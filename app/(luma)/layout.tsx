"use client";

import Footer from "@/components/shared/footer";
import LoadingScreen from "@/components/shared/loading-screen";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RootLayout({ children }: ILayout) {
  const router = useRouter();
  const { isFetchingUser, credentials } = useGlobalContext();

  useEffect(() => {
    let isMounted = true;

    const authenticateUser = async () => {
      if (!credentials) {
        router.push("/sign-in");
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
    return <LoadingScreen text="Please wait..." />;
  }

  return (
    <>
      <main className="flex-1 pt-8 pb-16">{children}</main>
      <Footer />
    </>
  );
}
