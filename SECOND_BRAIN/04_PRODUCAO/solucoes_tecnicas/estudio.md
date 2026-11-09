# Estúdio Remotion (`estudio/`)

- Criado em 2026-11-09 copiando o projeto do piloto 2D (`~/Vídeos/Tiktok/animado`): Remotion 4.0.537, React 18.3.1. `node_modules` copiado (700 MB) para não depender de rede.
- `src/comum.tsx`: peças 2D do piloto (personagem, cenários, chuva…). Reaproveite antes de desenhar do zero.
- Cada vídeo: `src/videos/<video_id>/` + uma `<Composition id="VIDEO-NNN">` em `src/Root.tsx` (**hífen**: o Remotion recusa "_" no id). Áudio em `public/<video_id>/`.
- Prévia: `cd estudio && npx remotion studio`. Render: `npx remotion render src/index.ts VIDEO-NNN ../producoes/VIDEO_NNN/trabalho/render.mp4 --concurrency=2` (~0,7 s/frame; acima de ~700 frames, em segmentos: ver `remotion_2d_mundo_unico.md`).
- Stills em lote: `node scripts/stills.mjs VIDEO-NNN <pasta> <t1> <t2> …` (segundos).
- Áudio: `audio/sintese.py` (síntese só com numpy), `audio/encurtar_pausas.py` (voz), `audio/mix_<video>.py`.
