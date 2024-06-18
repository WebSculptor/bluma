"use client";

import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { checkIfUserIsRegistered, getUser } from "@/services";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";

// Create Context
const GlobalContext = React.createContext<IGlobalContextProvider | undefined>(
  undefined
);

export default function GlobalContextProvider({ children }: ILayout) {
  const { address } = useWeb3ModalAccount();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<
    IUserCredentials | undefined
  >();

  const getRegisteredUser = useCallback(async (address: string) => {
    setIsFetchingUser(true);
    try {
      const isRegistered: boolean = await checkIfUserIsRegistered(address);
      if (isRegistered) {
        const user: IUserCredentials | undefined = await getUser(address);
        setCredentials(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCredentials(undefined);
      }
    } catch (error) {
      console.error("Error fetching registered user:", error);
      setIsAuthenticated(false);
    } finally {
      setIsFetchingUser(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isFetchingUser && address) {
        await getRegisteredUser(address);
      }
    };

    fetchUser();
  }, [address, isFetchingUser, getRegisteredUser]);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const propsValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      getRegisteredUser,
      isFetchingUser,
      credentials,
      setCredentials,
    }),
    [isAuthenticated, isFetchingUser, credentials, getRegisteredUser]
  );

  return (
    <GlobalContext.Provider value={propsValue}>
      <Toaster richColors theme="dark" />
      <NextTopLoader showSpinner={false} color="hsl(var(--primary))" />
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = (): IGlobalContextProvider => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
