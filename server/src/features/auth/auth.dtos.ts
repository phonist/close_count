export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface AuthUserResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  date: string;
}
