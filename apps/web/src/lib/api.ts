const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

let token: string | null = localStorage.getItem("sm_token");
export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem("sm_token", t);
  else localStorage.removeItem("sm_token");
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
