"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    if (credentials) {
      router.back();
    }
  }, [credentials, router]);

  // if (isFetchingUser) {
  //   return <LoadingScreen text="Verifying your credentials, please wait..." />;
  // }

  return (
    <div className="flex justify-center flex-col flex-1 items-center">
      {children}
    </div>
  );
}
