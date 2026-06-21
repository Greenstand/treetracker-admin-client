import { authAxios } from './httpClient';

const API_ROOT = process.env.REACT_APP_API_ROOT;

export async function createOrganization(payload) {
  const { data } = await authAxios.post(
    `${API_ROOT}/api/organizations`,
    payload
  );
  return data;
}

export async function updateOrganization(id, payload) {
  const { data } = await authAxios.patch(
    `${API_ROOT}/api/organizations/${id}`,
    payload
  );
  return data;
}

export async function deleteOrganization(id) {
  await authAxios.delete(`${API_ROOT}/api/organizations/${id}`);
}

// Tiebreaker appended to every sort so paging is stable.
const TIEBREAKER = 'id ASC';

export async function getOrganizations({
  skip = 0,
  rowsPerPage = 25,
  order = ['name ASC'],
  search = '',
} = {}) {
  const orderWithTiebreaker = order.includes(TIEBREAKER)
    ? order
    : [...order, TIEBREAKER];

  const filter = {
    where: { type: 'O' },
    order: orderWithTiebreaker,
    skip,
    ...(rowsPerPage > 0 && { limit: rowsPerPage }),
  };

  const params = new URLSearchParams();
  params.append('filter', JSON.stringify(filter));
  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  const { data } = await authAxios.get(
    `${API_ROOT}/api/organizations/paginated?${params.toString()}`
  );
  return {
    organizations: data?.organizations ?? [],
    total: data?.total ?? 0,
  };
}
