"use client";

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/sonner";

import { checkIfUserIsRegistered, getUser } from "@/services";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IGlobalContextProvider {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  getRegisteredUser: (address: string) => Promise<void>;
  isFetchingUser: boolean;
  credentials: IUserCredentials | undefined;
  setCredentials: (credentials: IUserCredentials | undefined) => void;
}

const GlobalContext = React.createContext<IGlobalContextProvider | undefined>(
  undefined
);

export default function GlobalContextProvider({ children }: ILayout) {
  const router = useRouter();

  const { address, isConnected } = useWeb3ModalAccount();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<
    IUserCredentials | undefined
  >();

  const getRegisteredUser = async (address: string) => {
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
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!isFetchingUser) {
        if (address) {
          await getRegisteredUser(`${address}`);
        } else {
          setTimeout(async () => {
            if (isConnected) {
              await getRegisteredUser(`${address}`);
            } else {
              setIsAuthenticated(false);
              setCredentials(undefined);
            }
          }, 2000);
        }
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, router]);

  const propsValue: IGlobalContextProvider = {
    isAuthenticated,
    setIsAuthenticated,
    getRegisteredUser,
    isFetchingUser,
    credentials,
    setCredentials,
  };

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
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
