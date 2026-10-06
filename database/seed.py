import re
import requests
import unicodedata
from database import Database

db = Database()

ARTISTAS_FIXOS = [
    "Legião Urbana",
    "Djavan",
    "Gal Costa",
    "Skank",
    "Los Hermanos",
    "Capital Inicial",
    "The Beatles",
    "Queen",
    "Guns N' Roses",
    "John Lennon",
    "Nirvana",
    "BK'",
    "Djonga",
    "2ZDinizz",
    "Pirâmide Perdida",
    "Flora Matos",
    "Rihanna",
    "Beyoncé",
    "Frank Ocean",
    "Justin Timberlake",
    "The Weeknd",
    "Kendrick Lamar",
    "Belo",
    "Soweto",
    "Tá Na Mente",
    "Exaltasamba",
    "Grupo Revelação",
]

ALBUNS_ARTISTA = 3

# palavras que indicam reedição/versão repetida de um álbum já existente
PALAVRAS_EXCLUIR_ALBUM = [
    "ao vivo", "live", "acustico", "acoustic", "unplugged",
    "deluxe", "edition", "remaster", "anniversary", "collection",
    "best of", "greatest hits", "as melhores", "mais tocadas",
    "sucessos", "box", "anthology", "essential", "the best",
]

# evita repetição de artistas já inseridos no banco de dados
cache_artistas = {}


def normalizar(texto):
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return texto.strip().lower()


def titulo_base(titulo):
    titulo = titulo.split(" - ")[0]
    titulo = re.split(r"[\(\[]", titulo)[0]
    return normalizar(titulo)


def eh_album_estudio(album):
    if album.get("record_type") != "album":
        return False
    titulo_normalizado = normalizar(album["title"])
    return not any(palavra in titulo_normalizado for palavra in PALAVRAS_EXCLUIR_ALBUM)


def deduplicar_por_titulo_base(albuns):
    vistos = set()
    resultado = []
    for album in albuns:
        chave = titulo_base(album["title"])
        if chave in vistos:
            continue
        vistos.add(chave)
        resultado.append(album)
    return resultado


def buscar_artista_por_nome(nome):
    resp = requests.get("https://api.deezer.com/search/artist", params={"q": nome})
    resultados = resp.json().get("data", [])
    if not resultados:
        return None

    nome_normalizado = normalizar(nome)
    exatos = [a for a in resultados if normalizar(a["name"]) == nome_normalizado]

    if exatos:
        return max(exatos, key=lambda a: a["nb_fan"])

    print(f"  Aviso: nome exato não encontrado pra '{nome}', usando primeiro resultado: '{resultados[0]['name']}'")
    return resultados[0]


def buscar_detalhes_album(id_album_deezer):
    url_det = requests.get(f"https://api.deezer.com/album/{id_album_deezer}")
    return url_det.json()


def buscar_faixas(id_album_deezer):
    url_faixas = requests.get(f"https://api.deezer.com/album/{id_album_deezer}/tracks")
    return url_faixas.json().get("data", [])


def buscar_melhores_albuns(id_artista_deezer, quantidade):
    url_alb = requests.get(
        f"https://api.deezer.com/artist/{id_artista_deezer}/albums",
        params={"limit": 100}
    )
    todos_albuns = url_alb.json().get("data", [])

    candidatos = [a for a in todos_albuns if eh_album_estudio(a)]
    if not candidatos:
        candidatos = todos_albuns  # fallback: evita ficar sem nenhum álbum

    candidatos = deduplicar_por_titulo_base(candidatos)

    detalhes = [buscar_detalhes_album(a["id"]) for a in candidatos]
    detalhes.sort(key=lambda d: d.get("fans", 0), reverse=True)

    return detalhes[:quantidade]


def obter_criar_artista(nome):
    if nome in cache_artistas:
        return cache_artistas[nome]

    query_verificar = db.executar_query(
        """SELECT cod_art
        FROM artista
        WHERE nome_art = %s""", (nome,)
    )

    if query_verificar:
        cod_art = query_verificar[0]["cod_art"]
    else:
        query_inserir = db.executar_query(
            """INSERT INTO artista (nome_art) VALUES (%s)
            RETURNING cod_art""", (nome,)
        )
        cod_art = query_inserir[0]["cod_art"]

    cache_artistas[nome] = cod_art
    return cod_art


def inserir_album(nome_album, data_lancamento, capa_url):
    query_inserir = db.executar_query(
        """INSERT INTO album (nome_alb, data_lancamento, capa_url) VALUES (%s, %s, %s)
        RETURNING id_alb""", (nome_album, data_lancamento, capa_url)
    )
    return query_inserir[0]["id_alb"]


def vincular_artista_album(cod_art, id_alb):
    db.executar_query(
        """INSERT INTO album_artista (id_alb, cod_art) VALUES (%s, %s)""",
        (id_alb, cod_art)
    )


def obter_ou_criar_album(nome_album, data_lancamento, capa_url, cod_art):
    existente = db.executar_query(
        """SELECT a.id_alb
        FROM album a
        JOIN album_artista aa ON aa.id_alb = a.id_alb
        WHERE a.nome_alb = %s AND aa.cod_art = %s""",
        (nome_album, cod_art)
    )

    if existente:
        return existente[0]["id_alb"], True

    id_alb = inserir_album(nome_album, data_lancamento, capa_url)
    vincular_artista_album(cod_art, id_alb)
    return id_alb, False


def obter_criar_estilo(nome):
    query_verificar = db.executar_query(
        """SELECT id_est
        FROM estilo
        WHERE nome_estilo = %s""", (nome,)
    )

    if query_verificar:
        return query_verificar[0]["id_est"]

    query_inserir = db.executar_query(
        """INSERT INTO estilo (nome_estilo) VALUES (%s)
        RETURNING id_est""", (nome,)
    )
    return query_inserir[0]["id_est"]


def inserir_musica(nome, duracao_segundos, data_lancamento, id_alb):
    query_inserir = db.executar_query(
        """INSERT INTO musica (nome_musica, duracao_segundos, data_lancamento, id_alb)
            VALUES (%s, %s, %s, %s)
            RETURNING cod_musica""",
        (nome, duracao_segundos, data_lancamento, id_alb)
    )
    return query_inserir[0]["cod_musica"]


def vincular_musica_estilo(cod_musica, id_est):
    db.executar_query(
        """INSERT INTO musica_estilo (cod_musica, id_est)
            VALUES (%s, %s)""",
        (cod_musica, id_est)
    )


def popular():
    for nome_artista in ARTISTAS_FIXOS:
        artista_deezer = buscar_artista_por_nome(nome_artista)

        if not artista_deezer:
            print(f"Artista não encontrado: {nome_artista}")
            continue

        cod_art = obter_criar_artista(artista_deezer["name"])
        print(f"Artista: {artista_deezer['name']}")

        for album in buscar_melhores_albuns(artista_deezer["id"], ALBUNS_ARTISTA):
            id_alb, ja_existia = obter_ou_criar_album(
                album["title"], album.get("release_date"), album.get("cover_medium"), cod_art
            )

            if ja_existia:
                print(f"    Álbum já existe, pulando: {album['title']}")
                continue

            ids_estilo = [
                obter_criar_estilo(genero["name"])
                for genero in album.get("genres", {}).get("data", [])
            ]

            for faixa in buscar_faixas(album["id"]):
                cod_musica = inserir_musica(
                    faixa["title"],
                    faixa["duration"],
                    album.get("release_date"),
                    id_alb
                )
                for id_est in ids_estilo:
                    vincular_musica_estilo(cod_musica, id_est)

            print(f"    Álbum: {album['title']}")


if __name__ == "__main__":
    popular()