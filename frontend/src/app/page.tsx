'use client'

import Image from 'next/image';
import Item from "@/components/CardMusica";
import Filtro from "@/components/Filtro";
import SelectUser from "@/components/User";
import { Search, SkipBack, Pause, SkipForward } from 'lucide-react';
import { useState, useEffect } from 'react';
import { buscarMusicas, listarFavoritos, listarMaisOuvidas, listarPorEstiloNome, Musica } from '@/lib/api';

const ID_USUARIO = 1; // depois trocar pelo seletor de usuário

export default function Home() {
  const [capaAtual, setCapaAtual] = useState('/4.jpg');
  const [termo, setTermo] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('');
  const [estiloAtivo, setEstiloAtivo] = useState('');
  const [musicas, setMusicas] = useState<Musica[]>([]);

  useEffect(() => {
    if (filtroAtivo === 'Favoritos') {
      listarFavoritos(ID_USUARIO).then(setMusicas).catch(console.error);
    } else if (filtroAtivo === 'Mais Ouvidas') {
      listarMaisOuvidas(ID_USUARIO).then(setMusicas).catch(console.error);
    } else if (filtroAtivo === 'Estilo Musical' && estiloAtivo) {
      listarPorEstiloNome(estiloAtivo, ID_USUARIO).then(setMusicas).catch(console.error);
    } else if (filtroAtivo === 'Estilo Musical' && !estiloAtivo) {
      setMusicas([]);
    } else {
      buscarMusicas(termo, ID_USUARIO).then(setMusicas).catch(console.error);
    }
  }, [termo, filtroAtivo, estiloAtivo]);

  return (
    <div className="relative flex justify-center h-screen overflow-hidden p-3 font-sans">
      <SelectUser />

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
        <div className="relative flex items-center justify-center w-[50%] py-12 shrink-0">
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Procure..."
            className="w-full py-2 px-5 bg-white/90 text-sm md:text-base lg:text-lg text-preto font-normal focus:outline-none rounded-full shadow-[3px_3px_3px_rgba(86,41,36,0.15)]"
          />

          <button 
            type="button" 
            className="absolute right-1 border-l border-bege px-3 cursor-pointer"
          >
            <Search className="w-5 h-5 text-marrom" />
          </button>
        </div>

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
            {musicas.map((musica) => (
              <Item
                key={musica.cod_musica}
                codMusica={musica.cod_musica}
                idUsuario={ID_USUARIO}
                nome={musica.musica}
                artista={musica.artista}
                tempo={musica.duracao_segundos}
                estilo={musica.estilos ?? musica.estilo ?? ''}
                favoritoInicial={musica.favorito}
                // qtdAcessos={musica.qtd_acessos}
                capa={musica.capa ?? '/1.jpg'}
                tocar={() => setCapaAtual(musica.capa ?? '/1.jpg')}
              />
            ))}
          </div>
        </div>

        <div className="shrink-0 h-2 w-full" />
      </main>
    </div>
  );
}