CREATE TABLE usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nome_usuario VARCHAR(100) NOT NULL,
    data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE artista (
    cod_art INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_art VARCHAR(255) NOT NULL,
    pais_origem VARCHAR(50)
);

CREATE TABLE album (
    id_alb INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_alb VARCHAR(255) NOT NULL,
    capa_url VARCHAR(500),
    data_lancamento DATE
);

CREATE TABLE album_artista (
    id_alb INTEGER NOT NULL,
    cod_art INTEGER NOT NULL,
    PRIMARY KEY (id_alb, cod_art),
    FOREIGN KEY (id_alb) REFERENCES album (id_alb) ON DELETE CASCADE,
    FOREIGN KEY (cod_art) REFERENCES artista (cod_art) ON DELETE CASCADE
);

CREATE TABLE musica (
    cod_musica INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_musica VARCHAR(255) NOT NULL,
    duracao_segundos INTEGER NOT NULL CHECK (duracao_segundos > 0),
    data_lancamento DATE,
    id_alb INTEGER,
    FOREIGN KEY (id_alb) REFERENCES album (id_alb) ON DELETE SET NULL
);

CREATE TABLE estilo (
    id_est INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_estilo VARCHAR(50) NOT NULL,
    descricao VARCHAR(255)
);

CREATE TABLE musica_estilo (
    cod_musica INTEGER NOT NULL,
    id_est INTEGER NOT NULL,
    PRIMARY KEY (cod_musica, id_est),
    FOREIGN KEY (cod_musica) REFERENCES musica (cod_musica) ON DELETE CASCADE,
    FOREIGN KEY (id_est) REFERENCES estilo (id_est) ON DELETE CASCADE
);

CREATE TABLE usuario_musica (
    id_um INTEGER NOT NULL,
    cod_musica INTEGER NOT NULL,
    qtd_acessos INTEGER NOT NULL DEFAULT 0 CHECK (qtd_acessos >= 0),
    favorito BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_um, cod_musica),
    FOREIGN KEY (id_um) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (cod_musica) REFERENCES musica (cod_musica) ON DELETE CASCADE
);