import type { AuthResponse, LoginParams } from '../types/auth';
import { mockLogin, mockLogout } from './_mock/auth';

export function login(params: LoginParams): Promise<AuthResponse> {
  return mockLogin(params);
}

export function logout(): Promise<void> {
  return mockLogout();
}
