export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}
