// import Keycloak from 'keycloak-js'
import {KeycloakService} from "./service/keycloak.service";

const keycloakConfig = {
    url: 'https://login.ourproject.at/auth/',
    realm: 'VFEEG',
    clientId: 'at.ourproject.vfeeg.app'
}

// export const authKeycloak = new KeycloakService({
//     authServerUrl: keycloakConfig.url,
//     clientSecret: 'LxUXJLXP2Ra57y4RcIzXPYgNHvJF7H1j',
//     clientId: keycloakConfig.clientId,
//     realm: keycloakConfig.realm}
// );
export const authKeycloak = new KeycloakService({
        authServerUrl: process.env.REACT_APP_AUTH_SERVER_URL,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
        clientId: process.env.REACT_APP_CLIENT_ID,
        realm: process.env.REACT_APP_AUTH_REALM
    }
);