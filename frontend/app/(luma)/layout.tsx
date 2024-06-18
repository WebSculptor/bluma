"use client";

import Footer from "@/components/shared/footer";
import LoadingScreen from "@/components/shared/loading-screen";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    if (!credentials) {
      router.push("/sign-in");
    }
  }, [credentials, router]);

  if (isFetchingUser) {
    return <LoadingScreen />;
  }

  return (
    <>
      <main className="flex-1 pt-8 pb-16 px-4 md:px-0">{children}</main>
      <Footer />
    </>
  );
}
