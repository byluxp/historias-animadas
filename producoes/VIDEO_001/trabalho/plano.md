# Plano de produção: VIDEO_001 (editor, beta D-007)

Motor: 2D em Remotion 4.0.537 (SVG), `estudio/src/videos/VIDEO_001/`. Tudo sincronizado ao `trabalho/voz/words.json`.

| Cena | Como será feita | Reutiliza |
|---|---|---|
| 1 Quintal dourado | SVG: céu gradiente, morro com vila em silhueta (paralaxe 3 camadas), cerca, árvore, pedra com gotas; Tomás novo (Boneco estendido: barba, chapéu, curvatura, regador); balões HA HA nas janelas em "ria"; poeira dourada | `Camera`, `Acabamento`, ideia do `Boneco`/`Cabeca` (estendidos em `Tomas`) |
| 2 Estações | Mesmo quintal, câmera parada; céu/árvore/luz trocam por palavra-chave (verão, frio, anos); barba cinza→branca em "branca"; push-in em "escutava" com Tomás ajoelhado | cenário da cena 1 |
| 3 Tempestade | Noite azul, 2 camadas de `Chuva`, relâmpago em "desabou", rio sobe em 2 pulos, luzinhas subindo o morro, Tomás de capa amarela correndo; close do abraço; rachadura acesa em "Toc" | `Chuva`, `Camera` (tremor) |
| 4 Pedrinha e amanhecer | Casca abre, Pedrinha (SVG novo) levanta e deita como barragem; amanhecer rosado, flores no musgo, Tomás rega uma flor; gota final em "inteira" | — |
| Legenda | Nova `LegendaFrases`: frases 2–4 palavras, CAIXA ALTA, palavra ativa em amarelo, y≈1300 | evolução de `Legenda` |
| Som | Síntese própria em numpy (sem scipy na máquina): celesta/pizzicato, pad, tambor, gotas, trovão, chuva, toc, estalos, tum; mix + loudnorm -14 LUFS | ideias de `cartoon-3d-short/templates/audio` |
