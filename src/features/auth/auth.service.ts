"use server";
import { api, processApiData } from "@/config/axios";
import { SignInPayload } from "./auth.interface";

export async function signIn(payload: SignInPayload) {
  // Simuler une requête d'authentification (remplacez par une vraie requête API)
  const endpoint = "/auth/login";
  const handle = api.post(endpoint, payload);
  return await processApiData(handle);
}
