describe('keycloak action update flow', () => {
  const originalEnv = { ...process.env };
  let mockInstance;

  function setupConfiguredEnv() {
    process.env.REACT_APP_KEYCLOAK_URL = 'https://kc.local/keycloak';
    process.env.REACT_APP_KEYCLOAK_REALM = 'master';
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID = 'treetracker-admin-client';
  }

  function mockKeycloakJs() {
    jest.doMock('keycloak-js', () => {
      return jest.fn().mockImplementation(() => {
        mockInstance = {
          init: jest.fn().mockResolvedValue(true),
          login: jest.fn().mockResolvedValue(undefined),
          token: 'access-token',
          tokenParsed: {},
        };
        return mockInstance;
      });
    });
  }

  beforeEach(() => {
    sessionStorage.clear();
    mockInstance = undefined;
  });

  afterEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    sessionStorage.clear();
  });

  describe('startKeycloakRequiredAction', () => {
    it('writes the action to sessionStorage and calls instance.login with action + redirectUri', async () => {
      setupConfiguredEnv();
      mockKeycloakJs();
      const {
        startKeycloakRequiredAction,
        KEYCLOAK_UPDATE_ACTIONS,
      } = require('./keycloak');

      await startKeycloakRequiredAction(
        KEYCLOAK_UPDATE_ACTIONS.UPDATE_PROFILE,
        '/account'
      );

      expect(sessionStorage.getItem('pendingKeycloakAction')).toBe(
        'UPDATE_PROFILE'
      );
      expect(mockInstance.login).toHaveBeenCalledWith({
        action: 'UPDATE_PROFILE',
        redirectUri: `${window.location.origin}/account`,
      });
    });

    it('defaults redirectUri to /account when no path is given', async () => {
      setupConfiguredEnv();
      mockKeycloakJs();
      const {
        startKeycloakRequiredAction,
        KEYCLOAK_UPDATE_ACTIONS,
      } = require('./keycloak');

      await startKeycloakRequiredAction(
        KEYCLOAK_UPDATE_ACTIONS.UPDATE_PASSWORD
      );

      expect(mockInstance.login).toHaveBeenCalledWith({
        action: 'UPDATE_PASSWORD',
        redirectUri: `${window.location.origin}/account`,
      });
    });

    it('returns false and does not touch sessionStorage when keycloak is not configured', async () => {
      delete process.env.REACT_APP_KEYCLOAK_URL;
      delete process.env.REACT_APP_KEYCLOAK_REALM;
      delete process.env.REACT_APP_KEYCLOAK_CLIENT_ID;

      mockKeycloakJs();
      const { startKeycloakRequiredAction } = require('./keycloak');

      const result = await startKeycloakRequiredAction('UPDATE_PROFILE');

      expect(result).toBe(false);
      expect(sessionStorage.getItem('pendingKeycloakAction')).toBeNull();
      expect(mockInstance).toBeUndefined();
    });
  });

  describe('consumeKeycloakActionUpdate', () => {
    it('returns undefined when no adapter update was recorded and clears any stale sessionStorage', async () => {
      setupConfiguredEnv();
      mockKeycloakJs();
      const {
        initializeKeycloak,
        consumeKeycloakActionUpdate,
      } = require('./keycloak');

      await initializeKeycloak();
      sessionStorage.setItem('pendingKeycloakAction', 'UPDATE_PROFILE');

      expect(consumeKeycloakActionUpdate()).toBeUndefined();
      expect(sessionStorage.getItem('pendingKeycloakAction')).toBeNull();
    });

    it('returns the adapter-provided action when present (v26+ server case)', async () => {
      setupConfiguredEnv();
      mockKeycloakJs();
      const {
        initializeKeycloak,
        consumeKeycloakActionUpdate,
      } = require('./keycloak');

      await initializeKeycloak();
      mockInstance.onActionUpdate('success', 'UPDATE_PROFILE');

      expect(consumeKeycloakActionUpdate()).toEqual({
        status: 'success',
        action: 'UPDATE_PROFILE',
      });
      expect(sessionStorage.getItem('pendingKeycloakAction')).toBeNull();
    });

    it('falls back to sessionStorage action when the adapter does not provide one (v23 server case)', async () => {
      setupConfiguredEnv();
      mockKeycloakJs();
      const {
        startKeycloakRequiredAction,
        consumeKeycloakActionUpdate,
        KEYCLOAK_UPDATE_ACTIONS,
      } = require('./keycloak');

      await startKeycloakRequiredAction(KEYCLOAK_UPDATE_ACTIONS.UPDATE_PROFILE);
      mockInstance.onActionUpdate('success');

      expect(consumeKeycloakActionUpdate()).toEqual({
        status: 'success',
        action: 'UPDATE_PROFILE',
      });
    });

    it('drains state — a second consume returns undefined', async () => {
      setupConfiguredEnv();
      mockKeycloakJs();
      const {
        initializeKeycloak,
        consumeKeycloakActionUpdate,
      } = require('./keycloak');

      await initializeKeycloak();
      mockInstance.onActionUpdate('success', 'UPDATE_PROFILE');

      expect(consumeKeycloakActionUpdate()).toEqual({
        status: 'success',
        action: 'UPDATE_PROFILE',
      });
      expect(consumeKeycloakActionUpdate()).toBeUndefined();
    });
  });
});
