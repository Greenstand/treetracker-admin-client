export const AUTH_CALLBACK_PATH = '/auth/callback';
export const LOGIN_PATH = '/login';

// Paths that should never be treated as a post-login redirect destination.
export const AUTH_REDIRECT_SKIP_PATHS = [AUTH_CALLBACK_PATH, LOGIN_PATH];

// sessionStorage key used to preserve the page the user originally requested
// across the Keycloak login round-trip.
export const POST_LOGIN_PATH_KEY = 'post_login_path';
