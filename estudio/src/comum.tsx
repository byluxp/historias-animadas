// Peças reutilizáveis dos clipes animados: boneco, legenda palavra a palavra, câmera, chuva e grão.
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const CORES = {
  pele: '#f4f1ea',
  contorno: '#262629',
  moletom: '#2b2b3a',
  calca: '#2f3a55',
  cabelo: '#141418',
};

export type Olhos = 'abertos' | 'fechados' | 'cansados';

// Boneco de cabeça redonda. Origem (0,0) nos pés; ~600 de altura.
// `passo` em radianos anima pernas e braços (caminhada); `inclina` gira o tronco.
export const Boneco: React.FC<{
  olhos?: Olhos;
  passo?: number;
  andando?: boolean;
  boca?: 'reta' | 'aberta' | 'triste';
}> = ({olhos = 'abertos', passo = 0, andando = false, boca = 'reta'}) => {
  const a = andando ? Math.sin(passo) * 24 : 0;
  const bob = andando ? Math.abs(Math.cos(passo)) * -10 : 0;
  const perna = (ang: number, x: number) => (
    <g transform={`translate(${x} -170) rotate(${ang})`}>
      <line x1={0} y1={0} x2={0} y2={150} stroke={CORES.calca} strokeWidth={34} strokeLinecap="round" />
      <ellipse cx={14} cy={160} rx={34} ry={17} fill="#f2f2f2" stroke={CORES.contorno} strokeWidth={5} />
      <rect x={-18} y={150} width={56} height={9} rx={4} fill={CORES.contorno} />
    </g>
  );
  const braco = (ang: number, x: number) => (
    <g transform={`translate(${x} -340) rotate(${ang})`}>
      <line x1={0} y1={0} x2={0} y2={140} stroke={CORES.moletom} strokeWidth={30} strokeLinecap="round" />
      <circle cx={0} cy={150} r={15} fill={CORES.pele} stroke={CORES.contorno} strokeWidth={4} />
    </g>
  );
  return (
    <g transform={`translate(0 ${bob})`}>
      {perna(-a, -26)}
      {braco(a * 0.8, -78)}
      <rect x={-80} y={-370} width={160} height={215} rx={50} fill={CORES.moletom} stroke={CORES.contorno} strokeWidth={5} />
      <path d="M -30 -365 Q 0 -330 30 -365" stroke="#3a3a46" strokeWidth={6} fill="none" />
      {perna(a, 26)}
      {braco(-a * 0.8, 78)}
      <Cabeca olhos={olhos} boca={boca} y={-480} />
    </g>
  );
};

export const Cabeca: React.FC<{olhos: Olhos; boca?: 'reta' | 'aberta' | 'triste'; y?: number}> = ({
  olhos,
  boca = 'reta',
  y = 0,
}) => (
  <g transform={`translate(0 ${y})`}>
    <circle r={112} fill={CORES.pele} stroke={CORES.contorno} strokeWidth={6} />
    {/* franja emo caindo para o lado */}
    <path
      d="M -112 -10 C -120 -95 -40 -140 40 -120 C 95 -108 120 -60 112 -20 C 70 -60 20 -70 -20 -55 C -10 -20 -40 15 -70 30 C -80 10 -100 5 -112 -10 Z"
      fill={CORES.cabelo}
    />
    {olhos === 'abertos' && (
      <>
        <circle cx={-10} cy={12} r={10} fill={CORES.contorno} />
        <circle cx={48} cy={12} r={10} fill={CORES.contorno} />
      </>
    )}
    {olhos === 'fechados' && (
      <>
        <path d="M -24 14 Q -10 22 4 14" stroke={CORES.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M 34 14 Q 48 22 62 14" stroke={CORES.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
      </>
    )}
    {olhos === 'cansados' && (
      <>
        {[-10, 48].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={16} r={10} fill={CORES.contorno} />
            <rect x={cx - 16} y={0} width={32} height={14} fill={CORES.pele} />
            <line x1={cx - 15} y1={13} x2={cx + 15} y2={13} stroke={CORES.contorno} strokeWidth={5} strokeLinecap="round" />
            <path d={`M ${cx - 14} 34 Q ${cx} 42 ${cx + 14} 34`} stroke="#8b7aa8" strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </>
    )}
    {boca === 'reta' && <line x1={6} y1={58} x2={34} y2={58} stroke={CORES.contorno} strokeWidth={6} strokeLinecap="round" />}
    {boca === 'aberta' && <ellipse cx={20} cy={60} rx={14} ry={18} fill="#5a2630" stroke={CORES.contorno} strokeWidth={5} />}
    {boca === 'triste' && <path d="M 2 64 Q 20 50 38 64" stroke={CORES.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />}
  </g>
);

// Legenda de 1–3 palavras no centro, branca com contorno preto (como no exemplo).
export type Palavra = {t0: number; t1: number; texto: string; y?: number};

export const Legenda: React.FC<{palavras: Palavra[]; y?: number}> = ({palavras, y = 1080}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const atual = palavras.find((p) => t >= p.t0 && t < p.t1);
  if (!atual) return null;
  const pop = interpolate(t - atual.t0, [0, 0.1], [0.82, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: (atual.y ?? y) - 960}}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: 'Montserrat',
            fontWeight: 900,
            fontSize: 92,
            color: 'white',
            WebkitTextStroke: '16px black',
            paintOrder: 'stroke fill',
            textAlign: 'center',
            letterSpacing: 1,
            transform: `scale(${pop})`,
            textShadow: '0 6px 0 rgba(0,0,0,0.35)',
            padding: '0 60px',
          }}
        >
          {atual.texto}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Câmera "pobre": inclina, aproxima e balança devagar.
export const Camera: React.FC<{
  children: React.ReactNode;
  de: {zoom: number; giro: number; x?: number; y?: number};
  ate: {zoom: number; giro: number; x?: number; y?: number};
  duracao: number;
  tremor?: number;
}> = ({children, de, ate, duracao, tremor = 0}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duracao], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const lerp = (a = 0, b = 0) => a + (b - a) * p;
  const tx = lerp(de.x, ate.x) + Math.sin(frame * 0.9) * tremor;
  const ty = lerp(de.y, ate.y) + Math.cos(frame * 1.3) * tremor;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${tx}px, ${ty}px) rotate(${lerp(de.giro, ate.giro)}deg) scale(${lerp(de.zoom, ate.zoom)})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Chuva: React.FC<{n?: number; area?: [number, number, number, number]; cor?: string; seed?: string}> = ({
  n = 70,
  area = [-100, -100, 1280, 2100],
  cor = 'rgba(180,200,255,0.35)',
  seed = 'chuva',
}) => {
  const frame = useCurrentFrame();
  const [x0, y0, w, h] = area;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const x = x0 + random(`${seed}x${i}`) * w;
        const v = 38 + random(`${seed}v${i}`) * 22;
        const y = y0 + ((random(`${seed}y${i}`) * h + frame * v) % h);
        return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 46} stroke={cor} strokeWidth={4} strokeLinecap="round" />;
      })}
    </g>
  );
};

// Vinheta escura nas bordas + grão leve, para dar o clima "aconchegante" do exemplo.
export const Acabamento: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)'}} />
      <AbsoluteFill style={{opacity: 0.06, mixBlendMode: 'overlay'}}>
        <svg width="1080" height="1920">
          <filter id={`grao${frame % 4}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 4} />
          </filter>
          <rect width="1080" height="1920" filter={`url(#grao${frame % 4})`} />
        </svg>
      </AbsoluteFill>
    </>
  );
};

// ---------------------------------------------------------------------------------------------
// Adições do VIDEO_001 (reutilizáveis): legenda por frases, partículas, piscada, relâmpago.

// Tempo de cada palavra vindo do words.json (segundos).
export type PalavraTempo = {word: string; start: number; end: number};
// Uma tela de legenda: palavras de i0 a i1 (inclusive) do words.json.
export type Frase = {i0: number; i1: number; grande?: boolean; y?: number; tamanho?: number}; // y: altura própria desta tela

// Legenda de frases curtas em CAIXA ALTA; a palavra que está sendo falada fica na cor de acento.
// A frase aparece 0,08 s antes da 1ª palavra e some quando a próxima começa (ou 0,5 s após a última).
export const LegendaFrases: React.FC<{
  palavras: PalavraTempo[];
  frases: Frase[];
  y?: number; // centro vertical da faixa
  acento?: string;
  tamanho?: number;
}> = ({palavras, frases, y = 1300, acento = '#FFD84D', tamanho = 92}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const idx = frases.findIndex((f, k) => {
    const ini = palavras[f.i0].start - 0.08;
    const prox = frases[k + 1] ? palavras[frases[k + 1].i0].start - 0.08 : Infinity;
    const fim = Math.min(prox, palavras[f.i1].end + 0.5);
    return t >= ini && t < fim;
  });
  if (idx < 0) return null;
  const fr = frases[idx];
  const t0 = palavras[fr.i0].start - 0.08;
  const pop = interpolate(t - t0, [0, 0.14], [0.7, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2.2))});
  const sobe = interpolate(t - t0, [0, 0.14], [24, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const tam = fr.grande ? tamanho * 2 : fr.tamanho ?? tamanho;
  const itens = [];
  for (let i = fr.i0; i <= fr.i1; i++) {
    const p = palavras[i];
    const ativa = t >= p.start - 0.03 && (i === fr.i1 || t < palavras[i + 1].start - 0.03);
    const ja = t >= p.start - 0.03;
    const s = ativa ? interpolate(t - p.start, [-0.03, 0.06, 0.16], [1, 1.12, 1.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
    itens.push(
      <span
        key={i}
        style={{
          display: 'inline-block',
          margin: `0 ${tam * 0.2}px`,
          color: ativa ? acento : ja ? 'white' : 'rgba(255,255,255,0.92)',
          transform: `scale(${s})`,
          WebkitTextStroke: `${Math.round(tam * 0.17)}px #111`,
          paintOrder: 'stroke fill',
        }}
      >
        {p.word.toLocaleUpperCase('pt-BR')}
      </span>,
    );
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: fr.y ?? y,
          transform: `translateY(-50%) translateY(${sobe}px) scale(${pop})`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: tam * 0.05,
          fontFamily: 'Montserrat',
          fontWeight: 900,
          fontSize: tam,
          lineHeight: 1.1,
          letterSpacing: 0.5,
          textAlign: 'center',
          filter: 'drop-shadow(0 7px 0 rgba(0,0,0,0.45))',
        }}
      >
        {itens}
      </div>
    </AbsoluteFill>
  );
};

// Partículas flutuando (poeira dourada, pólen, folhas pequenas). Determinístico (random com seed).
export const Particulas: React.FC<{
  n?: number;
  area?: [number, number, number, number];
  cor?: string;
  raio?: [number, number];
  vel?: number; // px por frame de subida
  seed?: string;
  opacidade?: number;
}> = ({n = 40, area = [0, 0, 1080, 1920], cor = '#ffe6a6', raio = [2, 6], vel = 0.6, seed = 'p', opacidade = 0.8}) => {
  const frame = useCurrentFrame();
  const [x0, y0, w, h] = area;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const r = raio[0] + random(`${seed}r${i}`) * (raio[1] - raio[0]);
        const fase = random(`${seed}f${i}`) * 100;
        const x = x0 + random(`${seed}x${i}`) * w + Math.sin((frame + fase * 10) / (40 + 30 * random(`${seed}s${i}`))) * 30;
        const y = y0 + (((random(`${seed}y${i}`) * h - frame * vel * (0.5 + random(`${seed}v${i}`))) % h) + h) % h;
        const brilho = 0.4 + 0.6 * Math.abs(Math.sin((frame + fase * 7) / 25));
        return <circle key={i} cx={x} cy={y} r={r} fill={cor} opacity={opacidade * brilho} />;
      })}
    </g>
  );
};

// Piscada natural: devolve true nos ~4 frames de olho fechado, em intervalos irregulares.
export const piscando = (frame: number, seed = 'pisca'): boolean => {
  const ciclo = 75 + Math.floor(random(seed) * 40);
  const k = Math.floor(frame / ciclo);
  const desloc = Math.floor(random(`${seed}${k}`) * (ciclo - 8));
  const f = frame % ciclo;
  return f >= desloc && f < desloc + 4;
};

// Clarão de relâmpago: opacidade 0–1 com dois picos (flash duplo), a partir de t0 (s).
export const clarao = (t: number, t0: number): number => {
  const d = t - t0;
  if (d < 0 || d > 0.7) return 0;
  return Math.max(Math.exp(-(((d - 0.02) / 0.05) ** 2)), 0.7 * Math.exp(-(((d - 0.2) / 0.06) ** 2)));
};
