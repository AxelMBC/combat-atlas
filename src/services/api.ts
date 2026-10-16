import './api.types';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Long enough for an Azure App Service cold start in a single attempt.
const REQUEST_TIMEOUT_MS = 90_000;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: REQUEST_TIMEOUT_MS,
});

const MAX_RETRIES = 3;
const TIMEOUT_ERROR_CODES = ['ECONNABORTED', 'ETIMEDOUT'];
const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

const isTimeout = (error: AxiosError) =>
  error.code !== undefined && TIMEOUT_ERROR_CODES.includes(error.code);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };
    const isRetryable =
      !config.skipRetry && !isTimeout(error) && (!error.response || error.response.status >= 500);
    const retryCount = config._retryCount ?? 0;

    if (isRetryable && retryCount < MAX_RETRIES && config) {
      config._retryCount = retryCount + 1;
      await delay(2 ** retryCount * 300);
      return api.request(config);
    }

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
    return Promise.reject(new Error(message));
  },
);

export default api;
