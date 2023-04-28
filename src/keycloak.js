// import Keycloak from 'keycloak-js'
import {KeycloakService} from "./service/keycloak.service";
const keycloakConfig = {
    url: 'https://login.ourproject.at/auth/',
    realm: 'VFEEG',
    clientId: 'at.ourproject.vfeeg.app'
}
// const keycloak = new Keycloak(keycloakConfig);
// export default keycloak

export const authKeycloak = new KeycloakService({
    authServerUrl: keycloakConfig.url,
    clientSecret: 'LxUXJLXP2Ra57y4RcIzXPYgNHvJF7H1j',
    clientId: keycloakConfig.clientId,
    realm: keycloakConfig.realm}
);