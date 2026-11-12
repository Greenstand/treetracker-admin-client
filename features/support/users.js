// The BDD accounts on the realm under test. Override any of them with the
// matching BDD_* environment variable when running against another realm.
const USERS_BY_ROLE = {
  'greenstand-admin': {
    username: process.env.BDD_ADMIN_USERNAME || 'org-manager',
    password: process.env.BDD_ADMIN_PASSWORD || 'fIM1&miRS$Qs0^ST',
  },
  'wallet-admin': {
    username: 'bdd-wallet-admin',
    password: 'bdd@wallet@admin123',
  },
  organization: {
    username:
      process.env.BDD_ORG_USERNAME || 'user-test-treetracker-admin-client',
    password: process.env.BDD_ORG_PASSWORD || 'LjyxVk4t5^yx&!Gl',
  },
  // A registered user who belongs to no organization yet.
  'registered-user': {
    username: process.env.BDD_USER_USERNAME,
    password: process.env.BDD_USER_PASSWORD,
  },
};

function userForRole(role) {
  const user = USERS_BY_ROLE[role];

  if (!user || !user.username || !user.password) {
    throw new Error(`No BDD credentials configured for role: ${role}`);
  }

  return user;
}

module.exports = { userForRole };
