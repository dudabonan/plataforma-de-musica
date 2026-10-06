'use client'

import Image from 'next/image';
import Item from "@/components/CardMusica";
import Filtro from "@/components/Filtro";
import { Search, SkipBack, Pause, SkipForward } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { buscarMusicas, listarFavoritos, listarMaisOuvidas, listarPorEstiloNome, registrarAcesso, Musica } from '@/lib/api';
import { useUser } from './contexts/UserContext';


export default function Home() {
  const { user } = useUser();
  const idUsuario = user?.id_usuario;
  const currentUser = useRef(idUsuario);
  useEffect(() => { currentUser.current = idUsuario; }, [idUsuario]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [capaAtual, setCapaAtual] = useState('/4.jpg');
  const [termo, setTermo] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('');
  const [estiloAtivo, setEstiloAtivo] = useState('');
  const [musicas, setMusicas] = useState<Musica[]>([]);

  useEffect(() => {
    let active = true;
    setMusicas([]); setError('');
    if (!idUsuario || (filtroAtivo === 'Estilo Musical' && !estiloAtivo)) {
      setLoading(false); return;
    }
    setLoading(true);
    const promise = filtroAtivo === 'Favoritos' ? listarFavoritos(idUsuario)
      : filtroAtivo === 'Mais Ouvidas' ? listarMaisOuvidas(idUsuario)
      : filtroAtivo === 'Estilo Musical' ? listarPorEstiloNome(estiloAtivo, idUsuario)
      : buscarMusicas(termo, idUsuario);
    promise.then((result) => { if (active) setMusicas(result); })
      .catch(() => { if (active) setError('Não foi possível carregar as músicas.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [termo, filtroAtivo, estiloAtivo, idUsuario]);

  const selecionarMusica = async (musica: Musica) => {
    if (!idUsuario) return;
    const result = await registrarAcesso(musica.cod_musica, idUsuario);
    if (currentUser.current !== idUsuario) return;
    setCapaAtual(musica.capa ?? '/1.jpg');
    setMusicas((current) => current.map((m) => m.cod_musica === musica.cod_musica
      ? { ...m, qtd_acessos: result.qtd_acessos } : m));
  };

  return (
    <div className="relative flex justify-center h-screen overflow-hidden p-3 font-sans">

      <div className="relative w-[25%] bg-marfim p-8 z-0 shadow-[-12px_0px_20px_3px_rgba(86,41,36,0.25)]" />
        <div className="absolute left-[25%] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex items-center">
          <div className="relative flex items-center">
            
            <div className="absolute left-[45%] w-88 h-88 rounded-full bg-[#1c1c1c] shadow-2xl flex items-center justify-center">
              <div className="absolute w-[90%] h-[90%] rounded-full border border-white/10" />
              <div className="absolute w-[75%] h-[75%] rounded-full border border-white/5" />
              <div className="absolute w-[60%] h-[60%] rounded-full border border-white/10" />
              
              <div className="w-28 h-28 bg-bege rounded-full border-4 border-[#1c1c1c] flex items-center justify-center shadow-inner">
                <div className="w-4 h-4 bg-preto rounded-full" />
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center gap-8 z-10 w-96 py-6 rounded-lg shadow-[3px_3px_15px_4px_rgba(0,0,0,0.3)] bg-marrom overflow-hidden border border-marfim/50">
              <div className="relative w-[90%] h-76 rounded-sm bg-bege overflow-hidden">
                  <Image
                    src={capaAtual}
                    alt="Capa"
                    fill
                    className="w-full h-full object-cover"
                  />
              </div>

              <div className="relative flex items-center justify-center w-full">
                <div className="w-[80%] h-0.5 bg-bege rounded-full" />
                <div className="absolute left-[25%] w-3 h-3 bg-bege rounded-full" />
                <div className="absolute left-[10%] w-[18%] h-1 bg-bege rounded-full" />
              </div>

              <div className="flex items-center justify-center w-full gap-8 ">
                <SkipBack className="text-bege fill-bege" />
                <div className="text-bege fill-transparent bg-bege py-1 px-2 rounded-full">
                  <Pause className="text-bege fill-marrom w-6 h-auto" />
                </div>
                <SkipForward className="text-bege fill-bege" />
              </div>
            </div>

          </div>
      </div>

      <main className="flex flex-1 flex-col items-center h-full pl-76 z-0 shadow-[12px_0px_20px_3px_rgba(86,41,36,0.25)]">
        <form onSubmit={(e) => {
          e.preventDefault(); setFiltroAtivo(''); setEstiloAtivo('');
        }} className="relative flex items-center justify-center w-[50%] py-12 shrink-0">
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Procure..."
            className="w-full py-2 px-5 bg-white/90 text-sm md:text-base lg:text-lg text-preto font-normal focus:outline-none rounded-full shadow-[3px_3px_3px_rgba(86,41,36,0.15)]"
          />

          <button 
            type="submit"
            aria-label="Buscar músicas"
            className="absolute right-1 border-l border-bege px-3 cursor-pointer"
          >
            <Search className="w-5 h-5 text-marrom" />
          </button>
        </form>

        <div className="pb-12 shrink-0">
          <Filtro
            filtroAtivo={filtroAtivo}
            estiloAtivo={estiloAtivo}
            onFiltroChange={setFiltroAtivo}
            onEstiloChange={setEstiloAtivo}
          />
        </div>

        <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto scroll-personalizado pb-4 pl-1">
          <div className="flex gap-4 items-center justify-center flex-col w-full">
            {loading && <p role="status">Carregando músicas...</p>}
            {error && <p role="alert" className="text-red-700">{error}</p>}
            {!loading && !error && idUsuario && !musicas.length && <p>Nenhuma música encontrada.</p>}
            {musicas.map((musica) => (
              <Item
                key={`${idUsuario}-${musica.cod_musica}`}
                codMusica={musica.cod_musica}
                idUsuario={idUsuario!}
                nome={musica.musica}
                artista={musica.artista}
                tempo={musica.duracao_segundos}
                estilo={musica.estilos ?? musica.estilo ?? ''}
                favoritoInicial={musica.favorito}
                qtdAcessos={musica.qtd_acessos ?? 0}
                onFavorito={(favorito) => {
                  if (currentUser.current !== idUsuario) return;
                  setMusicas((current) => filtroAtivo === 'Favoritos' && !favorito
                    ? current.filter((m) => m.cod_musica !== musica.cod_musica)
                    : current.map((m) => m.cod_musica === musica.cod_musica ? { ...m, favorito } : m));
                }}
                capa={musica.capa ?? '/1.jpg'}
                tocar={() => selecionarMusica(musica)}
              />
            ))}
          </div>
        </div>

        <div className="shrink-0 h-2 w-full" />
      </main>
    </div>
  );
}
