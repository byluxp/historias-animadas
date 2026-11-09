# Governança: regras que todo agente segue

1. **Não inventar** métricas, tendências, resultados nem fontes. Sem fonte = não existe.
2. **Fato × hipótese.** Marque cada afirmação estratégica como `[DADO]` (número medido, com fonte e
   data), `[EVIDÊNCIA]` (observado em vários exemplos, com links) ou `[HIPÓTESE]` (ideia a testar).
3. **Tendência ≠ desempenho ≠ oportunidade.** Tendência = popular/crescendo; desempenho = resultado
   medido (nosso ou de vários vídeos comparáveis); oportunidade = hipótese que merece teste. Um vídeo
   viral isolado não comprova formato. Nada se decide de forma definitiva com um vídeo só.
4. **Consultar antes de fazer:** o `SECOND_BRAIN/` (o que já sabemos) e `pesquisas/` (o que já foi
   pesquisado nos últimos 14 dias). Não repita pesquisa que ainda vale.
5. **Skills antes de código novo.** Antes de qualquer tarefa técnica, veja se uma skill instalada
   (`~/.claude/skills/<nome>/SKILL.md`) já resolve. Leia só a parte de que precisa.
6. **Não começar sem entrada.** Se faltar a entrega anterior, devolva `blocked`.
7. **Aprovado não se sobrescreve.** Para mudar um documento com `status: aprovado`, rode
   `python3 scripts/estado.py versionar <arquivo>` (guarda a versão anterior em `versoes/` e sobe a
   versão) e diga o motivo no `summary`.
8. **Escrita controlada** (quem escreve onde):

   | Pasta | Escreve |
   |---|---|
   | `SECOND_BRAIN/01_ESTRATEGIA`, `02_FORMATOS`, `ESTADO.json` | orquestrador (o `estado.py` atualiza o estado) |
   | `pesquisas/*_historias.md` | historias |
   | `pesquisas/*_marketing.md`, `producoes/*/briefing.md`, `05_METRICAS/resultados.md`, `experimentos.md` | marketing |
   | `producoes/*/roteiro.md`, `personagens.md`, `prompts.md`, `03_ROTEIROS/` | roteirista |
   | `producoes/*/trabalho/`, `video_final.mp4`, `relatorio_producao.md`, `plano_postagem.md`, `04_PRODUCAO/` | editor |
   | `producoes/*/revisao.md`, `publicacao.md` | revisor |
   | `05_METRICAS/aprendizados.md`, `producoes/*/estrategia.md` | orquestrador |

   Precisa mudar algo fora da sua pasta? Peça no JSON (`issues` + `next_agent: orquestrador`).
9. **Impedimentos vão ao orquestrador** (status `blocked`), nunca contornados em silêncio.
10. **Nada externo sem autorização.** Enviar ao TikTok, criar evento, gastar créditos de API ou baixar
    arquivos só com autorização registrada (`estado.py autorizar`). Nada é **publicado** pelo sistema:
    a postagem pública é sempre da Lucila, no app.
11. **Confira a integração antes de usar** (`docs/INTEGRACOES.md`). Se não existir, `blocked`.
12. **Originais preservados.** Nunca apague brutos nem versões. Arquivos intermediários ficam em
    `producoes/<VIDEO>/trabalho/`.
13. **Direitos autorais:** história, personagens, voz, trilha e efeitos são **nossos** (código,
    síntese, CC0 com licença registrada). Referências de terceiros servem só para estudo: nunca
    copiar roteiro, personagem, enquadramento ou música, nem citar o nome do canal de referência no vídeo.
14. **Popularidade não é comprovação** (regra 3), e conteúdo feito com IA leva o **rótulo de IA** do
    TikTok na hora de postar.
15. **Economia de tokens:** leia trechos, não arquivos inteiros; reutilize modelos de `modelos/` e de
    `SECOND_BRAIN/03_ROTEIROS/modelos/`; entregue o JSON curto, porque o detalhe fica no arquivo.
16. **Erro recorrente** (o mesmo problema 2 vezes) vira linha em
    `SECOND_BRAIN/04_PRODUCAO/solucoes_tecnicas/erros_recorrentes.md` (editor) ou em `aprendizados.md`.
17. **Dados pessoais:** nada de pessoa real identificável no vídeo. Se aparecer, siga a regra de
    borrão de `~/Vídeos/Edição/CLAUDE.md`.
18. Escreva sempre em **português do Brasil**.
