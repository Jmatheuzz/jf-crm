import { createContext, useEffect, useState } from "react";

// cria o contexto
export const Context = createContext();

// provider
export function Provider({ children }) {
  const [email, setEmail] = useState('');

  return (
    <Context.Provider value={{ email, setEmail }}>
      {children}
    </Context.Provider>
  );
}
