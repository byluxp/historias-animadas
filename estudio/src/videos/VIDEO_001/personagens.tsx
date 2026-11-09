// Personagens do VIDEO_001: Tomás (velho do regador), a Pedra/ovo e Pedrinha (bicho de pedra).
// Cores de producoes/VIDEO_001/personagens.md. Tudo SVG próprio. Origem (0,0) nos pés / na base.
import React from 'react';
import {interpolateColors, random} from 'remotion';
import {piscando} from '../../comum';

export const COR = {
  contorno: '#2A1E1A',
  pele: '#E8B48A',
  peleSombra: '#CF936B',
  nariz: '#E09A73',
  bochecha: '#E9877A',
  barbaCinza: '#9A9A9A',
  barbaBranca: '#F4F1EA',
  camisa: '#C8553D',
  camisaSombra: '#A5412E',
  calca: '#4A5A78',
  sapato: '#5A3A26',
  regador: '#4E9F6B',
  regadorSombra: '#3B7D53',
  capa: '#F2C14E',
  capaSombra: '#D6A232',
  chapeu: '#D9B26F',
  chapeuSombra: '#B8904E',
  fita: '#8A5A3A',
  pedra: '#8C8A86',
  pedraSombra: '#6E6C69',
  pedraLuz: '#B5B2AC',
  musgo: '#6FA35A',
  musgoEscuro: '#4F7F42',
  olho: '#2B2B2B',
  rachadura: '#FFF6D5',
  flor: '#F7A8B8',
  agua: '#8FC3D9',
};

type P = {x: number; y: number};
const rot = (p: P, graus: number): P => {
  const a = (graus * Math.PI) / 180;
  return {x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a)};
};
const add = (a: P, b: P): P => ({x: a.x + b.x, y: a.y + b.y});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpP = (a: P, b: P, t: number): P => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t)});

// Cotovelo/joelho por IK de 2 segmentos (L cada); `lado` escolhe para que lado dobra.
const ik = (a: P, c: P, L: number, lado: 1 | -1): P => {
  const dx = c.x - a.x;
  const dy = c.y - a.y;
  const d = Math.min(Math.hypot(dx, dy), 2 * L - 0.01);
  const h = Math.sqrt(Math.max(0, L * L - (d / 2) ** 2));
  const m = {x: (a.x + c.x) / 2, y: (a.y + c.y) / 2};
  const n = Math.hypot(dx, dy) || 1;
  return {x: m.x + (lado * -dy * h) / n, y: m.y + (lado * dx * h) / n};
};

export type OlhosTomas = 'abertos' | 'fechados' | 'preocupado' | 'surpreso' | 'olhando';
export type BocaTomas = 'sorriso' | 'sorrisao' | 'reta' | 'o' | 'fala';

// ------------------------------------------------------------------------------------------ cabeça
const CabecaTomas: React.FC<{
  olhos: OlhosTomas;
  boca: BocaTomas;
  barba: string;
  chapeu: boolean;
  capuz: boolean;
  frame: number;
  fala?: number; // 0..1 abertura da boca
  olhar?: number; // desloca as pupilas (px)
}> = ({olhos, boca, barba, chapeu, capuz, frame, fala = 0, olhar = 0}) => {
  const pisca = olhos === 'abertos' || olhos === 'olhando' || olhos === 'preocupado' ? piscando(frame, 'tomas') : false;
  const olho = (cx: number, cy: number, r: number) =>
    pisca ? (
      <path d={`M ${cx - r - 3} ${cy} Q ${cx} ${cy + 5} ${cx + r + 3} ${cy}`} stroke={COR.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx + olhar} cy={cy} rx={r * (olhos === 'surpreso' ? 1.25 : 1)} ry={r * (olhos === 'surpreso' ? 1.45 : 1.25)} fill={COR.contorno} />
        <circle cx={cx + olhar + r * 0.35} cy={cy - r * 0.45} r={r * 0.38} fill="white" />
      </g>
    );
  const fechado = (cx: number, cy: number, w: number) => (
    <path d={`M ${cx - w} ${cy + 4} Q ${cx} ${cy - 14} ${cx + w} ${cy + 4}`} stroke={COR.contorno} strokeWidth={7} fill="none" strokeLinecap="round" />
  );
  const fechadoOlhos = olhos === 'fechados';
  const sobr = olhos === 'preocupado' ? 10 : olhos === 'surpreso' ? -12 : 0;
  return (
    <g>
      {capuz && (
        <path d="M -118 40 C -140 -110 -40 -150 30 -145 C 110 -140 140 -60 128 30 C 120 90 100 120 90 130 L -100 130 Z" fill={COR.capa} stroke={COR.contorno} strokeWidth={6} />
      )}
      {/* cabelo de trás (tufos) */}
      {!capuz && (
        <path d="M -60 -55 C -110 -50 -118 0 -100 25 C -118 50 -95 80 -70 70 C -60 40 -55 0 -60 -55 Z" fill={barba} stroke={COR.contorno} strokeWidth={5} />
      )}
      {/* orelha */}
      <ellipse cx={-52} cy={12} rx={17} ry={25} fill={COR.pele} stroke={COR.contorno} strokeWidth={5} />
      <path d="M -55 2 Q -45 12 -55 24" stroke={COR.peleSombra} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* rosto */}
      <circle r={100} fill={COR.pele} stroke={COR.contorno} strokeWidth={6} />
      <path d="M -70 60 Q -20 100 50 95" stroke={COR.peleSombra} strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
      {/* rugas da testa */}
      <path d="M -10 -52 Q 25 -60 60 -52" stroke={COR.peleSombra} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
      <circle cx={52} cy={30} r={17} fill={COR.bochecha} opacity={0.45} />
      {/* olhos */}
      {fechadoOlhos ? (
        <>
          {fechado(10, -6, 15)}
          {fechado(63, -8, 12)}
        </>
      ) : (
        <>
          {olho(10, -6, 11)}
          {olho(63, -8, 9)}
        </>
      )}
      {/* sobrancelhas grossas */}
      <path d={`M -10 ${-30 + (sobr > 0 ? 6 : 0)} Q 8 ${-40 - Math.max(0, -sobr)} 28 ${-34 - sobr}`} stroke={barba} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={`M 50 ${-36 - sobr} Q 66 ${-42 - Math.max(0, -sobr)} 80 ${-34 + (sobr > 0 ? 6 : 0)}`} stroke={barba} strokeWidth={11} fill="none" strokeLinecap="round" />
      {/* barba */}
      <path
        d="M -50 28 C -62 95 -15 150 40 146 C 92 142 118 100 112 52 C 96 66 78 70 64 62 C 44 74 10 66 -8 50 C -22 46 -38 40 -50 28 Z"
        fill={barba}
        stroke={COR.contorno}
        strokeWidth={5}
      />
      <path d="M 0 95 Q 10 115 5 128 M 35 105 Q 40 125 36 138 M 70 100 Q 76 118 72 130" stroke={COR.contorno} strokeWidth={3} opacity={0.18} fill="none" />
      {/* boca (dentro da barba) */}
      {boca === 'sorriso' && <path d="M 50 86 Q 68 100 86 84" stroke={COR.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />}
      {boca === 'sorrisao' && <path d="M 44 82 Q 68 112 92 80 Z" fill="#6b2a2a" stroke={COR.contorno} strokeWidth={5} strokeLinejoin="round" />}
      {boca === 'reta' && <line x1={54} y1={88} x2={84} y2={86} stroke={COR.contorno} strokeWidth={6} strokeLinecap="round" />}
      {boca === 'o' && <ellipse cx={70} cy={90} rx={10} ry={13} fill="#5a2525" stroke={COR.contorno} strokeWidth={5} />}
      {boca === 'fala' && <ellipse cx={70} cy={88} rx={13} ry={3 + 11 * fala} fill="#5a2525" stroke={COR.contorno} strokeWidth={5} />}
      {/* bigode */}
      <path
        d="M 30 52 C 40 36 62 40 72 50 C 84 40 108 40 116 56 C 120 66 106 70 96 64 C 88 72 76 70 72 62 C 64 72 46 74 36 66 C 26 70 22 60 30 52 Z"
        fill={barba}
        stroke={COR.contorno}
        strokeWidth={5}
      />
      {/* nariz */}
      <ellipse cx={90} cy={22} rx={27} ry={23} fill={COR.nariz} stroke={COR.contorno} strokeWidth={6} />
      <ellipse cx={98} cy={14} rx={8} ry={5} fill="white" opacity={0.35} />
      {/* chapéu de palha */}
      {chapeu && !capuz && (
        <g transform="rotate(-5)">
          <path d="M -72 -66 C -72 -150 -30 -170 10 -170 C 55 -170 86 -146 84 -66 Z" fill={COR.chapeu} stroke={COR.contorno} strokeWidth={6} />
          <path d="M -70 -98 Q 8 -86 84 -98 L 84 -76 Q 8 -64 -70 -76 Z" fill={COR.fita} />
          {[-40, -10, 20, 50].map((x) => (
            <path key={x} d={`M ${x} -160 Q ${x + 6} -130 ${x + 2} -104`} stroke={COR.chapeuSombra} strokeWidth={3} fill="none" />
          ))}
          <ellipse cx={8} cy={-66} rx={158} ry={30} fill={COR.chapeu} stroke={COR.contorno} strokeWidth={6} />
          <ellipse cx={8} cy={-70} rx={120} ry={16} fill={COR.chapeuSombra} opacity={0.4} />
        </g>
      )}
      {capuz && <path d="M -96 -60 C -60 -120 60 -128 110 -60" stroke={COR.capaSombra} strokeWidth={14} fill="none" strokeLinecap="round" />}
    </g>
  );
};

// ------------------------------------------------------------------------------------------ regador
// Origem na mão (alça). `ang` gira para despejar (positivo = bico para baixo, olhando para a direita).
export const BICO_LOCAL: P = {x: 158, y: 12};
const Regador: React.FC = () => (
  <g>
    <path d="M -34 -4 C -34 -40 34 -40 34 -4" stroke={COR.regadorSombra} strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M 40 70 L 150 6" stroke={COR.contorno} strokeWidth={22} strokeLinecap="round" />
    <path d="M 40 70 L 150 6" stroke={COR.regador} strokeWidth={13} strokeLinecap="round" />
    <g transform="translate(156 3) rotate(-30)">
      <ellipse rx={13} ry={24} fill={COR.regadorSombra} stroke={COR.contorno} strokeWidth={5} />
    </g>
    <rect x={-52} y={0} width={104} height={92} rx={18} fill={COR.regador} stroke={COR.contorno} strokeWidth={6} />
    <rect x={-40} y={14} width={20} height={64} rx={10} fill="white" opacity={0.25} />
    <ellipse cx={0} cy={2} rx={52} ry={10} fill={COR.regadorSombra} stroke={COR.contorno} strokeWidth={5} />
  </g>
);

// ------------------------------------------------------------------------------------------ Tomás
export const anguloRega = (rega: number, frame: number) => -8 + rega * 48 + (rega > 0.5 ? Math.sin(frame / 7) * 2 : 0);
// Posição do bico do regador do Tomás SENTADO (quadril na origem), no referencial dele.
export const bicoSentado = (maoFrente: P, rega: number, curva: number, frame: number): P =>
  rot(add(maoFrente, rot(BICO_LOCAL, anguloRega(rega, frame))), curva + Math.sin(frame / 16) * 0.6);

export type TomasProps = {
  frame: number;
  olhos?: OlhosTomas;
  boca?: BocaTomas;
  fala?: number;
  olhar?: number;
  barba?: number; // 0 = cinza, 1 = branca
  chapeu?: boolean;
  capa?: boolean;
  curva?: number; // graus de inclinação do tronco
  joelho?: number; // 0 em pé → 1 ajoelhado
  sentado?: boolean;
  corre?: number; // fase da corrida (rad); undefined = parado
  regador?: boolean;
  rega?: number; // 0 (em pé) → 1 (despejando)
  maoFrente?: P; // alvo da mão da frente no referencial do tronco (substitui o padrão)
  maoTras?: P;
  inclinaCabeca?: number;
  gotasAteY?: number; // y (no referencial do Tomás) onde as gotas param; undefined = sem gotas
  camada?: 'tudo' | 'corpo' | 'bracos';
};

export const Tomas: React.FC<TomasProps> = ({
  frame,
  olhos = 'abertos',
  boca = 'sorriso',
  fala = 0,
  olhar = 0,
  barba = 0,
  chapeu = true,
  capa = false,
  curva = 10,
  joelho = 0,
  sentado = false,
  corre,
  regador = true,
  rega = 0,
  maoFrente,
  maoTras,
  inclinaCabeca = 0,
  gotasAteY,
  camada = 'tudo',
}) => {
  const respira = Math.sin(frame / 16);
  const corBarba = interpolateColors(barba, [0, 1], [COR.barbaCinza, COR.barbaBranca]);
  // quadril e pernas
  let quadril: P = {x: 0, y: lerp(-232, -150, joelho) + respira * 1.5};
  let pernas: {joelho: P; pe: P; q: P}[];
  if (sentado) {
    quadril = {x: 0, y: 0};
    pernas = [-1, 1].map((s) => ({q: {x: s * 14, y: 0}, joelho: {x: 92 + s * 8, y: 12}, pe: {x: 100 + s * 10 + Math.sin(frame / 12 + s) * 8, y: 118}}));
  } else if (corre !== undefined) {
    const bob = Math.abs(Math.cos(corre)) * -14;
    quadril = {x: 0, y: -232 + bob};
    pernas = [0, Math.PI].map((d) => {
      const a = Math.sin(corre + d) * 0.75;
      const dobra = Math.max(0, Math.cos(corre + d)) * 1.3 + 0.2;
      const q = {x: 0, y: quadril.y};
      const j = add(q, {x: Math.sin(a) * 118, y: Math.cos(a) * 118});
      const p = add(j, {x: Math.sin(a - dobra) * 115, y: Math.cos(a - dobra) * 115});
      return {q, joelho: j, pe: p};
    });
  } else {
    pernas = [-1, 1].map((s) => {
      const q = {x: s * 18, y: quadril.y};
      const pePe = {x: s * 26, y: 0};
      const peJo = {x: -120 + s * 10, y: -10};
      const joJo = {x: 18 + s * 12, y: -22};
      const pe = lerpP(pePe, peJo, joelho);
      const jo = joelho > 0.02 ? lerpP(ik(q, pePe, 118, -1), joJo, joelho) : ik(q, pePe, 118, -1);
      return {q, joelho: jo, pe};
    });
  }
  const perna = (p: {joelho: P; pe: P; q: P}, k: number) => (
    <g key={k}>
      <path d={`M ${p.q.x} ${p.q.y} L ${p.joelho.x} ${p.joelho.y} L ${p.pe.x} ${p.pe.y}`} stroke={COR.contorno} strokeWidth={38} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${p.q.x} ${p.q.y} L ${p.joelho.x} ${p.joelho.y} L ${p.pe.x} ${p.pe.y}`} stroke={COR.calca} strokeWidth={28} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={p.pe.x + 16} cy={p.pe.y - 4} rx={34} ry={17} fill={COR.sapato} stroke={COR.contorno} strokeWidth={5} />
    </g>
  );
  // braços (referencial do tronco: origem no quadril, y para cima negativo)
  const ombroF: P = {x: 42, y: -150};
  const ombroT: P = {x: -38, y: -150};
  let mF: P = maoFrente ?? {x: 118, y: -132};
  let mT: P = maoTras ?? {x: -22, y: -18};
  if (corre !== undefined) {
    mF = {x: 40 + Math.sin(corre + Math.PI) * 80, y: -60 + Math.cos(corre) * 10};
    mT = {x: -40 + Math.sin(corre) * 80, y: -60};
  }
  const cotF = ik(ombroF, mF, 86, 1);
  const cotT = ik(ombroT, mT, 86, 1);
  const manga = capa ? COR.capa : COR.camisa;
  const braco = (o: P, c: P, m: P, k: string) => (
    <g key={k}>
      <path d={`M ${o.x} ${o.y} L ${c.x} ${c.y} L ${m.x} ${m.y}`} stroke={COR.contorno} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${o.x} ${o.y} L ${c.x} ${c.y} L ${m.x} ${m.y}`} stroke={manga} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={m.x} cy={m.y} r={17} fill={COR.pele} stroke={COR.contorno} strokeWidth={5} />
    </g>
  );
  const angRega = anguloRega(rega, frame);
  // bico do regador no referencial do Tomás (para as gotas caírem retas)
  const bico = add(quadril, rot(add(mF, rot(BICO_LOCAL, angRega)), curva + respira * 0.6));
  const cabeca: P = {x: 34, y: -262};
  const curvaAtual = curva + respira * 0.6;
  const mostraCorpo = camada !== 'bracos';
  const mostraBracos = camada !== 'corpo';
  return (
    <g>
      {mostraCorpo && pernas.map(perna)}
      <g transform={`translate(${quadril.x} ${quadril.y}) rotate(${curvaAtual})`}>
        {mostraCorpo && braco(ombroT, cotT, mT, 'tras')}
        {mostraCorpo && (
          <g transform={`scale(1 ${1 + respira * 0.012})`}>
            {capa ? (
              <>
                <path d="M -70 60 Q -78 -80 -58 -168 Q 0 -196 60 -168 Q 82 -80 78 60 Q 4 78 -70 60 Z" fill={COR.capa} stroke={COR.contorno} strokeWidth={6} />
                <path d="M 8 -180 L 12 62" stroke={COR.capaSombra} strokeWidth={6} />
                {[-130, -80, -30, 20].map((y) => (
                  <circle key={y} cx={24} cy={y} r={6} fill={COR.capaSombra} />
                ))}
              </>
            ) : (
              <>
                <path d="M -62 8 Q -74 -84 -56 -166 Q 0 -192 58 -166 Q 76 -84 64 8 Q 2 22 -62 8 Z" fill={COR.camisa} stroke={COR.contorno} strokeWidth={6} />
                <path d="M -50 -20 Q -58 -90 -44 -150" stroke={COR.camisaSombra} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.6} />
                <path d="M 14 -178 L 18 8" stroke={COR.camisaSombra} strokeWidth={4} />
                {[-140, -96, -52].map((y) => (
                  <circle key={y} cx={28} cy={y} r={5} fill="#f2e6d0" />
                ))}
                <path d="M -64 0 Q 2 16 66 0 L 66 14 Q 2 30 -64 14 Z" fill="#5b3b28" stroke={COR.contorno} strokeWidth={4} />
              </>
            )}
          </g>
        )}
        {/* Ordem corrigida (ajuste pós-Lucila): braço da frente e regador ANTES da cabeça, para a barba ficar na
            frente do peito e do ombro (antes o ombro era desenhado por cima da barba). Na camada 'bracos'
            (abraço), a cabeça é redesenhada por cima do braço pelo mesmo motivo. */}
        {mostraBracos && regador && (
          <g transform={`translate(${mF.x} ${mF.y}) rotate(${angRega})`}>
            <Regador />
          </g>
        )}
        {mostraBracos && braco(ombroF, cotF, mF, 'frente')}
        <g transform={`translate(${cabeca.x} ${cabeca.y + respira * 2}) rotate(${inclinaCabeca - curva * 0.5})`}>
          {mostraCorpo && <rect x={-26} y={70} width={52} height={40} fill={COR.peleSombra} />}
          <CabecaTomas olhos={olhos} boca={boca} barba={corBarba} chapeu={chapeu} capuz={capa} frame={frame} fala={fala} olhar={olhar} />
        </g>
      </g>
      {mostraBracos && regador && gotasAteY !== undefined && rega > 0.6 && <Gotas de={bico} ateY={gotasAteY} frame={frame} />}
    </g>
  );
};

// Fios de água saindo do bico e caindo retos (no referencial de quem desenha).
export const Gotas: React.FC<{de: P; ateY: number; frame: number; n?: number}> = ({de, ateY, frame, n = 9}) => {
  const queda = Math.max(10, ateY - de.y);
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const fase = ((frame + i * (14 / n)) % 14) / 14;
        const y = de.y + 8 + fase * fase * queda;
        const x = de.x + 6 + (random(`g${i}`) - 0.5) * 26 + fase * 10;
        const op = fase > 0.93 ? 0 : 0.95;
        return <ellipse key={i} cx={x} cy={y} rx={5} ry={9} fill="#cfeeff" stroke="#5aa0c8" strokeWidth={2.5} opacity={op} />;
      })}
      {/* respingos no alvo */}
      {[0, 1, 2].map((i) => {
        const f = ((frame + i * 4.7) % 14) / 14;
        return (
          <circle key={`r${i}`} cx={de.x + 10 + (i - 1) * 18 + f * (i - 1) * 30} cy={ateY - f * 26 + f * f * 30} r={4 * (1 - f)} fill="#cfeeff" opacity={1 - f} />
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------------------------------ pedra / ovo
const RACHA = [
  [0, -250],
  [-15, -205],
  [12, -170],
  [-10, -125],
  [15, -85],
  [-8, -45],
  [0, 0],
];
const rachaPath = RACHA.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
const rachaVolta = [...RACHA].reverse().slice(1, -1).map((p) => `L ${p[0]} ${p[1]}`).join(' ');
const OVO = 'M 0 -250 C 95 -250 165 -150 160 -80 C 155 -20 100 0 0 0 C -100 0 -160 -20 -160 -85 C -160 -160 -95 -250 0 -250 Z';
const METADE_E = `M 0 -250 C -95 -250 -160 -160 -160 -85 C -160 -20 -100 0 0 0 ${rachaVolta} Z`;
const METADE_D = `M 0 -250 C 95 -250 165 -150 160 -80 C 155 -20 100 0 0 0 ${rachaVolta} Z`;

export const Pedra: React.FC<{
  id: string;
  frame: number;
  molhada?: number;
  racha?: number; // 0..1 quanto da rachadura está desenhada
  brilho?: number; // 0..1 luz saindo da rachadura
  abre?: number; // 0..1 metades se abrindo
  noite?: boolean;
}> = ({id, frame, molhada = 0, racha = 0, brilho = 0, abre = 0, noite = false}) => {
  const grad = (
    <defs>
      <radialGradient id={`${id}g`} cx="0.36" cy="0.3" r="0.8">
        <stop offset="0" stopColor={noite ? '#8f97a8' : COR.pedraLuz} />
        <stop offset="0.55" stopColor={noite ? '#6a7285' : COR.pedra} />
        <stop offset="1" stopColor={noite ? '#454b5c' : COR.pedraSombra} />
      </radialGradient>
      <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={10} />
      </filter>
    </defs>
  );
  const textura = (
    <g opacity={0.5}>
      {Array.from({length: 14}).map((_, i) => (
        <circle key={i} cx={-120 + random(`${id}tx${i}`) * 240} cy={-220 + random(`${id}ty${i}`) * 200} r={3 + random(`${id}tr${i}`) * 5} fill={COR.pedraSombra} />
      ))}
      <path d="M -110 -60 Q -90 -30 -60 -22" stroke={COR.pedraSombra} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 70 -190 Q 100 -170 110 -140" stroke={COR.pedraSombra} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
  const brilhoMolhado = (
    <g opacity={0.35 + molhada * 0.5}>
      <path d="M -95 -170 Q -70 -215 -25 -228" stroke="white" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />
      <circle cx={-110} cy={-130} r={7} fill="white" opacity={0.6} />
    </g>
  );
  // gotas escorrendo
  const escorre =
    molhada > 0 &&
    [0, 1, 2, 3].map((i) => {
      const f = ((frame * 0.6 + i * 23) % 60) / 60;
      const x = -60 + i * 45;
      const y0 = -230 + Math.abs(x) * 0.4;
      return <ellipse key={i} cx={x + f * (x > 0 ? 18 : -18)} cy={y0 + f * 170} rx={5} ry={8} fill="#d9f1ff" opacity={molhada * (1 - f) * 0.9} />;
    });
  if (abre > 0) {
    const a = abre * 32;
    const dx = abre * 70;
    return (
      <g>
        {grad}
        <ellipse cx={0} cy={-110} rx={130 + abre * 40} ry={120 + abre * 20} fill={COR.rachadura} opacity={brilho * 0.8} filter={`url(#${id}b)`} />
        <g transform={`translate(${-dx} ${abre * 10}) rotate(${-a} -150 0)`}>
          <path d={METADE_E} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={6} strokeLinejoin="round" />
        </g>
        <g transform={`translate(${dx} ${abre * 10}) rotate(${a} 150 0)`}>
          <path d={METADE_D} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={6} strokeLinejoin="round" />
        </g>
      </g>
    );
  }
  return (
    <g>
      {grad}
      {brilho > 0 && <path d={OVO} fill={COR.rachadura} opacity={brilho * 0.55} filter={`url(#${id}b)`} transform="scale(1.12) translate(0 12)" />}
      <path d={OVO} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={6} />
      {textura}
      {brilhoMolhado}
      {escorre}
      {racha > 0 && (
        <g>
          <path d={rachaPath} stroke={COR.rachadura} strokeWidth={26} fill="none" pathLength={1} strokeDasharray={`${racha} 1`} filter={`url(#${id}b)`} opacity={0.9} />
          <path d={rachaPath} stroke={COR.contorno} strokeWidth={13} fill="none" pathLength={1} strokeDasharray={`${racha} 1`} strokeLinejoin="round" strokeLinecap="round" />
          <path d={rachaPath} stroke={COR.rachadura} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${racha} 1`} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

// ------------------------------------------------------------------------------------------ Pedrinha
// Flor de 5 pétalas.
export const Flor: React.FC<{x: number; y: number; s: number; cor?: string; giro?: number}> = ({x, y, s, cor = COR.flor, giro = 0}) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${giro})`}>
      <line x1={0} y1={0} x2={0} y2={26} stroke={COR.musgoEscuro} strokeWidth={5} />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-13} rx={9} ry={13} fill={cor} stroke={COR.contorno} strokeWidth={3} transform={`rotate(${a})`} />
      ))}
      <circle r={8} fill="#FFD36E" stroke={COR.contorno} strokeWidth={3} />
    </g>
  );

export const Pedrinha: React.FC<{
  id: string;
  frame: number;
  modo: 'em_pe' | 'deitado';
  olhos?: number; // 0 fechados → 1 abertos
  feliz?: boolean; // olhos fechados em arco (feliz)
  flores?: number; // 0..1
  noite?: boolean;
  olhar?: number;
}> = ({id, frame, modo, olhos = 1, feliz = false, flores = 0, noite = false, olhar = 0}) => {
  const respira = Math.sin(frame / 22);
  const base = noite ? '#6a7285' : COR.pedra;
  const luz = noite ? '#8f97a8' : COR.pedraLuz;
  const sombra = noite ? '#454b5c' : COR.pedraSombra;
  const musgo = noite ? '#4f7a4a' : COR.musgo;
  const defs = (
    <defs>
      <radialGradient id={`${id}g`} cx="0.4" cy="0.25" r="0.85">
        <stop offset="0" stopColor={luz} />
        <stop offset="0.55" stopColor={base} />
        <stop offset="1" stopColor={sombra} />
      </radialGradient>
    </defs>
  );
  const pisca = !feliz && olhos > 0.9 && piscando(frame, `${id}p`);
  const olho = (cx: number, cy: number, r: number) => {
    if (feliz) return <path d={`M ${cx - r} ${cy + 4} Q ${cx} ${cy - r * 0.9} ${cx + r} ${cy + 4}`} stroke={COR.olho} strokeWidth={8} fill="none" strokeLinecap="round" />;
    const ab = pisca ? 0.08 : olhos;
    return (
      <g>
        <clipPath id={`${id}c${cx}`}>
          <rect x={cx - r - 4} y={cy + r - 2 * r * ab - 2} width={2 * r + 8} height={2 * r * ab + 6} />
        </clipPath>
        <g clipPath={`url(#${id}c${cx})`}>
          <circle cx={cx} cy={cy} r={r} fill="white" stroke={COR.contorno} strokeWidth={5} />
          <circle cx={cx + 4 + olhar} cy={cy + 2} r={r * 0.62} fill={COR.olho} />
          <circle cx={cx + 9 + olhar} cy={cy - r * 0.25} r={r * 0.24} fill="white" />
        </g>
        <path d={`M ${cx - r - 2} ${cy + r - 2 * r * ab} Q ${cx} ${cy + r - 2 * r * ab - 8 * ab} ${cx + r + 2} ${cy + r - 2 * r * ab}`} stroke={COR.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  if (modo === 'em_pe') {
    const sy = 1 + respira * 0.015;
    return (
      <g>
        {defs}
        {[-170, -70, 70, 165].map((x, i) => (
          <ellipse key={i} cx={x} cy={-12} rx={52} ry={34} fill={sombra} stroke={COR.contorno} strokeWidth={6} />
        ))}
        <g transform={`scale(1 ${sy})`}>
          <ellipse cx={0} cy={-210} rx={262} ry={205} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={7} />
          <ellipse cx={60} cy={-120} rx={150} ry={90} fill={luz} opacity={0.35} />
          {[[-150, -260], [-60, -120], [120, -250], [-180, -150]].map(([x, y], i) => (
            <path key={i} d={`M ${x} ${y} q 30 -20 60 0`} stroke={sombra} strokeWidth={6} fill="none" strokeLinecap="round" />
          ))}
          <path
            d="M -250 -260 C -220 -380 -80 -430 40 -415 C 160 -400 240 -330 250 -260 C 220 -280 200 -250 170 -270 C 140 -240 110 -275 80 -255 C 40 -280 10 -245 -30 -265 C -70 -240 -100 -280 -140 -258 C -170 -285 -210 -245 -250 -260 Z"
            fill={musgo}
            stroke={COR.contorno}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          {Array.from({length: 9}).map((_, i) => (
            <circle key={i} cx={-200 + i * 50} cy={-330 + Math.sin(i * 1.7) * 30 + (Math.abs(i - 4) * 12)} r={7} fill={COR.musgoEscuro} />
          ))}
        </g>
        {/* cabeça */}
        <g transform={`translate(205 ${-300 + respira * 4})`}>
          <ellipse cx={0} cy={0} rx={125} ry={112} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={7} />
          <path d="M -80 -80 C -40 -125 60 -125 95 -70 C 60 -95 0 -100 -80 -80 Z" fill={musgo} stroke={COR.contorno} strokeWidth={5} />
          {olho(-12, -8, 30)}
          {olho(66, -10, 26)}
          <circle cx={-30} cy={50} r={16} fill={COR.flor} opacity={0.35} />
          <path d="M 10 55 Q 34 72 58 54" stroke={COR.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      </g>
    );
  }
  // deitado (barragem): corpo comprido de ~940 px; cabeça à direita apoiada no chão
  const flor = (i: number, x: number, y: number) => {
    const s = Math.min(1, Math.max(0, flores * 9 - i * 0.7));
    return <Flor key={i} x={x} y={y} s={s * (1 + Math.sin(frame / 15 + i) * 0.05)} giro={Math.sin(frame / 20 + i) * 8} cor={i % 3 === 1 ? '#FFFFFF' : COR.flor} />;
  };
  return (
    <g>
      {defs}
      {[-330, -120, 110, 300].map((x, i) => (
        <ellipse key={i} cx={x} cy={-8} rx={50} ry={26} fill={sombra} stroke={COR.contorno} strokeWidth={6} />
      ))}
      <g transform={`translate(0 ${respira * 3})`}>
        <path d="M -440 -110 Q -500 -100 -488 -60 Q -470 -40 -430 -60 Z" fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={6} />
        <ellipse cx={0} cy={-125} rx={455} ry={128} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={7} />
        <ellipse cx={20} cy={-60} rx={380} ry={45} fill={luz} opacity={0.25} />
        <path
          d="M -420 -175 C -330 -270 -120 -268 0 -262 C 150 -262 330 -255 425 -170 C 390 -182 365 -158 330 -175 C 290 -150 260 -182 220 -165 C 180 -150 150 -180 110 -165 C 70 -150 40 -180 0 -165 C -40 -150 -80 -180 -120 -165 C -160 -150 -200 -182 -240 -166 C -280 -150 -320 -180 -360 -166 C -380 -158 -400 -172 -420 -175 Z"
          fill={musgo}
          stroke={COR.contorno}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {Array.from({length: 14}).map((_, i) => (
          <circle key={i} cx={-360 + i * 55} cy={-215 + Math.sin(i * 2.1) * 14} r={7} fill={COR.musgoEscuro} />
        ))}
        {[[-330, -232], [-250, -250], [-170, -246], [-90, -258], [-10, -252], [70, -256], [150, -250], [230, -244], [-210, -205], [-50, -210], [110, -212], [290, -226]].map(([x, y], i) =>
          flor(i, x, y),
        )}
      </g>
      {/* cabeça apoiada */}
      <g transform={`translate(430 ${-105 + respira * 2})`}>
        <ellipse cx={0} cy={0} rx={118} ry={100} fill={`url(#${id}g)`} stroke={COR.contorno} strokeWidth={7} />
        <path d="M -70 -70 C -30 -110 50 -110 85 -62 C 50 -85 0 -90 -70 -70 Z" fill={musgo} stroke={COR.contorno} strokeWidth={5} />
        {olho(-8, -4, 27)}
        {olho(62, -6, 23)}
        <circle cx={-26} cy={44} r={14} fill={COR.flor} opacity={0.35} />
        <path d="M 12 48 Q 34 64 56 48" stroke={COR.contorno} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
