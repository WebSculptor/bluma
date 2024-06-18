"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import { site } from "@/constants";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    document.title = `Sign In ・ ${site.name}`;

    if (credentials) {
      router.push("/home");
    }
  }, [credentials, router]);

  if (isFetchingUser) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex justify-center flex-col flex-1 items-center">
      {children}
    </div>
  );
}
