#!/usr/bin/env python3
"""Rascunhos do TikTok para a conta de HISTÓRIAS (reaproveita o app do projeto TikTok Legendas).

  tiktok.py verificar          # diz o que está configurado (sem mostrar segredos)
  tiktok.py conectar           # uma vez: autorizar o app NA CONTA DE HISTÓRIAS (troque de conta no navegador antes)
  tiktok.py enviar VIDEO_001   # envia producoes/VIDEO_001/video_final.mp4 aos rascunhos (exige autorização)

O código de envio é o de ~/Vídeos/Tiktok/nucleo/tiktok_api.py. Este script só troca o token por um
próprio (~/.config/historias-animadas/tiktok_token.json), para não misturar com a conta de músicas.
O app (client key/secret) é o mesmo: ~/.config/legendador-tiktok/tiktok.env.
"""
from __future__ import annotations

import csv
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PROJETO_LEGENDAS = Path.home() / "Vídeos" / "Tiktok"
CONFIG = Path.home() / ".config" / "historias-animadas"
HISTORICO = RAIZ / "SECOND_BRAIN" / "05_METRICAS" / "envios_tiktok.csv"
LIMITE_24H = 5

sys.path.insert(0, str(PROJETO_LEGENDAS))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from nucleo import tiktok_api  # noqa: E402
import estado  # noqa: E402

tiktok_api.PASTA = CONFIG
tiktok_api.ARQ_TOKEN = CONFIG / "tiktok_token.json"
if (CONFIG / "tiktok.env").exists():
    tiktok_api.ARQ_ENV = CONFIG / "tiktok.env"


def verificar() -> bool:
    ok = True
    for nome, arq in (("credenciais do app", tiktok_api.ARQ_ENV), ("token da conta de histórias", tiktok_api.ARQ_TOKEN)):
        existe = arq.exists()
        ok &= existe
        print(f"{'✅' if existe else '❌'} {nome}: {arq}")
    if not tiktok_api.ARQ_TOKEN.exists():
        print("   → rode: python3 scripts/tiktok.py conectar  (logada na conta de HISTÓRIAS no navegador)")
    return ok


def envios_ultimas_24h() -> int:
    if not HISTORICO.exists():
        return 0
    limite = datetime.now() - timedelta(hours=24)
    with open(HISTORICO, encoding="utf-8") as f:
        return sum(1 for l in csv.DictReader(f) if datetime.strptime(l["data"], "%Y-%m-%d %H:%M") > limite)


def registrar(vid: str, mb: float, total: float, status: str, publish_id: str) -> None:
    novo = not HISTORICO.exists()
    with open(HISTORICO, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if novo:
            w.writerow(["data", "video", "mb", "total_s", "status", "publish_id"])
        w.writerow([datetime.now().strftime("%Y-%m-%d %H:%M"), vid, f"{mb:.1f}", f"{total:.0f}", status, publish_id])


def enviar(vid: str) -> None:
    est = estado.carregar()
    v = estado.video(est, vid)
    if not v["autorizado"]:
        estado.falhar(f"{vid} sem autorização da Lucila (estado.py autorizar {vid} \"...\")")
    if v["publicacao"]["tiktok_rascunho"] and v["publicacao"]["tiktok_rascunho"].startswith("SEND_TO_USER_INBOX"):
        estado.falhar(f"{vid} já foi enviado aos rascunhos: {v['publicacao']['tiktok_rascunho']}")
    if envios_ultimas_24h() >= LIMITE_24H:
        estado.falhar(f"limite de {LIMITE_24H} envios em 24 h atingido; tente mais tarde")
    video = RAIZ / "producoes" / vid / "video_final.mp4"
    if not video.exists():
        estado.falhar(f"{video} não existe")
    if not verificar():
        estado.falhar("integração incompleta (veja acima)")

    mb = video.stat().st_size / 1e6
    print(f"Enviando {video.name} de {vid} ({mb:.1f} MB) aos rascunhos…")
    t0 = time.monotonic()
    pid = tiktok_api.enviar_rascunho(video)
    status = tiktok_api.acompanhar(pid)
    total = time.monotonic() - t0
    registrar(vid, mb, total, status, pid)
    est = estado.carregar()
    estado.cmd_publicacao(est, vid, "tiktok_rascunho", f"{status} publish_id={pid}")
    if status == "SEND_TO_USER_INBOX":
        print("✔ Chegou nos rascunhos (notificação no app do TikTok). Ainda NÃO está publicado.")
    else:
        print(f"⚠ Status final: {status}. Confira no app antes de considerar enviado.")


def main() -> None:
    a = sys.argv[1:]
    if not a or a[0] in ("-h", "--help"):
        print(__doc__)
    elif a[0] == "verificar":
        sys.exit(0 if verificar() else 1)
    elif a[0] == "conectar":
        CONFIG.mkdir(parents=True, exist_ok=True)
        tiktok_api.conectar()
    elif a[0] == "enviar" and len(a) == 2:
        enviar(a[1])
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
