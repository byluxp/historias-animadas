---
versao: 1
status: aprovado
atualizado: 2026-11-09
dono: orquestrador
---
# Diretrizes vigentes

> Só o orquestrador altera. Toda mudança vira uma linha em `decisoes.md`.

## Canal
- **Conta:** conta nova do TikTok só para as histórias (não a de músicas). [decisão D-002]
- **Idioma:** português do Brasil, na narração, nas legendas e na descrição. [D-003]
- **Proposta:** histórias animadas originais, sem rosto, com narração. Ideia de origem: trazer formatos que já viralizam lá fora e ainda não têm versão brasileira animada. [HIPÓTESE do Canal Dark]

## Histórias críveis [D-008]
- Toda história precisa ter uma chance remota, mas real, de acontecer: fofoca, hospital, vizinhança, bichos, trabalho. Nada de mágica nem de coisa impossível.
- Bichos e pessoas agem como agiriam de verdade (castor faz barragem, esquilo não).
- A virada responde ao mistério com pistas plantadas antes. Final que deixa a sensação de "que bobeira" faz a pessoa não voltar ao perfil.
- Quem garante isso é o **roteirista** (filtro de credibilidade); a premissa do marketing é só sugestão.

## Formato técnico padrão
- 9:16, 1080×1920 (ou 1440×2560 se o render 2K couber no tempo), 30 fps, H.264, AAC 48 kHz.
- Zona segura: nada importante a menos de 250 px das bordas de cima e de baixo.
- Loudness alvo: -14 LUFS integrado, pico ≤ -1 dBTP.
- Duração: definida pelo briefing; ponto de partida [HIPÓTESE]: 45–70 s (padrão provado do `cartoon-3d-short`).

## Produção
- Motor visual padrão: `cartoon-3d-short` (personagens 2D em mundo 3D, three.js + Remotion). Alternativa leve: `hyperframes`.
- Não há gerador de imagem ou vídeo por IA: tudo é construído em código e reaproveitado do banco `04_PRODUCAO/`.
- Voz: ElevenLabs `eleven_v4`, escolhida pelo tom da história [D-010]: **alegre → Juliano Magalhães**, **terror → Carlos**. Tom sem voz definida = perguntar à Lucila. Reserva: Gemini TTS (Sulafat) ou a voz gravada da Lucila.
- Trilha e efeitos: sintetizados ou CC0 com licença registrada. Nada de música comercial embutida no vídeo.
- As regras do `cartoon-3d-short` "English only" e "sem legendas" **não** valem aqui; legenda é decisão do briefing. [D-003]

## Publicação
- O sistema envia aos **rascunhos**; quem publica é a Lucila, no app, com o rótulo de conteúdo de IA ativado.
- No máximo 5 envios aos rascunhos por 24 h (limite visto no projeto Legendas). [EVIDÊNCIA externa]
- Todo envio exige autorização registrada (`scripts/estado.py autorizar`).

## Decisões com base em dados
- Nenhuma diretriz muda com base em 1 vídeo. Mínimo: 3 vídeos comparáveis por variável, e a mudança entra como "tendência", não como verdade.
