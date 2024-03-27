
export interface AppConfig {
  authServerUrl: string;
  realm: string;
  clientSecret: string;
  resource: string;
  redirect_uri: string;
}
export const globalConfigUrl = "/config/keycloak-config.json";