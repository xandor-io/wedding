import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET not set");
  return encoder.encode(s);
}

export type Role = "guest" | "admin";

const SITE_COOKIE = "ex_site";
const ADMIN_COOKIE = "ex_admin";

async function signToken(role: Role, ttlDays: number): Promise<string> {
  return await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttlDays}d`)
    .sign(secret());
}

export async function setSiteCookie(): Promise<void> {
  const token = await signToken("guest", 180); // 6 months
  const jar = await cookies();
  jar.set(SITE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function setAdminCookie(): Promise<void> {
  const token = await signToken("admin", 30);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function verifyToken(
  token: string | undefined
): Promise<{ role: Role } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = payload.role as Role;
    if (role !== "guest" && role !== "admin") return null;
    return { role };
  } catch {
    return null;
  }
}

// ——— for use in middleware (web-standard cookie API) ———
export async function verifyCookieHeader(
  cookieValue: string | undefined
): Promise<{ role: Role } | null> {
  return verifyToken(cookieValue);
}

export const SITE_COOKIE_NAME = SITE_COOKIE;
export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;

// ——— password check with constant-time comparison ———
export function passwordMatches(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
