# Aprendizados

> Só o orquestrador escreve. Cada aprendizado diz a força da evidência.

## Herdados de outro projeto (TikTok Legendas, nicho de música, 5 vídeos), tratar como [HIPÓTESE]
- O TikTok testa cada vídeo com um grupo pequeno e, se não engaja, para nas primeiras ~3 h. Por isso a métrica de 24 h mede o lote de teste.
- A maioria das pessoas saiu antes de 5-7 s, então o gancho dos primeiros segundos decide tudo.
- Perfil com fandom ativo rendeu 3× mais (n = 1, não conclusivo).

## Deste projeto
- **2026-11-09 · VIDEO_001 (beta) · avaliação da Lucila, n = 1, qualitativo:**
  - ✅ Aprovados: estrutura início-meio-fim, legenda palavra a palavra (tempos), narração Gemini com pausas comprimidas (~0,2 s) e mixagem.
  - ❌ Virada impossível (pedra que choca bicho de pedra): cumpre o "mistério no começo, revelação no fim", mas gera sensação de enganação e não faz voltar ao perfil. Virou a diretriz "Histórias críveis" (D-008).
  - ⚠ Detalhe de personagem: ombro do Tomás desenhado por cima da barba. Personagem novo precisa de still em close conferido antes do render.
  - ⚠ Estouro de ruído depois da última palavra (48,8 s) que o revisor não pegou: entrou o detector `scripts/qa_audio.py` no checklist.
