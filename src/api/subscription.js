import { authAxios } from './httpClient';

const API_ROOT = process.env.REACT_APP_API_ROOT;

export async function createSubscriptionSession(organizationId, returnUrl) {
  const {
    data,
  } = await authAxios.post(
    `${API_ROOT}/api/organizations/${organizationId}/subscription/session`,
    null,
    { params: { returnUrl } }
  );
  return data;
}

export async function getSubscription(organizationId, sessionId) {
  const {
    data,
  } = await authAxios.get(
    `${API_ROOT}/api/organizations/${organizationId}/subscription`,
    { params: sessionId ? { session_id: sessionId } : undefined }
  );
  return data;
}
