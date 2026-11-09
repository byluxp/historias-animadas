---
tipo: revisao
task_id: VIDEO_001
autor: revisor
rodada: 2
data: 2026-11-09
video_revisado: producoes/VIDEO_001/video_final.mp4 (sha256: 15f0f994afaba99ffa2c384934990b1cc06d98445a6ac680d458d66dfcc0910c)
veredito: aprovado
---
# Revisão: VIDEO_001 (rodada 2) · beta D-007

Escopo: conferir os itens #1, #2, #3, #4, #6 e #7 de `revisao.md` no novo `video_final.mp4`, mais as emendas
dos trechos re-renderizados (frames 330–419 e 1050–1487) e o loudness final. Tudo medido por mim. A v1 está em
`versoes/video_final_v1.mp4`.

## Checagens técnicas (medidas)
| Item | Esperado | Medido | OK? |
|---|---|---|---|
| Proporção / resolução | 9:16 · 1080×1920 | 1080×1920, H.264 | OK |
| Duração / frames | 40–50 s | 49,60 s · 1488 frames (contados com `-count_frames`), igual à v1 | OK |
| FPS | 30 | 30/1 | OK |
| Loudness integrado | -14 a -10 LUFS | -14,0 LUFS (LRA 2,4 LU) | OK |
| Pico | ≤ -1 dBTP | -1,1 dBTP | OK |
| Frames pretos/congelados | 0 indesejados | blackdetect (0,1 s): 0 · freezedetect (1 s): 0 | OK |
| Faixa de áudio | 1, sem silêncio indevido | 1 faixa AAC 48 kHz estéreo; silencedetect (-45 dB, 0,3 s): 0 | OK |
| Emendas dos segmentos | sem pulo nem frame repetido | PSNR quadro a quadro v2 × v1 (270×480): frames 0–329 com mín. 53,2 dB, 420–1049 com mín. 55,7 dB (idênticos, a não ser pelo reencode); trechos refeitos 330–419 (mín. 21,2) e 1050–1487 (mín. 16,8). Nas bordas, frames 329/330, 419/420 e 1049/1050 batem com a v1 no mesmo índice (51,8–56,9 dB), ou seja, não há deslocamento, frame repetido nem frame perdido | OK |

## Itens da rodada 1
| # | Problema (r1) | Medido na v2 | Status |
|---|---|---|---|
| 1 | Rosto do Pedrinha cortado no plano final | 45,5–49,5 s (frames a cada 0,5 s): rosto inteiro na frente do chão, longe da borda esquerda e acima da legenda; os olhos fecham felizes em "REGOU A VILA" e o quadro fica parado até o fim | resolvido |
| 2 | A barragem não aparecia em "parou" | 40,5 s: plano aberto com Pedrinha deitado ao longo da margem, bem maior que Tomás. Em 42,0 s a crista branca vem pelo rio, em 42,36 s ("parou") bate nas costas e espirra, e de 42,8 a 43,5 s a água fica parada com espuma encostada. O quintal fica seco na frente e nenhum caco cobre o rosto | resolvido |
| 3 | Tomás sumia em 35,5–37,6 s | Tomás fica no quadro de 35,0 a 37,5 s (abraço, flash do "TOC", recua à direita enquanto a pedra racha) e segue ao lado do Pedrinha em 38–40 s | resolvido |
| 4 | Voz só ~9 dB acima do resto na cena 3 | Stems (RMS por palavra, sem "Toc"): mediana c1 19,5 · c2 19,1 · **c3 23,7** (pior: 11,7 dB em "é", 33,85 s) · **c4 27,9 dB** (pior: 16,4). "deitou" +25,1 dB (antes −3,7). Fora da fala o resto fica em −33,9 dBFS e durante a fala em −38,3 dBFS (agora o ducking aparece). Whisper small no vídeo final: **131/140** literal, **135/140** sem contar a grafia "Thomas" (v1: 133). "O rio" e "morro" agora saem certos; os erros que restam são os mesmos da voz isolada ("veio o" fundido 2×, "quê"→"que", "Até que"→"aqui", "Toc"→"Toque") | resolvido |
| 6 | A legenda pulava de altura no meio de "NINGUÉM MAIS RIA." | 45,0 e 45,5 s: a tela inteira fica em y≈1300; "TOMÁS NUNCA" (46,0 s) já entra em y≈1450 | resolvido |
| 7 | Quebra "A BARBA" / "DE TOMÁS…" | 11,8–12,6 s "A BARBA DE TOMÁS" numa linha; 13,0–13,4 s "FICOU BRANCA."; ortografia OK. Barba cinza→branca de 13,0 a 13,2 s, idêntica à v1 | resolvido |

Fora do escopo, mas visto: as cenas 1–3 são as da v1 (PSNR acima de 53 dB), então a ortografia das outras 49 telas,
a zona segura e a sincronia aprovadas na rodada 1 continuam valendo.

## Problemas
| # | Problema | Local (tempo / cena) | Gravidade | Correção esperada | Responsável |
|---|---|---|---|---|---|
| 5 | Pausas comprimidas: mediana de 0,19 s de silêncio entre frases (na voz bruta era 0,53 s); taxa de 2,89 palavras/s, dentro do briefing. Pendente da escuta, não reprova (decisão do orquestrador) | vídeo inteiro | media | A Lucila ouve e decide; se achar corrido, pausas ≥ 0,30 s e sem atempo | usuario |
| 8 | A palavra "e" (27,3 s) e "é" (33,85 s) ficam só ~11,6–11,7 dB acima da água/SFX, abaixo da mediana | 27,3 s e 33,85 s / cena 3 | baixa | Opcional: baixar mais o SFX de água nesses pontos | editor |

**Só a escuta da Lucila pode julgar:** se a narração soa corrida (#5); timbre e naturalidade da voz Sulafat;
"Até que" em 20,9 s (o Whisper ouve "aqui" até na voz isolada); a pronúncia de "pro" e "Toc"; a qualidade dos
SFX sintetizados (risadinhas, trovão, "tum", crista d'água, pássaros); se o "toc" de pista a −32 dB em
"escutava" se percebe.

## Veredito
**aprovado.** Os 6 itens corrigidos foram conferidos e estão resolvidos. Não há problema `critica` nem `alta`, a
técnica está dentro do padrão e as emendas não têm pulo. Fica pendente só a escuta humana (#5), que não bloqueia.

## Frames inspecionados
- `producoes/VIDEO_001/trabalho/qa/revisor_r2/folha_35_49.jpg` (35,0–49,5 s, a cada 0,5 s)
- `producoes/VIDEO_001/trabalho/qa/revisor_r2/folha_leg_agua.jpg` (legenda 11,4–13,8 s; água 42,0–43,2 s)
- `producoes/VIDEO_001/trabalho/qa/revisor_r2/barba.jpg` (barba v2 × v1, 12,8–13,2 s)
- Medidas: `producoes/VIDEO_001/trabalho/qa/revisor_r2/psnr_v1_v2.log`, `whisper_video_final_r2.json`
