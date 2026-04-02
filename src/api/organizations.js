import { authAxios } from './httpClient';

const API_ROOT = process.env.REACT_APP_API_ROOT;

export async function createOrganization(payload) {
  4;
  try {
    const { data } = await authAxios.post(
      `${API_ROOT}/api/organizations`,
      payload
    );
    return data;
  } catch (e) {
    console.log('e', e);
    throw e;
  }
}
