from flask import Flask, request, jsonify
from flask_cors import CORS 
from database.db_actions import (
    marcar_favorito,
    alternar_favorito, 
    buscar_musicas,
    listar_favoritos,
    listar_mais_ouvidas,
    listar_por_estilo,
)

app = Flask(__name__)
app.json.ensure_ascii = False
CORS(app)

@app.route("/musicas/buscar", methods=["GET"])
def rota_buscar_musicas():
    termo = request.args.get("termo", "")
    id_usuario = request.args.get("id_usuario", type=int)
    resultado = buscar_musicas(termo, id_usuario)
    return jsonify(resultado)


@app.route("/musicas/favoritos", methods=["GET"])
def rota_listar_favoritos():
    id_usuario = request.args.get("id_usuario", type=int)
    resultado = listar_favoritos(id_usuario)
    return jsonify(resultado)


@app.route("/musicas/mais-ouvidas", methods=["GET"])
def rota_listar_mais_ouvidas():
    id_usuario = request.args.get("id_usuario", type=int)
    limite = request.args.get("limite", default=20, type=int)
    resultado = listar_mais_ouvidas(id_usuario, limite)
    return jsonify(resultado)


@app.route("/musicas/estilo", methods=["GET"])
def rota_listar_por_estilo_nome():
    nome_estilo = request.args.get("nome", "")
    id_usuario = request.args.get("id_usuario", type=int)
    resultado = listar_por_estilo(nome_estilo, id_usuario)
    return jsonify(resultado)


@app.route("/musicas/<int:cod_musica>/favorito", methods=["PATCH"])
def rota_alternar_favorito(cod_musica):
    id_usuario = request.json.get("id_usuario")
    alternar_favorito(id_usuario, cod_musica)
    return jsonify({"sucesso": True})


if __name__ == "__main__":
    app.run(debug=True, port=5000)