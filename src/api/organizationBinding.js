import { authAxios } from './httpClient';

const API_ROOT = process.env.REACT_APP_API_ROOT;

export async function requestBinding(organizationId) {
  const { data } = await authAxios.post(
    `${API_ROOT}/api/organizations/${organizationId}/binding-requests`
  );
  return data;
}

export async function getMyBinding() {
  const { data } = await authAxios.get(
    `${API_ROOT}/api/organizations/binding-requests/me`
  );
  return data;
}

export async function getPendingBindings({ skip = 0, limit = 10 } = {}) {
  const { data } = await authAxios.get(
    `${API_ROOT}/api/organizations/binding-requests`,
    {
      params: { skip, limit },
    }
  );
  return { total: data?.total ?? 0, requests: data?.requests ?? [] };
}

export async function approveBinding(userId) {
  const { data } = await authAxios.post(
    `${API_ROOT}/api/organizations/binding-requests/${userId}/approve`
  );
  return data;
}

export async function rejectBinding(userId) {
  const { data } = await authAxios.post(
    `${API_ROOT}/api/organizations/binding-requests/${userId}/reject`
  );
  return data;
}
