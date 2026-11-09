"""Encurta as pausas longas da narração (sem cortar fala) e remapeia o words.json.

Uso: python encurtar_pausas.py <voz.wav> <words.json> <saida.wav> <saida_words.json> [atempo]

- Silêncio = trechos com RMS < -40 dBFS por mais de 0,12 s. Só o MEIO do silêncio é removido
  (as bordas, com respiração e cauda da palavra, ficam), com crossfade de 15 ms.
- Pausa-alvo pela pontuação da palavra anterior: vírgula 0,24 s; ponto/dois-pontos 0,36 s;
  pausas dramáticas do roteiro: antes de "Toc." 0,55 s, depois de "Toc." 0,55 s,
  antes de "Tomás nunca" 0,75 s. Pausa já menor que o alvo fica como está.
- atempo opcional (≤ 1,08) via ffmpeg depois, com os tempos das palavras divididos pelo fator.
"""
import json
import subprocess
import sys

import numpy as np

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from sintese import SR, cortar_estouro_final, ler_wav, salvar_wav  # noqa: E402

ent, words_in, sai, words_out = sys.argv[1:5]
atempo = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
# pausas-alvo (s): depois de ponto, depois de vírgula, entre palavras
PONTO, VIRGULA, DENTRO = (float(v) for v in (sys.argv[6:9] if len(sys.argv) > 8 else (0.36, 0.24, 0.16)))
assert 1.0 <= atempo <= 1.08

x = ler_wav(ent)
W = json.load(open(words_in, encoding="utf-8"))
# o Gemini às vezes termina com um estouro de ruído depois da última palavra: zera antes de tudo
x, corte = cortar_estouro_final(x, max(w["end"] for w in W))
if corte is not None:
    print(f"AVISO: estouro de ruído no fim da voz a partir de {corte:.2f} s: zerado")

# RMS em janelas de 10 ms
jan = int(0.01 * SR)
nj = len(x) // jan
rms = np.sqrt(np.mean(x[: nj * jan].reshape(nj, jan) ** 2, 1) + 1e-12)
mudo = 20 * np.log10(rms) < -40
silencios = []
i = 0
while i < nj:
    if mudo[i]:
        j = i
        while j < nj and mudo[j]:
            j += 1
        if (j - i) * 0.01 >= 0.12:
            silencios.append((i * 0.01, j * 0.01))
        i = j
    else:
        i += 1

# Palavras com tempo estimado (o Whisper ouviu outra coisa, ex.: "Toque" por "Toc"): usa o tempo bruto
# do Whisper quando ele ouviu uma palavra com o mesmo começo dentro do intervalo.
import os, re, unicodedata
bruto_arq = os.path.join(os.path.dirname(os.path.abspath(words_in)), "words_whisper.json")
if os.path.exists(bruto_arq):
    def _n(p):
        return re.sub(r"[^a-z]", "", unicodedata.normalize("NFKD", p).encode("ascii", "ignore").decode().lower())
    bruto = json.load(open(bruto_arq, encoding="utf-8"))
    for w in W:
        if w.get("estimado"):
            for b in bruto:
                if b["start"] >= w["start"] - 0.05 and b["end"] <= w["end"] + 0.05 and _n(b["word"])[:2] == _n(w["word"])[:2]:
                    w["start"], w["end"] = b["start"], b["end"]
                    w["estimado"] = "whisper_bruto"
                    break

# Ajusta as bordas das palavras aos silêncios medidos (o Whisper estica palavras para dentro das pausas).
for w in W:
    for s0, s1 in silencios:
        # silêncio inteiro "dentro" da palavra (início esticado para trás): começa depois dele
        if w["start"] <= s0 and s1 <= w["end"] and (s1 - s0) > 0.4 * (w["end"] - w["start"]):
            w["start"] = round(s1, 3)
        if s0 <= w["start"] < s1:
            w["start"] = round(s1, 3)
        if s0 < w["end"] <= s1:
            w["end"] = round(s0, 3)
    if w["end"] <= w["start"]:
        w["end"] = round(w["start"] + 0.12, 3)

ESPECIAL_ANTES = {98: 0.42, 131: 0.58}   # índice da palavra seguinte → pausa
ESPECIAL_DEPOIS = {98: 0.42}


def alvo(s0, s1):
    # palavra anterior = a última que termina antes do meio do silêncio
    meio = (s0 + s1) / 2
    ant = max((k for k, w in enumerate(W) if w["end"] <= meio + 0.05), default=None)
    if ant is None:
        return 0.08  # silêncio inicial
    if ant == len(W) - 1:
        return 1.2   # cauda final
    prox = ant + 1
    if prox in ESPECIAL_ANTES:
        return ESPECIAL_ANTES[prox]
    if ant in ESPECIAL_DEPOIS:
        return ESPECIAL_DEPOIS[ant]
    p = W[ant]["word"][-1]
    if p in ".:!?":
        return PONTO
    if p in ",;":
        return VIRGULA
    return DENTRO


# monta os cortes: (ini, fim) a remover
cortes = []
for s0, s1 in silencios:
    a = alvo(s0, s1)
    dur = s1 - s0
    if dur > a + 0.02:
        tira = dur - a
        c0 = s0 + (dur - tira) * 0.45
        cortes.append((c0, c0 + tira))

xf = int(0.015 * SR)
partes, pos = [], 0
for c0, c1 in cortes:
    i0, i1 = int(c0 * SR), int(c1 * SR)
    partes.append(x[pos:i0])
    pos = i1
partes.append(x[pos:])
y = partes[0]
for p in partes[1:]:
    if len(y) > xf and len(p) > xf:
        r = np.linspace(0, 1, xf)
        y = np.concatenate([y[:-xf], y[-xf:] * (1 - r) + p[:xf] * r, p[xf:]])
    else:
        y = np.concatenate([y, p])


def mapa(t):
    tirado = 0.0
    for c0, c1 in cortes:
        if t >= c1:
            tirado += c1 - c0 + xf / SR
        elif t > c0:
            tirado += t - c0
    return max(0.0, t - tirado)


novo = [dict(w, start=round(mapa(w["start"]) / atempo, 3), end=round(mapa(w["end"]) / atempo, 3)) for w in W]
tmp = sai + ".tmp.wav"
salvar_wav(tmp, y)
filtro = f"atempo={atempo}" if atempo != 1.0 else "anull"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af", filtro, "-ac", "1", "-ar", str(SR), sai], check=True)
subprocess.run(["rm", "-f", tmp])
json.dump(novo, open(words_out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"original {len(x) / SR:.2f} s · {len(cortes)} pausas encurtadas · sem atempo {len(y) / SR:.2f} s · "
      f"atempo {atempo} → {len(y) / SR / atempo:.2f} s · última palavra termina em {novo[-1]['end']:.2f} s")
