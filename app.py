from flask import Flask, request, jsonify
from flask_cors import CORS 
from database.db_actions import (
    alternar_favorito, 
    buscar_musicas,
    listar_favoritos,
    listar_mais_ouvidas,
    listar_por_estilo,
    listar_usuarios,
    registrar_acesso,
)

app = Flask(__name__)
app.json.ensure_ascii = False
CORS(app)


def usuario_do_json():
    dados = request.get_json(silent=True)
    id_usuario = dados.get("id_usuario") if isinstance(dados, dict) else None
    if type(id_usuario) is not int or id_usuario <= 0:
        return None
    return id_usuario


def resposta_consulta(resultado, mensagem_erro):
    if resultado is None:
        return jsonify({"erro": mensagem_erro}), 503
    return jsonify(resultado)


@app.route("/usuarios", methods=["GET"])
def rota_usuarios():
    return resposta_consulta(listar_usuarios(), "Erro ao listar usuários")

@app.route("/musicas/<int:cod_musica>/acesso", methods=["POST"])
def rota_acesso(cod_musica):
    id_usuario = usuario_do_json()
    if id_usuario is None:
        return jsonify({"erro": "Informe id_usuario válido"}), 400
    quantidade = registrar_acesso(id_usuario, cod_musica)
    if quantidade is None:
        return jsonify({"erro": "Erro ao registrar acesso"}), 503
    return jsonify({"sucesso": True, "qtd_acessos": quantidade})

@app.route("/musicas/buscar", methods=["GET"])
def rota_buscar_musicas():
    termo = request.args.get("termo", "")
    id_usuario = request.args.get("id_usuario", type=int)
    resultado = buscar_musicas(termo, id_usuario)
    return resposta_consulta(resultado, "Erro ao buscar músicas")


@app.route("/musicas/favoritos", methods=["GET"])
def rota_listar_favoritos():
    id_usuario = request.args.get("id_usuario", type=int)
    resultado = listar_favoritos(id_usuario)
    return resposta_consulta(resultado, "Erro ao listar favoritos")


@app.route("/musicas/mais-ouvidas", methods=["GET"])
def rota_listar_mais_ouvidas():
    id_usuario = request.args.get("id_usuario", type=int)
    limite = request.args.get("limite", default=20, type=int)
    resultado = listar_mais_ouvidas(id_usuario, limite)
    return resposta_consulta(resultado, "Erro ao listar mais ouvidas")


@app.route("/musicas/estilo", methods=["GET"])
def rota_listar_por_estilo_nome():
    nome_estilo = request.args.get("nome", "")
    id_usuario = request.args.get("id_usuario", type=int)
    resultado = listar_por_estilo(nome_estilo, id_usuario)
    return resposta_consulta(resultado, "Erro ao listar por estilo")


@app.route("/musicas/<int:cod_musica>/favorito", methods=["PATCH"])
def rota_alternar_favorito(cod_musica):
    id_usuario = usuario_do_json()
    if id_usuario is None:
        return jsonify({"erro": "Informe id_usuario válido"}), 400
    favorito = alternar_favorito(id_usuario, cod_musica)
    if favorito is None:
        return jsonify({"erro": "Erro ao atualizar favorito"}), 503
    return jsonify({"sucesso": True, "favorito": favorito})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
