"use client"

import { createContext, useContext, useState } from "react";

const USERS = [
  { id: "1", name: "Wanessa" },
  { id: "2", name: "Maria Eduarda" },
  { id: "3", name: "David" },
];

export const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(USERS[0]);

  return (
    <UserContext.Provider value={{ user, setUser, users: USERS }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);