#!/usr/bin/env python3
"""Registro estruturado de métricas (sem API do TikTok para isso, então a entrada é manual ou lida no Studio).

  metricas.py registrar VIDEO_001 --janela 24h --views 312 --retencao-3s 41 --tempo-medio 7.2 \
      --conclusao 4.1 --curtidas 30 --comentarios 2 --compartilhamentos 1 --salvamentos 3 --seguidores 0 \
      [--replays N] [--fonte "TikTok Studio (print)"]
  metricas.py resumo                 # tabela por vídeo + medianas, com aviso de amostra pequena

Fonte única: SECOND_BRAIN/05_METRICAS/metricas.csv. Também acrescenta a linha em producoes/<V>/metricas.md.
Campo não informado fica vazio, nunca estimado. Para automatizar no futuro, basta outro script gravar no mesmo CSV.
"""
from __future__ import annotations

import argparse
import csv
import statistics
from datetime import datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CSV = RAIZ / "SECOND_BRAIN" / "05_METRICAS" / "metricas.csv"
CAMPOS = ["video", "janela", "coletado_em", "views", "retencao_3s_pct", "tempo_medio_s", "conclusao_pct",
          "replays", "curtidas", "comentarios", "compartilhamentos", "salvamentos", "seguidores", "fonte"]
NUMERICOS = CAMPOS[3:13]
MINIMO_CONCLUSIVO = 5


def registrar(a: argparse.Namespace) -> None:
    if not (RAIZ / "producoes" / a.video).exists():
        raise SystemExit(f"ERRO: producoes/{a.video} não existe")
    linha = {"video": a.video, "janela": a.janela, "coletado_em": datetime.now().strftime("%Y-%m-%d %H:%M"),
             "fonte": a.fonte}
    for c in NUMERICOS:
        v = getattr(a, c)
        linha[c] = "" if v is None else f"{v:g}"
    novo = not CSV.exists() or CSV.stat().st_size == 0
    with open(CSV, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CAMPOS)
        if novo:
            w.writeheader()
        w.writerow(linha)
    md = RAIZ / "producoes" / a.video / "metricas.md"
    if not md.exists():
        md.write_text(f"# Métricas: {a.video}\n\n> Fonte única: `SECOND_BRAIN/05_METRICAS/metricas.csv`.\n\n| "
                      + " | ".join(CAMPOS[1:]) + " |\n|" + "---|" * (len(CAMPOS) - 1) + "\n", encoding="utf-8")
    with open(md, "a", encoding="utf-8") as f:
        f.write("| " + " | ".join(str(linha[c]) or "—" for c in CAMPOS[1:]) + " |\n")
    print(f"registrado: {a.video} {a.janela} → {CSV.relative_to(RAIZ)}")


def resumo(_: argparse.Namespace) -> None:
    if not CSV.exists():
        print("Sem métricas ainda.")
        return
    with open(CSV, encoding="utf-8") as f:
        linhas = list(csv.DictReader(f))
    for janela in sorted({l["janela"] for l in linhas}):
        # a última coleta de cada vídeo nessa janela
        ult = {l["video"]: l for l in linhas if l["janela"] == janela}
        print(f"\n## Janela {janela} · {len(ult)} vídeo(s)")
        cols = ["views", "retencao_3s_pct", "tempo_medio_s", "conclusao_pct", "compartilhamentos", "salvamentos", "seguidores"]
        print("| vídeo | " + " | ".join(cols) + " |\n|" + "---|" * (len(cols) + 1))
        for vid, l in sorted(ult.items()):
            print(f"| {vid} | " + " | ".join(l[c] or "—" for c in cols) + " |")
        meds = []
        for c in cols:
            vals = [float(l[c]) for l in ult.values() if l[c] != ""]
            meds.append(f"{statistics.median(vals):g}" if vals else "—")
        print("| **mediana** | " + " | ".join(meds) + " |")
        if len(ult) < MINIMO_CONCLUSIVO:
            print(f"\n⚠ {len(ult)} vídeo(s): amostra pequena. Serve para levantar hipóteses, não para concluir.")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="acao", required=True)
    r = sub.add_parser("registrar")
    r.add_argument("video")
    r.add_argument("--janela", required=True, choices=["3h", "24h", "48h", "7d", "30d"])
    r.add_argument("--fonte", default="manual")
    for c in NUMERICOS:
        opt = "--" + c.replace("_pct", "").replace("_s", "").replace("_", "-")
        r.add_argument(opt, dest=c, type=float)
    r.set_defaults(f=registrar)
    sub.add_parser("resumo").set_defaults(f=resumo)
    a = p.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
