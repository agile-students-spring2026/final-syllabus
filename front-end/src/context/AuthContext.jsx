import { createContext, useContext, useState } from "react";

const STORAGE_KEY = "syllabus_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    return {
      user: parsed?.user ?? null,
      token: parsed?.token ?? null,
    };
  } catch {
    return { user: null, token: null };
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const initial =
    typeof window !== "undefined" ? readStoredAuth() : { user: null, token: null };
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);

  function login(userData, authToken) {
    setUser(userData);
    setToken(authToken);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: authToken }));
    } catch {
      /* ignore quota / private mode */
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
