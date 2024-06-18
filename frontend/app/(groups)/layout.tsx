"use client";

import LoadingScreen from "@/components/shared/loading-screen";
import SendMessage from "@/components/shared/send-message";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function GroupsLayout({ children }: ILayout) {
  const router = useRouter();
  const { credentials, isFetchingUser } = useGlobalContext();

  useEffect(() => {
    if (credentials) {
      router.back();
    }
  }, [credentials, router]);

  // if (isFetchingUser) {
  //   return <LoadingScreen text="Please wait..." />;
  // }

  return (
    <>
      <div className="flex-1 flex flex-col justify-end">
        <main>{children}</main>

        <SendMessage />
      </div>
    </>
  );
}
