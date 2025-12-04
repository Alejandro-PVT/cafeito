import crypto from "crypto"

export function hashPassword(password: string): string {
  // Simple hash para desarrollo - usa PBKDF2
  return crypto.pbkdf2Sync(password, "cafeito-salt-key", 1000, 64, "sha512").toString("hex")
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  return password === storedPassword
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
