import { Platform } from 'react-native';

type Store = {
  set: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  remove: (key: string) => Promise<void>;
};

// Respaldo en memoria: funciona siempre, pero se pierde al cerrar la app.
const memory: Record<string, string> = {};
const memoryStore: Store = {
  set: async (key, value) => {
    memory[key] = value;
  },
  get: async (key) => memory[key] ?? null,
  remove: async (key) => {
    delete memory[key];
  },
};

function createStore(): Store {
  if (Platform.OS === 'web') {
    return {
      set: async (key, value) => localStorage.setItem(key, value),
      get: async (key) => localStorage.getItem(key),
      remove: async (key) => localStorage.removeItem(key),
    };
  }

  // En celular intentamos usar SecureStore. Si el módulo nativo no existe
  // en tu Expo Go, no se rompe la app: se usa el respaldo en memoria.
  try {
    const SecureStore = require('expo-secure-store');
    if (SecureStore && typeof SecureStore.setItemAsync === 'function') {
      return {
        set: (key, value) => SecureStore.setItemAsync(key, value),
        get: (key) => SecureStore.getItemAsync(key),
        remove: (key) => SecureStore.deleteItemAsync(key),
      };
    }
  } catch {
    console.warn('SecureStore no disponible: se guarda la sesión solo en memoria.');
  }
  return memoryStore;
}

const store = createStore();

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

export async function saveSession(accessToken: string, refreshToken: string) {
  await store.set(ACCESS_TOKEN, accessToken);
  await store.set(REFRESH_TOKEN, refreshToken);
}

export async function getAccessToken() {
  return store.get(ACCESS_TOKEN);
}

export async function getRefreshToken() {
  return store.get(REFRESH_TOKEN);
}

export async function clearSession() {
  await store.remove(ACCESS_TOKEN);
  await store.remove(REFRESH_TOKEN);
}