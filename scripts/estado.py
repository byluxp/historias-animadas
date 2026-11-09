#!/usr/bin/env python3
"""Estado central da produtora (ESTADO.json) e validação das passagens de bastão.

  estado.py status [VIDEO]                   # visão geral ou de um vídeo
  estado.py novo "Título provisório"         # cria producoes/VIDEO_NNN/
  estado.py iniciar VIDEO agente             # marca o agente como in_progress
  estado.py handoff VIDEO arquivo.json       # valida e registra o JSON do protocolo
  estado.py aprovar VIDEO briefing|roteiro|estrategia
  estado.py marcar VIDEO status "motivo"     # ex.: rejected, blocked (orquestrador)
  estado.py autorizar VIDEO "frase da Lucila"
  estado.py publicacao VIDEO campo valor     # tiktok_rascunho | agenda_postagem | agenda_metricas | publicado
  estado.py versionar caminho/arquivo.md     # guarda a versão aprovada antes de mudar
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARQ = RAIZ / "ESTADO.json"
PRODUCOES = RAIZ / "producoes"

STATUS = {"pending", "in_progress", "completed", "blocked", "rejected", "revision_required", "approved"}
AGENTES = {"orquestrador", "historias", "marketing", "roteirista", "editor", "revisor"}
ETAPA = {"historias": "2_historias", "marketing": "3_marketing", "orquestrador": "4_estrategia",
         "roteirista": "5_roteiro", "editor": "6_edicao", "revisor": "7_revisao"}
CAMPOS_PUBLICACAO = {"tiktok_rascunho", "agenda_postagem", "agenda_metricas", "publicado"}
MAX_RODADAS = 2
CAMPOS_JSON = ["task_id", "agent", "status", "deliverable", "summary", "issues", "next_agent", "instructions"]


def agora() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def falhar(msg: str) -> None:
    print(f"ERRO: {msg}", file=sys.stderr)
    sys.exit(1)


def carregar() -> dict:
    if ARQ.exists():
        return json.loads(ARQ.read_text(encoding="utf-8"))
    return {"versao": 1, "atualizado": agora(), "videos": {}}


def salvar(estado: dict) -> None:
    estado["atualizado"] = agora()
    tmp = ARQ.with_suffix(".tmp")
    tmp.write_text(json.dumps(estado, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(ARQ)


def video(estado: dict, vid: str) -> dict:
    if vid not in estado["videos"]:
        falhar(f"{vid} não existe no ESTADO.json (use: estado.py novo)")
    return estado["videos"][vid]


def evento(v: dict, texto: str) -> None:
    v.setdefault("historico", []).append(f"{agora()} · {texto}")


def cmd_status(estado: dict, vid: str | None = None) -> None:
    if not estado["videos"]:
        print("Nenhum vídeo ainda. Comece com: estado.py novo \"título\"")
        return
    alvos = [vid] if vid else sorted(estado["videos"])
    for k in alvos:
        v = video(estado, k)
        pub = v["publicacao"]
        print(f"{k} · {v['titulo']}\n  etapa {v['etapa']} · {v['status']} · com: {v['responsavel']}"
              f" · autorizado: {'sim' if v['autorizado'] else 'não'}")
        print("  publicação: " + " · ".join(f"{c}={pub[c] or '—'}" for c in sorted(CAMPOS_PUBLICACAO)))
        if any(v["rodadas"].values()):
            print("  rodadas de correção: " + ", ".join(f"{a}={n}" for a, n in v["rodadas"].items() if n))
        if vid:
            for linha in v.get("historico", [])[-8:]:
                print(f"    {linha}")


def cmd_novo(estado: dict, titulo: str) -> None:
    nums = [int(k.split("_")[1]) for k in estado["videos"]] + [0]
    vid = f"VIDEO_{max(nums) + 1:03d}"
    pasta = PRODUCOES / vid
    (pasta / "trabalho").mkdir(parents=True, exist_ok=False)
    (pasta / "handoffs.jsonl").touch()
    estado["videos"][vid] = {
        "titulo": titulo, "criado": agora(), "etapa": "1_inicio", "status": "pending",
        "responsavel": "orquestrador", "rodadas": {a: 0 for a in ("roteirista", "editor", "marketing")},
        "aprovacoes": {}, "autorizado": False, "autorizacao": None,
        "publicacao": {c: None for c in CAMPOS_PUBLICACAO}, "historico": []}
    evento(estado["videos"][vid], f"criado: {titulo}")
    salvar(estado)
    print(f"{vid} criado em producoes/{vid}/")


def cmd_iniciar(estado: dict, vid: str, agente: str) -> None:
    if agente not in AGENTES:
        falhar(f"agente inválido: {agente}")
    v = video(estado, vid)
    if v["status"] == "blocked" and agente != "orquestrador":
        falhar(f"{vid} está blocked; o orquestrador precisa resolver antes ({v['historico'][-1]})")
    v.update(etapa=ETAPA.get(agente, v["etapa"]), status="in_progress", responsavel=agente)
    evento(v, f"{agente} iniciou")
    salvar(estado)
    print(f"{vid}: {agente} in_progress")


def validar(dados: dict, vid: str) -> list[str]:
    erros = [f"campo ausente: {c}" for c in CAMPOS_JSON if c not in dados]
    if erros:
        return erros
    if dados["task_id"] != vid and not str(dados["task_id"]).startswith("CICLO_"):
        erros.append(f"task_id {dados['task_id']} ≠ {vid}")
    if dados["agent"] not in AGENTES:
        erros.append(f"agent inválido: {dados['agent']}")
    if dados["status"] not in STATUS:
        erros.append(f"status inválido: {dados['status']} (permitidos: {', '.join(sorted(STATUS))})")
    if dados["status"] == "approved" and dados["agent"] not in ("revisor", "orquestrador"):
        erros.append("só revisor e orquestrador usam 'approved'")
    entregas = dados["deliverable"] if isinstance(dados["deliverable"], list) else [dados["deliverable"]]
    entregas = [e for e in entregas if e]
    if dados["status"] in ("completed", "approved"):
        if not entregas:
            erros.append("status de conclusão sem 'deliverable'")
        for e in entregas:
            if not (RAIZ / e).exists():
                erros.append(f"entrega não encontrada: {e}")
    if not isinstance(dados["issues"], list):
        erros.append("'issues' precisa ser uma lista")
    elif dados["status"] in ("revision_required", "blocked") and not dados["issues"]:
        erros.append(f"status {dados['status']} exige pelo menos 1 item em 'issues'")
    if not str(dados["summary"]).strip():
        erros.append("'summary' vazio")
    return erros


def cmd_handoff(estado: dict, vid: str, arquivo: str) -> None:
    v = video(estado, vid)
    try:
        dados = json.loads(Path(arquivo).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        falhar(f"JSON ilegível ({e})")
    erros = validar(dados, vid)
    if erros:
        falhar("handoff recusado:\n  - " + "\n  - ".join(erros))

    status, prox = dados["status"], dados["next_agent"]
    if status == "revision_required":
        resp = prox
        v["rodadas"][resp] = v["rodadas"].get(resp, 0) + 1
        if v["rodadas"][resp] > MAX_RODADAS:
            status, prox = "blocked", "usuario"
            dados["issues"].append({"problema": f"{resp} já teve {MAX_RODADAS} rodadas de correção",
                                    "gravidade": "alta", "responsavel": "orquestrador"})
            print(f"⚠ Limite de {MAX_RODADAS} rodadas atingido para {resp}: {vid} ficou blocked.")
    if dados["agent"] == "revisor" and status == "approved":
        v["etapa"] = "8_distribuicao"
    elif prox in ETAPA:
        v["etapa"] = ETAPA[prox]
    v.update(status=status, responsavel=prox)
    evento(v, f"{dados['agent']} → {status} → {prox}: {dados['summary'][:120]}")
    with open(PRODUCOES / vid / "handoffs.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps({"registrado": agora(), **dados}, ensure_ascii=False) + "\n")
    salvar(estado)
    print(f"{vid}: {dados['agent']} {status} → próximo: {prox} (etapa {v['etapa']})")


def cmd_aprovar(estado: dict, vid: str, doc: str) -> None:
    v = video(estado, vid)
    caminho = PRODUCOES / vid / f"{doc}.md"
    if not caminho.exists():
        falhar(f"{caminho} não existe")
    texto = caminho.read_text(encoding="utf-8")
    novo = re.sub(r"^status:.*$", "status: aprovado", texto, count=1, flags=re.M)
    caminho.write_text(novo, encoding="utf-8")
    v["aprovacoes"][doc] = agora()
    evento(v, f"{doc} aprovado")
    salvar(estado)
    print(f"{vid}: {doc} aprovado")


def cmd_marcar(estado: dict, vid: str, status: str, motivo: str) -> None:
    if status not in STATUS:
        falhar(f"status inválido: {status}")
    v = video(estado, vid)
    if v["status"] == "blocked" and status != "blocked":
        # Desbloquear é decisão da Lucila: as rodadas de correção recomeçam do zero.
        v["rodadas"] = {a: 0 for a in v["rodadas"]}
    v.update(status=status, responsavel="orquestrador")
    evento(v, f"orquestrador marcou {status}: {motivo}")
    salvar(estado)
    print(f"{vid}: {status}")


def cmd_autorizar(estado: dict, vid: str, frase: str) -> None:
    v = video(estado, vid)
    if v["etapa"] != "8_distribuicao":
        falhar(f"{vid} está na etapa {v['etapa']}; só se autoriza envio depois da aprovação do revisor")
    v.update(autorizado=True, autorizacao={"quando": agora(), "frase": frase})
    evento(v, f"Lucila autorizou: {frase}")
    salvar(estado)
    print(f"{vid}: autorizado")


def cmd_publicacao(estado: dict, vid: str, campo: str, valor: str) -> None:
    if campo not in CAMPOS_PUBLICACAO:
        falhar(f"campo inválido: {campo} (use {', '.join(sorted(CAMPOS_PUBLICACAO))})")
    v = video(estado, vid)
    if campo != "publicado" and not v["autorizado"]:
        falhar(f"{vid} não tem autorização registrada")
    v["publicacao"][campo] = f"{valor} ({agora()})"
    if campo == "publicado":
        v.update(etapa="9_feedback", status="completed", responsavel="orquestrador")
    evento(v, f"publicação: {campo} = {valor}")
    salvar(estado)
    print(f"{vid}: {campo} = {valor}")


def cmd_versionar(caminho: str) -> None:
    arq = (RAIZ / caminho) if not Path(caminho).is_absolute() else Path(caminho)
    if not arq.exists():
        falhar(f"{arq} não existe")
    texto = arq.read_text(encoding="utf-8")
    m = re.search(r"^versao:\s*(\d+)", texto, flags=re.M)
    n = int(m.group(1)) if m else 1
    destino = arq.parent / "versoes" / f"{arq.stem}_v{n}{arq.suffix}"
    destino.parent.mkdir(exist_ok=True)
    if destino.exists():
        falhar(f"{destino.name} já existe: a versão {n} já foi guardada")
    shutil.copy2(arq, destino)
    if m:
        texto = texto[:m.start(1)] + str(n + 1) + texto[m.end(1):]
    texto = re.sub(r"^status:.*$", "status: rascunho", texto, count=1, flags=re.M)
    arq.write_text(texto, encoding="utf-8")
    print(f"v{n} guardada em {destino.relative_to(RAIZ)}; {arq.name} agora é v{n + 1} (rascunho)")


def main() -> None:
    a = sys.argv[1:]
    if not a or a[0] in ("-h", "--help"):
        print(__doc__)
        return
    cmd, args = a[0], a[1:]
    uso = {"novo": 1, "iniciar": 2, "handoff": 2, "aprovar": 2, "marcar": 3, "autorizar": 2,
           "publicacao": 3, "versionar": 1}
    if cmd in uso and len(args) != uso[cmd]:
        falhar(f"'{cmd}' espera {uso[cmd]} argumento(s). Veja: estado.py --help")
    if cmd == "versionar":
        cmd_versionar(args[0])
        return
    estado = carregar()
    acoes = {"status": lambda: cmd_status(estado, args[0] if args else None),
             "novo": lambda: cmd_novo(estado, *args), "iniciar": lambda: cmd_iniciar(estado, *args),
             "handoff": lambda: cmd_handoff(estado, *args), "aprovar": lambda: cmd_aprovar(estado, *args),
             "marcar": lambda: cmd_marcar(estado, *args), "autorizar": lambda: cmd_autorizar(estado, *args),
             "publicacao": lambda: cmd_publicacao(estado, *args)}
    if cmd not in acoes:
        falhar(f"comando desconhecido: {cmd}")
    acoes[cmd]()


if __name__ == "__main__":
    main()
