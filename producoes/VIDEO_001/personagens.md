---
tipo: personagens
task_id: VIDEO_001
autor: roteirista
versao: 1
status: rascunho
---
# Personagens e cenários: VIDEO_001

> Banco `SECOND_BRAIN/04_PRODUCAO/personagens/` ainda vazio: os dois são novos. Se o revisor aprovar, entram no banco.

## Personagens
| Nome | Papel | Silhueta / proporção | Cores (hex) | Roupa / acessório-marca | Expressões necessárias | Banco (reuso?) |
|---|---|---|---|---|---|---|
| Tomás | Protagonista: velho teimoso e carinhoso que cuida da pedra | `Boneco` de cabeça redonda grande (cabeça ≈ 1/3 da altura), corpo levemente curvado para a frente, pernas finas; fica um pouco mais curvado na cena 2 | pele #E8B48A; barba #9A9A9A → #F4F1EA (branca a partir da cena 2); camisa #C8553D; calça #4A5A78; regador #4E9F6B; capa de chuva #F2C14E (cena 3) | Regador verde sempre na mão (some só no abraço); chapéu de palha #D9B26F nas cenas 1, 2 e 4; capa amarela na 3 | sorriso de olhos fechados, escutando (olhos fechados + sorrisinho), preocupado (boca reta, sobrancelha), abraçando com força, sorriso aberto no fim | Novo (base: `Boneco` + `Cabeca` de `comum.tsx`) |
| Pedrinha (nome não é dito) | Bicho de pedra que sai do "ovo" e vira barragem | Antes: pedra oval lisa, ~1/2 da altura de Tomás. Depois: bicho largo e baixo, tipo tartaruga/tatu sem casco, cabeça redonda pequena, corpo comprido (deitado ocupa a largura do quadro) | pedra #8C8A86 com sombra #6E6C69 e luz #B5B2AC; musgo #6FA35A; olhos #2B2B2B com brilho #FFFFFF; rachadura acesa #FFF6D5 | Musgo nas costas, que ganha florzinhas #F7A8B8 no amanhecer | olhos fechados (dentro do ovo), olhos abrindo devagar, olhar manso, olhos fechados feliz (fim) | Novo |

Vila: só silhuetas de casas no morro, janelas com balões "HA HA" (cena 1) e pontos de luz/lanterna (cena 3). Sem rostos.

## Cenários
| Id | Lugar | Hora / luz | Paleta | Elementos obrigatórios | Cenas |
|---|---|---|---|---|---|
| A | Quintal de Tomás | Fim de tarde dourado | #F6C177, #E9895B, #7FA866, céu #FBD8A0 | pedra no chão de terra, cerca baixa, vila em silhueta no morro ao fundo, poeira dourada | 1 |
| A' | Mesmo quintal, estações | Verão (sol forte), frio (cinza, folhas), troca rápida | verão #FFD36E; frio #A7B4C2 com folhas #C9773B | mesma composição de A (só o céu, a árvore e a luz mudam), pedra idêntica | 2 |
| B | Quintal + rio atrás, tempestade | Noite azul com relâmpagos | #1C2A4A, #2F4A78, relâmpago #E8F1FF, capa #F2C14E | chuva forte, rio subindo em dois níveis, estrada sendo coberta, luzinhas subindo o morro | 3 |
| C | Margem do rio | Amanhecer rosado | #F7B6A8, #F9D9C4, água #8FC3D9, musgo #6FA35A | Pedrinha deitado como barragem, rio calmo, cascas da pedra no chão, silhuetas quietas no morro, pássaros | 4 (começo da cena 4 ainda em B com chuva fraca) |

## Objetos importantes (props) e seus estados
| Objeto | Estado | Cenas |
|---|---|---|
| Pedra / ovo | lisa e molhada (gotas) | 1, 2 (idêntica o tempo todo) |
| Pedra / ovo | rachadura branca acesa | 3 (em "Toc") |
| Pedra / ovo | casca aberta em pedaços no chão | 4 |
| Regador | na mão, pingando | 1, 2, 4 |
| Rio | normal → nível 1 → nível 2 (cobre a estrada) → parado nas costas de Pedrinha → calmo | 3, 4 |
