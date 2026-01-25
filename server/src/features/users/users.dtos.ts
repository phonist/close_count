export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  date: string;
}
