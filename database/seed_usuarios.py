
import random
from database import Database

db = Database()

USUARIOS_FIXOS = [
    {"user": "david_rabelo", "email": "david.rabelo@email.com", "password": "senha123", "nome": "David Rabelo"},
    {"user": "duda_bonan", "email": "duda.bonan@email.com", "password": "senha123", "nome": "Duda Bonan"},
    {"user": "wanessa_fernandes", "email": "wanessa.fernandes@email.com", "password": "senha123", "nome": "Wanessa Fernandes"},
    {"user": "ana_silva", "email": "ana.silva@email.com", "password": "senha123", "nome": "Ana Silva"},
    {"user": "bruno_costa", "email": "bruno.costa@email.com", "password": "senha123", "nome": "Bruno Costa"},
    {"user": "carla_souza", "email": "carla.souza@email.com", "password": "senha123", "nome": "Carla Souza"},
    {"user": "diego_lima", "email": "diego.lima@email.com", "password": "senha123", "nome": "Diego Lima"},
    {"user": "elaine_reis", "email": "elaine.reis@email.com", "password": "senha123", "nome": "Elaine Reis"},
    {"user": "felipe_alves", "email": "felipe.alves@email.com", "password": "senha123", "nome": "Felipe Alves"},
    {"user": "giovana_martins", "email": "giovana.martins@email.com", "password": "senha123", "nome": "Giovana Martins"},
    {"user": "hugo_pereira", "email": "hugo.pereira@email.com", "password": "senha123", "nome": "Hugo Pereira"},
]

CHANCE_FAVORITO = 0.2


def obter_ou_criar_usuario(usuario):
    query_verificar = db.executar_query(
        """SELECT id_usuario FROM usuario WHERE usuario = %s""", (usuario["user"],)
    )
    if query_verificar:
        return query_verificar[0]["id_usuario"]

    query_inserir = db.executar_query(
        """INSERT INTO usuario (usuario, email, password, nome_usuario)
           VALUES (%s, %s, %s, %s)
           RETURNING id_usuario""",
        (usuario["user"], usuario["email"], usuario["password"], usuario["nome"])
    )
    return query_inserir[0]["id_usuario"]


def buscar_todas_musicas():
    resultado = db.executar_query("SELECT cod_musica FROM musica")
    return [linha["cod_musica"] for linha in resultado]


def dividir_em_grupos(lista, quantidade_grupos):
    random.shuffle(lista)
    grupos = [[] for _ in range(quantidade_grupos)]
    for indice, cod_musica in enumerate(lista):
        grupos[indice % quantidade_grupos].append(cod_musica)
    return grupos


def inserir_usuario_musica(id_usuario, cod_musica):
    qtd_acessos = random.randint(1, 100)
    favorito = random.random() < CHANCE_FAVORITO

    db.executar_query(
        """INSERT INTO usuario_musica (id_um, cod_musica, qtd_acessos, favorito)
           VALUES (%s, %s, %s, %s)
           ON CONFLICT (id_um, cod_musica) DO NOTHING""",
        (id_usuario, cod_musica, qtd_acessos, favorito)
    )


def popular():
    todas_musicas = buscar_todas_musicas()
    grupos = dividir_em_grupos(todas_musicas, len(USUARIOS_FIXOS))

    for usuario, musicas_do_usuario in zip(USUARIOS_FIXOS, grupos):
        id_usuario = obter_ou_criar_usuario(usuario)
        print(f"Usuário: {usuario['nome']} ({len(musicas_do_usuario)} músicas)")

        for cod_musica in musicas_do_usuario:
            inserir_usuario_musica(id_usuario, cod_musica)


if __name__ == "__main__":
    popular()