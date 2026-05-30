import {
  cleanupOidcArtifactsFromUrl,
  getLegacyToken,
  hasOidcArtifactsInHash,
  parseStoredToken,
  parseStoredUser,
} from './util';
import { session } from '../models/auth';

describe('auth util helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    delete session.token;
    window.history.replaceState({}, '', '/');
    jest.restoreAllMocks();
  });

  it('detects OIDC artifacts in hash', () => {
    expect(hasOidcArtifactsInHash(undefined)).toBe(false);
    expect(hasOidcArtifactsInHash('#')).toBe(false);
    expect(hasOidcArtifactsInHash('#tab=activity')).toBe(false);
    expect(hasOidcArtifactsInHash('#iss=https%3A%2F%2Fkc.local')).toBe(true);
    expect(hasOidcArtifactsInHash('#state=abc123&tab=activity')).toBe(true);
  });

  it('cleans OIDC callback params from query and hash', () => {
    window.history.replaceState(
      {},
      '',
      '/captures?state=abc&foo=bar&iss=https%3A%2F%2Fkc.local#iss=https%3A%2F%2Fkc.local&section=history'
    );

    cleanupOidcArtifactsFromUrl();

    expect(window.location.pathname).toBe('/captures');
    expect(window.location.search).toBe('?foo=bar');
    expect(window.location.hash).toBe('#section=history');
  });

  it('does not rewrite url when no OIDC artifacts exist', () => {
    window.history.replaceState({}, '', '/verify?foo=bar#tab=activity');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    cleanupOidcArtifactsFromUrl();

    expect(replaceSpy).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/verify');
    expect(window.location.search).toBe('?foo=bar');
    expect(window.location.hash).toBe('#tab=activity');
  });

  it('returns parsed stored user and handles invalid json', () => {
    expect(parseStoredUser()).toBeUndefined();

    localStorage.setItem(
      'user',
      JSON.stringify({ id: 'user-1', email: 'admin@example.com' })
    );
    expect(parseStoredUser()).toEqual({
      id: 'user-1',
      email: 'admin@example.com',
    });

    localStorage.setItem('user', '{invalid-json}');
    expect(parseStoredUser()).toBeUndefined();
  });

  it('returns parsed token and falls back to raw token string', () => {
    expect(parseStoredToken()).toBeUndefined();

    localStorage.setItem('token', JSON.stringify('Bearer stored-token'));
    expect(parseStoredToken()).toBe('Bearer stored-token');

    localStorage.setItem('token', 'Bearer raw-token');
    expect(parseStoredToken()).toBe('Bearer raw-token');
  });

  it('prefers session token over local storage token', () => {
    session.token = 'Bearer session-token';
    localStorage.setItem('token', JSON.stringify('Bearer stored-token'));

    expect(getLegacyToken()).toBe('Bearer session-token');
  });

  it('uses stored token when session token is missing', () => {
    localStorage.setItem('token', JSON.stringify('Bearer stored-token'));

    expect(getLegacyToken()).toBe('Bearer stored-token');
  });
});
