export {};

declare module 'axios' {
  interface AxiosRequestConfig {
    skipRetry?: boolean;
  }
}
