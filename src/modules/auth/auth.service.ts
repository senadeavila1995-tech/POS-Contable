import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export interface LoginResponse {
  token: string;
}

export const loginRequest = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data; // ✅ SOLO data
};

export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
  rolId: number; // 1 admin | 2 vendedor
}

export const registerRequest = async (
  data: RegisterDTO
): Promise<void> => {
  await api.post("/auth/register", data);
};
