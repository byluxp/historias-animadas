#!/usr/bin/env python3
"""Narração e tempo de cada palavra (words.json) para um vídeo.

  voz.py verificar                 # diz o que está configurado (sem mostrar chaves)
  voz.py vozes [filtro]            # lista as vozes da conta ElevenLabs (id, nome, sotaque)
  voz.py amostra "frase" [voice_id ...]   # 1 clipe curto por voz em testes/vozes/ (para escolher a voz)
  voz.py gerar VIDEO_001 [--tom alegre|terror]   # ElevenLabs: texto.txt → voz.mp3 + words.json
  voz.py gerar VIDEO_001 --motor gemini [--voz Sulafat]   # Gemini TTS → voz.wav; tempos pelo Whisper
  voz.py tempos VIDEO_001          # gravação própria: trabalho/voz/voz.wav → words.json (Whisper local)

ElevenLabs (SDK oficial `elevenlabs`, instalado em .venv/; o script se reexecuta lá se precisar):
  - chave: ELEVENLABS_API_KEY no .env.local da raiz do projeto (criado por `elevenlabs onboard`)
  - voz por tom da história: config/voz.json → vozes_por_tom (alegre: Juliano Magalhães; terror: Carlos);
    o tom vem do briefing. ELEVENLABS_VOICE_ID no ambiente tem prioridade.
  A ElevenLabs devolve o tempo de cada caractere: words.json sai direto, sem Whisper.

Gemini: GEMINI_API_KEY em ~/.config/historias-animadas/gemini.env (ou, na falta, o .env do projeto do
podcast, ~/Documentos/Projetos/podcast/.env, que já usa Gemini TTS). O Gemini não devolve o tempo das
palavras: o Whisper local mede e as palavras são alinhadas ao texto exato do roteiro.

words.json: [{"word": "Setenta", "start": 0.12, "end": 0.48}, ...] em segundos, sempre com as palavras do texto.txt.
"""
from __future__ import annotations

import base64
import difflib
import json
import os
import re
import subprocess
import time
import unicodedata
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ENV_LOCAL = RAIZ / ".env.local"
VENV_PY = RAIZ / ".venv" / "bin" / "python"
CONFIG_VOZ = RAIZ / "config" / "voz.json"
WHISPER_PY = Path.home() / "Vídeos" / "Edição" / ".whisper-env" / "bin" / "python"
GEMINI_ENVS = [Path.home() / ".config" / "historias-animadas" / "gemini.env",
               Path.home() / "Documentos" / "Projetos" / "podcast" / ".env"]
GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent"
GEMINI_MODELO = "gemini-3.8-flash-lite-tts"


def falhar(msg: str) -> None:
    print(f"ERRO: {msg}", file=sys.stderr)
    sys.exit(1)


def carregar_env_local() -> None:
    """Carrega o .env.local (chave da ElevenLabs) no ambiente, sem mostrar nada; o SDK lê ELEVENLABS_API_KEY."""
    try:
        from dotenv import load_dotenv
    except ImportError:  # python do sistema, sem o .venv: leitura simples do mesmo arquivo
        if ENV_LOCAL.exists():
            for linha in ENV_LOCAL.read_text(encoding="utf-8").splitlines():
                if "=" in linha and not linha.lstrip().startswith("#"):
                    k, v = linha.split("=", 1)
                    os.environ.setdefault(k.strip().removeprefix("export ").strip(), v.strip().strip('"').strip("'"))
        return
    load_dotenv(ENV_LOCAL)


def config_eleven(tom: str | None = None) -> dict:
    """Configuração da voz. A voz sai do tom da história (config/voz.json → vozes_por_tom)."""
    cfg = {"modelo": "eleven_v4", "idioma": "pt", "stability": 0.5, "similarity_boost": 0.75,
           "tom_padrao": "alegre", "vozes_por_tom": {}}
    if CONFIG_VOZ.exists():
        cfg.update(json.loads(CONFIG_VOZ.read_text(encoding="utf-8")).get("elevenlabs", {}))
    tom = tom or cfg["tom_padrao"]
    if tom not in cfg["vozes_por_tom"]:
        falhar(f"tom '{tom}' sem voz em {CONFIG_VOZ.relative_to(RAIZ)} (tons: {', '.join(cfg['vozes_por_tom'])})")
    cfg["tom"] = tom
    cfg["voice_id"] = os.environ.get("ELEVENLABS_VOICE_ID") or cfg["vozes_por_tom"][tom]["voice_id"]
    return cfg


def cliente():
    """Cliente do SDK. Se o SDK não estiver neste Python, reexecuta o script no .venv do projeto."""
    try:
        from elevenlabs import ElevenLabs
    except ImportError:
        # O python do .venv é um link para o do sistema: compare pelo prefixo do ambiente, não pelo executável.
        if VENV_PY.exists() and Path(sys.prefix).resolve() != VENV_PY.parent.parent.resolve():
            os.execv(str(VENV_PY), [str(VENV_PY), *sys.argv])
        falhar("SDK elevenlabs não instalado: python3 -m venv .venv && .venv/bin/pip install -r requirements.txt")
    carregar_env_local()
    if not os.environ.get("ELEVENLABS_API_KEY"):
        falhar("ELEVENLABS_API_KEY não encontrada no .env.local: status blocked (veja docs/INTEGRACOES.md)")
    # O SDK lê a variável no import (antes do .env.local ser carregado), então ela é passada aqui.
    return ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])


def verificar() -> bool:
    carregar_env_local()
    cfg = config_eleven()
    chave = bool(os.environ.get("ELEVENLABS_API_KEY"))
    print(f"{'✅' if chave else '❌'} ElevenLabs: chave em {ENV_LOCAL.name} · modelo {cfg['modelo']}")
    for tom, v in cfg["vozes_por_tom"].items():
        print(f"   voz para '{tom}'{' (padrão)' if tom == cfg['tom_padrao'] else ''}: {v['nome']}")
    print(f"{'✅' if VENV_PY.exists() else '❌'} SDK no .venv do projeto")
    print(f"{'✅' if chave_gemini() else '❌'} Gemini TTS (GEMINI_API_KEY em {' ou '.join(str(e) for e in GEMINI_ENVS)})")
    print(f"{'✅' if WHISPER_PY.exists() else '❌'} Whisper local (para gravação própria): {WHISPER_PY}")
    return chave


def listar_vozes(filtro: str = "") -> None:
    c = cliente()
    for v in c.voices.get_all().voices:
        if v.category == "premade" and not filtro:
            continue  # as 21 vozes padrão (inglês); use um filtro para vê-las
        rotulos = ", ".join(f"{k}: {x}" for k, x in (v.labels or {}).items())
        linha = f"{v.voice_id}  {v.name}  ({rotulos})"
        if filtro.lower() in linha.lower():
            print(linha)


def amostra(frase: str, ids: list[str]) -> None:
    c = cliente()
    cfg = config_eleven()
    vozes = {v.voice_id: v.name.split(" - ")[0] for v in c.voices.get_all().voices if v.category != "premade"}
    destino = RAIZ / "testes" / "vozes"
    destino.mkdir(parents=True, exist_ok=True)
    for vid in ids or list(vozes):
        audio = c.text_to_speech.convert(vid, text=frase, model_id=cfg["modelo"], language_code=cfg["idioma"],
                                         output_format="mp3_44100_128")
        arq = destino / f"{vozes.get(vid, vid)}.mp3"
        with open(arq, "wb") as f:
            for parte in audio:
                f.write(parte)
        print(f"{arq.relative_to(RAIZ)} ({vid})")


def palavras_de_caracteres(chars: list[str], inicios: list[float], fins: list[float]) -> list[dict]:
    """Junta o alinhamento por caractere da ElevenLabs em palavras (tags [..] ficam de fora)."""
    palavras, atual, ini, fim = [], "", None, None
    for ch, s, e in zip(chars, inicios, fins):
        if ch.isspace():
            if atual:
                palavras.append({"word": atual, "start": round(ini, 3), "end": round(fim, 3)})
            atual, ini = "", None
            continue
        if ini is None:
            ini = s
        atual += ch
        fim = e
    if atual:
        palavras.append({"word": atual, "start": round(ini, 3), "end": round(fim, 3)})
    return [p for p in palavras if not p["word"].startswith("[") and not p["word"].endswith("]")]


def gerar(vid: str, tom: str | None = None) -> None:
    pasta = RAIZ / "producoes" / vid / "trabalho" / "voz"
    texto_arq = pasta / "texto.txt"
    if not texto_arq.exists():
        falhar(f"crie {texto_arq.relative_to(RAIZ)} com a narração exata do roteiro")
    c = cliente()
    cfg = config_eleven(tom)
    from elevenlabs import VoiceSettings

    # A instrução longa de tom no começo (feita para o Gemini) sai; tags curtas no meio ficam (o v4 entende).
    texto = re.sub(r"^\s*\[[^\]]{25,}\]\s*", "", texto_arq.read_text(encoding="utf-8")).strip()
    try:
        resp = c.text_to_speech.convert_with_timestamps(
            cfg["voice_id"], text=texto, model_id=cfg["modelo"], language_code=cfg["idioma"],
            output_format="mp3_44100_128",
            voice_settings=VoiceSettings(stability=cfg["stability"], similarity_boost=cfg["similarity_boost"]))
    except Exception as e:  # 401 chave, 422 voz/modelo, 429 limite
        falhar(f"ElevenLabs recusou: {e}")
    (pasta / "voz.mp3").write_bytes(base64.b64decode(resp.audio_base_64))
    al = resp.alignment or resp.normalized_alignment
    palavras = palavras_de_caracteres(al.characters, al.character_start_times_seconds, al.character_end_times_seconds)
    (pasta / "words.json").write_text(json.dumps(palavras, ensure_ascii=False, indent=1), encoding="utf-8")
    custo = {"motor": "elevenlabs", "modelo": cfg["modelo"], "tom": cfg["tom"], "voice_id": cfg["voice_id"], "caracteres": len(texto),
             "palavras": len(palavras), "duracao_s": palavras[-1]["end"] if palavras else 0}
    (pasta / "custo.json").write_text(json.dumps(custo, indent=1), encoding="utf-8")
    print(f"voz.mp3 + words.json em {pasta.relative_to(RAIZ)} · {custo}")


def chave_gemini() -> str | None:
    for env in GEMINI_ENVS:
        if env.exists():
            for linha in env.read_text(encoding="utf-8").splitlines():
                if linha.startswith("GEMINI_API_KEY="):
                    chave = linha.split("=", 1)[1].strip().strip('"')
                    if chave:
                        return chave
    return None


def gerar_gemini(vid: str, voz: str) -> None:
    import requests

    pasta = RAIZ / "producoes" / vid / "trabalho" / "voz"
    texto_arq = pasta / "texto.txt"
    if not texto_arq.exists():
        falhar(f"crie {texto_arq.relative_to(RAIZ)} com a narração exata do roteiro")
    chave = chave_gemini()
    if not chave:
        falhar("GEMINI_API_KEY não encontrada: status blocked (veja docs/INTEGRACOES.md)")
    # Instruções de tom vão entre colchetes no próprio texto (o modelo 3.8 não aceita instrução geral).
    estilo = pasta / "estilo.txt"
    texto = texto_arq.read_text(encoding="utf-8").strip()
    falado = (estilo.read_text(encoding="utf-8").strip() + " " if estilo.exists() else "") + texto
    corpo = {"contents": [{"parts": [{"text": falado}]}],
             "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {
                 "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voz}}}}}
    for tentativa in range(1, 4):
        r = requests.post(GEMINI_API.format(modelo=GEMINI_MODELO), headers={"x-goog-api-key": chave},
                          json=corpo, timeout=300)
        if r.status_code not in (429, 500, 503):
            break
        print(f"  Gemini HTTP {r.status_code}, nova tentativa em {20 * tentativa} s…")
        time.sleep(20 * tentativa)
    if r.status_code != 200:
        falhar(f"Gemini respondeu HTTP {r.status_code}: {r.text[:300]}")
    partes = r.json()["candidates"][0]["content"]["parts"]
    audio = b"".join(base64.b64decode(p["inlineData"]["data"]) for p in partes if "inlineData" in p)
    taxa = re.search(r"rate=(\d+)", next(p["inlineData"]["mimeType"] for p in partes if "inlineData" in p))
    wav = pasta / "voz.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", taxa.group(1) if taxa else "24000",
                    "-ac", "1", "-i", "pipe:0", "-ar", "48000", str(wav)], input=audio, check=True)
    # Checa estouro de ruído no fim (o Gemini às vezes devolve ~0,2 s de ruído em volume máximo após a fala).
    pcm = [int.from_bytes(audio[i:i + 2], "little", signed=True) / 32768 for i in range(max(0, len(audio) - 2 * 24000), len(audio) - 1, 2)]
    saltos = [abs(pcm[k + 1] - pcm[k]) for k in range(len(pcm) - 1)]
    if saltos and max(saltos) > 0.8:
        print("AVISO: possível estouro de ruído no último 1 s da voz; encurtar_pausas.py zera automaticamente "
              "(estudio/audio/sintese.py: cortar_estouro_final)")
    uso = r.json().get("usageMetadata", {})
    (pasta / "custo.json").write_text(json.dumps({"motor": "gemini", "modelo": GEMINI_MODELO, "voz": voz,
                                                  "caracteres": len(falado), "tokens": uso}, indent=1), encoding="utf-8")
    print(f"voz.wav gerado ({len(audio) / 2 / int(taxa.group(1) if taxa else 24000):.1f} s); medindo os tempos…")
    tempos(vid)


def _norm(p: str) -> str:
    p = unicodedata.normalize("NFKD", p).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]", "", p)


def alinhar_ao_texto(medidas: list[dict], texto: str) -> list[dict]:
    """Troca as palavras do Whisper pelas do texto exato, mantendo os tempos medidos."""
    alvo = re.sub(r"\[[^\]]*\]", " ", texto).split()
    a, b = [_norm(w["word"]) for w in medidas], [_norm(w) for w in alvo]
    saida: list[dict | None] = [None] * len(alvo)
    for bloco in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(bloco.size):
            m = medidas[bloco.a + k]
            saida[bloco.b + k] = {"word": alvo[bloco.b + k], "start": m["start"], "end": m["end"]}
    # Palavras sem par (Whisper ouviu diferente): divide o intervalo entre os vizinhos medidos.
    i = 0
    while i < len(saida):
        if saida[i] is not None:
            i += 1
            continue
        j = i
        while j < len(saida) and saida[j] is None:
            j += 1
        ini = saida[i - 1]["end"] if i > 0 else (medidas[0]["start"] if medidas else 0.0)
        fim = saida[j]["start"] if j < len(saida) else (medidas[-1]["end"] if medidas else ini + 0.4 * (j - i))
        passo = max(fim - ini, 0.05 * (j - i)) / (j - i)
        for k in range(i, j):
            saida[k] = {"word": alvo[k], "start": round(ini + passo * (k - i), 3),
                        "end": round(ini + passo * (k - i + 1), 3), "estimado": True}
        i = j
    return saida  # type: ignore[return-value]


WHISPER = r"""
import json, sys
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[3], device="cpu", compute_type="int8")
segs, _ = m.transcribe(sys.argv[1], language="pt", word_timestamps=True)
out = [{"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)} for s in segs for w in s.words]
json.dump(out, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(out), "palavras")
"""


def tempos(vid: str, modelo: str = "small") -> None:
    pasta = RAIZ / "producoes" / vid / "trabalho" / "voz"
    audio = next((p for p in (pasta / "voz.wav", pasta / "voz.mp3") if p.exists()), None)
    if not audio:
        falhar(f"coloque a gravação em {pasta.relative_to(RAIZ)}/voz.wav")
    if not WHISPER_PY.exists():
        falhar(f"Whisper local não encontrado em {WHISPER_PY}")
    bruto = pasta / "words_whisper.json"
    subprocess.run([str(WHISPER_PY), "-c", WHISPER, str(audio), str(bruto), modelo], check=True)
    texto_arq = pasta / "texto.txt"
    medidas = json.loads(bruto.read_text(encoding="utf-8"))
    if texto_arq.exists():
        palavras = alinhar_ao_texto(medidas, texto_arq.read_text(encoding="utf-8"))
        estimadas = sum(1 for p in palavras if p.get("estimado"))
        print(f"alinhado ao texto: {len(palavras)} palavras, {estimadas} com tempo estimado")
    else:
        palavras = medidas
    (pasta / "words.json").write_text(json.dumps(palavras, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"words.json em {pasta.relative_to(RAIZ)} (confira os tempos à mão nos pontos de sincronia)")


def main() -> None:
    a = sys.argv[1:]
    if a[:1] == ["verificar"]:
        sys.exit(0 if verificar() else 1)
    if a[:1] == ["amostra"] and len(a) >= 2:
        amostra(a[1], a[2:])
        return
    if a[:1] == ["vozes"]:
        listar_vozes(a[1] if len(a) > 1 else "")
        return
    if len(a) >= 2 and a[0] == "gerar":
        if "--motor" in a and a[a.index("--motor") + 1] == "gemini":
            gerar_gemini(a[1], a[a.index("--voz") + 1] if "--voz" in a else "Sulafat")
        else:
            gerar(a[1], a[a.index("--tom") + 1] if "--tom" in a else None)
    elif len(a) >= 2 and a[0] == "tempos":
        tempos(a[1], *a[2:3])
    else:
        print(__doc__)
        sys.exit(0 if a[:1] in (["-h"], ["--help"]) else 1)


if __name__ == "__main__":
    main()
