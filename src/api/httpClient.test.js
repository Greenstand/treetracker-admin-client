describe('httpClient explicit interceptors', () => {
  let originalLocation;

  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    originalLocation = window.location;
    delete window.location;
    window.location = { assign: jest.fn() };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  function loadClientWithMocks({
    isConfigured = true,
    refreshedToken = 'token-123',
    refreshError,
    sessionToken,
  } = {}) {
    let mod;
    const ensureFreshToken = refreshError
      ? jest.fn().mockRejectedValue(refreshError)
      : jest.fn().mockResolvedValue(refreshedToken);
    const clearAuthState = jest.fn();

    jest.isolateModules(() => {
      jest.doMock('../auth/keycloak', () => ({
        isKeycloakConfigured: jest.fn(() => isConfigured),
        ensureFreshToken,
        clearAuthState,
      }));

      jest.doMock('../models/auth', () => ({
        session: {
          token: sessionToken,
        },
      }));

      mod = require('./httpClient');
      mod.setupAuthAxiosInterceptors();
    });

    return { ...mod, ensureFreshToken, clearAuthState };
  }

  it('attaches bearer token for keycloak-authenticated requests', async () => {
    const { authAxios, ensureFreshToken } = loadClientWithMocks();
    const handlers = authAxios.interceptors.request.handlers;
    const handler = handlers[handlers.length - 1].fulfilled;

    const config = await handler({ headers: {} });

    expect(ensureFreshToken).toHaveBeenCalledWith(30);
    expect(config.headers.Authorization).toBe('Bearer token-123');
  });

  it('preserves explicit authorization header when provided', async () => {
    const { authAxios, ensureFreshToken } = loadClientWithMocks();
    const handlers = authAxios.interceptors.request.handlers;
    const handler = handlers[handlers.length - 1].fulfilled;

    const config = await handler({
      headers: { Authorization: 'Custom header token' },
    });

    expect(ensureFreshToken).not.toHaveBeenCalled();
    expect(config.headers.Authorization).toBe('Custom header token');
  });

  it('uses legacy session token when keycloak is disabled', async () => {
    const { authAxios, ensureFreshToken } = loadClientWithMocks({
      isConfigured: false,
      sessionToken: 'Legacy token',
    });
    const handlers = authAxios.interceptors.request.handlers;
    const handler = handlers[handlers.length - 1].fulfilled;

    const config = await handler({ headers: {} });

    expect(ensureFreshToken).not.toHaveBeenCalled();
    expect(config.headers.Authorization).toBe('Legacy token');
  });

  it('uses localStorage token fallback when session token is missing', async () => {
    localStorage.setItem('token', JSON.stringify('Stored token'));
    const { authAxios, ensureFreshToken } = loadClientWithMocks({
      isConfigured: false,
      sessionToken: undefined,
    });
    const handlers = authAxios.interceptors.request.handlers;
    const handler = handlers[handlers.length - 1].fulfilled;

    const config = await handler({ headers: {} });

    expect(ensureFreshToken).not.toHaveBeenCalled();
    expect(config.headers.Authorization).toBe('Stored token');
  });

  it('does not attach authorization when keycloak disabled and no legacy token', async () => {
    const { authAxios } = loadClientWithMocks({
      isConfigured: false,
      sessionToken: undefined,
    });
    const handlers = authAxios.interceptors.request.handlers;
    const handler = handlers[handlers.length - 1].fulfilled;

    const config = await handler({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('clears auth and redirects when refresh fails', async () => {
    const refreshError = new Error('refresh failed');
    const { authAxios, clearAuthState } = loadClientWithMocks({
      refreshError,
    });
    const handlers = authAxios.interceptors.request.handlers;
    const handler = handlers[handlers.length - 1].fulfilled;

    await expect(handler({ headers: {} })).rejects.toThrow('refresh failed');
    expect(clearAuthState).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith('/login');
  });

  it('does not attach auth interceptor to publicAxios', () => {
    const { publicAxios } = loadClientWithMocks();
    expect(publicAxios.interceptors.request.handlers.length).toBe(0);
  });
});
