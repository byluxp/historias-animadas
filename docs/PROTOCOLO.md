# Protocolo de comunicação entre agentes

Todo agente termina a tarefa devolvendo **um bloco JSON** (e nada de relatório longo no chat). O
orquestrador grava esse bloco com `python3 scripts/estado.py handoff <VIDEO> <arquivo.json>`, que
valida os campos e atualiza o `ESTADO.json`.

## Formato

```json
{
  "task_id": "VIDEO_001",
  "agent": "roteirista",
  "status": "completed",
  "deliverable": ["producoes/VIDEO_001/roteiro.md", "producoes/VIDEO_001/personagens.md"],
  "summary": "Roteiro de 62 s em 9 cenas conforme briefing v1; gancho 'E se...' em 2,5 s.",
  "issues": [],
  "next_agent": "editor",
  "instructions": "Produzir as cenas 1-9; personagens em personagens.md; não alterar falas."
}
```

| Campo | Regra |
|---|---|
| `task_id` | `VIDEO_NNN` ou `CICLO_AAAA-MM-DD` (pesquisa que serve a vários vídeos) |
| `agent` | `orquestrador`, `historias`, `marketing`, `roteirista`, `editor`, `revisor` |
| `status` | `pending`, `in_progress`, `completed`, `blocked`, `rejected`, `revision_required`, `approved` |
| `deliverable` | Caminho(s) relativo(s) à raiz do projeto. **Obrigatório** em `completed` e `approved`, e o arquivo tem de existir (o script recusa se não existir). |
| `summary` | O resultado obtido, em até 2 frases, com números quando houver |
| `issues` | Lista de problemas (vazia se não houver). Formato abaixo. |
| `next_agent` | Quem recebe o bastão (`usuario` quando depende da Lucila) |
| `instructions` | O que o próximo agente precisa fazer, em até 3 frases |

### Formato de cada problema (`issues`)
```json
{"problema": "Legenda com 'consiguiu'", "local": "00:12.4–00:13.1 / cena 4",
 "gravidade": "media", "correcao": "Trocar por 'conseguiu'", "responsavel": "editor"}
```
Gravidade: `critica` (impede publicar), `alta` (o público percebe), `media`, `baixa` (polimento).

## Quando usar cada status
- `completed`: entrega pronta para a próxima etapa.
- `approved`: só o **revisor** (vídeo) e o **orquestrador** (estratégia) usam.
- `revision_required`: o revisor devolve com `issues`, e `next_agent` é o responsável pela correção.
- `rejected`: o orquestrador descarta um formato ou uma produção (justificar em `summary`).
- `blocked`: falta entrada, ferramenta ou permissão. Diga em `issues` exatamente o que falta.

## Resumo de contexto (o que o orquestrador manda a cada agente)
Nunca a conversa inteira. Só isto, em até ~150 palavras:
```
TAREFA: VIDEO_001 · etapa 5 (roteiro)
OBJETIVO: <uma frase>
LEIA: producoes/VIDEO_001/briefing.md (v1, aprovado), pesquisas/2026-11-09_historias.md §2
RESTRIÇÕES: <o que foi decidido e não pode mudar>
ENTREGUE: roteiro.md, personagens.md, prompts.md em producoes/VIDEO_001/ + JSON do protocolo
```

## Correções
- Cada problema tem no máximo **2 rodadas** de correção. Na 3ª, o `estado.py` marca `blocked` e o
  orquestrador leva a decisão à Lucila. Isso evita loop infinito.
- Quem corrige mexe **só no que o problema aponta** (uma cena, uma legenda). Nada de refazer tudo.
