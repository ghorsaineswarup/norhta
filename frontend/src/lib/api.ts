let csrfToken: string | null = null;

async function ensureCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/csrf-token`, {
      credentials: "include",
    });
    const data = await res.json();
    csrfToken = data.csrfToken || null;
  } catch {
    csrfToken = null;
  }

  return csrfToken;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const method = (options.method || "GET").toUpperCase();
  const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const token = mutating ? await ensureCsrfToken() : csrfToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-CSRF-Token": token } : {}),
      ...options.headers,
    },
  });

  try {
    const clone = res.clone();
    const data = await clone.json();
    if (data?.csrfToken) {
      csrfToken = data.csrfToken;
    }
  } catch {
    // not JSON, ignore
  }

  return res;
}