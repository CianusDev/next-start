"use client";
import { User } from "@/models/user.model";
import { useEffect, useState } from "react";
import { getUsers } from "./users.service";
import { toast } from "sonner";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultErrorMessage =
    "Une erreur s'est produite lors de la récupération des utilisateurs";

  async function fetchUsers() {
    setIsLoading(true);
    setError(null);
    try {
      const { success, data, message } = await getUsers();
      if (success && data) {
        setUsers(data as User[]);
      } else {
        toast.error(message || defaultErrorMessage);
        setError(message || defaultErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, error, refetch: fetchUsers };
}
