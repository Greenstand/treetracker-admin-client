import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
  url: `${process.env.REACT_APP_KEYCLOAK_URL}`,
  realm: 'greenstand',
  clientId: 'admin-panel',
});

export default keycloak;
