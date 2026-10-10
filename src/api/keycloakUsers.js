import { authAxios } from './httpClient';

const API_ROOT = process.env.REACT_APP_API_ROOT;

export async function searchKeycloakUsers(search) {
  if (!search || !search.trim()) return [];

  const params = new URLSearchParams({ search: search.trim() });
  const { data } = await authAxios.get(
    `${API_ROOT}/api/keycloak-users?${params.toString()}`
  );
  return data ?? [];
}

export async function getKeycloakUser(id) {
  const { data } = await authAxios.get(`${API_ROOT}/api/keycloak-users/${id}`);
  return data;
}
