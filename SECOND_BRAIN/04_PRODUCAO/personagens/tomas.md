---
tipo: personagem
nome: Tomás
origem: VIDEO_001 ("O velho que regava uma pedra")
status: aguardando aprovação do revisor   # o README pede aprovação antes de entrar no banco; registrado aqui para achar o código
---
# Tomás

- **Papel:** velho teimoso e carinhoso. Cabeça redonda grande (≈ 1/3 da altura), nariz grande, barba e bigode
  volumosos, sobrancelhas grossas, corpo levemente curvado, pernas finas. Visto em 3/4 olhando para a direita
  (espelhar com `scale(-1,1)` para olhar para a esquerda).
- **Cores:** pele #E8B48A; barba #9A9A9A → #F4F1EA (prop `barba` 0→1); camisa #C8553D; calça #4A5A78;
  sapato #5A3A26; regador #4E9F6B; chapéu de palha #D9B26F (fita #8A5A3A); capa de chuva #F2C14E com capuz.
- **Expressões (`olhos`/`boca`):** abertos (pisca sozinho), fechados (sorriso de olhos fechados), olhando,
  preocupado, surpreso; bocas sorriso, sorrisão, reta, "o", fala (abertura animada por `fala`).
- **Poses:** em pé regando (`rega` 0→1, gotas do bico até `gotasAteY`), ajoelhado (`joelho` 0→1, contínuo),
  correndo (`corre` = fase), sentado (`sentado`), abraçando (`camada: 'corpo'` + objeto + `camada: 'bracos'`).
- **Código:** `estudio/src/videos/VIDEO_001/personagens.tsx` → `Tomas`, `bicoSentado`, `Gotas`.
  Escala usada: 0,84 (altura ≈ 540 px com chapéu).

## Correção 2026-11-09 (feedback da Lucila): ombro por cima da barba
- **Defeito:** o braço da frente (e o regador) eram desenhados **depois** da cabeça, então a manga/ombro
  aparecia por cima da barba, como se o ombro saísse da barba.
- **Correção no componente `Tomas`:** ordem das camadas = pernas → braço de trás → tronco → **regador → braço
  da frente → cabeça (barba)**. A barba fica na frente do peito e do ombro; o ombro sai do tronco. Na camada
  `'bracos'` (abraço na pedra) a cabeça é redesenhada por cima do braço pelo mesmo motivo.
- **Efeito colateral aceito:** com a mão perto do peito (plano final, sentado), parte da mão fica atrás da barba;
  o regador continua visível. Stills de antes/depois: `producoes/VIDEO_001/trabalho/stills/ajuste_ombro/`.
