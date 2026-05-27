import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api';
import type { UserInfo } from '../api/auth';

const TOKEN_KEY = 'auth-token';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<UserInfo | null>(null);

  const isLoggedIn = computed(() => !!token.value);

  function setAuth(newToken: string, newUser: UserInfo) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem(TOKEN_KEY, newToken);
  }

  async function login(email: string, password: string) {
    const result = await authApi.login({ email, password });
    setAuth(result.token, result.user);
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  async function initAuth() {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) return;
    try {
      const me = await authApi.getMe();
      token.value = savedToken;
      user.value = me;
    } catch {
      logout();
    }
  }

  return { token, user, isLoggedIn, login, logout, initAuth };
});
