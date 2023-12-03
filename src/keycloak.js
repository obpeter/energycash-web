// import Keycloak from 'keycloak-js'
import {KeycloakService} from "./service/keycloak.service";

// import keycloakConfig from "keycloakConfig";

// const keycloakConfig = {
//     url: 'https://login.ourproject.at/auth/',
//     realm: 'VFEEG',
//     clientId: 'at.ourproject.vfeeg.app'
// }

// export const authKeycloak = new KeycloakService({
//     authServerUrl: keycloakConfig.url,
//     clientSecret: 'LxUXJLXP2Ra57y4RcIzXPYgNHvJF7H1j',
//     clientId: keycloakConfig.clientId,
//     realm: keycloakConfig.realm}
// );

const {authServerUrl, clientSecret, clientId, realm} = window['authConfig']
export const authKeycloak =
    new KeycloakService({
        authServerUrl: authServerUrl,
        clientSecret: clientSecret,
        clientId: clientId,
        realm: realm
    })