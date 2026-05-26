import type { AuthResponse, LoginParams } from '../../types/auth';

const MOCK_ACCOUNT = { phone: '18800000000', password: '123456' };
const MOCK_TOKEN = 'mock-token-abcdef123456';
const MOCK_USER = { id: '1', name: '测试用户', phone: '18800000000' };

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(params: LoginParams): Promise<AuthResponse> {
  await delay(300);
  if (params.phone === MOCK_ACCOUNT.phone && params.password === MOCK_ACCOUNT.password) {
    return { token: MOCK_TOKEN, user: { ...MOCK_USER } };
  }
  return Promise.reject({ code: 401, message: '手机号或密码错误' });
}

export async function mockLogout(): Promise<void> {
  await delay(100);
}
