import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { getToken, removeSession } from "../services/session.service";
import { clientEnv } from "./env";
import { APIResponse } from "./types";
import { redirect } from "next/navigation";

// Création d'une instance axios
export const api: AxiosInstance = axios.create({
  baseURL: clientEnv.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  async (config) => {
    // Vous pouvez ajouter des tokens d'authentification ici
    const session = await getToken();

    // On récupère le token de la session entreprise ou membre si disponible
    const token = session?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.request) {
      console.error("Erreur de requête: Pas de réponse reçue");
    }
    return Promise.reject(error);
  },
);

// un helper pour traiter les réponses API avec gestion des erreurs et redirections
export async function processApiData(
  handle: Promise<AxiosResponse>,
): Promise<APIResponse> {
  try {
    const result = await handle;
    return {
      success: true,
      data: result.data,
    };
  } catch (err) {
    const error = err as AxiosError;
    const status = error.response?.status;
    const message = error.response?.data as { error: string };
    switch (status) {
      case 401: {
        await removeSession();
        redirect("/");
      }
      default:
        return {
          success: false,
          message: message.error,
        };
    }
  }
}
