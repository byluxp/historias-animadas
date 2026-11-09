// VIDEO_001 · "O velho que regava uma pedra" · 9:16, 30 fps.
// Tudo sincronizado ao words.json (tempos medidos pelo Whisper na voz final). Reações 1–2 frames antes da palavra.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Acabamento, clarao, Frase, LegendaFrases, PalavraTempo} from '../../comum';
import {Camera, MUNDO, Mundo, mixPal, PAL, Paleta} from './cenario';
import {bicoSentado, COR, Flor, Pedra, Pedrinha, Tomas, TomasProps} from './personagens';
import PALAVRAS from './words.json';

export const FPS = 30;
const W = PALAVRAS as PalavraTempo[];
const T = (i: number) => W[i].start - 0.05; // ~1,5 frame antes da palavra
const E = (i: number) => W[i].end;
export const FIM = E(W.length - 1) + 1.05;
export const DURACAO_FRAMES = Math.ceil(FIM * FPS);

// Cortes (s)
const C2 = T(23) - 0.02; // "Veio o verão"
const C3 = T(58) - 0.1; // "Até que, numa noite"
const C3B = T(89) - 0.02; // "Abraçou"
const TOC = T(98);
const C4 = TOC + 0.38; // depois do branco
const C4B = T(112) - 0.08; // "Ele se deitou"
const C4C = T(126) - 0.06; // "De manhã"
const C4D = T(131) - 0.2; // "Tomás nunca regou"

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const r = (t: number, a: number, b: number, ease: (x: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {...cl, easing: ease});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
// Plano geral padrão: um pouco de zoom e o mundo descido, para os personagens ficarem logo acima da legenda.
const LARGO = {z: 1.1, fx: 540, fy: 870};

export const FRASES: Frase[] = [
  [0, 1], [2, 3], [4, 5], [6, 7], [8, 10], [11, 13], [14, 16], [17, 18], [19, 22],
  [23, 25], [26, 28], [29, 31], [32, 35], [36, 37], [38, 39], [40, 41], [42, 43], [44, 45], [46, 48], [49, 50],
  [51, 54], [55, 57], [58, 61], [62, 64], [65, 67], [68, 69], [70, 73], [74, 77], [78, 79], [80, 82], [83, 84],
  [85, 86], [87, 88], [89, 91], [92, 93], [94, 97], [98, 98], [99, 101], [102, 104], [105, 107], [108, 111],
  [112, 114], [115, 118], [119, 122], [123, 125], [126, 127], [128, 130], [131, 132], [133, 135], [136, 138], [139, 139],
].map(([i0, i1]) => ({i0, i1, grande: i0 === 98, y: i0 >= 131 ? 1450 : undefined, tamanho: i0 === 32 ? 76 : undefined}));

// Tomás posicionado no mundo (olhando para a esquerda, para a pedra, por padrão).
const TomasEm: React.FC<{x: number; y: number; s?: number; vira?: boolean} & TomasProps> = ({x, y, s = MUNDO.tomas.s, vira = true, ...p}) => (
  <g transform={`translate(${x} ${y}) scale(${vira ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={20} fill="black" opacity={0.22} />
    <Tomas {...p} />
  </g>
);

const PedraEm: React.FC<React.ComponentProps<typeof Pedra>> = (p) => (
  <g transform={`translate(${MUNDO.pedra.x} ${MUNDO.pedra.y}) scale(${MUNDO.pedra.s})`}>
    <ellipse cx={0} cy={4} rx={175} ry={26} fill="black" opacity={0.25} />
    <Pedra {...p} />
  </g>
);

// y (no referencial do Tomás) do topo da pedra, onde as gotas batem
const GOTA_Y = (MUNDO.pedra.y - 232 * MUNDO.pedra.s - MUNDO.tomas.y) / MUNDO.tomas.s;

const RegadorNoChao: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 0.8}) => (
  <g transform={`translate(${x} ${y}) scale(${-s} ${s})`}>
    <path d="M 40 -22 L 150 -86" stroke={COR.contorno} strokeWidth={22} strokeLinecap="round" />
    <path d="M 40 -22 L 150 -86" stroke={COR.regador} strokeWidth={13} strokeLinecap="round" />
    <rect x={-52} y={-92} width={104} height={92} rx={18} fill={COR.regador} stroke={COR.contorno} strokeWidth={6} />
    <path d="M -34 -96 C -34 -132 34 -132 34 -96" stroke={COR.regadorSombra} strokeWidth={12} fill="none" strokeLinecap="round" />
  </g>
);

// ------------------------------------------------------------------------------------------ cena 1
const Cena1: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const abre = r(t, 0.9, 3.0, Easing.out(Easing.cubic));
  const deriva = Math.max(0, t - 3) * 9;
  const cam: Camera = {z: lerp(2.2, LARGO.z, abre), fx: lerp(400, LARGO.fx, abre), fy: lerp(1015, LARGO.fy, abre), sx: -deriva};
  const tRia = T(10);
  const tSorri = T(18);
  const rega = 1 - r(t, 3.35, 3.65) + r(t, T(20) - 0.1, T(20) + 0.2);
  const risada = t >= tRia - 0.05 && t < tSorri;
  return (
    <Mundo
      frame={frame}
      pal={PAL.dourado}
      cam={cam}
      sol={{x: 300, y: 610, r: 68, cor: '#FFF1C9'}}
      nuvens={{cor: '#FFE9C9', op: 0.55, vel: 0.35}}
      poeira="#FFE6A6"
      risos={t - tRia}
      risosSome={r(t, 6.0, 6.45)}
      personagens={
        <>
          <PedraEm id="p1" frame={frame} molhada={0.4 + 0.6 * Math.min(1, rega + 0.3)} />
          <TomasEm
            x={MUNDO.tomas.x}
            y={MUNDO.tomas.y}
            frame={frame}
            rega={rega}
            maoFrente={{x: lerp(120, 190, rega), y: lerp(-100, -150, rega)}}
            gotasAteY={GOTA_Y}
            olhos={t >= tSorri && t < T(20) ? 'fechados' : risada ? 'olhando' : 'abertos'}
            olhar={risada ? -6 : 3}
            boca={t >= tSorri && t < T(20) + 0.4 ? 'sorrisao' : risada ? 'reta' : 'sorriso'}
            inclinaCabeca={risada ? -8 : t >= tSorri ? 6 : 0}
          />
        </>
      }
    />
  );
};

// ------------------------------------------------------------------------------------------ cena 2
const CICLO: Paleta[] = [PAL.primavera, PAL.verao, PAL.outono, PAL.frio, PAL.primavera, PAL.verao, PAL.outono, PAL.frio, PAL.primavera];
const Cena2: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const tV = T(25);
  const tF = T(28);
  const tA = T(29);
  const fimCiclo = E(31) + 0.12;
  let pal = PAL.dourado;
  let estacao: 'tarde' | 'verao' | 'frio' | 'ciclo' = 'tarde';
  if (t >= tA && t < fimCiclo) {
    const k = Math.min(CICLO.length - 1, Math.floor((t - tA) / 0.1));
    pal = CICLO[k];
    estacao = 'ciclo';
  } else if (t >= tF && t < tA) {
    pal = mixPal(PAL.verao, PAL.frio, r(t, tF, tF + 0.2));
    estacao = 'frio';
  } else if (t >= tV && t < tF) {
    pal = mixPal(PAL.dourado, PAL.verao, r(t, tV, tV + 0.2));
    estacao = 'verao';
  } else if (t >= fimCiclo) {
    pal = mixPal(PAL.primavera, PAL.dourado, r(t, fimCiclo, fimCiclo + 0.3));
  }
  const kCiclo = Math.floor((t - tA) / 0.1);
  const cheia = estacao === 'frio' ? 0.15 : estacao === 'ciclo' ? [1, 1, 0.6, 0.15][kCiclo % 4] : 1;
  const folha = estacao === 'frio' ? '#C9773B' : estacao === 'ciclo' ? ['#7DBA55', '#5FA040', '#D9833B', '#C9773B'][kCiclo % 4] : undefined;
  const sol =
    estacao === 'verao'
      ? {x: 800, y: 280, r: 92, cor: '#FFF6C9', raios: 1}
      : estacao === 'frio'
        ? undefined
        : estacao === 'ciclo'
          ? kCiclo % 4 === 1
            ? {x: 800, y: 280, r: 92, cor: '#FFF6C9', raios: 1}
            : undefined
          : {x: 300, y: 610, r: 68, cor: '#FFF1C9'};
  // envelhece em "branca"
  const tB = T(37);
  const velho = r(t, tB, tB + 0.4);
  // ajoelha para escutar
  const tEnc = T(44);
  const joelho = r(t, tEnc - 0.35, tEnc + 0.45);
  const tEsc = T(50);
  const push = r(t, tEnc - 0.4, tEsc + 0.5, Easing.inOut(Easing.sin));
  const cam: Camera = {z: lerp(LARGO.z, 1.5, push), fx: lerp(LARGO.fx, 500, push), fy: lerp(LARGO.fy, 860, push)};
  const rega = 1 - r(t, tEnc - 0.6, tEnc - 0.3);
  const escutando = t >= tEsc - 0.05;
  return (
    <Mundo
      frame={frame}
      pal={pal}
      cam={cam}
      sol={sol}
      nuvens={estacao === 'frio' ? {cor: '#D5DCE3', op: 0.8, vel: 0.9} : {cor: '#FFE9C9', op: 0.5, vel: 0.35}}
      arvore={{cheia, folha}}
      folhasCaindo={estacao === 'frio' ? 1 : 0}
      poeira={estacao === 'frio' || estacao === 'ciclo' ? null : estacao === 'verao' ? '#FFF6C9' : '#FFE6A6'}
      personagens={
        <>
          {joelho > 0.3 && <RegadorNoChao x={760} y={1085} s={0.62} />}
          <PedraEm id="p2" frame={frame} molhada={rega} />
          <TomasEm
            x={lerp(MUNDO.tomas.x, 585, joelho)}
            y={lerp(MUNDO.tomas.y, 1082, joelho)}
            frame={frame}
            barba={velho}
            curva={lerp(lerp(10, 17, velho), 46, joelho)}
            joelho={joelho}
            regador={joelho < 0.3}
            rega={rega}
            maoFrente={joelho > 0 ? {x: lerp(190, 150, joelho), y: lerp(-150, -10, joelho)} : {x: lerp(120, 190, rega), y: lerp(-100, -150, rega)}}
            gotasAteY={GOTA_Y}
            olhos={escutando ? 'fechados' : estacao === 'verao' ? 'fechados' : 'abertos'}
            boca={escutando ? 'sorriso' : estacao === 'frio' ? 'reta' : 'sorriso'}
            inclinaCabeca={lerp(0, 26, joelho)}
          />
        </>
      }
    />
  );
};

// ------------------------------------------------------------------------------------------ cena 3
const Raio: React.FC<{op: number; x: number}> = ({op, x}) =>
  op <= 0.05 ? null : (
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <polyline points={`${x},-10 ${x - 40},140 ${x + 20},170 ${x - 50},330 ${x + 10},350 ${x - 70},520`} fill="none" stroke="#E8F1FF" strokeWidth={14} strokeLinejoin="round" opacity={op} />
      <polyline points={`${x},-10 ${x - 40},140 ${x + 20},170 ${x - 50},330 ${x + 10},350 ${x - 70},520`} fill="none" stroke="white" strokeWidth={5} strokeLinejoin="round" opacity={op} />
    </svg>
  );

const Cena3: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const tDes = T(64);
  const chuva = r(t, tDes - 0.05, tDes + 0.6);
  const flash = Math.max(clarao(t, tDes), clarao(t, T(67) + 0.1) * 0.6, clarao(t, T(73) + 0.4) * 0.5, clarao(t, T(84)) * 0.55);
  const nivel = 0.95 * r(t, T(72), T(72) + 0.3, Easing.out(Easing.back(1.6))) + 1.0 * r(t, T(73), T(73) + 0.3, Easing.out(Easing.back(1.6))) + 0.4 * r(t, T(77), T(79) + 0.4);
  const tremor = chuva * (2 + 2 * r(t, T(72), T(73) + 0.3));
  const tCorre = T(85);
  const corre = r(t, tCorre - 0.1, C3B - 0.12, (x) => x);
  const cam: Camera = {
    z: LARGO.z + 0.05 * r(t, C3, C3B),
    fx: LARGO.fx,
    fy: LARGO.fy,
    sx: Math.sin(frame * 0.9) * tremor,
    sy: Math.cos(frame * 1.3) * tremor + flash * -6,
  };
  return (
    <>
      <Mundo
        frame={frame}
        pal={PAL.noite}
        cam={cam}
        nuvens={{cor: '#0B1226', op: 0.9, vel: 1 + chuva * 3, escuras: true}}
        arvore={{cheia: 1}}
        rioNivel={nivel}
        rioAgitado={0.25 + chuva * 0.75}
        luzinhas={r(t, T(80) - 0.1, T(84) + 0.9, (x) => x)}
        chuva={chuva}
        clarao={flash}
        personagens={
          <>
            <PedraEm id="p3" frame={frame} molhada={chuva} noite />
            {t >= tCorre - 0.15 && (
              <TomasEm
                x={lerp(1180, 590, corre)}
                y={MUNDO.tomas.y}
                frame={frame}
                capa
                regador={false}
                corre={corre < 1 ? t * 15 : undefined}
                curva={corre < 1 ? 18 : 24}
                olhos="preocupado"
                boca="reta"
                barba={1}
                maoFrente={corre < 1 ? undefined : {x: 120, y: -80}}
              />
            )}
          </>
        }
      />
      <Raio op={clarao(t, tDes) * 1.2} x={760} />
      <Raio op={clarao(t, T(84)) * 0.9} x={260} />
    </>
  );
};

const Cena3b: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const racha = r(t, TOC - 0.06, TOC + 0.1, Easing.out(Easing.cubic));
  const brilho = r(t, TOC, TOC + 0.3);
  const tranco = t > TOC - 0.03 ? Math.exp(-(t - TOC) / 0.09) * Math.sin((t - TOC) * 70) * 16 : 0;
  const parado = t > TOC - 0.5; // a câmera para antes do Toc
  const tremor = parado ? 0 : 1.6;
  const cam: Camera = {
    z: lerp(2.05, 2.25, r(t, C3B, TOC - 0.5)),
    fx: 480,
    fy: 905,
    sx: Math.sin(frame * 0.9) * tremor + tranco,
    sy: Math.cos(frame * 1.3) * tremor + tranco * 0.6,
  };
  const sussurra = t >= T(94) && t < E(97);
  const surpresa = t >= TOC + 0.05;
  const tomas = (camada: 'corpo' | 'bracos') => (
    <TomasEm
      x={585}
      y={1082}
      frame={frame}
      capa
      regador={false}
      barba={1}
      joelho={1}
      curva={surpresa ? 30 : 44}
      inclinaCabeca={surpresa ? 8 : 22}
      maoFrente={{x: 172, y: -48}}
      maoTras={{x: 150, y: 10}}
      olhos={surpresa ? 'surpreso' : 'fechados'}
      boca={surpresa ? 'o' : sussurra ? 'fala' : 'sorriso'}
      fala={sussurra ? Math.abs(Math.sin(t * 22)) * 0.55 : 0}
      camada={camada}
    />
  );
  return (
    <Mundo
      frame={frame}
      pal={PAL.noite}
      cam={cam}
      nuvens={{cor: '#0B1226', op: 0.9, vel: 4, escuras: true}}
      rioNivel={2.35}
      rioAgitado={1}
      luzinhas={1}
      chuva={parado ? 0.75 : 1}
      clarao={0}
      personagens={
        <>
          {tomas('corpo')}
          <PedraEm id="p3b" frame={frame} molhada={1} noite racha={racha} brilho={brilho} />
          {tomas('bracos')}
        </>
      }
    />
  );
};

// ------------------------------------------------------------------------------------------ cena 4
const Cena4a: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const tRachou = T(101);
  const abre = r(t, tRachou - 0.05, tRachou + 0.45, Easing.out(Easing.back(1.4)));
  const olhos = r(t, T(104) - 0.05, T(104) + 0.3);
  const cresce = r(t, T(106) - 0.05, E(107) + 0.25, Easing.out(Easing.back(1.1)));
  const s = lerp(0.3, 1.45, cresce);
  const sacode = t > T(108) && t < E(111) ? Math.sin((t - T(108)) * 18) * 3 * (1 - r(t, T(110), E(111))) : 0;
  const cam: Camera = {z: lerp(1.85, 1.0, cresce), fx: lerp(400, 500, cresce), fy: lerp(905, 760, cresce), sy: 0};
  return (
    <Mundo
      frame={frame}
      pal={PAL.madrugada}
      cam={cam}
      nuvens={{cor: '#1A2446', op: 0.8, vel: 2, escuras: true}}
      rioNivel={2.35}
      rioAgitado={0.9}
      luzinhas={1}
      chuva={lerp(0.6, 0.35, r(t, C4, C4B))}
      personagens={
        <>
          {abre > 0.05 && (
            <g transform={`translate(${MUNDO.pedra.x} ${MUNDO.pedra.y}) rotate(${sacode}) scale(${s})`}>
              <Pedrinha id="pd4a" frame={frame} modo="em_pe" olhos={olhos} noite olhar={6 * cresce} />
            </g>
          )}
          <PedraEm id="p4a" frame={frame} molhada={0.6} noite racha={1} brilho={1 - r(t, tRachou + 0.3, tRachou + 1.2)} abre={abre * (1 + cresce * 0.6)} />
          <TomasEm
            x={lerp(lerp(585, 650, r(t, C4, T(101) + 0.5, Easing.out(Easing.cubic))), 930, cresce)}
            y={lerp(1082, MUNDO.tomas.y + 30, cresce)}
            frame={frame}
            capa
            regador={false}
            barba={1}
            joelho={1}
            curva={-6}
            inclinaCabeca={-18}
            maoFrente={{x: 60, y: -40}}
            olhos="surpreso"
            boca={cresce > 0.6 ? 'sorrisao' : 'o'}
          />
        </>
      }
    />
  );
};

const Cascas: React.FC<{frame: number; noite?: boolean}> = ({frame, noite}) => <PedraEm id="cascas" frame={frame} abre={1.6} brilho={0} noite={noite} />;

// Pedrinha deitado como barragem: virado (cabeça à esquerda), na beira do rio, logo na frente da cerca.
const PEDRINHA_DEITADO = {x: 540, y: 1000, s: 0.85};
const deitadoT = (k = 1) => `translate(${PEDRINHA_DEITADO.x} ${PEDRINHA_DEITADO.y}) scale(${-PEDRINHA_DEITADO.s} ${PEDRINHA_DEITADO.s * k})`;
// espuma da água parada nas costas (desenhada atrás do corpo)
const Espuma: React.FC<{frame: number; calma: number}> = ({frame, calma}) => {
  let d = 'M -470 -250';
  for (let x = -450; x <= 470; x += 30) d += ` L ${x} ${-250 - Math.abs(x) * 0.0 - Math.abs(Math.sin(x / 40 + frame * 0.3 * (1 - calma))) * 18 * (1 - calma * 0.8)}`;
  return <path d={d} stroke="#DDEBFA" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.85} />;
};

// Cena 4b (barragem): plano aberto (zoom 0,9) com Pedrinha ENORME deitado na margem (cabeça à esquerda) e o rio
// cheio atrás dele. Em "parou" uma onda chega, bate nas costas dele, espirra e a água fica parada.
const B4 = {x: 810, y: 1000, s: 1.5};
const AGUA_LONGE = -338; // borda de lá da água (referencial do Pedrinha), logo abaixo das casas do morro
const Represa: React.FC<{t: number; frame: number; parou: number; tOnda: number}> = ({t, frame, parou, tOnda}) => {
  const agit = 1 - parou;
  const onda = r(t, tOnda - 0.75, tOnda, Easing.in(Easing.quad)); // crista viajando até as costas
  const yOnda = lerp(AGUA_LONGE + 4, -262, onda);
  const ondas = [0, 1, 2, 3, 4].map((k) => {
    const f = ((frame * 0.035 + k / 5) % 1);
    const y = lerp(AGUA_LONGE + 8, -262, f);
    let d = `M -1100 ${y}`;
    for (let x = -1050; x <= 1100; x += 50) d += ` L ${x} ${y + Math.sin(x / 45 + frame * 0.25 + k) * 5}`;
    return <path key={k} d={d} stroke="#9CC0EC" strokeWidth={4} fill="none" opacity={0.7 * agit * Math.sin(Math.PI * f)} strokeDasharray="60 40" />;
  });
  let crista = `M -1100 ${yOnda}`;
  for (let x = -1050; x <= 1100; x += 40) crista += ` L ${x} ${yOnda - 10 - Math.abs(Math.sin(x / 60 + frame * 0.3)) * 12}`;
  return (
    <g>
      <rect x={-1100} y={AGUA_LONGE - 14} width={2200} height={14} fill="#3A3C55" />
      <rect x={-1100} y={AGUA_LONGE} width={2200} height={-AGUA_LONGE} fill="#3566A0" />
      <rect x={-1100} y={AGUA_LONGE} width={2200} height={30} fill="#4B7DBA" opacity={0.6} />
      {ondas}
      {/* ondinhas paradas depois de "parou" */}
      {parou > 0 &&
        [0, 1, 2].map((k) => (
          <path key={k} d={`M ${-700 + k * 450} ${-300 + k * 6} q 40 -8 80 0`} stroke="#9CC0EC" strokeWidth={4} fill="none" opacity={0.6 * parou} />
        ))}
      {onda > 0 && onda < 1 && <path d={crista} stroke="#EAF4FF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.95} />}
    </g>
  );
};
const Respingo: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const d = t - t0;
  if (d < 0 || d > 0.7) return null;
  return (
    <g opacity={1 - d / 0.7}>
      {Array.from({length: 18}).map((_, i) => {
        const x0 = -420 + i * 50;
        const vy = 380 + (i % 4) * 90;
        const y = -262 - vy * d + 900 * d * d;
        return <ellipse key={i} cx={x0 + (i % 3 - 1) * 30 * d} cy={y} rx={9} ry={13} fill="#EAF4FF" />;
      })}
    </g>
  );
};

const Cena4b: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const tDeita = E(114); // "tum" logo DEPOIS de "deitou"
  const amassa = r(t, tDeita - 0.35, tDeita, Easing.in(Easing.quad));
  const deitado = t >= tDeita;
  const assenta = r(t, tDeita, tDeita + 0.4, Easing.out(Easing.back(2)));
  const tum = t > tDeita ? Math.exp(-(t - tDeita) / 0.12) * Math.sin((t - tDeita) * 60) * 10 : 0;
  const tOnda = T(122);
  const parou = r(t, tOnda, tOnda + 0.45);
  const cam: Camera = {z: 0.9, fx: 540, fy: 775, sx: tum, sy: tum};
  return (
    <Mundo
      frame={frame}
      pal={mixPal(PAL.madrugada, PAL.amanhecer, r(t, C4B, C4C) * 0.25)}
      cam={cam}
      nuvens={{cor: '#2A3560', op: 0.7, vel: 1.2, escuras: true}}
      rioNivel={2.35}
      rioAgitado={0.9 * (1 - parou)}
      rioParado={parou}
      luzinhas={1}
      chuva={lerp(0.3, 0.12, r(t, C4B, C4C))}
      barragem={
        <g transform={`translate(${B4.x} ${B4.y})`}>
          <g transform={`scale(${B4.s})`}>
            <Represa t={t} frame={frame} parou={parou} tOnda={tOnda} />
          </g>
          {deitado ? (
            <g transform={`scale(${-B4.s} ${B4.s * (0.85 + 0.15 * assenta)})`}>
              <Espuma frame={frame} calma={parou} />
              <Pedrinha id="pd4b" frame={frame} modo="deitado" noite olhos={1} olhar={-8} />
            </g>
          ) : (
            <g transform={`translate(-480 0) scale(${-1.0 * (1 + amassa * 0.6)} ${1.0 * (1 - amassa * 0.45)})`}>
              <Pedrinha id="pd4b0" frame={frame} modo="em_pe" noite olhos={1} />
            </g>
          )}
          <g transform={`scale(${B4.s})`}>
            <Respingo t={t} t0={tOnda} />
          </g>
        </g>
      }
      personagens={
        <TomasEm
          x={890}
          y={1062}
          s={0.5}
          frame={frame}
          capa
          regador={false}
          barba={1}
          curva={-4}
          inclinaCabeca={-14}
          olhos={parou > 0.5 ? 'fechados' : 'surpreso'}
          boca={parou > 0.5 ? 'sorrisao' : 'o'}
          maoFrente={parou > 0.5 ? {x: 70, y: -230} : {x: 90, y: -90}}
          maoTras={parou > 0.5 ? {x: -60, y: -230} : undefined}
        />
      }
    />
  );
};

// Amanhecer: plano geral (C4C) e plano médio final (C4D) no mesmo cenário.
const Cena4c: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const medio = t >= C4D;
  const tFeliz = T(136);
  const tGota = T(139);
  const flores = r(t, C4C, C4C + 1.4, (x) => x);
  const zoomMedio = r(t, C4D, FIM - 1.0, Easing.inOut(Easing.sin));
  const cam: Camera = medio
    ? {z: lerp(1.75, 1.85, zoomMedio), fx: 277, fy: 785}
    : {z: lerp(LARGO.z, LARGO.z + 0.05, r(t, C4C, C4D)), fx: LARGO.fx, fy: LARGO.fy};
  const rega = r(t, tFeliz - 0.1, tFeliz + 0.3);
  const gota = r(t, tGota - 0.32, tGota - 0.02, Easing.in(Easing.quad));
  const pulo = t > tGota ? Math.exp(-(t - tGota) / 0.25) * Math.sin((t - tGota) * 22) : 0;
  const tomasLocal = {x: 110, y: -250};
  const mao = {x: lerp(110, 135, rega), y: lerp(-100, -150, rega)};
  const kT = MUNDO.tomas.s / PEDRINHA_DEITADO.s;
  const bico = bicoSentado(mao, rega * 0.55, 6, frame);
  const bicoP = {x: tomasLocal.x + bico.x * kT, y: tomasLocal.y + bico.y * kT};
  const florFinal = {x: bicoP.x + 4, y: -238};
  return (
    <Mundo
      frame={frame}
      pal={PAL.amanhecer}
      cam={cam}
      sol={{x: 300, y: lerp(660, 600, r(t, C4C, FIM)), r: 78, cor: '#FFE3C2'}}
      nuvens={{cor: '#FCE3D6', op: 0.65, vel: 0.3}}
      rioNivel={2.35}
      rioAgitado={0.05}
      rioParado={1}
      silhuetas={r(t, T(128) - 0.1, T(130) + 0.3, (x) => x)}
      passaros
      poeira="#FFE9D6"
      barragem={
        <g transform={deitadoT()}>
          <Espuma frame={frame} calma={1} />
          <Pedrinha id="pd4c" frame={frame} modo="deitado" flores={flores} feliz={t >= tFeliz} olhos={1} olhar={-8} />
          {/* flor que Tomás rega no fim */}
          <Flor x={florFinal.x} y={florFinal.y} s={1.5 * Math.min(1, flores * 2) * (1 + 0.18 * pulo)} giro={pulo * 14} cor="#F7A8B8" />
          {t > tGota && t < tGota + 0.5 && (
            <g opacity={1 - r(t, tGota, tGota + 0.5)}>
              {[0, 1, 2, 3, 4].map((i) => {
                const a = -Math.PI / 2 + (i - 2) * 0.5;
                const d = 20 + (t - tGota) * 140;
                return <circle key={i} cx={florFinal.x + Math.cos(a) * d} cy={florFinal.y - 10 + Math.sin(a) * d} r={5} fill="#d9f1ff" />;
              })}
            </g>
          )}
          <g transform={`translate(${tomasLocal.x} ${tomasLocal.y}) scale(${kT})`}>
            <Tomas
              frame={frame}
              sentado
              barba={1}
              curva={6}
              rega={rega * 0.55}
              maoFrente={mao}
              olhos={t >= tFeliz ? 'fechados' : 'abertos'}
              boca={t >= tGota ? 'sorrisao' : 'sorriso'}
              inclinaCabeca={t >= tFeliz ? 8 : 0}
            />
          </g>
          {t >= tGota - 0.32 && t < tGota && (
            <ellipse cx={bicoP.x + 4} cy={lerp(bicoP.y + 6, florFinal.y - 22, gota)} rx={8} ry={12} fill="#cfeeff" stroke="#5aa0c8" strokeWidth={3} />
          )}
        </g>
      }
      personagens={medio ? null : <g transform="translate(396 256) scale(0.8)"><Cascas frame={frame} /></g>}
    />
  );
};

// ------------------------------------------------------------------------------------------ composição
export const Video001: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fade12 = r(t, C2 - 0.13, C2 + 0.13, (x) => x); // fade curto (8 frames)
  const branco = Math.max(r(t, TOC + 0.18, TOC + 0.26, (x) => x) * (t < C4 ? 1 : 0), t >= C4 ? 1 - r(t, C4, C4 + 0.25) : 0);
  let cena: React.ReactNode;
  if (t < C2 + 0.13) {
    cena = (
      <>
        <Cena1 t={t} frame={frame} />
        {fade12 > 0 && (
          <AbsoluteFill style={{opacity: fade12}}>
            <Cena2 t={t} frame={frame} />
          </AbsoluteFill>
        )}
      </>
    );
  } else if (t < C3) cena = <Cena2 t={t} frame={frame} />;
  else if (t < C3B) cena = <Cena3 t={t} frame={frame} />;
  else if (t < C4) cena = <Cena3b t={t} frame={frame} />;
  else if (t < C4B) cena = <Cena4a t={t} frame={frame} />;
  else if (t < C4C) cena = <Cena4b t={t} frame={frame} />;
  else cena = <Cena4c t={t} frame={frame} />;
  // escurece o começo da cena 3 (corte seco para o escuro)
  const escuro = t >= C3 && t < T(64) ? 0.35 * (1 - r(t, C3, T(64))) + 0.15 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {cena}
      {escuro > 0 && <AbsoluteFill style={{backgroundColor: '#000', opacity: escuro}} />}
      {branco > 0 && <AbsoluteFill style={{backgroundColor: '#FFF6D5', opacity: branco}} />}
      <Acabamento />
      {/* faixa escura suave atrás da legenda (legibilidade) */}
      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0) 52%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.28) 76%, rgba(0,0,0,0) 86%)'}} />
      {/* no plano médio final a legenda desce um pouco (ainda dentro da faixa 1100–1500) para não cobrir o rosto do Pedrinha */}
      <LegendaFrases palavras={W} frases={FRASES} y={1300} />
      <Audio src={staticFile('VIDEO_001/mix.wav')} />
    </AbsoluteFill>
  );
};
