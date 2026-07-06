const DEFAULT_SHARE_APP_BASE = 'https://greenstand.org';

export function buildShareAppLink({ name, id } = {}) {
  const base = DEFAULT_SHARE_APP_BASE;

  const params = new URLSearchParams();
  if (name.trim()) params.append('org_name', name);
  if (id) params.append('org_id', String(id));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
