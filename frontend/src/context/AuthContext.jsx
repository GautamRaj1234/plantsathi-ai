import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("plantsathi_token"));
  const [loading, setLoading] = useState(true);

  // On first load, if we have a saved token, verify it's still valid and restore the session.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        // token expired or invalid — clear it
        localStorage.removeItem("plantsathi_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("plantsathi_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("plantsathi_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("plantsathi_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
