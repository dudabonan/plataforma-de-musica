export interface Usuario {
  id_usuario: number;
  usuario: string;
  email: string;
  nome_usuario: string;
  data_cadastro?: string;
}

export interface Musica {
  cod_musica: number;
  musica: string;
  duracao_segundos: number;
  artista: string;
  estilo?: string;
  estilos?: string;
  capa: string | null;
  favorito: boolean;
  qtd_acessos?: number;
  total_acessos?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function consultarApi<T>(caminho: string, mensagemErro: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_URL}${caminho}`, options);
  if (!resp.ok) throw new Error(mensagemErro);
  return resp.json();
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return consultarApi("/usuarios", "Erro ao listar usuários");
}

export async function buscarMusicas(termo: string, idUsuario: number): Promise<Musica[]> {
  return consultarApi(
    `/musicas/buscar?termo=${encodeURIComponent(termo)}&id_usuario=${idUsuario}`,
    "Erro ao buscar músicas"
  );
}

export async function listarFavoritos(idUsuario: number): Promise<Musica[]> {
  return consultarApi(`/musicas/favoritos?id_usuario=${idUsuario}`, "Erro ao listar favoritos");
}

export async function listarMaisOuvidas(idUsuario: number): Promise<Musica[]> {
  return consultarApi(`/musicas/mais-ouvidas?id_usuario=${idUsuario}`, "Erro ao listar mais ouvidas");
}

export async function listarPorEstiloNome(nomeEstilo: string, idUsuario: number): Promise<Musica[]> {
  return consultarApi(
    `/musicas/estilo?nome=${encodeURIComponent(nomeEstilo)}&id_usuario=${idUsuario}`,
    "Erro ao listar por estilo"
  );
}

export async function alternarFavorito(codMusica: number, idUsuario: number): Promise<{ sucesso: boolean; favorito: boolean }> {
  return consultarApi(`/musicas/${codMusica}/favorito`, "Erro ao favoritar", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: idUsuario }),
  });
}

export async function registrarAcesso(codMusica: number, idUsuario: number): Promise<{ sucesso: boolean; qtd_acessos: number }> {
  return consultarApi(`/musicas/${codMusica}/acesso`, "Erro ao registrar acesso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: idUsuario }),
  });
}
