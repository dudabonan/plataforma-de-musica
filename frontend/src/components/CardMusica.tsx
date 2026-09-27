"use client";

import Image from 'next/image';
import { Heart, Play } from 'lucide-react';
import { useState } from "react";

interface Musica {
    nome: string,
    artista: string,
    tempo: number,
    estilo: string,
    capa: string,
    tocar: () => void
}

export default function Item({ nome, artista, tempo, estilo, capa, tocar }: Musica) {
    const [fav, setFav] = useState(false);
    const [plays, setPlays] = useState(0);

    const handleTocar = () => {
        setPlays(plays + 1);
        tocar();
    };

    return (
        <div className="relative flex items-center p-4 gap-6 shrink-0 bg-marfim h-28 w-[70%] rounded-sm border border-bege shadow-[3px_3px_3px_rgba(86,41,36,0.15)]">
            <div
                onClick={handleTocar}
                className="relative bg-bege h-20 aspect-square rounded-sm active:scale-95 transition-all cursor-pointer group"
            >
                <Image
                    src={capa}
                    alt="Capa"
                    fill
                    draggable={false}
                    className="object-cover rounded-sm group-hover:brightness-50 transition duration-200"
                />
                <Play className='absolute inset-0 m-auto w-8 h-8 text-bege/80 fill-bege/90 opacity-0 group-hover:opacity-100 transition duration-200 z-10' />

                {plays > 0 && (
                    <span className="absolute -top-2 -right-2 bg-marrom text-bege font-medium text-xs px-2 py-0.5 rounded-full z-10 shadow-md">
                        {plays}x
                    </span>
                )}
            </div>
            
            <div className="flex flex-col justify-between flex-1 min-w-0">
                <div className='flex flex-col w-[85%]'>
                    <h2 className='text-preto text-lg font-semibold truncate'>{nome}</h2>
                    <h3 className='text-bege text-base font-medium truncate'>{artista}</h3>
                    <div className='flex items-center text-sm font-medium text-marrom gap-2 mt-2'>
                        <span>{Math.floor(tempo / 60)}:{(tempo % 60).toString().padStart(2, '0')}</span>
                        <span className='w-1 h-1 rounded-full bg-marrom'></span>
                        <p className='truncate'>{estilo}</p>
                    </div>
                </div>
            </div>

            <div className='absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer active:scale-95'>
                <button
                    type="button"
                    onClick={(e) => setFav(!fav)}
                    className=" flex items-center justify-center h-5 w-5 rounded-full cursor-pointer"
                >
                    <Heart 
                        className={`w-5 h-5 text-marrom transition-colors ${
                            fav ? 'fill-marrom' : 'fill-transparent'
                        }`} 
                    />
                </button>
            </div>
        </div>
    )
}