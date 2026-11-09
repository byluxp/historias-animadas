# Arquitetura (decidida em 2026-11-09)

```
Lucila ──/ciclo──► ORQUESTRADOR (sessão principal, skill .claude/skills/ciclo)
                     │  estado: scripts/estado.py → ESTADO.json + producoes/<V>/handoffs.jsonl
                     │  memória estratégica: SECOND_BRAIN/01, 02, 05/aprendizados
   ┌─────────────────┼──────────────────────────────────────────────┐
   ▼                 ▼                ▼              ▼              ▼
historias ──► marketing ──► [orquestrador + Lucila aprovam] ──► roteirista ──► editor ──► revisor
(pesquisas/)  (briefing.md)        (estrategia.md)            (roteiro.md)  (video_final) (revisao.md)
                                                                   ▲            ▲            │
                                                                   └─narrativo──┴─visual/áudio┘
                                                                     (máx. 2 rodadas por responsável)
revisor (modo PUBLICAR, só com estado.py autorizar) ──► scripts/tiktok.py (rascunho) + Google Agenda
Lucila posta no app ──► metricas.py registrar ──► marketing + historias (em paralelo) ──► orquestrador atualiza diretrizes
```

## Por que assim
| Escolha | Motivo |
|---|---|
| Orquestrador = sessão principal | Subagentes do Claude Code não chamam outros subagentes |
| Especialistas = subagentes nativos (`.claude/agents/*.md`) | Cada um com ferramentas, modelo e skills próprios; contexto isolado (economia de tokens) |
| Sonnet para pesquisa, Opus para roteiro, edição e revisão | Pesquisa é volume; os outros pedem qualidade |
| Passagem de bastão por arquivo + JSON validado | Nada de "concluí" sem arquivo; histórico auditável; troca de ferramenta sem mexer no fluxo |
| `estado.py` controla rodadas e autorização | Evita loop de correção e envio sem permissão |
| Integrações atrás de scripts (`tiktok.py`, `voz.py`, `metricas.py`) | Trocar a ferramenta (outra voz, API de métricas) muda um script, não os agentes |
| Pesquisa por ciclo, reaproveitada por 14 dias | Não pagar a mesma pesquisa duas vezes |

## Skills por agente
| Agente | Skills | Ferramentas externas |
|---|---|---|
| historias | cinematic-director, short-drama-develop | Claude in Chrome (só leitura), WebSearch |
| marketing | style-sampling, animation-basics (+ reverse-any-video para referência enviada) | Claude in Chrome (só leitura), WebSearch |
| roteirista | cinematic-director, short-drama-write, short-drama-storyboard, short-drama-assets | WebSearch (checar fatos) |
| editor | cartoon-3d-short, remotion-best-practices, hyperframes, remotion-captions, animation-basics | voz.py, FFmpeg, Remotion |
| revisor | short-drama-review | FFmpeg, Whisper local, tiktok.py, Google Agenda |

## Limitações conhecidas
Ver `docs/INTEGRACOES.md`: sem gerador de imagem/vídeo por IA, sem API de métricas, máquina sem GPU
(um render por vez), voz depende de chave, conta do TikTok de histórias ainda não conectada.
