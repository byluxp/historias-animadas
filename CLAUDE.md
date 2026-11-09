# Histórias animadas: produtora multiagente para TikTok

Produz histórias animadas originais, em pt-BR e 9:16, para a conta de histórias do TikTok da Lucila.
Projeto no second brain: `01 Projetos/Canal Dark automatizado/` (a skill `second-brain` acha pela pasta).

## Quem faz o quê
- **A sessão principal é o ORQUESTRADOR.** Para iniciar ou retomar um vídeo: skill **`/ciclo`**
  (`.claude/skills/ciclo/SKILL.md`). Ela tem o pipeline, os portões e como chamar cada agente.
- **Especialistas** (subagentes em `.claude/agents/`): `historias`, `marketing`, `roteirista`,
  `editor`, `revisor`. São chamados com a ferramenta Agent (`subagent_type` = nome do agente).
- O orquestrador **delega** as tarefas: não pesquisa, não escreve roteiro, não edita, não revisa no lugar deles.
- **Perguntas da Lucila o orquestrador responde direto**, sem acionar agentes nem rodar checagens: ele conhece o
  sistema (`ESTADO.json`, `docs/`, `SECOND_BRAIN/`). Se não sabe ou não foi testado, diz isso.
- A **Lucila** tem a palavra final na estratégia e em tudo que sai da máquina (rascunhos, agenda, gastos).

## Arquivos-chave
| O quê | Onde |
|---|---|
| Regras globais | `docs/GOVERNANCA.md` |
| Formato das passagens de bastão | `docs/PROTOCOLO.md` |
| Integrações e o que falta | `docs/INTEGRACOES.md` |
| Estado de todas as tarefas | `ESTADO.json` (só via `python3 scripts/estado.py`) |
| Memória compartilhada | `SECOND_BRAIN/` |
| Modelos de entrega | `modelos/` |
| Um vídeo | `producoes/VIDEO_NNN/` |
| Pesquisas de um ciclo (reutilizáveis) | `pesquisas/AAAA-MM-DD_<agente>.md` |
| Testes medidos | `TESTES.md` |

## Regras que não mudam
- Nada é publicado pelo sistema. Rascunho no TikTok e evento na Agenda só com `estado.py autorizar`.
- Fato × hipótese sempre marcado; nenhuma métrica ou tendência inventada.
- Exceção registrada (D-005): os vídeos deste projeto não usam as pastas numeradas de
  `~/Vídeos/Edição`, mas a regra de borrar dados pessoais de lá continua valendo.
- Máquina fraca (4 núcleos, 3,7 GB de RAM, sem GPU): um render por vez, nunca em paralelo.
- Responder sempre em português do Brasil.
