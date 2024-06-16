"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDisconnect, useWeb3Modal } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/providers/global-provider";

export function LogOutModal() {
  const router = useRouter();

  const { disconnect } = useDisconnect();
  const { setCredentials, setIsAuthenticated } = useGlobalContext();

  const signOut = async () => {
    await disconnect();
    router.push("/sign-in");
    setCredentials(undefined);
    setIsAuthenticated(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center justify-between w-full px-3 py-2 text-[13px] rounded-sm hover:bg-secondary/80">
        Sign Out
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Logging out means you wont have access to use the dapp untill you
            sign back in, would you like to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={signOut}>Proceed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
