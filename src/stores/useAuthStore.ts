import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'resume-auth-v1';
const MOCK_USERNAME = 'admin';
const MOCK_PASSWORD = '123456';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref<boolean>(localStorage.getItem(STORAGE_KEY) === 'true');

  watch(isLoggedIn, (val) => {
    localStorage.setItem(STORAGE_KEY, String(val));
  });

  function login(username: string, password: string): boolean {
    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      isLoggedIn.value = true;
      return true;
    }
    return false;
  }

  function logout(): void {
    isLoggedIn.value = false;
  }

  return { isLoggedIn, login, logout };
});
