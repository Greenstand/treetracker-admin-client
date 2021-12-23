import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
  url: 'https://dev-k8s.treetracker.org/auth',
  realm: 'greenstand',
  clientId: 'admin-panel',
});

export default keycloak;
