export async function fetchPublicEvents({ page = 1, limit = 20, category = '', search = '' } = {}) {
  try {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (category) params.set('category', category);
    if (search) params.set('search', search);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4010'}/api/events?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    const payload = await res.json();
    return payload;
  } catch (err) {
    return { data: [] };
  }
}
