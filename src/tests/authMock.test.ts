import { describe, expect, it } from 'vitest';
import { mockLogin } from '../api/_mock/auth';

describe('mockLogin', () => {
  it('正确账号密码返回 token 和用户信息', async () => {
    const result = await mockLogin({ phone: '18800000000', password: '123456' });
    expect(result.token).toBeTruthy();
    expect(result.user.phone).toBe('18800000000');
    expect(result.user.name).toBe('测试用户');
  });

  it('错误密码抛出 401 错误', async () => {
    await expect(mockLogin({ phone: '18800000000', password: 'wrong' })).rejects.toMatchObject({
      code: 401,
      message: '手机号或密码错误',
    });
  });

  it('不存在的手机号抛出 401 错误', async () => {
    await expect(mockLogin({ phone: '13900000000', password: '123456' })).rejects.toMatchObject({
      code: 401,
      message: '手机号或密码错误',
    });
  });
});
