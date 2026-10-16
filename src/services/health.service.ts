import api from './api';

export const pingHealth = async (): Promise<void> => {
  await api.get('/health', { skipRetry: true });
};
