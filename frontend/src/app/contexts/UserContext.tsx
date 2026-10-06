"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { listarUsuarios, Usuario } from "@/lib/api";

interface UserState {
  user: Usuario | null;
  setUser: (user: Usuario) => void;
  users: Usuario[];
  error: string;
  loading: boolean;
}
const UserContext = createContext<UserState | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    listarUsuarios().then((result) => {
      if (active) { setUsers(result); setUser(result[0] ?? null); }
    }).catch(() => {
      if (active) setError("Não foi possível carregar os usuários.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, users, error, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserProvider não encontrado");
  return context;
}
