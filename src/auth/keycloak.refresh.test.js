describe('keycloak token refresh', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  function setupConfiguredEnv() {
    process.env.REACT_APP_KEYCLOAK_URL = 'https://kc.local/keycloak';
    process.env.REACT_APP_KEYCLOAK_REALM = 'master';
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID = 'treetracker-admin-client';
  }

  it('deduplicates concurrent refresh calls', async () => {
    setupConfiguredEnv();

    const updateToken = jest.fn().mockResolvedValue(true);

    jest.doMock('keycloak-js', () => {
      return jest.fn().mockImplementation(() => ({
        init: jest.fn().mockResolvedValue(true),
        updateToken,
        token: 'updated-token',
      }));
    });

    const { ensureFreshToken } = require('./keycloak');

    const first = ensureFreshToken(30);
    const second = ensureFreshToken(30);

    const [token1, token2] = await Promise.all([first, second]);

    expect(updateToken).toHaveBeenCalledTimes(1);
    expect(token1).toBe('updated-token');
    expect(token2).toBe('updated-token');
  });

  it('throws when token refresh fails', async () => {
    setupConfiguredEnv();

    jest.doMock('keycloak-js', () => {
      return jest.fn().mockImplementation(() => ({
        init: jest.fn().mockResolvedValue(true),
        updateToken: jest.fn().mockRejectedValue(new Error('refresh failed')),
        token: 'updated-token',
      }));
    });

    const { ensureFreshToken } = require('./keycloak');

    await expect(ensureFreshToken(30)).rejects.toThrow('refresh failed');
  });
});
