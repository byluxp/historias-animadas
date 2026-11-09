# Remotion 2D: um "mundo" só, câmera com paralaxe, stills em lote e render em segmentos

Usado no VIDEO_001 (`estudio/src/videos/VIDEO_001/`). Máquina: 4 núcleos, 3,7 GB, sem GPU.

## Mundo único + câmera
- `cenario.tsx` desenha **um** lugar (céu, morros, vila, rio, estrada, árvore, cerca, chão) em camadas SVG
  com profundidade `d` (0 = infinito, 1 = plano dos personagens). `camT(cam, d)` aplica zoom/foco/tremor
  proporcionais a `d` → paralaxe de graça em todo zoom, tremor e deriva.
- Cada cena é o mesmo `Mundo` com outra **paleta** (`PAL.dourado/verao/frio/noite/madrugada/amanhecer`,
  `mixPal` interpola cores) e outra câmera. Close = mesmo mundo com zoom 1,5–2,2: continuidade automática
  (a pedra está sempre no mesmo lugar) e quase nenhum desenho extra.
- `LARGO = {z: 1.1, fx: 540, fy: 870}`: plano geral que põe os pés dos personagens em y≈1150, logo acima da
  legenda (y 1300). Sem isso a metade de baixo do 9:16 fica vazia.
- Tempos de tudo vêm do `words.json` importado no TSX (`T(i)` = início da palavra i − 0,05 s ≈ 1,5 frame antes).

## Peças reutilizáveis em `src/comum.tsx`
`LegendaFrases` (frases 2–4 palavras, CAIXA ALTA, palavra ativa em amarelo, contorno grosso, pop),
`Particulas` (poeira/pólen), `piscando(frame, seed)` (piscada natural), `clarao(t, t0)` (relâmpago duplo).

## Personagem com pose paramétrica
`Tomas` (`personagens.tsx`): pernas e braços por IK de 2 segmentos (`ik`), então `joelho` 0→1 ajoelha
suavemente, `corre` (fase) anima corrida, `sentado`, `curva` do tronco, `rega` inclina o regador e as gotas
saem do bico calculado (caem retas mesmo com o personagem espelhado). `camada: 'corpo' | 'bracos'` permite
desenhar um objeto **entre** o corpo e os braços (abraço na pedra).

## Stills em lote (1 bundle só)
`node scripts/stills.mjs VIDEO-001 <pasta> 0.3 2.0 4.2 …` (segundos). 8–12 stills em ~1,5 min, contra
~40 s **por** still com `npx remotion still`. Montar folha: `ffmpeg -pattern_type glob -i 't*.png'
-vf "scale=300:533,tile=6x2" -frames:v 1 folha.png` e olhar uma imagem só.

## Render
- Velocidade medida: ~0,7 s/frame (1080×1920, SVG, `--concurrency=2`). 49,6 s de vídeo ≈ 17 min.
- `producoes/VIDEO_001/trabalho/render/render.sh`: 3 segmentos (`--frames=0-499` …, `--muted`), concat
  `-c copy`, mux do áudio final (`-map 0:v:0 -map 1:a:0`, AAC 48 kHz). Rodar em segundo plano.

## Pegadinha
O id da `<Composition>` **não aceita "_"**: usar `VIDEO-001` (a pasta continua `VIDEO_001`).
