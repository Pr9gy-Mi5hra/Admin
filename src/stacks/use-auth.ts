import React, { useCallback, useEffect, useMemo } from 'react';

import { AppState, defaultState } from './context';
import { AppConfig, UserSession } from '@stacks/auth';
import { AuthOptions } from '@stacks/connect';

export function useAuth() {
  const [state, setState] = React.useState<AppState>(defaultState());
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = useMemo(
    () => new AppConfig(['store_write', 'publish_data'], process.env.NEXT_PUBLIC_DOMAIN),
    []
  );
  const userSession = useMemo(() => new UserSession({ appConfig }), [appConfig]);

  const handleSignOut = useCallback(() => {
    userSession.signUserOut();
    setState({ userData: null });
  }, [userSession]);

  const handleRedirectAuth = useCallback(async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState({ userData });
      setAppPrivateKey(userData.appPrivateKey);
    } else if (userSession.isUserSignedIn()) {
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
    }
  }, [userSession]);
// @ts-ignore
  const onFinish = useCallback(({ userSession, authResponse }) => {

    const userData = userSession.loadUserData();
    setAppPrivateKey(userSession.loadUserData().appPrivateKey);
    setAuthResponse(authResponse);
    setState({ userData });
  }, []);

  const onCancel = useCallback(() => {
   
  }, []);

  useEffect(() => {
    void handleRedirectAuth();
    if (userSession.isUserSignedIn() && !state.userData) {
      const userData = userSession.loadUserData();
      setState({ userData });
    }
  }, [handleRedirectAuth, userSession, state]);

  const authOptions: AuthOptions = {
    manifestPath: "/static/manifest.json",
    redirectTo: "/",
    userSession,
    onFinish,
    onCancel,
    appDetails: {
      name: "aio-launchpad",
      icon: process.env.NEXT_PUBLIC_CURRENT_URL + "/assets/images/logo.gif",
    },
  };
  
  return {
    authOptions,
    state,
    authResponse,
    appPrivateKey,
    handleSignOut,
  };
}