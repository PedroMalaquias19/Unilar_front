import api from "./api";

export async function login(email: string, password: string) {
  const response = await api.post("/api/v1/auth/login", { email, password });
  return response.data; // Deve conter access_token, refresh_token e tipo de usuário
}