// Mundo único do VIDEO_001: quintal de Tomás com o rio, a estrada e a vila no morro ao fundo.
// Todas as cenas são o MESMO lugar, com outra luz/estação e outra posição de câmera (paralaxe por camada).
import React from 'react';
import {interpolateColors, random} from 'remotion';
import {Chuva, Particulas} from '../../comum';
import {COR} from './personagens';

export type Paleta = {
  ceu1: string;
  ceu2: string;
  ceu3: string;
  longe: string;
  morro: string;
  morroSombra: string;
  casa: string;
  telhado: string;
  janela: string;
  rio: string;
  rioLuz: string;
  estrada: string;
  cerca: string;
  grama: string;
  grama2: string;
  terra: string;
  tronco: string;
  folha: string;
  tinta: string; // cor da luz que tinge a cena
  tintaOp: number;
};

export const PAL: Record<string, Paleta> = {
  dourado: {
    ceu1: '#E9895B', ceu2: '#F6C177', ceu3: '#FBD8A0', longe: '#D99A78', morro: '#B9765A', morroSombra: '#9C5F4A',
    casa: '#8E5444', telhado: '#6E3A33', janela: '#FFE29A', rio: '#7FB7C9', rioLuz: '#F8D9A6', estrada: '#C9A27A',
    cerca: '#8A5A3A', grama: '#7FA866', grama2: '#557D45', terra: '#C68A5A', tronco: '#6B4630', folha: '#6E9F4E',
    tinta: '#FFB86B', tintaOp: 0.12,
  },
  verao: {
    ceu1: '#FF9F43', ceu2: '#FFC75F', ceu3: '#FFE8A3', longe: '#E0A866', morro: '#C98A4E', morroSombra: '#A86E3C',
    casa: '#9A5B3E', telhado: '#73402E', janela: '#FFF1BF', rio: '#6FC1D8', rioLuz: '#FFF4CC', estrada: '#D8B07C',
    cerca: '#8A5A3A', grama: '#8DBB55', grama2: '#5F8A3A', terra: '#D09254', tronco: '#6B4630', folha: '#5FA040',
    tinta: '#FFD36E', tintaOp: 0.16,
  },
  outono: {
    ceu1: '#C9785A', ceu2: '#E8A66F', ceu3: '#F4D3A6', longe: '#B58B72', morro: '#9C6A52', morroSombra: '#7F5442',
    casa: '#7E4A3C', telhado: '#5E302A', janela: '#FFD98A', rio: '#7FA9B8', rioLuz: '#F0CFA0', estrada: '#B99572',
    cerca: '#7A4E33', grama: '#A39A55', grama2: '#6F6A3A', terra: '#B97B4E', tronco: '#5E3E2A', folha: '#D9833B',
    tinta: '#E9895B', tintaOp: 0.1,
  },
  frio: {
    ceu1: '#8C9AAB', ceu2: '#A7B4C2', ceu3: '#C9D2DB', longe: '#94A0AE', morro: '#7D8794', morroSombra: '#66707C',
    casa: '#5E6470', telhado: '#454A55', janela: '#F3E3B0', rio: '#8BA7B8', rioLuz: '#D9E3EA', estrada: '#A9A39A',
    cerca: '#6E5646', grama: '#8E9C80', grama2: '#66745C', terra: '#9C8670', tronco: '#56443A', folha: '#C9773B',
    tinta: '#B9C6D6', tintaOp: 0.14,
  },
  primavera: {
    ceu1: '#8FC7E8', ceu2: '#BFE3EE', ceu3: '#F7D9E0', longe: '#A9C2A0', morro: '#8FAE7A', morroSombra: '#738F62',
    casa: '#A0684F', telhado: '#7A4436', janela: '#FFF1BF', rio: '#7FC3D9', rioLuz: '#E8F6FA', estrada: '#CBB08A',
    cerca: '#8A5A3A', grama: '#86B95E', grama2: '#5E8D42', terra: '#C99366', tronco: '#6B4630', folha: '#7DBA55',
    tinta: '#FFFFFF', tintaOp: 0.06,
  },
  noite: {
    ceu1: '#0F1830', ceu2: '#1C2A4A', ceu3: '#2F4A78', longe: '#1A2643', morro: '#16203A', morroSombra: '#101831',
    casa: '#0E1529', telhado: '#0A1022', janela: '#F5C766', rio: '#2C5A8C', rioLuz: '#8FB4E2', estrada: '#4A4A60',
    cerca: '#1E2235', grama: '#22384A', grama2: '#16243A', terra: '#2A2E44', tronco: '#1A1A2A', folha: '#1F3A3E',
    tinta: '#2F4A78', tintaOp: 0.25,
  },
  madrugada: {
    ceu1: '#1E2A4E', ceu2: '#3A4C7A', ceu3: '#6A7BA8', longe: '#2E3A5E', morro: '#26304E', morroSombra: '#1C2542',
    casa: '#18203A', telhado: '#121830', janela: '#F5C766', rio: '#3566A0', rioLuz: '#9CC0EC', estrada: '#545670',
    cerca: '#2A2E44', grama: '#2E4A55', grama2: '#1E3042', terra: '#3A3C55', tronco: '#22222F', folha: '#2C4A48',
    tinta: '#6A7BA8', tintaOp: 0.18,
  },
  amanhecer: {
    ceu1: '#F29C9C', ceu2: '#F7B6A8', ceu3: '#F9D9C4', longe: '#D8A3A0', morro: '#B98A8E', morroSombra: '#9C7078',
    casa: '#8A5E66', telhado: '#6A434E', janela: '#FFE6B0', rio: '#8FC3D9', rioLuz: '#FCE3D6', estrada: '#C9A592',
    cerca: '#7A5048', grama: '#86A866', grama2: '#5C7E4C', terra: '#C49078', tronco: '#6B4630', folha: '#76A65A',
    tinta: '#F7B6A8', tintaOp: 0.12,
  },
};

export const mixPal = (a: Paleta, b: Paleta, t: number): Paleta => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const out: Record<string, string | number> = {};
  (Object.keys(a) as (keyof Paleta)[]).forEach((k) => {
    out[k] = k === 'tintaOp' ? a.tintaOp + (b.tintaOp - a.tintaOp) * t : interpolateColors(t, [0, 1], [a[k] as string, b[k] as string]);
  });
  return out as unknown as Paleta;
};

// Posições fixas do mundo (coordenadas com câmera em zoom 1).
export const MUNDO = {
  pedra: {x: 380, y: 1080, s: 0.74},
  tomas: {x: 650, y: 1040, s: 0.84},
  rioTopo: 770,
  rioBase: 832,
  estrada: [838, 878] as [number, number],
  cerca: 880,
  chao: 930,
};

// casas da vila no morro (à direita): x, base y, largura, altura
export const CASAS = [
  {x: 470, y: 610, w: 82, h: 70},
  {x: 575, y: 548, w: 96, h: 82},
  {x: 690, y: 505, w: 88, h: 78},
  {x: 800, y: 488, w: 100, h: 86},
  {x: 915, y: 500, w: 86, h: 74},
  {x: 1015, y: 532, w: 80, h: 70},
];

export type Camera = {z: number; fx: number; fy: number; sx?: number; sy?: number};
// Transformação de uma camada com profundidade d (0 = infinito, 1 = plano dos personagens).
export const camT = (c: Camera, d: number) => {
  const z = 1 + (c.z - 1) * d;
  const fx = 540 + (c.fx - 540) * d;
  const fy = 960 + (c.fy - 960) * d;
  return `translate(${540 + (c.sx ?? 0) * d} ${960 + (c.sy ?? 0) * d}) scale(${z}) translate(${-fx} ${-fy})`;
};

export type EstadoMundo = {
  frame: number;
  pal: Paleta;
  cam: Camera;
  sol?: {x: number; y: number; r: number; cor: string; raios?: number};
  lua?: boolean;
  nuvens?: {cor: string; op: number; vel: number; escuras?: boolean};
  arvore?: {cheia: number; folha?: string};
  folhasCaindo?: number; // 0..1 intensidade
  risos?: number; // segundos desde o "ria" (<0 = nada)
  risosSome?: number; // 0..1 sumindo
  rioNivel?: number; // 0 normal, 1, 2 (cobre a estrada)
  rioAgitado?: number; // 0..1
  rioParado?: number; // 0..1 (água para nas costas de Pedrinha)
  luzinhas?: number; // 0..1 lanternas subindo o morro
  chuva?: number; // 0..1
  clarao?: number; // 0..1
  poeira?: string | null;
  silhuetas?: number; // 0..1 gente quieta no morro
  passaros?: boolean;
  barragem?: React.ReactNode; // camada d=0.92 (Pedrinha deitado)
  personagens?: React.ReactNode; // camada d=1
};

const Casa: React.FC<{c: (typeof CASAS)[number]; p: Paleta; i: number; frame: number; acesa: boolean}> = ({c, p, i, frame, acesa}) => {
  const tremula = acesa ? 0.85 + 0.15 * Math.sin(frame / (6 + i) + i) : 0.9;
  return (
    <g>
      <rect x={c.x - c.w / 2} y={c.y - c.h} width={c.w} height={c.h + 30} fill={p.casa} />
      <polygon points={`${c.x - c.w / 2 - 12},${c.y - c.h} ${c.x},${c.y - c.h - c.h * 0.6} ${c.x + c.w / 2 + 12},${c.y - c.h}`} fill={p.telhado} />
      <rect x={c.x - c.w * 0.28} y={c.y - c.h * 0.7} width={c.w * 0.22} height={c.h * 0.3} rx={3} fill={p.janela} opacity={tremula} />
      <rect x={c.x + c.w * 0.08} y={c.y - c.h * 0.7} width={c.w * 0.22} height={c.h * 0.3} rx={3} fill={p.janela} opacity={tremula * 0.9} />
      {i % 2 === 0 && <rect x={c.x + c.w * 0.18} y={c.y - c.h - c.h * 0.45} width={12} height={26} fill={p.telhado} />}
    </g>
  );
};

// Balão "HA HA" saindo de uma janela.
const Balao: React.FC<{x: number; y: number; t: number; i: number; some: number}> = ({x, y, t, i, some}) => {
  if (t < 0) return null;
  const s = Math.min(1, t / 0.18) * (1 + 0.25 * Math.exp(-(((t - 0.2) / 0.08) ** 2))) * (1 - some);
  if (s <= 0.01) return null;
  const sobe = t * 22;
  const bal = Math.sin(t * 9 + i) * 5;
  const txt = i % 3 === 1 ? 'HA HA HA' : 'HA HA';
  const w = txt.length * 17 + 30;
  return (
    <g transform={`translate(${x + bal} ${y - sobe}) scale(${s}) rotate(${(i % 2 ? 1 : -1) * 6})`}>
      <path d={`M -10 26 L 0 46 L 12 26 Z`} fill="white" stroke="#2A1E1A" strokeWidth={4} strokeLinejoin="round" />
      <rect x={-w / 2} y={-28} width={w} height={56} rx={26} fill="white" stroke="#2A1E1A" strokeWidth={4.5} />
      <text x={0} y={11} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#C8553D">
        {txt}
      </text>
    </g>
  );
};

export const Mundo: React.FC<EstadoMundo> = (e) => {
  const {frame, pal: p, cam} = e;
  const L = (d: number, filhos: React.ReactNode) => <g transform={camT(cam, d)}>{filhos}</g>;
  const nivel = e.rioNivel ?? 0;
  const agit = e.rioAgitado ?? 0;
  const parado = e.rioParado ?? 0;
  const rioBase = MUNDO.rioBase + nivel * 37;
  const rioTopo = MUNDO.rioTopo - nivel * 12;
  const onda = (x: number, k: number) => {
    const a = (4 + agit * 16) * (1 - parado * 0.85);
    return Math.sin(x / (60 - agit * 15) + frame * (0.08 + agit * 0.22) + k) * a;
  };
  const linhaRio = (y: number, k: number) => {
    let d = `M -200 ${y + onda(-200, k)}`;
    for (let x = -160; x <= 1280; x += 40) d += ` L ${x} ${y + onda(x, k)}`;
    return d;
  };
  const chuva = e.chuva ?? 0;
  const risos = e.risos ?? -1;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.ceu1} />
          <stop offset="0.55" stopColor={p.ceu2} />
          <stop offset="1" stopColor={p.ceu3} />
        </linearGradient>
        <linearGradient id="chao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.grama} />
          <stop offset="1" stopColor={p.grama2} />
        </linearGradient>
        <radialGradient id="solg">
          <stop offset="0" stopColor={e.sol?.cor ?? '#fff'} stopOpacity={0.95} />
          <stop offset="0.35" stopColor={e.sol?.cor ?? '#fff'} stopOpacity={0.45} />
          <stop offset="1" stopColor={e.sol?.cor ?? '#fff'} stopOpacity={0} />
        </radialGradient>
        <filter id="desfoque">
          <feGaussianBlur stdDeviation={3} />
        </filter>
      </defs>
      {/* céu (d=0.05) */}
      {L(
        0.05,
        <>
          <rect x={-400} y={-400} width={1880} height={1500} fill="url(#ceu)" />
          {e.sol && (
            <g>
              <circle cx={e.sol.x} cy={e.sol.y} r={e.sol.r * 3.2} fill="url(#solg)" />
              {(e.sol.raios ?? 0) > 0 &&
                Array.from({length: 12}).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2 + frame / 200;
                  return (
                    <line
                      key={i}
                      x1={e.sol!.x + Math.cos(a) * e.sol!.r * 1.3}
                      y1={e.sol!.y + Math.sin(a) * e.sol!.r * 1.3}
                      x2={e.sol!.x + Math.cos(a) * e.sol!.r * (1.75 + 0.1 * Math.sin(frame / 8 + i))}
                      y2={e.sol!.y + Math.sin(a) * e.sol!.r * (1.75 + 0.1 * Math.sin(frame / 8 + i))}
                      stroke={e.sol!.cor}
                      strokeWidth={10}
                      strokeLinecap="round"
                      opacity={e.sol!.raios}
                    />
                  );
                })}
              <circle cx={e.sol.x} cy={e.sol.y} r={e.sol.r} fill={e.sol.cor} />
            </g>
          )}
          {e.lua && (
            <g opacity={0.5}>
              <circle cx={250} cy={300} r={60} fill="#dfe6f5" />
              <circle cx={275} cy={285} r={56} fill={p.ceu1} />
            </g>
          )}
          {e.nuvens &&
            Array.from({length: e.nuvens.escuras ? 7 : 4}).map((_, i) => {
              const w = 1600;
              const x = ((random(`nx${i}`) * w + frame * e.nuvens!.vel * (0.6 + random(`nv${i}`))) % w) - 300;
              const y = (e.nuvens!.escuras ? 60 : 160) + random(`ny${i}`) * (e.nuvens!.escuras ? 380 : 260);
              const s = 0.8 + random(`ns${i}`) * 0.9;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={e.nuvens!.op}>
                  <ellipse cx={0} cy={0} rx={130} ry={42} fill={e.nuvens!.cor} />
                  <circle cx={-50} cy={-22} r={48} fill={e.nuvens!.cor} />
                  <circle cx={30} cy={-36} r={60} fill={e.nuvens!.cor} />
                  <circle cx={90} cy={-10} r={38} fill={e.nuvens!.cor} />
                </g>
              );
            })}
        </>,
      )}
      {/* morros distantes (d=0.2) */}
      {L(
        0.2,
        <path d="M -300 720 Q -100 600 120 660 Q 330 720 520 640 Q 760 560 1000 650 Q 1200 700 1400 640 L 1400 900 L -300 900 Z" fill={p.longe} />,
      )}
      {/* morro da vila (d=0.35) */}
      {L(
        0.35,
        <>
          <path d="M 260 800 Q 380 640 520 600 Q 700 470 860 478 Q 1060 486 1200 560 L 1300 600 L 1300 820 L 260 820 Z" fill={p.morro} />
          <path d="M 330 800 Q 470 690 600 650 Q 560 720 520 800 Z" fill={p.morroSombra} opacity={0.6} />
          {/* caminho do morro */}
          <path d="M 420 790 Q 520 720 560 660 Q 640 600 720 560 Q 790 530 860 500" stroke={p.estrada} strokeWidth={10} fill="none" opacity={0.6} strokeDasharray="22 14" />
          {CASAS.map((c, i) => (
            <Casa key={i} c={c} p={p} i={i} frame={frame} acesa={(e.luzinhas ?? 0) > 0 || chuva > 0} />
          ))}
          {/* silhuetas quietas da vila (amanhecer) */}
          {(e.silhuetas ?? 0) > 0 &&
            [
              [520, 600],
              [545, 596],
              [640, 545],
              [668, 540],
              [745, 500],
              [865, 494],
              [890, 494],
              [968, 506],
            ].map(([x, y], i) => {
              const s = Math.min(1, Math.max(0, (e.silhuetas! - i * 0.06) * 3));
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${1.5 * s * (0.9 + (i % 3) * 0.08)})`} opacity={s}>
                  <rect x={-9} y={-36} width={18} height={36} rx={8} fill="#4A3040" />
                  <circle cx={0} cy={-46} r={10} fill="#4A3040" />
                </g>
              );
            })}
          {/* lanternas subindo o morro (pessoas = pontos de luz) */}
          {(e.luzinhas ?? 0) > 0 &&
            Array.from({length: 11}).map((_, i) => {
              const prog = Math.min(1, Math.max(0, e.luzinhas! * 1.25 - i * 0.03 - random(`lz${i}`) * 0.15));
              const pts = [
                [420, 790],
                [560, 660],
                [720, 560],
                [860, 500],
              ];
              const seg = Math.min(2.999, prog * 3);
              const k = Math.floor(seg);
              const f = seg - k;
              const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f + (random(`lx${i}`) - 0.5) * 50;
              const y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f + (random(`ly${i}`) - 0.5) * 24 + Math.sin(frame / 3 + i) * 2;
              return (
                <g key={i} opacity={prog > 0.995 ? 0.5 : 1}>
                  <circle cx={x} cy={y} r={22} fill="#FFD98A" opacity={0.25} />
                  <circle cx={x} cy={y} r={7} fill="#FFE7A8" />
                </g>
              );
            })}
          {risos >= 0 &&
            CASAS.map((c, i) => <Balao key={i} x={c.x} y={c.y - c.h - 70 - (i % 2) * 30} t={risos - [0, 0.12, 0.05, 0.2, 0.09, 0.16][i]} i={i} some={e.risosSome ?? 0} />)}
        </>,
      )}
      {/* rio e estrada (d=0.6–0.7) */}
      {L(
        0.62,
        <>
          <rect x={-300} y={rioTopo - 20} width={1700} height={rioBase - rioTopo + 60} fill={p.rio} />
          <path d={`${linhaRio(rioTopo, 0)} L 1280 ${rioTopo - 60} L -200 ${rioTopo - 60} Z`} fill={p.morro} />
          {[0.3, 0.55, 0.8].map((f, k) => (
            <path key={k} d={linhaRio(rioTopo + (rioBase - rioTopo) * f, k * 2)} stroke={p.rioLuz} strokeWidth={4 + agit * 3} fill="none" opacity={0.55} strokeDasharray={`${40 + k * 20} ${50 + k * 10}`} />
          ))}
        </>,
      )}
      {L(
        0.7,
        <>
          <rect x={-300} y={MUNDO.estrada[0]} width={1700} height={MUNDO.estrada[1] - MUNDO.estrada[0] + 10} fill={p.estrada} />
          {Array.from({length: 14}).map((_, i) => (
            <ellipse key={i} cx={-200 + i * 110 + random(`ep${i}`) * 40} cy={850 + random(`eq${i}`) * 20} rx={10} ry={4} fill={p.cerca} opacity={0.3} />
          ))}
          {/* água invadindo a estrada */}
          {nivel > 0.02 && (
            <path d={`M -300 ${MUNDO.estrada[0] - 10} L 1400 ${MUNDO.estrada[0] - 10} L 1400 ${rioBase} ${linhaRio(rioBase, 3).replace('M', 'L')} L -300 ${rioBase} Z`} fill={p.rio} />
          )}
          {nivel > 0.02 && <path d={linhaRio(rioBase - 4, 5)} stroke={p.rioLuz} strokeWidth={6} fill="none" opacity={0.8} />}
        </>,
      )}
      {/* árvore (d=0.8) */}
      {L(
        0.8,
        <g>
          <path d="M 95 960 C 110 820 100 700 130 590 L 165 595 C 150 700 160 820 160 960 Z" fill={p.tronco} stroke="#2A1E1A" strokeWidth={5} />
          <path d="M 135 700 Q 200 640 250 600" stroke={p.tronco} strokeWidth={18} strokeLinecap="round" fill="none" />
          <path d="M 128 650 Q 70 600 40 560" stroke={p.tronco} strokeWidth={14} strokeLinecap="round" fill="none" />
          {[
            [140, 520, 150],
            [40, 560, 110],
            [250, 560, 105],
            [120, 420, 110],
            [220, 460, 90],
          ].map(([x, y, r], i) => {
            const cheia = e.arvore?.cheia ?? 1;
            const sway = Math.sin(frame / 30 + i) * 4 * (1 + chuva * 2);
            if (cheia < 0.3) {
              // galhos quase pelados: só algumas folhas soltas
              return [0, 1, 2].map((k) => (
                <ellipse key={`${i}-${k}`} cx={x + sway + (random(`fo${i}${k}`) - 0.5) * r} cy={y + (random(`fp${i}${k}`) - 0.5) * r} rx={12} ry={7} fill={e.arvore?.folha ?? p.folha} stroke="#2A1E1A" strokeWidth={2} />
              ));
            }
            return <circle key={i} cx={x + sway} cy={y} r={r * (0.55 + 0.45 * cheia)} fill={e.arvore?.folha ?? p.folha} stroke="#2A1E1A" strokeWidth={5} />;
          })}
        </g>,
      )}
      {/* cerca (d=0.85) */}
      {L(
        0.85,
        <g>
          <rect x={-300} y={MUNDO.cerca + 18} width={1700} height={14} fill={p.cerca} stroke="#2A1E1A" strokeWidth={3} />
          <rect x={-300} y={MUNDO.cerca + 52} width={1700} height={14} fill={p.cerca} stroke="#2A1E1A" strokeWidth={3} />
          {Array.from({length: 18}).map((_, i) => (
            <path key={i} d={`M ${-240 + i * 95} ${MUNDO.cerca + 100} L ${-240 + i * 95} ${MUNDO.cerca} L ${-228 + i * 95} ${MUNDO.cerca - 14} L ${-216 + i * 95} ${MUNDO.cerca} L ${-216 + i * 95} ${MUNDO.cerca + 100} Z`} fill={p.cerca} stroke="#2A1E1A" strokeWidth={4} />
          ))}
        </g>,
      )}
      {/* chão do quintal (d=1) */}
      {L(
        1,
        <g>
          <path d={`M -300 ${MUNDO.chao} Q 540 ${MUNDO.chao - 20} 1400 ${MUNDO.chao} L 1400 2300 L -300 2300 Z`} fill="url(#chao)" />
          <ellipse cx={MUNDO.pedra.x + 30} cy={MUNDO.pedra.y + 6} rx={300} ry={60} fill={p.terra} />
          <ellipse cx={MUNDO.pedra.x + 30} cy={MUNDO.pedra.y + 6} rx={240} ry={40} fill={p.terra} opacity={0.6} filter="url(#desfoque)" />
          {Array.from({length: 26}).map((_, i) => {
            const x = -100 + random(`tufo${i}`) * 1300;
            const y = 960 + random(`tufoy${i}`) * 900;
            if (Math.abs(x - MUNDO.pedra.x) < 260 && Math.abs(y - MUNDO.pedra.y) < 60) return null;
            const sw = Math.sin(frame / 20 + i) * (3 + chuva * 6);
            return (
              <path key={i} d={`M ${x - 14} ${y} Q ${x - 10 + sw} ${y - 30} ${x - 4 + sw} ${y - 42} M ${x} ${y} Q ${x + sw} ${y - 36} ${x + 4 + sw} ${y - 52} M ${x + 14} ${y} Q ${x + 12 + sw} ${y - 26} ${x + 18 + sw} ${y - 38}`} stroke={p.grama2} strokeWidth={6} fill="none" strokeLinecap="round" />
            );
          })}
          {/* poça da chuva */}
          {chuva > 0 && <ellipse cx={760} cy={1180} rx={140} ry={20} fill={p.rio} opacity={0.5 * chuva} />}
        </g>,
      )}
      {/* Pedrinha deitado (barragem): depois do chão, para a borda do chão não cortar o corpo dele no zoom */}
      {e.barragem && L(0.92, e.barragem)}
      {L(1, <g>{e.personagens}</g>)}
      {/* primeiro plano (d=1.25): tufos e florzinhas nas bordas de baixo, fora da faixa da legenda */}
      {L(
        1.25,
        <g>
          {[
            [40, 1560, 1.4],
            [150, 1620, 1.1],
            [960, 1580, 1.3],
            [1060, 1530, 1.0],
            [-10, 1480, 1.0],
          ].map(([x, y, s], i) => {
            const sw = Math.sin(frame / 18 + i) * (4 + chuva * 8);
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                {[-30, -12, 6, 24, 40].map((dx, k) => (
                  <path key={k} d={`M ${dx} 40 Q ${dx + sw * 0.5} -20 ${dx + sw + (k - 2) * 12} ${-70 - (k % 2) * 30}`} stroke={p.grama2} strokeWidth={14} fill="none" strokeLinecap="round" />
                ))}
              </g>
            );
          })}
        </g>,
      )}
      {/* folhas caindo (frio) */}
      {(e.folhasCaindo ?? 0) > 0 &&
        L(
          0.85,
          Array.from({length: 14}).map((_, i) => {
            const y = ((random(`fy${i}`) * 1400 + frame * (3 + random(`fv${i}`) * 2)) % 1400) + 300;
            const x = random(`fx${i}`) * 1100 + Math.sin(frame / 14 + i) * 40;
            return <ellipse key={i} cx={x} cy={y} rx={14} ry={7} fill={e.arvore?.folha ?? '#C9773B'} stroke="#2A1E1A" strokeWidth={2} transform={`rotate(${frame * 4 + i * 40} ${x} ${y})`} opacity={e.folhasCaindo} />;
          }),
        )}
      {/* poeira dourada / pólen */}
      {e.poeira && L(0.9, <Particulas n={45} cor={e.poeira} raio={[2, 6]} vel={0.5} seed="poeira" opacidade={0.75} area={[-100, 200, 1300, 1400]} />)}
      {/* pássaros (amanhecer) */}
      {e.passaros &&
        L(
          0.3,
          [0, 1, 2, 3].map((i) => {
            const x = ((frame * (2.2 + i * 0.4) + i * 260) % 1500) - 200;
            const y = 260 + i * 55 + Math.sin(frame / 10 + i) * 12;
            const asa = Math.sin(frame / 3 + i * 2) * 12;
            return <path key={i} d={`M ${x - 22} ${y - asa} Q ${x - 10} ${y - 6} ${x} ${y} Q ${x + 10} ${y - 6} ${x + 22} ${y - asa}`} stroke="#5a3b3b" strokeWidth={5} fill="none" strokeLinecap="round" />;
          }),
        )}
      {/* chuva em 2 camadas (paralaxe) */}
      {chuva > 0 && (
        <>
          <g opacity={chuva * 0.7}>
            <Chuva n={Math.round(60 * chuva)} seed="longe" cor="rgba(170,190,230,0.45)" area={[-100, -100, 1300, 2100]} />
          </g>
          <g opacity={chuva}>
            <g transform="scale(1.6) translate(-200 -300)">
              <Chuva n={Math.round(35 * chuva)} seed="perto" cor="rgba(210,225,255,0.55)" area={[0, 0, 1100, 1600]} />
            </g>
          </g>
        </>
      )}
      {/* luz que tinge a cena */}
      <rect x={0} y={0} width={1080} height={1920} fill={p.tinta} opacity={p.tintaOp} style={{mixBlendMode: 'soft-light'}} />
      {/* relâmpago */}
      {(e.clarao ?? 0) > 0 && <rect x={0} y={0} width={1080} height={1920} fill="#E8F1FF" opacity={e.clarao! * 0.85} />}
    </svg>
  );
};

export {COR};
