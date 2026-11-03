import axios from "axios";
import type { DataResponse, MessageResponse, PageResponse, PageResult } from "@/shared/types/api";
import { clearToken, getToken } from "@/shared/api/token";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is missing. Set it in ERBS_Frontend/.env, for example http://localhost:5000/api/v1");
}

export const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const url = error.config?.url ?? "";
    const isCredentialCheck = ["/auth/login", "/auth/register", "/auth/change-password"].some((path) => url.includes(path));
    if (error.response?.status === 401 && !isCredentialCheck) {
      clearToken();
    }
    return Promise.reject(error);
  },
);

export async function getData<T>(url: string, params?: object): Promise<T> {
  const response = await api.get<DataResponse<T>>(url, { params });
  return response.data.data;
}

export async function getPage<T>(url: string, params?: object): Promise<PageResult<T>> {
  const response = await api.get<PageResponse<T>>(url, { params });
  return { items: response.data.data, meta: response.data.meta };
}

export async function sendData<T>(url: string, body?: unknown, method: "post" | "patch" = "post"): Promise<T> {
  const response = await api.request<DataResponse<T>>({ url, method, data: body });
  return response.data.data;
}

export async function sendMessage(url: string, body?: unknown, method: "post" | "patch" = "post"): Promise<string> {
  const response = await api.request<MessageResponse>({ url, method, data: body });
  return response.data.message;
}
