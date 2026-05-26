import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { login as apiLogin } from '../api/auth';
import type { LoginParams, User } from '../types/auth';

const TOKEN_KEY = 'resume-builder-auth-token';
const USER_KEY = 'resume-builder-auth-user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'));

  const isLoggedIn = computed(() => token.value !== null);

  async function login(params: LoginParams): Promise<void> {
    const res = await apiLogin(params);
    token.value = res.token;
    user.value = res.user;
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token, user, isLoggedIn, login, logout };
});
