import type { LoginParams, AuthResult, UserInfo } from '../auth';

const MOCK_USER: UserInfo = {
  id: 'mock-user-1',
  email: 'test@example.com',
  name: '测试用户',
};

const MOCK_TOKEN = 'mock-token-abc123';

export async function login(params: LoginParams): Promise<AuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (params.email === 'test@example.com' && params.password === '123456') {
    return { token: MOCK_TOKEN, user: MOCK_USER };
  }
  throw { response: { data: { message: '邮箱或密码错误' } } };
}

export async function getMe(): Promise<UserInfo> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_USER;
}
