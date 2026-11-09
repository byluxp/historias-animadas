// Gera vários stills numa só passada (um bundle só): node scripts/stills.mjs VIDEO_001 <pasta_saida> t1 t2 ... (segundos)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [id, saida, ...tempos] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id});
for (const t of tempos) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(parseFloat(t) * comp.fps));
  const out = path.join(saida, `t${parseFloat(t).toFixed(2).padStart(5, '0')}_f${String(frame).padStart(4, '0')}.png`);
  await renderStill({composition: comp, serveUrl, output: out, frame, scale: 0.5});
  console.log(out);
}
