describe('keycloak bootstrap', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  function mockKeycloakModule(instanceFactory) {
    jest.doMock('keycloak-js', () => {
      return jest.fn().mockImplementation(instanceFactory);
    });
  }

  it('returns unauthenticated when keycloak is not configured', async () => {
    delete process.env.REACT_APP_KEYCLOAK_URL;
    delete process.env.REACT_APP_KEYCLOAK_REALM;
    delete process.env.REACT_APP_KEYCLOAK_CLIENT_ID;

    mockKeycloakModule(() => ({}));
    const { getBootstrapAuthState } = require('./keycloak');

    await expect(getBootstrapAuthState()).resolves.toEqual({
      authenticated: false,
      token: undefined,
      user: undefined,
    });
  });

  it('returns authenticated bootstrap state when session exists', async () => {
    process.env.REACT_APP_KEYCLOAK_URL = 'https://kc.local/keycloak';
    process.env.REACT_APP_KEYCLOAK_REALM = 'master';
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID = 'treetracker-admin-client';

    const init = jest.fn().mockResolvedValue(true);
    mockKeycloakModule(() => ({
      init,
      token: 'access-token',
      tokenParsed: {
        sub: 'user-1',
        preferred_username: 'admin',
        email: 'admin@example.com',
        realm_access: { roles: ['super_permission'] },
      },
    }));

    const { getBootstrapAuthState } = require('./keycloak');
    const result = await getBootstrapAuthState();

    expect(result.authenticated).toBe(true);
    expect(result.token).toBe('Bearer access-token');
    expect(result.user.userName).toBe('admin');
    expect(result.user.policy.policies).toEqual([{ name: 'super_permission' }]);
  });

  it('maps organization_id claim into policy.organization', async () => {
    process.env.REACT_APP_KEYCLOAK_URL = 'https://kc.local/keycloak';
    process.env.REACT_APP_KEYCLOAK_REALM = 'master';
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID = 'treetracker-admin-client';

    mockKeycloakModule(() => ({
      init: jest.fn().mockResolvedValue(true),
      token: 'access-token',
      tokenParsed: {
        sub: 'user-1',
        preferred_username: 'admin',
        email: 'admin@example.com',
        realm_access: { roles: ['org'] },
        organization_id: '178',
      },
    }));

    const { getBootstrapAuthState } = require('./keycloak');
    const result = await getBootstrapAuthState();

    expect(result.user.policy.policies).toEqual([{ name: 'org' }]);
    expect(result.user.policy.organization).toEqual({ id: 178 });
  });

  it('initializes keycloak only once for concurrent calls', async () => {
    process.env.REACT_APP_KEYCLOAK_URL = 'https://kc.local/keycloak';
    process.env.REACT_APP_KEYCLOAK_REALM = 'master';
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID = 'treetracker-admin-client';

    let resolveInit;
    const init = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveInit = resolve;
        })
    );

    mockKeycloakModule(() => ({
      init,
      token: 'access-token',
      tokenParsed: {},
    }));

    const { initializeKeycloak } = require('./keycloak');

    const first = initializeKeycloak();
    const second = initializeKeycloak();

    resolveInit(true);
    await Promise.all([first, second]);

    expect(init).toHaveBeenCalledTimes(1);
  });
});
