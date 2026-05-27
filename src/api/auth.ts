import request from './request';

export interface LoginParams {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  token: string;
  user: UserInfo;
}

export async function login(params: LoginParams): Promise<AuthResult> {
  const response = await request.post<AuthResult>('/auth/login', params);
  return response.data;
}

export async function getMe(): Promise<UserInfo> {
  const response = await request.get<UserInfo>('/auth/me');
  return response.data;
}
