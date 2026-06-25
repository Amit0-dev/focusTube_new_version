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
    const data = await response.json();
    throw new Error(data.error || 'API request failed');
  }

  return response.json();
}
