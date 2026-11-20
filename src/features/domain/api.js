import { authAxios } from '../../api/httpClient';
const root =
  process.env.REACT_APP_DOMAIN_API_ROOT || process.env.REACT_APP_API_ROOT;
export async function domainRequest(
  path,
  { method = 'GET', data, signal, params } = {}
) {
  if (!root) throw new Error('The domain API is not configured.');
  const response = await authAxios({
    url: root.replace(/\/$/, '') + '/api/admin-domain' + path,
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
