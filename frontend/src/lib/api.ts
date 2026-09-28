export interface Usuario {
  id_usuario: number;
  usuario: string;
  email: string;
  nome_usuario: string;
  data_cadastro?: string;
  name?: string;
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

export async function listarUsuarios(): Promise<Usuario[]> {
  const resp = await fetch(`${API_URL}/usuarios`);
  if (!resp.ok) throw new Error("Erro ao listar usuários");
  return resp.json();
}

export async function buscarMusicas(termo: string, idUsuario: number): Promise<Musica[]> {
  const resp = await fetch(
    `${API_URL}/musicas/buscar?termo=${encodeURIComponent(termo)}&id_usuario=${idUsuario}`
  );
  if (!resp.ok) throw new Error("Erro ao buscar músicas");
  return resp.json();
}

export async function listarFavoritos(idUsuario: number): Promise<Musica[]> {
  const resp = await fetch(`${API_URL}/musicas/favoritos?id_usuario=${idUsuario}`);
  if (!resp.ok) throw new Error("Erro ao listar favoritos");
  return resp.json();
}

export async function listarMaisOuvidas(idUsuario: number): Promise<Musica[]> {
  const resp = await fetch(`${API_URL}/musicas/mais-ouvidas?id_usuario=${idUsuario}`);
  if (!resp.ok) throw new Error("Erro ao listar mais ouvidas");
  return resp.json();
}

export async function listarPorEstiloNome(nomeEstilo: string, idUsuario: number): Promise<Musica[]> {
  const resp = await fetch(
    `${API_URL}/musicas/estilo?nome=${encodeURIComponent(nomeEstilo)}&id_usuario=${idUsuario}`
  );
  if (!resp.ok) throw new Error("Erro ao listar por estilo");
  return resp.json();
}

export async function alternarFavorito(codMusica: number, idUsuario: number): Promise<{ sucesso: boolean; favorito?: boolean }> {
  const resp = await fetch(`${API_URL}/musicas/${codMusica}/favorito`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: idUsuario }),
  });
  if (!resp.ok) throw new Error("Erro ao favoritar");
  return resp.json();
}

export async function registrarAcesso(codMusica: number, idUsuario: number): Promise<{ sucesso: boolean; qtd_acessos?: number }> {
  const resp = await fetch(`${API_URL}/musicas/${codMusica}/acesso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: idUsuario }),
  });
  if (!resp.ok) throw new Error("Erro ao registrar acesso");
  return resp.json();
}