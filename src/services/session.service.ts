"use server";
import { SessionPayload } from "@/config/types";
import {
  deleteSession,
  updateSession,
  verifySession,
  createSession,
} from "../config/session";

export async function getToken() {
  const session = await verifySession();
  return {
    token: session?.token,
  };
}

export async function addSession(payload: SessionPayload) {
  try {
    const result = await createSession(payload);
    return result;
  } catch {
    return false;
  }
}

export async function refreshSession(payload: Partial<SessionPayload>) {
  try {
    const result = await updateSession(payload);
    return result;
  } catch {
    return false;
  }
}

export async function removeSession() {
  try {
    await deleteSession();
    return true;
  } catch {
    return false;
  }
}
