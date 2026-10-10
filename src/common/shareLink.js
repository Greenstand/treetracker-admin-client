const SHARE_APP_PATH = '/app.html';

function shareAppBase() {
  return (
    process.env.REACT_APP_SHARE_APP_BASE ||
    `${window.location.origin}${SHARE_APP_PATH}`
  );
}

export function buildShareAppLink({ name, id } = {}) {
  const base = shareAppBase();

  const params = new URLSearchParams();
  if (name.trim()) params.append('org_name', name);
  if (id) params.append('org_id', String(id));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
