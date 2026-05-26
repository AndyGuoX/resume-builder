import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../stores/useAuthStore';

// mock api/auth 模块
vi.mock('../api/auth', () => ({
  login: vi.fn(async ({ phone, password }: { phone: string; password: string }) => {
    if (phone === '18800000000' && password === '123456') {
      return { token: 'mock-token', user: { id: '1', name: '测试用户', phone: '18800000000' } };
    }
    throw { code: 401, message: '手机号或密码错误' };
  }),
  logout: vi.fn(async () => {}),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('初始状态：未登录', () => {
    const store = useAuthStore();
    expect(store.isLoggedIn).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
  });

  it('登录成功后 isLoggedIn 为 true，token 和 user 被写入', async () => {
    const store = useAuthStore();
    await store.login({ phone: '18800000000', password: '123456' });
    expect(store.isLoggedIn).toBe(true);
    expect(store.token).toBe('mock-token');
    expect(store.user?.phone).toBe('18800000000');
  });

  it('登录成功后 token 持久化到 localStorage', async () => {
    const store = useAuthStore();
    await store.login({ phone: '18800000000', password: '123456' });
    expect(localStorage.getItem('resume-builder-auth-token')).toBe('mock-token');
  });

  it('登录失败时抛出错误，状态不变', async () => {
    const store = useAuthStore();
    await expect(store.login({ phone: '18800000000', password: 'wrong' })).rejects.toMatchObject({
      code: 401,
    });
    expect(store.isLoggedIn).toBe(false);
  });

  it('logout 后清空状态和 localStorage', async () => {
    const store = useAuthStore();
    await store.login({ phone: '18800000000', password: '123456' });
    store.logout();
    expect(store.isLoggedIn).toBe(false);
    expect(store.token).toBeNull();
    expect(localStorage.getItem('resume-builder-auth-token')).toBeNull();
  });

  it('从 localStorage 恢复登录状态', () => {
    localStorage.setItem('resume-builder-auth-token', 'saved-token');
    localStorage.setItem(
      'resume-builder-auth-user',
      JSON.stringify({ id: '1', name: '测试用户', phone: '18800000000' }),
    );
    const store = useAuthStore();
    expect(store.isLoggedIn).toBe(true);
    expect(store.token).toBe('saved-token');
  });
});
