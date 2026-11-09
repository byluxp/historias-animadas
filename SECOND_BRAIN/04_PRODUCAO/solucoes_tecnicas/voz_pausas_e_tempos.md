# Voz longa demais: encurtar pausas sem cortar fala (e manter os tempos das palavras)

**Problema (VIDEO_001, 2026-11-09):** o Gemini TTS (Sulafat, `gemini-3.8-flash-lite-tts`) leu 140 palavras em
**67,6 s** (2,1 palavras/s, pausas de 0,4–0,8 s entre frases). O alvo era 40–50 s. Regenerar não é garantia e custa.

**Solução:** `estudio/audio/encurtar_pausas.py` (rodar com o Python do venv do Whisper, que tem numpy):
```
~/Vídeos/Edição/.whisper-env/bin/python estudio/audio/encurtar_pausas.py \
  trabalho/voz/voz.wav trabalho/voz/words.json trabalho/voz/voz_editada.wav trabalho/voz/words_editado.json \
  1.08 0.24 0.14 0.09        # atempo, pausa após ponto, após vírgula, entre palavras (s)
```
1. Detecta silêncios (RMS < -40 dBFS por ≥ 0,12 s) e remove só o **meio** de cada um (crossfade de 15 ms):
   a fala nunca é cortada. Pausas dramáticas do roteiro ficam maiores (dicionários `ESPECIAL_ANTES/DEPOIS`,
   índice da palavra no words.json; ajustar por vídeo).
2. **Corrige os tempos do Whisper antes:** o Whisper estica palavras para dentro das pausas ("Até" 1 s) e
   erra palavras curtas/estranhas ("Toc" → "Toque", que o alinhamento marca como estimada). O script
   encaixa as bordas nos silêncios medidos e, para palavra estimada, usa o tempo bruto do Whisper quando
   as 2 primeiras letras batem.
3. Remapeia o words.json pelo mesmo mapa de cortes e divide pelo `atempo` (≤ 1,08).

**Resultado medido:** 67,6 s → 48,95 s (43 pausas encurtadas + atempo 1,08). Conferência: nova
transcrição da voz editada pareou 131 de 140 palavras com desvio médio de **0,028 s** no início (p90
0,07 s, máx. 0,29 s); os 9 pontos de sincronia do roteiro ficaram a ≤ 0,04 s. Tempo: ~5 s (mais ~3,5 min
se quiser re-transcrever para conferir).

**Limitação:** pausa de 0,22 s após ponto deixa a narração mais corrida; se sobrar margem, use 0,30.
O jeito certo de evitar é pedir no `texto.txt` um ritmo um pouco mais ágil.
