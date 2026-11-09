# Erros recorrentes e soluções

| Data | Erro | Onde apareceu | Causa | Solução | Vezes |
|---|---|---|---|---|---|
| 2026-11-09 | `Composition id can only contain a-z, A-Z, 0-9, CJK characters and -. You passed VIDEO_001` | still/render do VIDEO_001 | Remotion não aceita `_` no id | id `VIDEO-001` (pasta segue `VIDEO_001`) | 1 |
| 2026-11-09 | `ModuleNotFoundError: scipy` | templates de áudio do cartoon-3d-short | scipy não instalado | `estudio/audio/sintese.py` (só numpy) | 1 |
| 2026-11-09 | Estouro de ruído em volume máximo depois da última palavra (VIDEO_001, 48,8–48,95 s; salto entre amostras ~1,3, pico ~0 dBFS) | voz do Gemini TTS (`voz.wav`, 67,44–67,57 s) | o Gemini às vezes devolve ~0,15 s de ruído branco no fim do áudio; o encurtar_pausas mantinha a cauda | `estudio/audio/sintese.py: cortar_estouro_final()` chamado no `encurtar_pausas.py` (zera desde o 1º salto > 0,1 depois da fala, com fade de 5 ms); `scripts/voz.py` avisa ao gerar. Conferir com `python3 scripts/qa_audio.py <video> --fim-fala <s>` | 1 |
| 2026-11-09 | Ombro/braço do Tomás desenhado por cima da barba | `personagens.tsx` (Tomas) | braço da frente desenhado depois da cabeça | braço e regador antes da cabeça; na camada `bracos`, cabeça redesenhada por cima | 1 |
