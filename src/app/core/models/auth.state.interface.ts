export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  base_url: string;
  user: User;
}

export interface User {
  userId: number;
  userName: string;
  email: string;
  badgeId: number;
  personId: number;
}

export interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  userData: LoginResponse | null;
  error: string | null;
}
