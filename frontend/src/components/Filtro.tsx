'use client'

interface FiltroProps {
    filtroAtivo: string;
    estiloAtivo: string;
    onFiltroChange: (filtro: string) => void;
    onEstiloChange: (estilo: string) => void;
}

export default function Filtro({ filtroAtivo, estiloAtivo, onFiltroChange, onEstiloChange }: FiltroProps) {
    const filtrosPrincipais = ['Favoritos', 'Mais Ouvidas', 'Estilo Musical'];
    const estilosMusicais = ['Pop', 'MPB', 'Samba', 'Rap', 'R&B', 'Rock', 'Trilhas'];

    const handleFiltroClick = (filtro: string) => {
        if (filtroAtivo === filtro) {
            onFiltroChange('');
            onEstiloChange('');
        } else {
            onFiltroChange(filtro);
            if (filtro !== 'Estilo Musical') {
                onEstiloChange('');
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {filtrosPrincipais.map((filtro) => {
                    const isAtivo = filtroAtivo === filtro;

                    return (
                        <button
                            key={filtro}
                            onClick={() => handleFiltroClick(filtro)}
                            className={`
                                px-4 py-1 rounded-sm border active:scale-95 transition-all duration-300
                                ${isAtivo 
                                    ? 'bg-marrom text-white border-marrom' 
                                    : 'bg-bege text-marrom border-marrom hover:bg-marfim'
                                }
                            `}
                        >
                            {filtro}
                        </button>
                    );
                })}
            </div>

            {filtroAtivo === 'Estilo Musical' && (
                <div className="flex items-center justify-center flex-wrap mt-2 gap-3 duration-300">
                    {estilosMusicais.map((estilo) => {
                        const isEstiloAtivo = estiloAtivo === estilo;

                        return (
                            <button
                                key={estilo}
                                onClick={() => onEstiloChange(isEstiloAtivo ? '' : estilo)}
                                className={`
                                    text-sm px-3 py-1 rounded-sm border transition-all duration-300
                                    ${isEstiloAtivo
                                        ? 'bg-marrom text-bege border-marrom'
                                        : 'bg-transparent text-preto border-preto/30 hover:border-marrom hover:text-marrom'
                                    }
                                `}
                            >
                                {estilo}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
