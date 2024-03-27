import React, {createContext, PureComponent, useContext, useMemo} from "react";
import {OidcProvider} from "../../components/OidcProvider";
import {UserManager, UserProfile} from "oidc-client-ts";
import {AuthService} from "../../service/auth.service";

// export interface AuthClient {
//   login(username: string, password: string): Promise<boolean>
//   init(initOptions: KeycloakConfig): Promise<boolean>
//   hasResourceRole(role: string): boolean
//   hasRealmRole(role: string): boolean
//   getToken(): Promise<string>
//   updateToken(minValidity: number): Promise<string>
//   onAuthSuccess?: () => void;
//   token?: string
//   refreshToken?: string
//   idToken?: string
//   tenants: string[]
//   accessGroups: string[]
//   claims: Record<string, any>
// }
//
// export type AuthContextInterface<T extends AuthClient> = {
//   authClient?: T;
//   isAuthenticated: boolean;
//   tenants: string[];
//   roles: string[];
//   claims: Record<string, any>
// }
//
// // export const authContextDefaults: AuthContextInterface = {
// //   isAuthenticated: false,
// // };
// //
// // export const AuthContext = createContext(authContextDefaults)
//
//
// export function createAuthContext<T extends AuthClient>(
//   initialContext?: Partial<AuthContextInterface<T>>
// ): React.Context<AuthContextInterface<T>> {
//   return createContext({
//     isAuthenticated: false,
//     tenants: [],
//     roles: [],
//     claims: {},
//     ...initialContext,
//   })
// }
// export default createAuthContext;
//
// export type AuthProviderProps<T extends AuthClient> = {
//   authClient: T
//   initOptions?: KeycloakConfig
//   children: React.ReactNode
// }
//
// type AuthProviderState = {
//   initialized: boolean
//   isAuthenticated: boolean
//   tenants: string[]
//   roles: string[]
//   claims: Record<string, any>
// }
//
//
// export function createAuthProvider<T extends AuthClient>(AuthContext: React.Context<AuthContextInterface<T>>) {
//
//   const initialState: AuthProviderState = {
//     initialized: false,
//     isAuthenticated: false,
//     tenants: [],
//     roles: [],
//     claims: {}
//   }
//
//   return class AuthProvider extends PureComponent<AuthProviderProps<T>, AuthProviderState> {
//
//     state = {
//       ...initialState,
//     }
//
//     componentDidMount() {
//       this.init()
//     }
//
//     async init() {
//       const { initOptions, authClient } = this.props
//
//       authClient.onAuthSuccess = () => {this.updateState()};
//
//       await authClient.init(initOptions!)
//         .then(() => this.setState({...this.state, initialized: true}))
//         .catch((err) => console.log(err));
//
//     }
//
//     updateState() {
//       const { authClient } = this.props
//
//       const authenticated = (authClient.idToken !== undefined && authClient.token !== undefined);
//
//       this.setState({
//         ...this.state,
//         isAuthenticated: authenticated,
//         initialized: true,
//         tenants: authClient.tenants,
//         roles: authClient.accessGroups,
//         claims: authClient.claims,
//       });
//
//       // console.log("UpdateState: ", this.state, "tenants", authClient);
//     }
//
//     render() {
//       const { children, authClient } = this.props
//       const { initialized, isAuthenticated, tenants, roles, claims } = this.state
//
//       if (!initialized) {
//         return <></>
//       }
//
//       return (
//         <AuthContext.Provider value={{authClient, isAuthenticated, tenants, roles, claims}}>
//           {children}
//         </AuthContext.Provider>
//       )
//     }
//   }
// }
//
// export const KeycloakContext = createAuthContext<KeycloakService>();
//
// export const KeycloakProvider = createAuthProvider(KeycloakContext);
//
// export const useKeycloak = () => {
//   const {authClient, isAuthenticated} = useContext(KeycloakContext);
//   return {
//     isAuthenticated, keycloak: authClient!,
//   }
// }
//
// export const useTenants = () => {
//   const {tenants} = useContext(KeycloakContext);
//   return tenants;
// }
//
// export const useRoles = () => {
//   const {roles} = useContext(KeycloakContext);
//   return roles;
// }
//





interface OidcAuthState {
  decodeToken(str: string): any
  parseToken(token: string): string
  getToken(): Promise<string>
  refresh(): Promise<string | void>
  login(): Promise<void>
  logout(): Promise<void>
  redirectToUserAccount(): Promise<void>
  _logoutActive: boolean
  onTokenReceived?: (props: Record<string, any>) => void
  tenant?: string
  token?: string
  tenants: string[]
  accessGroups: string[]
  claims: Record<string, any>
  logoutActive: boolean
}

export type OidcAuthContextInterface<T extends Omit<OidcAuthState, "logoutActive" | "_logoutActive"> & UserManager> = {
  authService?: T;
  tenant?: string
  token?: string
  tenants: string[];
  roles: string[];
  claims: Record<string, any>
}

export function createOidcAuthContext<T extends Omit<OidcAuthState, "logoutActive" | "_logoutActive"> & UserManager>(
  initialContext?: Partial<OidcAuthContextInterface<T>>
): React.Context<OidcAuthContextInterface<T>> {
  return createContext({
    tenants: [],
    roles: [],
    claims: {},
    // _logoutActive: false,
    // _loggedIn: false,
    // loggedIn: false,
    // loginTried: false,
    ...initialContext,
  })
}

// type OidcAuthProviderType = Pick<OidcAuthState, "tenant" | "token" | "tenants" | "claims">
type OidcAuthProviderType = Omit<OidcAuthState, "_logoutActive">

export type OidcAuthProviderProps<T extends OidcAuthProviderType & UserManager> = {
  authService?: T
  children: React.ReactNode
}

type OidcAuthProviderState<T extends OidcAuthProviderType & UserManager> = {
  tenants: string[]
  roles: string[]
  claims: Record<string, any>
  authService: T | undefined
}

export function createOidcAuthProvider<T extends OidcAuthProviderType & UserManager>(OidcAuthContext: React.Context<OidcAuthContextInterface<T>>) {

  const initialState: OidcAuthProviderState<T> = {
    tenants: [],
    roles: [],
    claims: {},
    authService: undefined
  }

  return class OidcAuthProvider extends PureComponent<OidcAuthProviderProps<T>, OidcAuthProviderState<T>> {

    state = {
      ...initialState,
      authService: this.props.authService,
    }

    componentDidMount() {
      const { authService } = this.props
      if (authService) {
        authService.onTokenReceived = (props) => {this.updateState(props)}
      }
    }

    updateState(props: Record<string, any>) {
      this.setState({
        ...this.state,
        tenants: props.tenants,
        roles: props.accessGroups,
        claims: props.claims,
      });
    }

    render() {
      const { children } = this.props
      const { tenants, roles, claims, authService } = this.state

      if (!authService) {
        return <></>
      }

      return (
        <OidcAuthContext.Provider value={{tenants, roles, claims, authService}}>
          <OidcProvider _userManager={authService}>
            {children}
          </OidcProvider>
        </OidcAuthContext.Provider>
      )
    }
  }
}

export const OidcAuthContext = createOidcAuthContext<AuthService>();

export const OidcAuthProvider = createOidcAuthProvider(OidcAuthContext);

export const useTenants = () => {
  const {tenants} = useContext(OidcAuthContext);
  return tenants;
}

export const useRoles = () => {
  const {roles} = useContext(OidcAuthContext);
  return roles;
}

export const useUser = () => {
  const {authService} = useContext(OidcAuthContext)
  return authService
}
