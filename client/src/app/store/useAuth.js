import { create } from "zustand";
import { api } from "../api";

export const useAuth = create((set, get) => ({
  /**
   * Objekt aktualnie zalogowanego użytkownika, lub `null` jeśli użytkownik nie jest zalogowany.
   */
  currentUser: null,
  /**
   * Jest `true`, jeśli nie wiadomo czy użytkownik jest (nie) zalogowany, w przeciwnym przypadku `false`.
   */
  isLoading: true,
  /**
   * Pobiera na nowo aktualnie zalogowanego użytkownika.
   */
  getInitialUser: async () => {
    try {
      const { data } = await api.get("/auth/verify-and-get-user");
      const { user, access_token } = data;
      localStorage.setItem("access_token", access_token);
      set({ currentUser: user, isLoading: false });
    } catch (err) {
      console.warn("Nie udało się odświerzyć aktualnie zalogowanego użytkownika");
      get().logout();
    }
  },
  /**
   * Czyści wszystkie state i usuwa tokeny z local storage
   */
  logout: () => {
    set({ currentUser: null, isLoading: false });
    localStorage.removeItem("access_token");
  },
}));
