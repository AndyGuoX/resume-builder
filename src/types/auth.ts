// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
