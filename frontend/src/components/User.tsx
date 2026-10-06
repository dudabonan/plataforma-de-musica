"use client"

import { useState } from "react";
import { useUser } from "@/app/contexts/UserContext";

export default function SelectUser() {
  const { user, setUser, users, loading, error } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-6 left-6 z-50">
      <button
        disabled={loading || !users.length}
        onClick={() => setOpen(!open)}
        className="flex items-center bg-bege text-preto px-4 py-2 rounded-full gap-2 border border-bege/20 inset-shadow-sm active:scale-95 transition-all"
      >
        {user?.nome_usuario ?? (loading ? "Carregando..." : "Sem usuários")}
      </button>
      {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}

      {open && (
        <div className="absolute mt-2 min-w-40 bg-bege rounded-md overflow-hidden inset-shadow-xs border border-bege/20">
          {users.map((u) => (
            <button
              key={u.id_usuario}
              onClick={() => {
                setUser(u);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-preto hover:bg-marfim/50"
            >
              {u.nome_usuario}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
