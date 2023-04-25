import { useEffect } from "react";
import { useAuth } from "../app/store/useAuth";

/**
 * Provider zajmuję się odebraniem objektu użytkownika z local storage,
 * natomiast jeśli accesss token jest już nie ważny to zostaje wywołana
 * funkcja do odświeżenia tokenu TYLKO jeśli refresh token znajduje się w local storage
 */
export const AuthProvider = ({ children }) => {
  useEffect(() => {
    try {
      // tokeny i data wygaśnięcia access tokena w sekundach
      const access_token = localStorage.getItem("access_token");

      // jeśli nie jakiegoś z  tokenów to wylogowanie użytkownika i zatrzymanie dalszego wykonywania
      if (!access_token) {
        useAuth.getState().logout();
        return;
      }

      useAuth.getState().getInitialUser();
    } catch (err) {
      // wylogowanie użytkownika i ostrzeżenie o nieudanej próbie pobrania użytkownika, itd.
      useAuth.getState().logout();
      console.warn("Nie udało się pobrać użytkownika");
    }
  }, []);

  return children;
};
