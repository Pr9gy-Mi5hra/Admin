"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { AppContext } from "../stacks/context";
import { useAuth } from "../stacks/use-auth";
import { Provider } from "react-redux";
import { store } from "../stores";
import { persistor } from "@/stores";
import { PersistGate } from "redux-persist/integration/react";
type ProviderProps = {
  children: ReactNode;
};
function ProviderClientWrapper({ children }: ProviderProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  const { state } = useAuth();
  return (
    <Provider store={store}>
      <AppContext.Provider value={state}>
        {isBrowser ? (
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        ) : (
          children
        )}
      </AppContext.Provider>
    </Provider>
  );
}

export default ProviderClientWrapper;
