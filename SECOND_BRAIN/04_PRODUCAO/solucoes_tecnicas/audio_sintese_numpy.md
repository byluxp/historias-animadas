# Trilha e efeitos sintetizados só com numpy (sem scipy)

Os templates de áudio do `cartoon-3d-short` usam `scipy`, que **não está instalado** (nem no Python do
sistema, nem no venv do Whisper). Solução: `estudio/audio/sintese.py`, só numpy (filtros por FFT).

- Instrumentos: `celesta`, `pizz`, `pad`, `baixo`, `tambor`.
- Efeitos: `gota`, `trovao`, `chuva`, `whoosh`, `toc` (madeira/pedra), `estalo_pedra`, `tum`,
  `agua_subindo`, `ondas`, `passarinho`, `risadinha` (vogal por formantes, abafada), `brilho`; `reverb` por convolução.
- `Mesa`: trilhas nomeadas onde se soma som em um tempo. Exemplo completo: `estudio/audio/mix_video001.py`
  (cues pelos índices do words.json; ducking da trilha pela envoltória da voz; stems separados).
- Rodar com `~/Vídeos/Edição/.whisper-env/bin/python` (tem numpy). ~1,5 min para 50 s.

**Loudness (2 passadas):**
```
ffmpeg -i mix_pre.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -   # mede
ffmpeg -i mix_pre.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=…:measured_TP=…:measured_LRA=…:measured_thresh=…:offset=…" -ar 48000 -ac 2 mix_final.wav
```
VIDEO_001: voz −15,3 LUFS × trilha −35,4 LUFS nos stems (trilha 20 LU abaixo); final −14,0 LUFS, −1,5 dBTP.
Licença: tudo gerado por código próprio, sem material de terceiros.
