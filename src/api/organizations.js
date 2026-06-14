import { authAxios } from './httpClient';

const API_ROOT = process.env.REACT_APP_API_ROOT;

export async function createOrganization(payload) {
  const { data } = await authAxios.post(
    `${API_ROOT}/api/organizations`,
    payload
  );
  return data;
}

export async function getOrganizations({
  skip = 0,
  rowsPerPage = 25,
  orderBy = 'name',
  order = 'ASC',
} = {}) {
  const params = new URLSearchParams();
  params.append('filter[order]', `${orderBy} ${order}`);
  params.append('filter[where][type]', 'O');
  params.append('filter[skip]', skip);
  // rowsPerPage <= 0 means "All" (MUI uses -1), so omit the limit to fetch all.
  if (rowsPerPage > 0) {
    params.append('filter[limit]', rowsPerPage);
  }

  const { data } = await authAxios.get(
    `${API_ROOT}/api/organizations/paginated?${params.toString()}`
  );
  // Dedicated endpoint returns `{ organizations, total }`; `total` reflects the
  // same `where` filter (ignoring skip/limit) for pagination.
  return {
    organizations: data?.organizations ?? [],
    total: data?.total ?? 0,
  };
}
