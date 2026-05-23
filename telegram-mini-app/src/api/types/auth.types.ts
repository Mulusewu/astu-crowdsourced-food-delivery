import { type User } from "@/types/user.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}
