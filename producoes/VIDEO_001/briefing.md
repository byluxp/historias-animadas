---
tipo: briefing
task_id: VIDEO_001
autor: marketing
versao: 1
status: aprovado
data: 2026-11-09
baseado_em: [SECOND_BRAIN/01_ESTRATEGIA/diretrizes.md, decisoes.md D-007]
---
# BRIEFING_DE_PRODUCAO: VIDEO_001 (BETA)

> Modo beta (D-007): sem relatório de histórias nem pesquisas/*.md; 1 busca rápida na web. Serve para a Lucila avaliar animação, legenda e narração. Marcas: [DADO]/[EVIDÊNCIA]/[HIPÓTESE].

| Item | Definição |
|---|---|
| **Formato narrativo** | Fábula curta com **virada final** (história completa em 3 atos: situação estranha → pressão → revelação que muda o sentido do começo). Premissa sugerida (original, o roteirista pode ajustar): *o velho Tomás rega todo dia uma pedra no quintal; a vila ri; na enchente a "pedra" choca e vira um bicho de pedra gigante que segura a água e salva a vila.* Moral de uma frase: "quem cuida do que ninguém enxerga é quem salva todo mundo". **Justificativa:** [EVIDÊNCIA fraca] guias de criadores (busca rápida, ver Restrições) recomendam guardar a virada/resolução para o fim e manter um detalhe novo a cada poucos segundos; [HIPÓTESE] um mistério visual curioso ("regar uma pedra") no início + payoff claro no fim favorece o vídeo ser assistido até o fim, o que o beta não mede. |
| **Público-alvo** | [HIPÓTESE] brasileiros 16–40 que consomem histórias curtas/fábulas no TikTok, em geral sem som na primeira olhada (por isso legenda). |
| **Gancho** | Tipo: curiosidade/absurdo. Imagem em 1,5 s: velho regando uma pedra no sol, close na pedra com gotas. Fala em 3 s: "Todo dia, Tomás regava uma pedra." (5 palavras, cabe em 2 s). [HIPÓTESE] |
| **Estética** | Aconchegante, cores quentes e saturadas; cena 1 dourada de fim de tarde, cena 3 azul-noite com chuva e relâmpago, cena 4 amanhecer rosado. Personagens simples em SVG, cabeça grande, contorno limpo. Estilo do piloto em `~/Vídeos/Tiktok/animado/src` (sem copiar nada de terceiros). |
| **Tipo de animação** | 2D em Remotion (SVG), paralaxe de 3 camadas por cenário, partículas (poeira/pólen, chuva), câmera com leve zoom. **3–4 cenários, 2 personagens** (Tomás e o bicho de pedra "Pedrinha"; vila só como silhueta/fundo, sem personagem extra). Ver cenas abaixo. |
| **Narração** | Uma narradora, Gemini TTS voz "Sulafat", pt-BR, tom de contadora de histórias, calorosa; ~3 palavras/s, **130–145 palavras** (~45 s). Sem diálogo com várias vozes: falas dos personagens viram discurso indireto. |
| **Legendas** | Sim. Frases curtas (2–4 palavras por tela), CAIXA ALTA, palavra ativa destacada (cor de acento), fonte grossa com contorno, **dentro da zona segura** (nada a menos de 250 px do topo e da base; sugestão: faixa entre y≈1100 e y≈1500). Sincronizar com os tempos de palavra da TTS. |
| **Duração recomendada** | **~45 s (40–50 s)**. [DADO interno] D-007; o padrão 45–70 s das diretrizes é só hipótese, e o beta usa o piso. |
| **Ritmo de edição** | 4 cenas (~8 s, ~12 s, ~14 s, ~11 s); micro-movimento (paralaxe, partículas, respiração do personagem) o tempo todo; um novo detalhe visual a cada ~3–4 s; pico de movimento na tempestade (cena 3) e na revelação (cena 4). Corte seco ou fade curto entre cenas. [HIPÓTESE] |
| **Estratégia de retenção** | Pergunta aberta no início (por que regar uma pedra?); tensão crescente (zombaria → tempestade); virada nos últimos ~12 s, com a imagem final ressignificando a cena 1; frase final curta e quotável. Sem clickbait que o fim não pague. [EVIDÊNCIA fraca] |
| **Som** | Trilha sintetizada, suave e curiosa (celesta/pizzicato) na cena 1, tensão com graves e tambor na 3, resolução calorosa na 4; efeitos sintetizados: gotas, trovão, estrondo de pedra, "toc" do choco. Voz acima da trilha (trilha ~-20 dB sob a voz); alvo -14 LUFS, pico ≤ -1 dBTP. Nada de música comercial. |
| **CTA** | Falado: nenhum (o fim da história é o fim). Na legenda do post: "Você já cuidou de algo que ninguém acreditava? Conta aqui 👇". Hashtags e rótulo de IA ativado ao postar (Lucila). |
| **Testes planejados** | Nenhum teste A/B neste beta (1 vídeo não comprova nada, GOVERNANCA §3). A Lucila avalia qualitativamente: animação, legenda, narração. Próximo ciclo, se aprovado: variável única = tipo de gancho (curiosidade × "E se...?"). |
| **Restrições** | Nada de personagens/histórias de terceiros nem pessoas reais; sem diálogo multivoz; máx. 2 personagens e 4 cenários; nada importante nas bordas 250 px topo/base; sem violência nem medo forte (a enchente é mostrada sem vítimas); a vila "ri" só por balões/sombras, sem rostos novos. Pesquisa do beta: 1 busca rápida, fontes fracas (blogs de criadores), por isso tudo marcado como hipótese. |

## Estrutura de cenas sugerida (para o roteirista; ~135 palavras)
1. **Quintal ao entardecer (~8 s, ~22 palavras):** gancho; Tomás rega a pedra; a vila ri.
2. **Mesmo quintal, passam as estações (~12 s, ~34 palavras):** anos de rega, zombaria, ele insiste; nada muda.
3. **Tempestade e rio subindo (~14 s, ~42 palavras):** chuva forte, água ameaça a vila; Tomás abraça a pedra; rachadura, "toc".
4. **Amanhecer (~11 s, ~37 palavras):** o bicho de pedra se abre, deita-se como barragem; a vila a salvo; Tomás sorri; frase final.

## Critérios de sucesso deste vídeo
Beta qualitativo: a Lucila aprova (ou aponta ajustes em) animação, legenda e narração. Técnicos: 1080×1920, 30 fps, 40–50 s, legenda sincronizada e dentro da zona segura, história com início/meio/fim compreensível sem som. Métricas de TikTok só se for postado (retenção 3 s e conclusão), sem limiar definido por falta de histórico.
