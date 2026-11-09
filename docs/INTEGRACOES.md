# Integrações: o que existe, o que falta

Atualizado em 2026-11-09 (diagnóstico da Fase 1). Antes de usar uma integração, confira aqui. Se o
status não for ✅, devolva `blocked`.

| Integração | Status | Como usar | O que falta |
|---|---|---|---|
| **TikTok: rascunhos** | 🟡 Código pronto, conta das histórias **não conectada** | `python3 scripts/tiktok.py enviar VIDEO_001` (exige `estado.py autorizar`) | A Lucila roda `python3 scripts/tiktok.py conectar` logada na **conta nova** (uma vez). Se o app estiver em modo sandbox, adicionar a conta nova como usuária de teste no portal developers.tiktok.com. |
| **TikTok: publicação pública** | ⛔ Fora do escopo | A Lucila posta no app, a partir do rascunho | Por decisão: o sistema nunca publica |
| **TikTok: métricas** | ⛔ Sem API | Registro manual: `python3 scripts/metricas.py registrar ...`, ou leitura assistida do TikTok Studio pelo Claude in Chrome (só leitura) | Para automatizar: pedir os escopos `video.list` e `user.info.stats` na revisão do app (mesmo assim, retenção e tempo médio **não** vêm pela API, só views/curtidas/comentários/compartilhamentos) |
| **Google Agenda** | ✅ Testado (lê as agendas; fuso America/Sao_Paulo) | MCP `create_event` na agenda `lucila.vitxria@gmail.com` | Nada |
| **Pesquisa web** | 🟡 Funciona, fontes fracas | WebSearch / WebFetch | Os resultados são focados nos EUA e cheios de números sem fonte: usar só como `[HIPÓTESE]` |
| **Pesquisa no TikTok** | 🟡 Claude in Chrome conectado ("Browser 1") | Abrir tiktok.com/search, perfis e o TikTok Creative Center; ler com `get_page_text` | A Lucila precisa estar logada no Chrome; nada de curtir, seguir ou comentar (só leitura) |
| **Download de referência** | 🟡 `yt-dlp` 2024.04.09 (antigo) | Só para estudo privado, com autorização | Pode falhar no TikTok; atualizar com `pip install -U yt-dlp` se precisar |
| **Voz: ElevenLabs** | ✅ Conta conectada e testada (2026-11-09), SDK oficial no `.venv/` | `python3 scripts/voz.py gerar <VIDEO> --tom alegre\|terror` (voz.mp3 + words.json com o tempo de cada palavra, sem Whisper); `voz.py amostra "frase"` compara vozes | Chave em `.env.local` (fora do git). Vozes por tom em `config/voz.json`: alegre = Juliano Magalhães, terror = Carlos (D-010). Plano grátis não permite monetizar. |
| **Voz: Gemini TTS** | ✅ Usado no VIDEO_001 e aprovado pela Lucila (D-009) | `python3 scripts/voz.py gerar <VIDEO> --motor gemini` (voz Sulafat; tempos pelo Whisper) | Chave reaproveitada do projeto do podcast |
| **Voz: gravação própria** (reserva) | ✅ | Gravar `trabalho/voz/voz.wav` e rodar `python3 scripts/voz.py tempos <VIDEO>` (Whisper local) | Nada |
| **Música / efeitos** | ✅ Síntese em Python (`~/.claude/skills/cartoon-3d-short/templates/audio/`) e `~/Vídeos/Edição/Sons de efeito` | Editor | ACE-Step local **não roda** (sem GPU, 3,7 GB de RAM). ElevenLabs Music só com chave. |
| **Imagem / vídeo por IA** | ⛔ Sem nenhuma API | Personagens e cenários desenhados em código (three.js + Canvas2D no Remotion) | Opcional: uma API de imagem, se um dia o estilo pedir |
| **Render** | ✅ Node 22, FFmpeg 6.1, Remotion 4 (via npx) | Editor, **um render por vez** | Máquina fraca: 4 núcleos, 3,7 GB de RAM, sem GPU. Renders longos. |
| **Second brain (Obsidian)** | ✅ | Nota `01 Projetos/Canal Dark automatizado/` aponta para esta pasta | Nada |
