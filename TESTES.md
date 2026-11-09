# Testes medidos: Histórias animadas

## 2026-11-09: Fase 2, estrutura (estado, protocolo, scripts)
**O que mudou e por quê:** criada a arquitetura multiagente (orquestrador + 5 subagentes) com estado
central validado por script, para nenhum agente "concluir" sem arquivo e nenhum envio sair sem autorização.

**Casos usados** (numa cópia descartável do projeto, com entregas falsas; resposta esperada → obtida):
| # | Caso | Esperado | Obtido |
|---|---|---|---|
| 1 | Handoff `completed` com arquivo inexistente | recusar | ✅ recusou |
| 2 | Handoff sem `deliverable` e status `done` | recusar | ✅ recusou |
| 3 | Handoff válido do agente de histórias | aceitar, etapa → marketing | ✅ |
| 4 | Roteirista usando `approved` | recusar | ✅ recusou |
| 5 | `revision_required` sem `issues` | recusar | ✅ recusou |
| 6 | 3ª rodada de correção do editor | `blocked`, vai para a Lucila | ✅ bloqueou na 3ª |
| 7 | Agente iniciar com vídeo `blocked` | recusar | ✅ recusou |
| 8 | Autorizar envio antes da aprovação do revisor | recusar | ✅ recusou |
| 9 | Registrar publicação sem autorização | recusar | ✅ recusou |
| 10 | Desbloquear (decisão da Lucila) → rodadas zeradas | aceitar | ✅ |
| 11 | Revisor `approved` → etapa 8; autorizar → registrar estados | aceitar | ✅ |
| 12 | Versionar documento aprovado (2×) | guardar v1 e v2, original vira rascunho | ✅ |
| 13 | Métrica de vídeo inexistente | recusar | ✅ recusou |
| 14 | Resumo de métricas com 1 vídeo | mostrar aviso de amostra pequena | ✅ |
| 15 | Envio ao TikTok sem autorização | recusar antes de tocar na API | ✅ recusou |
| 16 | Voz sem chave da ElevenLabs | `blocked` com motivo | ✅ |

**Resultado:** 16 de 16 casos com a resposta esperada. Marco zero: não existia sistema antes.
**Não testado ainda:** chamada real dos subagentes (só carregam numa sessão nova), envio real ao TikTok
(conta não conectada), voz real (sem chave). Ficam para as Fases 3-5.

## 2026-11-09: VIDEO_001, voz do Gemini encurtada (pausas + atempo) e sincronia das legendas
**O que mudou e por quê:** a narração do Gemini TTS (Sulafat) saiu com 67,6 s para 140 palavras; o alvo era
40–50 s. Criado `estudio/audio/encurtar_pausas.py`, que encurta só o meio dos silêncios, acelera ≤ 1,08× e
remapeia o `words.json` (tempos usados na legenda e em toda a animação). Risco: cortar fala ou dessincronizar.

**Casos usados:** as 140 palavras do texto; resposta esperada = cada palavra audível na voz editada e com o
tempo do `words_editado.json` igual ao de uma transcrição nova e independente (Whisper small) da voz editada.
Pontos de sincronia do roteiro conferidos um a um: ria, branca, escutava, desabou, subiu (2×), Toc, parou, ria, inteira.

| Medida | Antes (voz bruta) | Depois (voz editada) |
|---|---|---|
| Duração | 67,6 s | 48,95 s (vídeo 49,6 s com 1 s parado no fim) |
| Palavras do texto ouvidas na transcrição | 140/140 | 140/140 (variações de grafia do Whisper: "Thomas", "Toque", "aqui", "sai") |
| Palavras com tempo estimado (sem par no Whisper) | 7 | 6 ("Toc" passou a usar o tempo bruto do Whisper) |
| Desvio médio do início (words remapeado × transcrição nova) | — | 0,028 s em 131 palavras pareadas (p90 0,07 s; máx. 0,29 s) |
| Pontos de sincronia do roteiro a ≤ 0,05 s | — | 10 de 10 |

**O que falhou e por quê:** 1ª versão do remapeamento errava 1,1 s no fim (o crossfade de 15 ms foi subtraído
com o sinal trocado); detectado porque a última palavra terminava depois do fim do áudio. Corrigido antes de usar.
**Decisão:** usar a voz editada (1 geração só, sem regenerar). Pausa após ponto ficou em 0,22 s: a Lucila deve
avaliar se a narração ficou corrida.
**Frase para entrevista:** "encurtei a narração de 67,6 s para 49 s sem cortar nenhuma palavra, e a legenda ficou
a 28 ms em média do áudio, medido contra uma transcrição independente".

## 2026-11-09: VIDEO_001 beta, primeiro ciclo de ponta a ponta (marketing → roteirista → editor → revisor)
**O que mudou:** primeira produção real com os agentes. **Casos:** 1 vídeo (beta).
| Medida | Resultado |
|---|---|
| Handoffs válidos aceitos pelo `estado.py` | 6 de 6 |
| Problemas pegos pelo revisor na rodada 1 | 7 (2 altos, 3 médios, 2 baixos), confirmados nos frames pelo orquestrador |
| Rodadas até a aprovação | 2 (limite: 2 por responsável) |
| Voz acima do resto na cena 3 | 8,7 dB → 23,7 dB |
| Palavras certas (Whisper no vídeo final) | 133/140 → 135/140 |
| Tempo total (fora a pausa por limite de uso) | ~1 h 40 min, dos quais ~15 min de render por versão |

**O que falhou:** agentes nativos não carregam na sessão em que foram criados (usado o general-purpose lendo o AGENT.md). O 1º rascunho da cena 4 não mostrava a virada; o revisor pegou.
**Frase para entrevista:** "no primeiro vídeo, o agente revisor pegou 7 problemas antes de chegar a mim, 2 deles graves no final da história, e a correção saiu numa única rodada."

## Próximos testes planejados
- **Fase 3 (estratégia):** 1 ciclo real de historias → marketing → orquestrador. Medir: briefing com 0
  itens vazios, % de afirmações com marca de evidência, nº de exemplos com link, tempo e tokens por agente.
- **Fase 4 (revisor):** conjunto fixo de 10 vídeos curtos com defeitos plantados (legenda errada, áudio
  dessincronizado em 0,3 s, frame preto, duração errada, 16:9, texto fora da zona segura, loudness -24
  LUFS, personagem com cor trocada, CTA ausente, 1 vídeo sem defeito). Medir: defeitos pegos / plantados
  e falsos positivos.
