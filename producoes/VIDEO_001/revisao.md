---
tipo: revisao
task_id: VIDEO_001
autor: revisor
rodada: 1
data: 2026-11-09
video_revisado: producoes/VIDEO_001/video_final.mp4 (sha256: df573115712bd387dc6af87de27b0e2e275b8944455fa1f3331ff32019bc3c20)
veredito: revision_required
---
# Revisão: VIDEO_001 (rodada 1) · beta D-007 (foco: animação, legenda, narração)

Tudo abaixo foi medido por mim no `video_final.mp4` (não copiado do relatório do editor). Ferramentas:
ffprobe, ffmpeg (ebur128, blackdetect, freezedetect, silencedetect), Whisper local `small` (faster_whisper, pt),
numpy nos stems de `trabalho/audio/mix_pre_stems/`.

## Checagens técnicas (medidas)
| Item | Esperado | Medido | OK? |
|---|---|---|---|
| Proporção / resolução | 9:16 · 1080×1920 | 1080×1920, H.264 | OK |
| Duração | briefing: ~45 s (40–50 s) | 49,60 s (fala 0,07–48,53 s + 1 s parado) | OK (no limite) |
| FPS | 30 | 30/1 | OK |
| Loudness integrado | -14 a -10 LUFS | -14,0 LUFS (LRA 2,5 LU) | OK |
| Pico | ≤ -1 dBTP | -1,1 dBTP | OK |
| Frames pretos/brancos/congelados | 0 indesejados | blackdetect (0,1 s): 0 · freezedetect (1 s): 0 · branco: só o flash intencional do "Toc" (~35,1–35,5 s) | OK |
| Faixa de áudio | 1, sem silêncio indevido | 1 faixa AAC 48 kHz estéreo; silencedetect (-45 dB, 0,3 s): nenhum silêncio | OK |

## Checagens de conteúdo
| Item | OK? | Nota |
|---|---|---|
| Gancho (imagem até 1,5 s, fala até 3 s) | OK | 0 s: close da pedra com gotas, Tomás inteiro em 1 s; "Todo dia, Tomás regava uma pedra." termina em 2,67 s |
| Roteiro respeitado (falas exatas) | OK | 140 palavras de `words_editado.json` = 140 tokens de `texto.txt`, na ordem |
| Personagens consistentes (cores, silhueta) | Parcial | Tomás e Pedrinha estáveis; mas Tomás some 35,5–37,6 s (#3) e o rosto do Pedrinha é cortado no plano final (#1) |
| Narração clara, sem erro de pronúncia | Parcial | Whisper no vídeo final: 133/140 palavras (ver Áudio); erros concentrados na cena 3, onde a voz fica só ~9 dB acima do resto (#4). Pronúncia/timbre: só escuta humana |
| Sincronia fala × imagem (≤ 3 frames) | OK | Início das palavras no vídeo final × `words_editado.json`: mediana 0,001 s, p90 0,066 s (2 frames), 133 palavras pareadas; reações do código ancoradas no mesmo json (palavra − 0,05 s). Exceção de conteúdo: "parou" sem reação visual (#2) |
| Legendas e ortografia | OK | 51/51 telas conferidas por frame contra `texto.txt` (acentos, pontuação, "TOC." 2× maior): 0 erros. Sem buraco sem legenda durante a fala |
| Zona segura (250 px de cima e de baixo) | OK | legenda centrada em y=1300 (y=1450 a partir de 45,35 s), ocupa ~y 1200–1520; nada importante em y<250 nem y>1670 |
| Ritmo (nenhum trecho > 4 s sem mudança) | OK | micro-movimento contínuo (chuva, água, respiração); cena 3 fica ~8,7 s (20,9–29,6 s) sem personagem, mas com relâmpago, rio subindo e lanternas |
| Briefing respeitado (item a item) | Parcial | 4 cenas, 2 personagens, paletas por cena, sem rostos extras, sem vítimas, legenda CAIXA ALTA com palavra ativa: OK. "Trilha ~20 dB sob a voz": cenas 1–2 ~19 dB, cena 3 ~9 dB, cena 4 ~10 dB (#4). Virada "deita-se como barragem" pouco legível sem som (#2) |
| Direitos (trilha, efeitos, assets com licença) | OK | trilha e SFX sintetizados por código próprio; Montserrat OFL; voz Gemini TTS (relatório) |
| CTA presente | OK | Sem CTA falado por decisão do briefing; CTA na legenda do post (`plano_postagem.md`) |

## Áudio (avaliação objetiva; eu não ouço)
- **Transcrição do vídeo final (Whisper small, pt, 246 s de CPU):** 133/140 palavras iguais ao `texto.txt`.
  Diferenças: "veio ~~o~~ verão", "veio ~~o~~ frio" (artigo fundido na fala: "veio o"), "o quê" → "o que" (só grafia),
  "Até que" → "Até **aqui**", "O rio" → "**Um** rio", "pro morro" → "pro **mol**" (confiança 0,07), "Toc" → "Toque".
  Mesmo modelo na voz isolada (`voz_editada.wav`, 195 s): 130/140 literal, **134/140** desconsiderando a grafia
  "Thomas" (4×); restam "veio o" fundido (2×), "quê"→"que", "Até que"→"Até aqui", "Toc"→"Toque", "saiu"→"sai".
  **Conclusão:** "Um rio" e "mol" (morro) só aparecem no vídeo final, então vêm da mixagem da cena 3 (#4);
  "Até aqui" aparece também na voz isolada, então é da TTS/do Whisper: a Lucila confere de ouvido em 20,9 s.
- **Taxa de fala:** 140 palavras em 48,46 s = **2,89 palavras/s** (briefing pede ~3; a TTS bruta estava em 2,07).
- **Pausas (silêncio real na voz isolada, energia < pico−35 dB, ≥ 0,12 s):** voz bruta 45 pausas, mediana **0,53 s**;
  voz editada 24 pausas, mediana **0,19 s** (0,12–0,47 s). Há ~35 quebras de frase/vírgula no texto, então ~11 delas
  ficaram sem nenhum silêncio ≥ 0,12 s. Pelos tempos de palavra: após ponto 0,21–0,57 s (antes de "Toc" 0,57 s;
  antes de "Tomás nunca" 0,56 s; as demais ~0,21–0,26 s).
- **Voz × resto (stems, RMS durante cada palavra):** mediana +16,4 dB; por cena: c1 +18,7, c2 +18,9, **c3 +8,7**,
  c4 +10,2 dB. Piores palavras: "deitou" −3,7 dB (sob o "tum"), "Toc" −0,2 (o SFX "TOC" coincide, intencional),
  "é (a sua vez)" +1,3, "subiu" +2,3/+3,6, "beira" +3,0. O "ducking" quase não aparece: o resto fica em −29,5 dBFS
  durante a fala e −30,9 dBFS fora dela.
- **Só a escuta da Lucila pode julgar:** se a narração soa corrida (pausas de ~0,2 s e atempo 1,08 podem soar
  apressadas mesmo com 2,89 pal/s dentro do briefing); timbre e naturalidade da Sulafat, tom "calma e carinho";
  pronúncia de "pro", "Toc" e "morro"; se a chuva/trovão da cena 3 atrapalham entender; qualidade dos SFX sintetizados
  (risadinhas, trovão, "tum", pássaros); se o "toc" de pista a −32 dB em "escutava" se percebe no celular.

## Problemas
| # | Problema | Local (tempo / cena) | Gravidade | Correção esperada | Responsável |
|---|---|---|---|---|---|
| 1 | Plano final: rosto do Pedrinha cortado por uma borda reta da camada de chão em primeiro plano (y≈1385, acima da legenda) e pela borda esquerda do quadro; a boca some. Não é só a legenda, como diz o handoff. É o último quadro, parado 1 s, e o frame de loop | 45,4–49,6 s / cena 4 (plano médio final) | alta | Reenquadrar o plano final (ou trazer Pedrinha para frente do chão) para o rosto dele ficar inteiro, acima da legenda (y≤1350) e longe da borda | editor |
| 2 | "Ele se deitou na beira do rio, e a água parou nas suas costas": a imagem não mostra a barragem. O rio fica atrás, no mesmo nível, sem reação em "parou" (frames 41,6/42,2/42,6/43,4 iguais); Pedrinha deitado parece menor que Tomás em pé e com a cabeça atrás de um caco da casca. Falha o ponto de sincronia "parou" do roteiro e a virada "compreensível sem som" do briefing | 40,5–43,6 s / cena 4 | alta | Mostrar a água chegando e parando encostada nas costas do Pedrinha em "parou" (onda que bate e recua, nível do rio contido de um lado), com Pedrinha visivelmente maior que Tomás; tirar o caco da frente do rosto | editor |
| 3 | Tomás some do quadro logo depois de abraçar a pedra e reaparece em pé à direita ~2 s depois | 35,5–37,6 s / cena 4 (início) | media | Manter Tomás no quadro (recuando assustado) enquanto a pedra racha | editor |
| 4 | Na cena 3 a voz fica só ~8,7 dB acima de trilha+chuva+SFX (briefing: ~20 dB); "deitou" fica 3,7 dB abaixo do "tum". O Whisper no vídeo final errou "até que", "o rio" e "morro" nessa cena | 20,9–35,5 s (cena 3) e 40,6 s | media | Baixar chuva/trovão/água sob a voz na cena 3 (ducking efetivo, alvo ≥ 15 dB) e deslocar o "tum" para depois de "deitou" | editor |
| 5 | Pausas entre frases comprimidas: mediana 0,19 s de silêncio (bruta: 0,53 s); ~11 quebras sem silêncio. Pode soar corrido; não dá para concluir sem ouvir | vídeo inteiro | media | Lucila ouve e decide. Se achar corrido: pausas ≥ 0,30 s após ponto e sem atempo, cortando 1 s do "parado" final ou aceitando ~50 s | usuario (escuta) → editor |
| 6 | A legenda muda de y=1300 para y=1450 no meio da tela "NINGUÉM MAIS RIA." (salto visível) e, em 44,3–45,5 s, cobre os olhos do Pedrinha | 45,35 s / cena 4 | baixa | Trocar a altura só na troca de tela ("TOMÁS NUNCA", 45,59 s) | editor |
| 7 | Quebra de legenda separa o sujeito: "A BARBA" / "DE TOMÁS FICOU BRANCA." | 11,6–13,6 s / cena 2 | baixa | "A BARBA DE TOMÁS" / "FICOU BRANCA." | editor |

## Veredito
**revision_required.** Técnica, ortografia das 51 telas, zona segura e sincronia de palavras estão OK. Há 2 problemas
`alta` de animação na cena 4 (#1 rosto do Pedrinha cortado no quadro final; #2 a barragem/virada não aparece na
imagem), além de 3 `media`. Correção só na cena 4 e na mixagem da cena 3; nada de refazer o resto.

## Frames inspecionados
- `producoes/VIDEO_001/trabalho/qa/folha_contato.jpg` (principal: 50 frames, 1/s)
- `producoes/VIDEO_001/trabalho/qa/revisor/folha_1s_a.jpg`, `folha_1s_b.jpg` (1/s, maior)
- `producoes/VIDEO_001/trabalho/qa/revisor/folha_legenda_1.jpg`, `folha_legenda_19.jpg`, `folha_legenda_37.jpg` (as 51 telas de legenda, recorte y 1080–1640, no tempo da última palavra de cada tela)
- `producoes/VIDEO_001/trabalho/qa/revisor/folha_cortes.jpg` (trocas de cena: 8,6/8,75 · 20,8/20,95 · 35,3/35,55 · 40,45/40,6 · 43,55/43,7 · 45,3/45,45)
- `producoes/VIDEO_001/trabalho/qa/revisor/det/detalhes.jpg`, `final_crop.jpg`, `agua.jpg` (cena 4)
- Transcrições: `producoes/VIDEO_001/trabalho/qa/revisor/whisper_video_final.json`, `whisper_voz_editada_small.json`
