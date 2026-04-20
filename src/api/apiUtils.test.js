import { getOrganization, getOrganizationId } from './apiUtils';
import { session } from '../models/auth';
import { getUserFromToken, isKeycloakConfigured } from '../auth/keycloak';

jest.mock('../auth/keycloak', () => ({
  getUserFromToken: jest.fn(),
  isKeycloakConfigured: jest.fn(),
}));

describe('apiUtils organization helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
    session.user = undefined;
  });

  it('uses live keycloak user organization id when keycloak is configured', () => {
    isKeycloakConfigured.mockReturnValue(true);
    getUserFromToken.mockReturnValue({
      id: 'user-1',
      policy: {
        organization: { id: 3474 },
      },
    });
    session.user = {
      policy: {
        organization: { id: 12 },
      },
    };

    expect(getOrganizationId()).toBe(3474);
    expect(getOrganization()).toBe('organization/3474/');
  });

  it('falls back to session user when keycloak user is unavailable', () => {
    isKeycloakConfigured.mockReturnValue(true);
    getUserFromToken.mockReturnValue({});
    session.user = {
      policy: {
        organization: { id: 12 },
      },
    };

    expect(getOrganizationId()).toBe(12);
    expect(getOrganization()).toBe('organization/12/');
  });
});
