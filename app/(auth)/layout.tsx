"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import { useGlobalContext } from "@/providers/global-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthLayout({ children }: ILayout) {
  const router = useRouter();
  const { isFetchingUser, credentials } = useGlobalContext();

  useEffect(() => {
    let isMounted = true;

    const authenticateUser = async () => {
      if (credentials) {
        router.push("/home");
      } else {
        router.refresh();
        toast.dismiss();
      }
    };

    if (isMounted) {
      authenticateUser();
    }

    return () => {
      isMounted = false;
    };
  }, [credentials, router]);

  if (isFetchingUser) {
    return <LoadingScreen text="Verifying your credentials, please wait..." />;
  }

  return (
    <>
      <div className="size-full fixed top-0 left-0 min-h-svh backdrop-blur-3xl opacity-20 -z-10">
        <Image
          src="/assets/gradient-dark.png"
          alt="gradient"
          priority
          fill
          className="object-cover size-full blur-3xl"
        />
      </div>
      <div className="flex justify-center flex-col flex-1 items-center">
        {children}
      </div>
    </>
  );
}
