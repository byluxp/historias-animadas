"""Síntese de trilha e SFX só com numpy (a máquina não tem scipy).

Peças: instrumentos (celesta, pizzicato, pad, baixo, tambor), efeitos (gota, trovão, chuva, whoosh,
"toc" de madeira/pedra, estalos, tum grave, água subindo, ondas, passarinhos, risadinhas abafadas).
Tudo é som próprio, gerado por código (sem licença de terceiros).
"""
from __future__ import annotations

import numpy as np

SR = 48000
TAU = 2 * np.pi


def ns(s: float) -> int:
    return max(1, int(round(s * SR)))


def rng(seed: int = 0):
    return np.random.default_rng(seed)


def m2f(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12.0)


# ---------------------------------------------------------------- filtros (FFT, fase zero)
def _fft_filtro(x: np.ndarray, ganho) -> np.ndarray:
    n = len(x)
    X = np.fft.rfft(x, n * 2)
    f = np.fft.rfftfreq(n * 2, 1 / SR)
    return np.fft.irfft(X * ganho(f), n * 2)[:n]


def lp(x, fc, ordem=2):
    return _fft_filtro(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * ordem)))


def hp(x, fc, ordem=2):
    return _fft_filtro(x, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * ordem)))


def bp(x, f0, largura):
    return _fft_filtro(x, lambda f: np.exp(-0.5 * ((f - f0) / largura) ** 2))


def fades(x, a=0.003, r=0.02):
    x = x.copy()
    na, nr = min(len(x), ns(a)), min(len(x), ns(r))
    x[:na] *= np.linspace(0, 1, na)
    x[len(x) - nr:] *= np.linspace(1, 0, nr)
    return x


def env_adsr(n, a, d, s, r_inicio_n, r):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    if r_inicio_n < n:
        e[r_inicio_n:] *= np.exp(-np.arange(n - r_inicio_n) / SR / max(r, 1e-4))
    return e


def modal(dur, modos, r=None):
    """Soma de senoides amortecidas: [(freq, amp, decaimento_s)]."""
    r = r or rng(0)
    t = np.arange(ns(dur)) / SR
    y = np.zeros_like(t)
    for f, a, d in modos:
        if f < SR / 2:
            y += a * np.sin(TAU * f * t + r.uniform(0, TAU)) * np.exp(-t / d)
    return y


def reverb(x, tempo=1.6, mistura=0.25, seed=7):
    """Reverb por convolução com ruído decaindo (FFT)."""
    r = rng(seed)
    n = ns(tempo)
    t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t / (tempo / 6.9))
    ir = lp(ir, 5000)
    ir[: ns(0.012)] = 0
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    m = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[: len(x) + n]
    out = np.zeros(len(y))
    out[: len(x)] += x * (1 - mistura)
    return out + y * mistura


# ---------------------------------------------------------------- instrumentos
def celesta(f, vel=0.6, dur=1.6, seed=0):
    r = rng(seed)
    y = modal(dur, [(f, 1.0, 0.9), (f * 2.0, 0.35, 0.35), (f * 3.01, 0.12, 0.15), (f * 4.2, 0.06, 0.06)], r)
    t = np.arange(len(y)) / SR
    y += hp(r.standard_normal(len(y)), 4000) * np.exp(-t / 0.001) * 0.1
    return fades(y * vel, 0.001, 0.05)


def pizz(f, vel=0.6, dur=0.7, seed=0):
    r = rng(seed)
    t = np.arange(ns(dur)) / SR
    y = np.zeros_like(t)
    for k in range(1, 12):
        y += (k ** -1.2) * np.sin(TAU * f * k * t + r.uniform(0, TAU)) * np.exp(-t * (6 + 3 * k))
    y += lp(r.standard_normal(len(t)), 2500) * np.exp(-t / 0.004) * 0.15
    return fades(y * vel, 0.001, 0.05)


def pad(f, dur, vel=0.3, brilho=1.0, seed=0):
    r = rng(seed)
    t = np.arange(ns(dur)) / SR
    y = np.zeros_like(t)
    for k, a in [(1, 1.0), (2, 0.45 * brilho), (3, 0.2 * brilho), (4, 0.1 * brilho)]:
        for det in (-0.004, 0.0, 0.0045):
            y += a * np.sin(TAU * f * k * (1 + det) * t + r.uniform(0, TAU))
    a = min(0.8, dur / 3)
    e = np.minimum(1, t / a) * np.minimum(1, (dur - t) / a)
    return y * np.clip(e, 0, 1) * vel / 3


def baixo(f, dur, vel=0.5):
    t = np.arange(ns(dur)) / SR
    y = np.sin(TAU * f * t) + 0.3 * np.sin(TAU * 2 * f * t)
    return fades(y * np.exp(-t / max(dur * 0.6, 0.1)) * vel, 0.01, 0.08)


def tambor(vel=0.7, grave=True, seed=0):
    r = rng(seed)
    dur = 0.9 if grave else 0.4
    t = np.arange(ns(dur)) / SR
    f0 = 70 if grave else 160
    ph = TAU * np.cumsum(f0 * (1 + 1.8 * np.exp(-t / 0.03))) / SR
    y = np.sin(ph) * np.exp(-t / (0.35 if grave else 0.12))
    y += lp(r.standard_normal(len(t)), 1800) * np.exp(-t / 0.03) * 0.35
    return fades(y * vel, 0.0005, 0.05)


# ---------------------------------------------------------------- efeitos
def gota(vel=0.5, f=None, seed=0):
    r = rng(seed)
    f = f or r.uniform(900, 1400)
    t = np.arange(ns(0.16)) / SR
    fr = f * (1 + 1.4 * (t / 0.16))
    y = np.sin(TAU * np.cumsum(fr) / SR) * np.exp(-t / 0.03)
    return fades(y * vel, 0.0005, 0.02)


def trovao(dur=4.0, vel=1.0, seed=0):
    r = rng(seed)
    t = np.arange(ns(dur)) / SR
    ruido = r.standard_normal(len(t))
    estalo = hp(ruido, 800) * np.exp(-t / 0.08) * 0.6
    ronco = lp(ruido, 140, 3) * 6
    mod = 0.6 + 0.4 * np.abs(lp(r.standard_normal(len(t)), 4)) * 8
    e = np.minimum(1, t / 0.02) * np.exp(-t / (dur / 3.2))
    y = (estalo + ronco * mod) * e
    return fades(y / (np.max(np.abs(y)) + 1e-9) * vel, 0.002, 0.3)


def chuva(dur, vel=0.3, seed=0):
    r = rng(seed)
    n = ns(dur)
    y = bp(r.standard_normal(n), 3500, 2500) * 0.6 + lp(r.standard_normal(n), 600) * 0.6
    # pingos individuais
    for _ in range(int(dur * 25)):
        i = r.integers(0, n - ns(0.05))
        g = gota(r.uniform(0.05, 0.18), r.uniform(1500, 3500), seed=int(i))
        y[i: i + len(g)] += g[: n - i]
    y /= np.max(np.abs(y)) + 1e-9
    return fades(y * vel, 0.5, 0.5)


def whoosh(dur=0.6, vel=0.4, seed=0):
    r = rng(seed)
    t = np.arange(ns(dur)) / SR
    x = r.standard_normal(len(t))
    # varredura: soma de bandas com envelope deslocado
    y = np.zeros_like(t)
    for i, f0 in enumerate([500, 900, 1500, 2500]):
        c = dur * (0.35 + 0.1 * i)
        y += bp(x, f0, f0 * 0.6) * np.exp(-((t - c) / (dur * 0.22)) ** 2)
    return fades(y / (np.max(np.abs(y)) + 1e-9) * vel, 0.01, 0.05)


def toc(vel=0.8, seed=0, f=None):
    """Batida seca de pedra/madeira oca."""
    r = rng(seed)
    f = f or 520
    y = modal(0.35, [(f, 1.0, 0.05), (f * 2.3, 0.5, 0.025), (f * 3.9, 0.25, 0.012), (f * 0.5, 0.6, 0.08)], r)
    t = np.arange(len(y)) / SR
    y += bp(r.standard_normal(len(y)), 2500, 1500) * np.exp(-t / 0.002) * 0.6
    return fades(y / (np.max(np.abs(y)) + 1e-9) * vel, 0.0003, 0.05)


def estalo_pedra(vel=0.7, seed=0):
    r = rng(seed)
    dur = 0.5
    n = ns(dur)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k in range(r.integers(5, 9)):
        i = int(r.uniform(0, 0.25) * SR)
        g = hp(r.standard_normal(ns(0.03)), 1500) * np.exp(-np.arange(ns(0.03)) / SR / 0.004)
        y[i: i + len(g)] += g[: n - i] * r.uniform(0.4, 1)
    y += lp(r.standard_normal(n), 300) * np.exp(-t / 0.1) * 0.8
    return fades(y / (np.max(np.abs(y)) + 1e-9) * vel, 0.0005, 0.08)


def tum(vel=0.9, seed=0):
    r = rng(seed)
    t = np.arange(ns(1.4)) / SR
    ph = TAU * np.cumsum(45 * (1 + 1.2 * np.exp(-t / 0.05))) / SR
    y = np.sin(ph) * np.exp(-t / 0.45)
    y += lp(r.standard_normal(len(t)), 400) * np.exp(-t / 0.12) * 0.7
    return fades(y / (np.max(np.abs(y)) + 1e-9) * vel, 0.001, 0.2)


def agua_subindo(dur=1.2, vel=0.6, seed=0):
    r = rng(seed)
    t = np.arange(ns(dur)) / SR
    x = r.standard_normal(len(t))
    y = lp(x, 250, 3) * 3 + bp(x, 900, 400) * 0.4
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.7
    sub = np.sin(TAU * np.cumsum(40 + 25 * t / dur) / SR) * 0.6
    y = (y + sub) * e
    return fades(y / (np.max(np.abs(y)) + 1e-9) * vel, 0.05, 0.2)


def ondas(dur, vel=0.3, periodo=3.2, seed=0):
    r = rng(seed)
    t = np.arange(ns(dur)) / SR
    x = lp(r.standard_normal(len(t)), 1200) + bp(r.standard_normal(len(t)), 3000, 1500) * 0.3
    e = 0.35 + 0.65 * (0.5 + 0.5 * np.sin(TAU * t / periodo)) ** 2
    return fades(x / (np.max(np.abs(x)) + 1e-9) * e * vel, 0.8, 0.8)


def passarinho(vel=0.25, seed=0):
    r = rng(seed)
    y = np.zeros(0)
    for _ in range(r.integers(2, 5)):
        d = r.uniform(0.05, 0.12)
        t = np.arange(ns(d)) / SR
        f0, f1 = r.uniform(2800, 4200), r.uniform(3000, 5200)
        fr = f0 + (f1 - f0) * (t / d) + 300 * np.sin(TAU * 30 * t)
        s = np.sin(TAU * np.cumsum(fr) / SR) * np.sin(np.pi * t / d)
        y = np.concatenate([y, s, np.zeros(ns(r.uniform(0.03, 0.09)))])
    return y * vel


def risadinha(vel=0.2, seed=0):
    """'Ha ha' abafado e distante: vogal sintetizada (formantes) em pulsos."""
    r = rng(seed)
    y = np.zeros(0)
    f0 = r.uniform(170, 260)
    for k in range(r.integers(3, 5)):
        d = 0.11
        t = np.arange(ns(d)) / SR
        fr = f0 * (1 - 0.04 * k) * (1 + 0.05 * np.sin(np.pi * t / d))
        ph = TAU * np.cumsum(fr) / SR
        voz = sum((1 / h) * np.sin(h * ph) for h in range(1, 18))
        voz = bp(voz, 750, 220) + bp(voz, 1200, 250) * 0.6
        aspir = bp(r.standard_normal(len(t)), 1400, 700) * 0.15
        s = (voz + aspir) * np.sin(np.pi * t / d) ** 0.8
        y = np.concatenate([y, s, np.zeros(ns(0.06))])
    y = lp(y, 1600)  # abafado (de longe)
    return y / (np.max(np.abs(y)) + 1e-9) * vel


def brilho(vel=0.3, seed=0):
    """Cintilada mágica (rachadura acendendo)."""
    y = np.zeros(ns(1.6))
    for i, m in enumerate([84, 88, 91, 96, 100]):
        c = celesta(m2f(m), 0.5, 1.2, seed=seed + i)
        o = ns(0.05 * i)
        y[o: o + len(c)] += c[: len(y) - o]
    return y * vel


# ---------------------------------------------------------------- mesa
class Mesa:
    def __init__(self, dur):
        self.n = ns(dur)
        self.trilhas: dict[str, np.ndarray] = {}

    def add(self, trilha: str, som: np.ndarray, t: float, ganho: float = 1.0):
        buf = self.trilhas.setdefault(trilha, np.zeros(self.n))
        i = ns(t) if t > 0 else 0
        if i >= self.n:
            return
        k = min(len(som), self.n - i)
        buf[i: i + k] += som[:k] * ganho

    def get(self, trilha):
        return self.trilhas.get(trilha, np.zeros(self.n))


def db(x):
    return 10 ** (x / 20)


def salvar_wav(caminho, x, sr=SR):
    import wave
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    dados = (x * 32767).astype("<i2").tobytes()
    with wave.open(str(caminho), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(dados)


def ler_wav(caminho):
    import wave
    with wave.open(str(caminho), "rb") as w:
        sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
        x = np.frombuffer(w.readframes(n), "<i2").astype(float) / 32768
    if ch > 1:
        x = x.reshape(-1, ch).mean(1)
    assert sr == SR, f"wav a {sr} Hz; esperado {SR}"
    return x


def cortar_estouro_final(x, fim_fala, limiar=0.2, sr=SR):
    """Zera o fim do áudio a partir do 1º estouro de ruído depois da fala.

    O Gemini TTS às vezes devolve ~0,2 s de ruído branco em volume máximo depois da última palavra
    (VIDEO_001: 67,40–67,57 s da voz bruta, saltos entre amostras de ~1,3). Fala normal tem salto médio
    entre amostras < 0,05; aqui, janela de 10 ms com salto médio > `limiar` = estouro.
    Devolve (áudio, segundo onde cortou ou None).
    """
    import numpy as _np
    jan = int(0.01 * sr)
    i = int((fim_fala + 0.05) * sr)
    while i + jan < len(x):
        if _np.mean(_np.abs(_np.diff(x[i: i + jan]))) > limiar:
            # volta até o 1º salto grande (o estouro pode começar no meio da janela anterior)
            a = max(0, i - jan)
            saltos = _np.nonzero(_np.abs(_np.diff(x[a: i + jan])) > 0.1)[0]
            i = max(0, a + (int(saltos[0]) if len(saltos) else jan) - int(0.002 * sr))
            y = x.copy()
            f = int(0.005 * sr)
            y[max(0, i - f): i] *= _np.linspace(1, 0, min(f, i))
            y[i:] = 0
            return y, i / sr
        i += jan
    return x, None
