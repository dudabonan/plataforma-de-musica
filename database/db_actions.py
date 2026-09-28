from .database import Database 

db = Database()

MAPA_ESTILOS_FRONTEND = {
    "Pop": ["Pop", "Pop Latino", "Pop internacional"],
    "MPB": ["MPB"],
    "Samba": ["Samba/Pagode"],
    "Rap": ["Rap/Hip Hop"],
    "R&B": ["R&B"],
    "Rock": ["Rock", "Alternativo"],
    "Trilhas": ["Filmes/Games", "Trilhas de filmes"],
}

def listar_usuarios():
    return db.executar_query(
        """SELECT id_usuario, usuario, email, nome_usuario, data_cadastro
           FROM usuario ORDER BY nome_usuario"""
    )
    
def alternar_favorito(id_usuario, cod_musica):
    resultado = db.executar_query(
        """
        INSERT INTO usuario_musica (id_um, cod_musica, favorito)
        VALUES (%s, %s, TRUE)
        ON CONFLICT (id_um, cod_musica)
        DO UPDATE
        SET favorito = NOT usuario_musica.favorito
        RETURNING favorito
        """,
        (id_usuario, cod_musica)
    )

    return resultado[0]["favorito"] if resultado else None

def registrar_acesso(id_usuario, cod_musica):
    resultado = db.executar_query(
        """INSERT INTO usuario_musica (id_um, cod_musica, qtd_acessos)
           VALUES (%s, %s, 1)
           ON CONFLICT (id_um, cod_musica)
           DO UPDATE SET qtd_acessos = usuario_musica.qtd_acessos + 1
           RETURNING qtd_acessos""",
        (id_usuario, cod_musica)
    )
    return resultado[0]["qtd_acessos"] if resultado else None

def buscar_musicas(termo, id_usuario):
    return db.executar_query(
        """SELECT m.cod_musica,
                m.nome_musica AS musica,
                m.duracao_segundos,
                STRING_AGG(DISTINCT a.nome_art, ', ') AS artista,
                STRING_AGG(DISTINCT e.nome_estilo, ', ') AS estilo,
                al.capa_url AS capa,
                COALESCE(um.favorito, FALSE) AS favorito
            FROM musica m
            LEFT JOIN album al
                ON al.id_alb = m.id_alb
            LEFT JOIN album_artista aa
                ON aa.id_alb = al.id_alb
            LEFT JOIN artista a
                ON a.cod_art = aa.cod_art
            LEFT JOIN musica_estilo me
                ON me.cod_musica = m.cod_musica
            LEFT JOIN estilo e
                ON e.id_est = me.id_est
            LEFT JOIN usuario_musica um
                ON um.cod_musica = m.cod_musica AND um.id_um = %s
            WHERE m.nome_musica ILIKE %s
            GROUP BY m.cod_musica,
                    m.nome_musica,
                    m.duracao_segundos,
                    al.capa_url,
                    um.favorito
            ORDER BY m.nome_musica""",
        (id_usuario, f"%{termo}%")
    )

def listar_favoritos(id_usuario):
    return db.executar_query(
        """SELECT m.cod_musica,
                m.nome_musica AS musica,
                m.duracao_segundos,
                STRING_AGG(DISTINCT a.nome_art, ', ') AS artista,
                STRING_AGG(DISTINCT e.nome_estilo, ', ') AS estilos,
                al.capa_url AS capa,
                TRUE AS favorito
            FROM musica m
            JOIN usuario_musica um
                ON um.cod_musica = m.cod_musica
            LEFT JOIN album al
                ON al.id_alb = m.id_alb
            LEFT JOIN album_artista aa
                ON aa.id_alb = al.id_alb
            LEFT JOIN artista a
                ON a.cod_art = aa.cod_art
            LEFT JOIN musica_estilo me
                ON me.cod_musica = m.cod_musica
            LEFT JOIN estilo e
                ON e.id_est = me.id_est
            WHERE um.id_um = %s AND um.favorito = TRUE
            GROUP BY m.cod_musica,
                m.nome_musica,
                m.duracao_segundos,
                al.capa_url
            ORDER BY m.nome_musica""",
        (id_usuario,)
    )

def listar_mais_ouvidas(id_usuario, limite=20):
    return db.executar_query(
        """SELECT m.cod_musica,
                m.nome_musica AS musica,
                m.duracao_segundos,
                STRING_AGG(DISTINCT a.nome_art, ', ') AS artista,
                STRING_AGG(DISTINCT e.nome_estilo, ', ') AS estilos,
                al.capa_url AS capa,
                um.favorito,
                um.qtd_acessos
            FROM musica m
            JOIN usuario_musica um
                ON um.cod_musica = m.cod_musica
            LEFT JOIN album al
                ON al.id_alb = m.id_alb
            LEFT JOIN album_artista aa
                ON aa.id_alb = al.id_alb
            LEFT JOIN artista a
                ON a.cod_art = aa.cod_art
            LEFT JOIN musica_estilo me
                ON me.cod_musica = m.cod_musica
            LEFT JOIN estilo e
                ON e.id_est = me.id_est
            WHERE um.id_um = %s
            GROUP BY m.cod_musica,
                m.nome_musica,
                m.duracao_segundos,
                al.capa_url,
                um.favorito,
                um.qtd_acessos
            ORDER BY um.qtd_acessos DESC
            LIMIT %s""",
        (id_usuario, limite)
    )

def listar_por_estilo(nome_estilo_frontend, id_usuario, limite=50):
    nomes_banco = MAPA_ESTILOS_FRONTEND.get(nome_estilo_frontend, [nome_estilo_frontend])
    return db.executar_query(
        """SELECT m.cod_musica,
                m.nome_musica AS musica,
                m.duracao_segundos,
                STRING_AGG(DISTINCT a.nome_art, ', ') AS artista,
                al.capa_url AS capa,
                COALESCE(SUM(um_geral.qtd_acessos), 0) AS total_acessos,
                COALESCE(um_usuario.favorito, FALSE) AS favorito
            FROM musica m
            JOIN musica_estilo me
                ON me.cod_musica = m.cod_musica
            JOIN estilo e
                ON e.id_est = me.id_est
            LEFT JOIN album al
                ON al.id_alb = m.id_alb
            LEFT JOIN album_artista aa
                ON aa.id_alb = al.id_alb
            LEFT JOIN artista a
                ON a.cod_art = aa.cod_art
            LEFT JOIN usuario_musica um_geral
                ON um_geral.cod_musica = m.cod_musica
            LEFT JOIN usuario_musica um_usuario
                ON um_usuario.cod_musica = m.cod_musica AND um_usuario.id_um = %s
            WHERE e.nome_estilo = ANY(%s)
            GROUP BY m.cod_musica,
                m.nome_musica,
                m.duracao_segundos,
                al.capa_url,
                um_usuario.favorito
            ORDER BY total_acessos DESC
            LIMIT %s""",
        (id_usuario, nomes_banco, limite)
    )
