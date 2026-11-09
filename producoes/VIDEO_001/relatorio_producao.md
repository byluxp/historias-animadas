---
tipo: relatorio_producao
task_id: VIDEO_001
autor: editor
versao: 1
data: 2026-11-09
roteiro_usado: producoes/VIDEO_001/roteiro.md (v1)
briefing_usado: producoes/VIDEO_001/briefing.md (v1, aprovado)
---
# Relatório de produção: VIDEO_001 · "O velho que regava uma pedra" (beta D-007)

| Item | Valor (medido com ffprobe / ffmpeg ebur128) |
|---|---|
| Arquivo | producoes/VIDEO_001/video_final.mp4 |
| Duração | 49,60 s (1488 frames) · última palavra termina em 48,53 s, 1 s parado no fim |
| Resolução / proporção | 1080×1920 · 9:16 |
| FPS · codec | 30/1 · H.264 + AAC 48 kHz estéreo |
| Loudness integrado (LUFS) · pico (dBTP) | −14,0 LUFS · −1,1 dBTP (LRA 2,5 LU) |
| Tamanho (MB) | 23,4 MB (23 417 862 bytes) |
| Tempo de render | 878 s (14,6 min) em 3 segmentos de ~500 frames (331 + 285 + 250 s), `--concurrency=2`, ~0,6 s/frame. Mais ~6 min em 6 rodadas de stills de conferência |
| Skills usadas | remotion-best-practices (Remotion 4.0.537), animation-basics (antecipação, squash & stretch, overshoot); áudio próprio (numpy) |
| Voz | Gemini TTS `gemini-3.8-flash-lite-tts`, voz Sulafat, **1 geração** (sem regenerar). Uso (`trabalho/voz/custo.json`): 836 caracteres, 246 tokens de entrada + 1686 tokens de áudio (total 1932). Custo em R$ não medido (a API não devolve preço) |
| Sem quadro preto | `blackdetect` (0,1 s): nenhum |

## Cenas produzidas
Um só "mundo" 2D (quintal + rio + estrada + vila no morro) com câmera e paralaxe por camada; cada cena muda paleta, câmera e ação. Código: `estudio/src/videos/VIDEO_001/` (`Video001.tsx`, `cenario.tsx`, `personagens.tsx`, `words.json`), composição `VIDEO-001` em `estudio/src/Root.tsx`.

| # | Tempo | Status | O que tem | Pontos de sincronia (palavra → reação) |
|---|---|---|---|---|
| 1 | 0,0–8,7 | nova | close 2,2× na pedra com gotas abrindo até plano geral, deriva lateral; Tomás rega; poeira dourada; balões "HA HA" nas janelas; sorriso de olhos fechados | "pedra" (gotas), "ria" 3,83 s (balões), "sorria" 6,63 s |
| 2 | 8,7–20,8 | nova | fade de 8 frames; mesmo quintal, câmera parada; verão → frio (folhas caindo, árvore pelada) → troca rápida de estações; barba cinza→branca e corpo mais curvado; ajoelha e encosta o ouvido; push-in 1,1→1,5 | "verão" 9,02, "frio" 9,95, "anos", "branca" 12,97, "escutava" 17,82 ("toc" a −32 dB) |
| 3 | 20,8–35,5 | nova | escuro; noite azul, relâmpago com raio, chuva em 2 camadas, tremor; rio sobe em 2 pulos e engole a estrada; lanternas sobem o morro; Tomás de capa amarela corre contra elas; close do abraço; câmera para, "Toc" com tranco, rachadura acesa, branco de 4 frames | "desabou" 22,53, "subiu, subiu" 25,73/26,56, "engolir", "correu pro quintal", "Toc" 35,08 |
| 4 | 35,5–49,6 | nova | casca se abre (overshoot), Pedrinha pequeno abre os olhos e cresce até ocupar o quadro, Tomás surpreso; Pedrinha deita (squash) como barragem com "tum"; água se acalma; amanhecer rosado, flores brotam no musgo, silhuetas quietas no morro, pássaros; plano médio final: Tomás rega uma flor, Pedrinha fecha os olhos feliz, gota em "inteira" | "rachou" 36,12, "saiu", "enorme", "deitou" 40,62, "parou" 42,36, "ria" 44,87, "inteira" 48,14 |

Legenda: `LegendaFrases` (comum.tsx), 51 telas de 1–4 palavras, CAIXA ALTA, Montserrat Black com contorno, palavra ativa em amarelo #FFD84D, centro em y=1300 (y=1450 no plano final, para não cobrir o rosto do Pedrinha), "TOC." sozinho e 2× maior; ortografia do `texto.txt`. Movimento contínuo: respiração e piscadas dos dois personagens, partículas, nuvens, água, grama balançando.

## Fontes de áudio e licenças
| Elemento | Origem | Licença |
|---|---|---|
| Narração | Gemini TTS (Sulafat), gerada para este vídeo; pausas encurtadas + atempo 1,08 (`estudio/audio/encurtar_pausas.py`) | Termos da API Google Gemini (uso autorizado pela Lucila para este teste) |
| Trilha (celesta/pizzicato, tensão em Ré menor, resolução em Fá maior) | Sintetizada por código próprio (`estudio/audio/sintese.py`, `mix_video001.py`) | Própria |
| SFX (gotas, risadinhas abafadas, whoosh, toc, trovões, chuva, água, passos, estalos, tum, ondas, pássaros, cintilada) | Sintetizados por código próprio | Própria |
| Fonte Montserrat | instalada no sistema | SIL Open Font License |

Mix: voz −15,3 LUFS × trilha −35,4 LUFS nos stems (trilha ~20 LU abaixo, com ducking sob a voz); loudnorm em 2 passadas para −14 LUFS. Arquivos: `trabalho/audio/mix_final.wav`, `mix_pre_stems/`.

## Limitações técnicas encontradas
- **Voz longa:** a TTS leu em 67,6 s (2,1 palavras/s). Para caber em 40–50 s, as pausas foram encurtadas (após ponto ≈ 0,22 s) e a voz acelerada 1,08×. Nenhuma palavra cortada (140/140 na re-transcrição; legenda a 0,028 s em média do áudio, ver `TESTES.md`). A narração pode soar mais corrida que o "com calma" pedido: **ponto a avaliar pela Lucila**.
- Pausa antes de "Toc." ficou ~0,57 s (alvo do roteiro ~0,4 s) e antes de "Tomás nunca" ~0,56 s (alvo ~0,6 s).
- Não consigo **ouvir** o áudio: a pronúncia de "pro" (Whisper transcreveu "para o" na 1ª passada e "pro" na 2ª), o tom da voz e o timbre dos SFX sintetizados (risadinha, trovão) precisam de escuta humana.
- id da composição é `VIDEO-001` (o Remotion não aceita "_").
- `scipy` não está instalado: os templates de áudio do cartoon-3d-short não rodam; síntese reescrita só com numpy.
- O "Toc" em "escutava" está a −32 dB (quase inaudível, como pede o roteiro): talvez nem se perceba no celular.
- Plano final: a legenda cobre a boca do Pedrinha (os olhos ficam visíveis).

## Soluções reutilizáveis registradas
- `SECOND_BRAIN/04_PRODUCAO/solucoes_tecnicas/voz_pausas_e_tempos.md`
- `SECOND_BRAIN/04_PRODUCAO/solucoes_tecnicas/remotion_2d_mundo_unico.md`
- `SECOND_BRAIN/04_PRODUCAO/solucoes_tecnicas/audio_sintese_numpy.md`
- `SECOND_BRAIN/04_PRODUCAO/solucoes_tecnicas/estudio.md` (atualizado) e `erros_recorrentes.md` (2 linhas)
- Personagens: `SECOND_BRAIN/04_PRODUCAO/personagens/tomas.md`, `pedrinha.md` (código em `estudio/src/videos/VIDEO_001/personagens.tsx`)
- Stills de conferência: `trabalho/stills/v1…v6` + folhas de contato; frames do vídeo final: `trabalho/qa/folha_final.png`

## Rodada 1 de correção (revisao.md, rodada 1) · 2026-11-09
Versão anterior guardada em `versoes/video_final_v1.mp4` (mix anterior: `trabalho/audio/mix_final_v1.wav`). Cenas 1–3 (imagem) e narração **não** foram mexidas; pausas da voz (#5) intactas, aguardando a escuta da Lucila.

| # | Correção feita |
|---|---|
| 1 | Plano final (45,4–49,6 s): Pedrinha deitado agora é desenhado **depois** do chão (a borda do chão em primeiro plano cortava o rosto por causa da paralaxe no zoom); câmera reenquadrada (z 1,75→1,85, foco 277/785): rosto inteiro, ~150 px da borda esquerda, base do rosto acima de y≈1310 |
| 2 | 40,2–43,6 s refeito: plano aberto (zoom 0,9) com Pedrinha deitado na margem em escala 1,5 (≈ 1360 px de comprimento, cabeça maior que Tomás, que aparece pequeno, de capa, no quintal); rio cheio atrás dele até o pé do morro, ondas indo na direção das costas; em "parou" (42,36 s) uma crista branca chega, bate nas costas, espirra e a água fica parada com espuma encostada; quintal e Tomás secos na frente. Sem caco da casca na cena (no plano geral do amanhecer as cascas foram para o chão em frente, longe do rosto) |
| 3 | 35,4–37,6 s: Tomás fica no quadro, ajoelhado e recuando (x 585→650) enquanto a pedra racha; depois se afasta para a direita quando Pedrinha cresce |
| 4 | Da cena 3 em diante, trilha + chuva + trovão + água + SFX abaixam 14 dB enquanto a voz fala (exceto no "TOC", que coincide de propósito com a palavra); água do 2º "subiu" −5 dB; "tum" movido para depois de "deitou" (41,01 s) e −7 dB. Medido nos stems (RMS durante cada palavra, sem "Toc"): voz acima do resto, mediana c3 **23,7 dB** (antes 8,7), c4 **27,9 dB** (antes 10,2); pior palavra c3 11,6 dB ("e", 27,3 s), c4 16,4 dB. Cenas 1–2 sem mudança (19,5 / 19,1 dB) |
| 6 | A altura da legenda é por tela: y=1300 até "NINGUÉM MAIS RIA." inteira; y=1450 só a partir de "TOMÁS NUNCA" (45,59 s) |
| 7 | Quebra "A BARBA DE TOMÁS" / "FICOU BRANCA." (a 1ª tela em fonte 76 px para caber numa linha) |

Re-render só dos trechos alterados: frames 330–419 (legenda #7) e 1050–1487 (cena 4), montados com os frames da v1 (`trabalho/render/render_r1.sh`, reencode H.264 CRF 17). Stills de conferência: `trabalho/stills/r1a`, `r1b` (+ folhas).

**Medidas da versão corrigida (ffprobe / ebur128):** 49,60 s, 1488 frames, 1080×1920, 30/1, H.264 + AAC 48 kHz; −14,0 LUFS, −1,1 dBTP; 26,1 MB; blackdetect 0. Re-render da rodada: 668 s (68 + 252 s de Remotion + montagem/reencode). Frames conferidos no arquivo final: `trabalho/qa/folha_final_r1.png` (11,0–49,55 s, incluindo as emendas 11/12,5/14 s).
