export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = AuthUser & {
  passwordHash: string;
  createdAt: string;
};

const USERS_KEY = "echolens-users";
const SESSION_KEY = "echolens-session";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getSession(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as AuthUser | null;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function registerLocalUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists. Please sign in.");
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return saveSession({ id: user.id, name: user.name, email: user.email });
}

export async function signInLocalUser(email: string, password: string) {
  const user = readUsers().find((item) => item.email === email.trim().toLowerCase());
  if (!user || user.passwordHash !== await hashPassword(password)) {
    throw new Error("Incorrect email or password.");
  }
  return saveSession({ id: user.id, name: user.name, email: user.email });
}

export function updateLocalProfile(currentUser: AuthUser, name: string) {
  const nextName = name.trim();
  if (!nextName) throw new Error("Your name is required.");
  const users = readUsers().map((user) => user.id === currentUser.id ? { ...user, name: nextName } : user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return saveSession({ ...currentUser, name: nextName });
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
