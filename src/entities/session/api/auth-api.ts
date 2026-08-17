import type { AuthTokens, User } from "../model/types";

// --- MOCK auth backend ---
// The provided endpoints have no login API, so authentication is simulated
// locally. In production these functions would call a real server that sets
// the refresh token as an HttpOnly cookie.

interface MockAccount {
  password: string;
  user: User;
}

const ACCOUNTS: Record<string, MockAccount> = {
  "admin@ntx.test": {
    password: "admin123",
    user: {
      id: "1",
      name: "Admin NTX",
      email: "admin@ntx.test",
      role: "admin",
    },
  },
  "user@ntx.test": {
    password: "user123",
    user: { id: "2", name: "User NTX", email: "user@ntx.test", role: "user" },
  },
};

// Fake token (NOT a real signed JWT — mock only, just an encoded payload)
function fakeToken(email: string, ttlSeconds: number): string {
  return btoa(
    JSON.stringify({ sub: email, exp: Date.now() + ttlSeconds * 1000 }),
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<{ tokens: AuthTokens; user: User }> {
  await delay(400); // simulate network latency
  const account = ACCOUNTS[email];
  if (!account || account.password !== password) {
    throw new Error("Invalid email or password");
  }
  return {
    user: account.user,
    tokens: {
      accessToken: fakeToken(email, 60), // short-lived: 60s
      refreshToken: fakeToken(email, 60 * 60 * 24), // long-lived: 1 day
    },
  };
}

// Simulates silent refresh. In production the browser sends the HttpOnly
// refresh cookie automatically; here we pass the mock token explicitly.
export async function refreshRequest(
  refreshToken: string,
): Promise<AuthTokens> {
  await delay(300);
  const decoded = JSON.parse(atob(refreshToken)) as {
    sub: string;
    exp: number;
  };
  if (decoded.exp < Date.now()) {
    throw new Error("Refresh token expired");
  }
  return { accessToken: fakeToken(decoded.sub, 60), refreshToken };
}
