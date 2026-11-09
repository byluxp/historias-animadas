"""Trilha + SFX + voz do VIDEO_001, sincronizados ao words.json da voz final.

Uso (python do venv com numpy): python mix_video001.py <words.json> <voz.wav> <saida_pre.wav> <duracao_s>
Depois: loudnorm em 2 passadas (ffmpeg) para -14 LUFS / -1,5 dBTP (feito pelo script de shell do editor).
Gera também as faixas separadas (voz, trilha, sfx) em <saida_pre>_stems/ para medir a relação trilha × voz.
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sintese import (SR, Mesa, agua_subindo, baixo, brilho, celesta, chuva, db, estalo_pedra, gota, ler_wav, lp,  # noqa: E402
                     m2f, ns, ondas, pad, passarinho, pizz, reverb, risadinha, rng, salvar_wav, tambor, toc, trovao, tum, whoosh)

words_arq, voz_arq, saida, dur = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
W = json.load(open(words_arq, encoding="utf-8"))
T = lambda i: W[i]["start"]  # noqa: E731
E = lambda i: W[i]["end"]  # noqa: E731

C3 = T(58) - 0.15
SIL0 = E(97) + 0.02  # silêncio antes do Toc
TOC = T(98) - 0.04
C4C = T(126) - 0.11
FIM = dur

m = Mesa(dur + 2)
R = rng(11)

# ------------------------------------------------------------------ trilha A (cenas 1–2): celesta + pizzicato, Fá maior
BPM = 96
b = 60 / BPM
ACORDES_A = [[53, 57, 60], [50, 53, 57], [46, 50, 53], [48, 52, 55]]  # F, Dm, Bb, C
MELODIA = [72, 74, 76, 77, 76, 74, 72, 69, 70, 72, 74, 72, 71, 72, 74, 76]
t = 0.0
k = 0
while t < C3 - 0.3:
    ac = ACORDES_A[k % 4]
    m.add("trilha", pad(m2f(ac[0]), 4 * b + 0.6, 0.10, 0.6, seed=k) + pad(m2f(ac[1]), 4 * b + 0.6, 0.08, 0.6, seed=k + 50) + pad(m2f(ac[2]), 4 * b + 0.6, 0.07, 0.6, seed=k + 90), t)
    for beat in (0, 2):
        m.add("trilha", pizz(m2f(ac[0] - 12 + (7 if beat == 2 else 0)), 0.5, seed=k * 3 + beat), t + beat * b)
    for e8 in range(8):  # arpejo de celesta em colcheias
        nota = ac[e8 % 3] + 12 + (12 if e8 in (3, 7) else 0)
        m.add("trilha", celesta(m2f(nota), 0.12 + 0.05 * (e8 % 2 == 0), 1.2, seed=k * 8 + e8), t + e8 * b / 2)
    if k % 2 == 1:  # frase de melodia a cada 2 compassos
        for j in range(4):
            m.add("trilha", celesta(m2f(MELODIA[(k * 4 + j) % len(MELODIA)]), 0.28, 1.6, seed=500 + k * 4 + j), t + j * b)
    t += 4 * b
    k += 1
# "escutava": a trilha abaixa; fim da cena 2 some
env = np.ones(m.n)
tt = np.arange(m.n) / SR
env *= np.interp(tt, [T(49) - 0.3, T(50), E(57), C3 - 0.1, C3 + 0.05], [1, db(-9), db(-9), db(-14), 0])
env[tt < T(49) - 0.3] = 1
m.trilhas["trilha"] *= env

# ------------------------------------------------------------------ trilha B (cena 3): tensão em Ré menor
tB = C3
dur_b = SIL0 - tB
drone = pad(m2f(38), dur_b + 0.5, 0.16, 0.8, seed=3) + pad(m2f(45), dur_b + 0.5, 0.10, 0.8, seed=4) + pad(m2f(50), dur_b + 0.5, 0.06, 1.2, seed=5)
cres = np.interp(np.arange(len(drone)) / SR, [0, T(64) - tB, dur_b], [0.45, 0.75, 1.25])
m.add("trilhaB", drone * cres, tB)
# batidas: coração antes do "desabou", depois tambor em todo tempo, acelerando a intensidade
bB = 60 / 100
x = tB + 0.2
while x < T(64) - 0.1:
    m.add("trilhaB", tambor(0.35, True, seed=int(x * 10)), x)
    m.add("trilhaB", tambor(0.25, True, seed=int(x * 10) + 1), x + 0.28)
    x += 1.2
x = T(64)
i = 0
while x < SIL0 - 0.05:
    prog = (x - T(64)) / (SIL0 - T(64))
    m.add("trilhaB", tambor(0.45 + 0.4 * prog + (0.2 if i % 4 == 0 else 0), True, seed=100 + i), x)
    if prog > 0.35 and i % 2 == 1:
        m.add("trilhaB", tambor(0.25 + 0.3 * prog, False, seed=300 + i), x + bB / 2)
    x += bB
    i += 1
# ostinato de pizzicato grave (a partir de "O rio")
OST = [38, 38, 41, 38, 40, 38, 45, 44]
x = T(70)
i = 0
while x < SIL0 - 0.1:
    m.add("trilhaB", pizz(m2f(OST[i % 8]), 0.55, 0.5, seed=700 + i), x)
    x += bB / 2
    i += 1
# corte seco antes do Toc
g = np.ones(m.n)
g[ns(SIL0):] = 0
rampa = ns(0.03)
g[ns(SIL0) - rampa: ns(SIL0)] = np.linspace(1, 0, rampa)
m.trilhas["trilhaB"] *= g

# ------------------------------------------------------------------ trilha C (cena 4): revelação e amanhecer, Fá maior
tC = TOC + 0.55
ACORDES_C = [[53, 57, 60], [45, 48, 52], [46, 50, 53], [48, 52, 55], [53, 57, 60]]
# noite: pads largos crescendo até "enorme"
x = tC
k = 0
while x < C4C - 0.2:
    ac = ACORDES_C[k % 4]
    d = 2.4
    for j, n_ in enumerate(ac):
        m.add("trilhaC", pad(m2f(n_), d + 0.8, 0.09 + 0.02 * (x > T(106)), 0.9 + 0.4 * (x > T(106)), seed=900 + k * 3 + j), x)
    m.add("trilhaC", baixo(m2f(ac[0] - 12), d, 0.25), x)
    x += d
    k += 1
m.add("trilhaC", brilho(0.45, seed=1), T(101) - 0.1)
m.add("trilhaC", brilho(0.35, seed=2), T(106))
# amanhecer: pizz + celesta, mais leve
x = C4C
k = 0
ACORDES_D = [[53, 57, 60], [50, 53, 57], [46, 50, 53], [48, 52, 55]]
while x < T(139) - 0.3:
    ac = ACORDES_D[k % 4]
    for j, n_ in enumerate(ac):
        m.add("trilhaC", pad(m2f(n_), 4 * b + 0.6, 0.075, 0.6, seed=1200 + k * 3 + j), x)
    m.add("trilhaC", pizz(m2f(ac[0] - 12), 0.5, seed=1300 + k), x)
    m.add("trilhaC", pizz(m2f(ac[0] - 5), 0.4, seed=1350 + k), x + 2 * b)
    for e8 in range(8):
        m.add("trilhaC", celesta(m2f(ac[e8 % 3] + 24), 0.1, 1.0, seed=1400 + k * 8 + e8), x + e8 * b / 2)
    x += 4 * b
    k += 1
# acorde final em "inteira", deixando soar
for j, n_ in enumerate([53, 57, 60, 65]):
    m.add("trilhaC", pad(m2f(n_), FIM - T(139) + 1.0, 0.11, 0.7, seed=1500 + j), T(139) - 0.05)
    m.add("trilhaC", celesta(m2f(n_ + 12), 0.25, 2.5, seed=1600 + j), T(139) + j * 0.06)
envC = np.interp(tt, [tC, tC + 0.6, FIM - 0.8, FIM], [0, 1, 1, 0])
envC[tt < tC] = 0
m.trilhas["trilhaC"] *= envC

# ------------------------------------------------------------------ SFX
# gotas do regador (cena 1 e começo da 2): mais altas no close inicial
def chuvisco_regador(a, z, ganho):
    x = a
    while x < z:
        m.add("sfx", gota(R.uniform(0.25, 0.5), R.uniform(900, 1700), seed=int(x * 100)), x, ganho)
        x += R.uniform(0.08, 0.17)


chuvisco_regador(0.0, 1.5, db(-12))
chuvisco_regador(1.5, 3.4, db(-20))
chuvisco_regador(T(20), T(44) - 0.6, db(-23))
# risadinhas abafadas da vila em "ria"
for j in range(6):
    m.add("sfx", reverb(risadinha(0.5, seed=40 + j), 1.2, 0.35), T(10) + [0, 0.12, 0.05, 0.2, 0.09, 0.16][j] + 0.05, db(-20))
# whoosh nas trocas de estação
for x_, g_ in [(T(25), -15), (T(28), -15), (T(29), -17), (T(29) + 0.35, -19)]:
    m.add("sfx", whoosh(0.55, 0.9, seed=int(x_ * 10)), x_ - 0.2, db(g_))
# o "toc" baixinho (pista) em "escutava"
m.add("sfx", toc(1.0, seed=5, f=420), E(50) + 0.12, db(-32))
# trovões
m.add("sfx", trovao(4.5, 1.0, seed=1), T(64) - 0.04, db(-6))
m.add("sfx", trovao(3.0, 0.7, seed=2), T(67) + 0.1, db(-14))
m.add("sfx", trovao(3.0, 0.7, seed=3), T(84), db(-14))
m.add("sfx", trovao(2.0, 0.5, seed=4), T(73) + 0.4, db(-18))
# chuva: entra no "desabou", abaixa no silêncio antes do Toc, diminui na cena 4 e some no amanhecer
ch = chuva(C4C - T(64) + 1.5, 1.0, seed=8)
tch = np.arange(len(ch)) / SR + T(64)
ch *= np.interp(tch, [T(64), T(64) + 0.6, SIL0 - 0.2, SIL0, TOC + 0.3, TOC + 1.0, T(112), C4C - 0.2, C4C + 0.4], [0, 1, 1, 0.3, 0.3, 0.75, 0.45, 0.3, 0])
m.add("amb", ch, T(64), db(-16))
# água subindo (dois pulos) e engolindo a estrada
m.add("sfx", agua_subindo(1.0, 1.0, seed=1), T(72) - 0.1, db(-10))
m.add("sfx", agua_subindo(1.0, 1.0, seed=2), T(73) - 0.1, db(-14))
m.add("sfx", agua_subindo(1.8, 0.8, seed=3), T(77) - 0.1, db(-14))
# passos na lama (Tomás correndo)
x = T(85) - 0.05
while x < T(89) - 0.15:
    s_ = lp(R.standard_normal(ns(0.09)), 900) * np.exp(-np.arange(ns(0.09)) / SR / 0.025)
    m.add("sfx", s_ / (np.abs(s_).max() + 1e-9), x, db(-20))
    x += 0.2
# TOC seco e alto + cintilada
m.add("sfx", toc(1.0, seed=9, f=360), TOC, db(-3))
m.add("sfx", reverb(toc(0.6, seed=10, f=360), 1.5, 0.6), TOC + 0.01, db(-12))
m.add("sfx", brilho(0.5, seed=3), TOC + 0.12, db(-14))
# estalos da pedra rachando
m.add("sfx", estalo_pedra(1.0, seed=1), T(101) - 0.08, db(-9))
m.add("sfx", estalo_pedra(0.8, seed=2), T(101) + 0.25, db(-12))
m.add("sfx", tum(0.7, seed=1), T(101) + 0.35, db(-14))
# passo pesado ao crescer, e "tum" ao deitar
m.add("sfx", tum(0.8, seed=2), T(106) + 0.1, db(-12))
# rodada 1 do revisor: "tum" DEPOIS de "deitou" (antes cobria a palavra)
m.add("sfx", tum(1.0, seed=3), E(114) + 0.02, db(-13))
# onda batendo nas costas em "parou"
m.add("sfx", agua_subindo(0.6, 0.7, seed=7), T(122) - 0.15, db(-16))
# ondas batendo e acalmando ("parou")
on = ondas(C4C - T(112) + 1.0, 1.0, 1.6, seed=5)
ton = np.arange(len(on)) / SR + T(112) - 0.3
on *= np.interp(ton, [T(112) - 0.3, T(112), T(122), T(122) + 0.8, C4C], [0, 1, 1, 0.25, 0.15])
m.add("amb", on, T(112) - 0.3, db(-17))
# amanhecer: rio calmo e passarinhos
m.add("amb", ondas(FIM - C4C + 1, 1.0, 4.0, seed=6), C4C, db(-27))
for j, x_ in enumerate(np.arange(C4C + 0.2, FIM - 0.6, 0.9)):
    m.add("amb", passarinho(0.6, seed=60 + j), x_ + R.uniform(0, 0.5), db(-24))
# gota final em "inteira"
m.add("sfx", gota(0.9, 1100, seed=99), T(139) - 0.02, db(-9))
m.add("sfx", celesta(m2f(96), 0.4, 1.5, seed=99), T(139), db(-16))

# ------------------------------------------------------------------ mix
voz = ler_wav(voz_arq)
vz = np.zeros(m.n)
vz[: min(len(voz), m.n)] = voz[: m.n]
# ducking da trilha sob a voz (envelope da voz suavizado)
ev = np.sqrt(np.convolve(vz ** 2, np.ones(ns(0.05)) / ns(0.05), mode="same"))
ev = np.convolve((ev > 0.01).astype(float), np.ones(ns(0.25)) / ns(0.25), mode="same")
duck = 1 - 0.35 * np.clip(ev, 0, 1)

trilha = (m.get("trilha") + m.get("trilhaB") + m.get("trilhaC")) * duck
sfx = m.get("sfx")
amb = m.get("amb")

# níveis: voz ~-18 dBFS RMS; trilha ~20 dB abaixo
def rms_db(x):
    x = x[np.abs(x) > 1e-4]
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12) if len(x) else -120


g_voz = db(-18 - rms_db(vz))
vz *= g_voz
trilha *= db(-18 - 18.3 - rms_db(trilha))
# SFX e ambiente já estão com ganhos relativos; escala única para ficarem ~8 dB abaixo da voz no pico
sfx *= db(-6) * (np.abs(vz).max() / (np.abs(sfx).max() + 1e-9))
amb *= db(-32 - rms_db(amb))  # ambiente (chuva/ondas) ~-32 dBFS RMS

# rodada 1 do revisor: da cena 3 em diante, chuva/trovão/água/SFX/trilha abaixam sob a voz (alvo voz ≥ 15 dB acima)
DUCK_DB = float(os.environ.get("DUCK_DB", "14"))
ev2 = np.sqrt(np.convolve(vz ** 2, np.ones(ns(0.03)) / ns(0.03), mode="same"))
ativo = (ev2 > 10 ** (-40 / 20)).astype(float)
ativo = np.convolve(ativo, np.ones(ns(0.12)) / ns(0.12), mode="same")  # ataque/soltura ~60 ms
ativo = np.maximum(ativo, np.convolve(ativo, np.ones(ns(0.2)) / ns(0.2), mode="same"))
duck2 = np.where(tt[: m.n] >= C3 - 0.1, db(-DUCK_DB * np.clip(ativo, 0, 1)), 1.0)
# o "TOC" do SFX coincide com a palavra "Toc" de propósito: não abaixa ali
janela_toc = (tt[: m.n] > TOC - 0.05) & (tt[: m.n] < TOC + 0.4)
duck2[janela_toc] = 1.0
trilha, sfx, amb = trilha * duck2, sfx * duck2, amb * duck2

final = vz + trilha + sfx + amb
final = final[: ns(dur)]
fade = ns(0.4)
final[-fade:] *= np.linspace(1, 0, fade)
pico = np.abs(final).max()
if pico > 0.95:
    final *= 0.95 / pico
    vz, trilha, sfx, amb = (a * 0.95 / pico for a in (vz, trilha, sfx, amb))
salvar_wav(saida, final)
stems = saida.replace(".wav", "_stems")
os.makedirs(stems, exist_ok=True)
for nome, a in [("voz", vz), ("trilha", trilha), ("sfx", sfx), ("amb", amb)]:
    salvar_wav(os.path.join(stems, f"{nome}.wav"), a[: ns(dur)])
# medida: voz × resto (RMS durante cada palavra), mediana por cena
resto = trilha + sfx + amb
CENAS = [("c1", 0, T(23)), ("c2", T(23), T(58)), ("c3", T(58), T(99)), ("c4", T(99), FIM)]
med = {}
for nome, a, z in CENAS:
    dif = []
    for i, w in enumerate(W):
        if a <= w["start"] < z and i != 98:
            i0, i1 = ns(w["start"]), ns(w["end"])
            rv = np.sqrt(np.mean(vz[i0:i1] ** 2) + 1e-12)
            rr = np.sqrt(np.mean(resto[i0:i1] ** 2) + 1e-12)
            dif.append(20 * np.log10(rv / rr))
    med[nome] = (round(float(np.median(dif)), 1), round(float(np.min(dif)), 1))
print("voz - resto por cena (mediana, pior palavra, sem 'Toc'):", med)
print(f"mix pré: {saida} ({dur:.2f} s) · RMS voz {rms_db(vz):.1f} dBFS · trilha {rms_db(trilha):.1f} · sfx {rms_db(sfx):.1f} · amb {rms_db(amb):.1f}")
