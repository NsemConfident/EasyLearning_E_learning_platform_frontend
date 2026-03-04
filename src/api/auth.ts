import { api, setAuthToken } from '@/api/client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student' | string;
  profile_photo: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', data);
  await setAuthToken(res.data.token);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  await setAuthToken(res.data.token);
  return res.data;
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } finally {
    await setAuthToken(null);
  }
};

export const me = async (): Promise<User> => {
  const res = await api.get<User>('/me');
  return res.data;
};

