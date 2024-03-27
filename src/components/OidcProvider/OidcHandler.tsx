import {FC, PropsWithChildren, useEffect, useState} from "react";
import {hasAuthParams, useAuth} from "react-oidc-context";
import {IonSpinner} from "@ionic/react";

export const OidcHandler: FC<PropsWithChildren & {hasTried: () => boolean}> = ({ children, hasTried}) => {
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  console.log("OIDC Handler", hasTriedSignin, auth)

  useEffect(() => {
    (async () => {
      if (
        !hasAuthParams() &&
        !auth.isAuthenticated &&
        !auth.activeNavigator &&
        !auth.isLoading &&
        !hasTriedSignin &&
        !hasTried()
      ) {
        await auth.signinRedirect();
        setHasTriedSignin(true);
      } else if (
        !hasAuthParams() &&
        auth.isAuthenticated &&
        !auth.isLoading &&
        !hasTriedSignin) {
        console.log("Upps! It is already authenticated!")
        // await auth.clearStaleState()
        // await auth.signinSilent()
        // setHasTriedSignin(true);
      }
    })()
  }, [auth, hasTriedSignin]);


  // useEffect(() => {
  //   // the `return` is important - addAccessTokenExpiring() returns a cleanup function
  //   return auth.events.addAccessTokenExpiring(() => {
  //     // if (alert("You're about to be signed out due to inactivity. Press continue to stay signed in.")) {
  //     //   auth.signinSilent();
  //     // }
  //   })
  // }, [auth.events, auth.signinSilent]);

  if (auth.error) {
    return (
      <div className="full-screen-center">
          {auth.error.name}: {auth.error.message}
      </div>
    );
  }

  if (auth.isLoading) {
    return (
      <div className="full-screen-center">
        <IonSpinner style={{margin: "auto", height: "48px", width: "48px"}}/>
      </div>
    );
  }

  return <>{children}</>;
};