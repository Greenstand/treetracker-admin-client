import { authAxios } from './httpClient';

// The keycloak build of the wallet-api. v2 sits behind an API key, which a
// browser app cannot hold, so this points at the keycloak version, which
// authorizes on the same bearer token the admin panel already sends.
const WALLET_API_ROOT = process.env.REACT_APP_WALLET_API_ROOT;

export async function getWallets({
  skip = 0,
  rowsPerPage = 25,
  search = '',
  sortBy = 'created_at',
  order = 'desc',
} = {}) {
  const params = new URLSearchParams({
    offset: skip,
    limit: rowsPerPage,
    sort_by: sortBy,
    order,
  });
  if (search && search.trim()) {
    params.append('name', search.trim());
  }

  const { data } = await authAxios.get(
    `${WALLET_API_ROOT}/admin/wallets?${params.toString()}`
  );
  return {
    wallets: data?.wallets ?? [],
    total: data?.total ?? 0,
  };
}
