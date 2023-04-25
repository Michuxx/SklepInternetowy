import axios from "axios";
import { useAuth } from "../store/useAuth";

// główny fetcher dzięki któremu pobieramy dane z serwera
export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
});

// request interceptor - czyli akcje które odbywają się przed wysłaniem każdego zapytania
api.interceptors.request.use(
  function (config) {
    // jeśli w local storage znajduje się access token to zostaje on dodany do zapytania
    // w headerze 'Authorization'
    const access_token = localStorage.getItem("access_token");
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;

    return config;
  },
  function (error) {
    // akcja, która odbywa się podczas błędu przed wysłaniem zapytania
    return Promise.reject(error);
  }
);

// response interceptor - czyli akcje, które odbywają się po odebraniu każdego zapytania
api.interceptors.response.use(
  async function (response) {
    // odbieranie tokenów, itd.
    const { user, access_token } = response.data;
    const url = response.request.responseURL;

    // jeśli access_token został przekazany to zostaje on dodany do local storage
    // oraz dekodowany jest z niego użytkownik, który jest aktualizowany w
    // 'useAuth' state. Więc jeśli np. po aktualizacji danych użytkownika
    // jeśli został w odpowiedzi przekazany access token to automatycznie
    // state z aktualnym użytkownikiem zostanie zaktualizowany.
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }

    if (user && ["login", "register", "verify-and-get-user"].some((path) => url.endsWith(path))) {
      useAuth.setState({ currentUser: user });
    }

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
