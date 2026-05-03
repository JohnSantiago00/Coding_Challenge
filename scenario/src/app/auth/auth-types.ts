export type AuthUser = {
  id: string;
  email: string;
}

export type AuthResponse = {
  user: AuthUser;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type SignupRequest = {
  email: string;
  password: string;
}
