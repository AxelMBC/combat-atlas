import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
});

const MAX_RETRIES = 3;
const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };
    const isRetryable = !error.response || error.response.status >= 500;
    const retryCount = config._retryCount ?? 0;

    if (isRetryable && retryCount < MAX_RETRIES && config) {
      config._retryCount = retryCount + 1;
      await delay(2 ** retryCount * 300);
      return api.request(config);
    }

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;
    return Promise.reject(new Error(message));
  }
);

export default api;
