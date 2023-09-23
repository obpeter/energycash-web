import React, {createContext, PureComponent, useContext, useMemo} from "react";
import {KeycloakConfig, KeycloakService} from "../../service/keycloak.service";

export interface AuthClient {
  login(username: string, password: string): Promise<boolean>
  init(initOptions: KeycloakConfig): Promise<boolean>
  hasResourceRole(role: string): boolean
  hasRealmRole(role: string): boolean
  getToken(): Promise<string>
  updateToken(minValidity: number): Promise<string>
  onAuthSuccess?: () => void;
  token?: string
  refreshToken?: string
  idToken?: string
  tenants: string[]
  accessGroups: string[]
}

export type AuthContextInterface<T extends AuthClient> = {
  authClient?: T;
  isAuthenticated: boolean;
  tenants: string[];
  roles: string[];
}

// export const authContextDefaults: AuthContextInterface = {
//   isAuthenticated: false,
// };
//
// export const AuthContext = createContext(authContextDefaults)


export function createAuthContext<T extends AuthClient>(
  initialContext?: Partial<AuthContextInterface<T>>
): React.Context<AuthContextInterface<T>> {
  return createContext({
    isAuthenticated: false,
    tenants: [],
    roles: [],
    ...initialContext,
  })
}
export default createAuthContext;

export type AuthProviderProps<T extends AuthClient> = {
  authClient: T
  initOptions?: KeycloakConfig
  children: React.ReactNode
}

type AuthProviderState = {
  initialized: boolean
  isAuthenticated: boolean
  tenants: string[]
  roles: string[]
}


export function createAuthProvider<T extends AuthClient>(AuthContext: React.Context<AuthContextInterface<T>>) {

  const initialState: AuthProviderState = {
    initialized: false,
    isAuthenticated: false,
    tenants: [],
    roles: [],
  }

  return class AuthProvider extends PureComponent<AuthProviderProps<T>, AuthProviderState> {

    state = {
      ...initialState,
    }

    componentDidMount() {
      this.init()
    }

    async init() {
      const { initOptions, authClient } = this.props

      authClient.onAuthSuccess = () => {this.updateState()};

      await authClient.init(initOptions!)
        .then(() => this.setState({...this.state, initialized: true}))
        .catch((err) => console.log(err));

    }

    updateState() {
      const { authClient } = this.props

      const authenticated = (authClient.idToken !== undefined && authClient.token !== undefined);

      this.setState({
        ...this.state,
        isAuthenticated: authenticated,
        initialized: true,
        tenants: authClient.tenants,
        roles: authClient.accessGroups,
      });

      // console.log("UpdateState: ", this.state, "tenants", authClient);
    }

    render() {
      const { children, authClient } = this.props
      const { initialized, isAuthenticated, tenants, roles } = this.state

      if (!initialized) {
        return <></>
      }

      return (
        <AuthContext.Provider value={{authClient, isAuthenticated, tenants, roles}}>
          {children}
        </AuthContext.Provider>
      )
    }
  }
}

export const KeycloakContext = createAuthContext<KeycloakService>();

export const KeycloakProvider = createAuthProvider(KeycloakContext);

export const useKeycloak = () => {
  const {authClient, isAuthenticated} = useContext(KeycloakContext);
  return {
    isAuthenticated, keycloak: authClient!,
  }
}

export const useTenants = () => {
  const {tenants} = useContext(KeycloakContext);
  return tenants;
}

export const useRoles = () => {
  const {roles} = useContext(KeycloakContext);
  return roles;
}