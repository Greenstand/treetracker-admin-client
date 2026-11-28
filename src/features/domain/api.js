import { authAxios } from '../../api/httpClient';
const root =
  process.env.REACT_APP_DOMAIN_API_ROOT || process.env.REACT_APP_API_ROOT;
let developmentRoot;
async function configuredRoot() {
  if (
    process.env.NODE_ENV !== 'development' ||
    !['127.0.0.1', 'localhost'].includes(window.location.hostname)
  )
    return root;
  if (!developmentRoot)
    developmentRoot = fetch('/domain-api-config.local.json', {
      cache: 'no-store',
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((config) => {
        if (!config?.domainApiRoot) return root;
        const url = new URL(config.domainApiRoot);
        if (
          !['127.0.0.1', 'localhost'].includes(url.hostname) ||
          url.protocol !== 'http:' ||
          url.username ||
          url.password ||
          url.search ||
          url.hash
        )
          throw new Error(
            'Local domain API configuration must use a loopback HTTP address.'
          );
        return url.origin;
      })
      .catch(() => root);
  return developmentRoot;
}
export async function domainRequest(
  path,
  { method = 'GET', data, signal, params } = {}
) {
  const configured = await configuredRoot();
  if (!configured) throw new Error('The domain API is not configured.');
  const response = await authAxios({
    url: configured.replace(/\/$/, '') + '/api/admin-domain' + path,
    method,
    data,
    signal,
    params,
  });
  return response.data;
}
export function errorMessage(error) {
  return typeof error?.response?.data?.error === 'string'
    ? error.response.data.error
    : error?.message || 'Could not complete this operation.';
}
