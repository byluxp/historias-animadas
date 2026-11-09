#!/usr/bin/env python3
"""Procura estalos e estouros no áudio de um vídeo (o "tch" que o ouvido pega e o LUFS não).

  qa_audio.py producoes/VIDEO_001/video_final.mp4 [--fim-fala 48.53]

Critério (calibrado no VIDEO_001, onde um estouro de ruído em 48,8 s passou pelo revisor):
som alto (> -15 dBFS RMS em 10 ms) que COMEÇA de golpe (sobe ≥ 25 dB em 10 ms) ou TERMINA de golpe
(cai ≥ 20 dB em 10 ms). Voz e efeitos naturais sobem e descem mais devagar. Salto entre amostras não
serve: sons de "s" e "ch" da voz também têm salto alto (deu 47 falsos alarmes).
Com --fim-fala (fim da última palavra), mostra o pico depois dela: acima de -30 dBFS, algo toca depois
da história acabar. Sai com código 1 se achar algo (o revisor ouve/investiga cada ponto).
"""
from __future__ import annotations

import argparse
import array
import math
import subprocess
import sys

TAXA = 48000
JANELA = TAXA // 100  # 10 ms
NIVEL_MIN, SUBIDA, QUEDA = -15.0, 25.0, 20.0


def niveis(video: str) -> tuple[array.array, list[float]]:
    bruto = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", str(TAXA),
                            "-f", "f32le", "-"], capture_output=True, check=True).stdout
    som = array.array("f", bruto)
    rms = [20 * math.log10(math.sqrt(sum(x * x for x in som[i:i + JANELA]) / JANELA) + 1e-9)
           for i in range(0, len(som) - JANELA, JANELA)]
    return som, rms


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("video")
    p.add_argument("--fim-fala", type=float, help="segundo em que termina a última palavra")
    a = p.parse_args()

    som, r = niveis(a.video)
    achados = []
    for k in range(1, len(r) - 1):
        sobe, desce = r[k] - r[k - 1], r[k] - r[k + 1]
        if r[k] > NIVEL_MIN and (sobe >= SUBIDA or desce >= QUEDA):
            tipo = "começa de golpe" if sobe >= SUBIDA else "corta de golpe"
            achados.append(f"   {k / 100:6.2f} s · {tipo} · nível {r[k]:5.1f} dBFS (sobe {sobe:+.1f}, cai {desce:.1f} dB)")
    print(f"Duração do áudio: {len(som) / TAXA:.2f} s")
    print(f"❌ {len(achados)} ponto(s) suspeito(s):\n" + "\n".join(achados) if achados else "✅ Nenhum estalo/estouro")

    alerta = False
    if a.fim_fala is not None:
        cauda = som[int(a.fim_fala * TAXA):]
        pico = 20 * math.log10(max((abs(x) for x in cauda), default=0) + 1e-9)
        alerta = pico > -30
        print(f"{'⚠' if alerta else '✅'} Depois da última palavra ({a.fim_fala:.2f} s): pico {pico:.1f} dBFS")
    sys.exit(1 if achados or alerta else 0)


if __name__ == "__main__":
    main()
