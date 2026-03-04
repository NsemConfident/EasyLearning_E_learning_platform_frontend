import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use your computer's LAN IP when testing on a physical device (Expo Go).
// Use 10.0.2.2:8000 only when running in Android emulator.
const API_BASE_URL = 'http://192.168.0.108:8000/api';

let authToken: string | null = null;

export const setAuthToken = async (token: string | null) => {
  authToken = token;
  if (token) {
    await SecureStore.setItemAsync('authToken', token);
  } else {
    await SecureStore.deleteItemAsync('authToken');
  }
};

export const loadStoredToken = async () => {
  authToken = await SecureStore.getItemAsync('authToken');
  return authToken;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(config => {
  if (authToken) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    };
  }
  return config;
});

