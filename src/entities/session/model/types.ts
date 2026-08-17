export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  // assume an HttpOnly cookie set by the backend and is
  // never exposed to JS. Kept here only to simulate the refresh flow.
  refreshToken: string;
}
