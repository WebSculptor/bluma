"use client";

import ProfileCard from "@/components/cards/profile-card";
import LoadingProfileCard from "@/components/loaders/loading-profile-card";
import { Skeleton } from "@/components/ui/skeleton";
import { shortenAddress } from "@/lib/utils";
import { getAllUsers, getEthereumContracts } from "@/services";
import { Copy, CopyCheck } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AllUsersPage() {
  const [allUsers, setAllUsers] = useState<IUserCredentials[] | undefined>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success(`Copied ${shortenAddress(text)}`);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        toast.error("Failed to copy");
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    const fetchEveryUser = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error: any) {
        console.log("ERROR FETCHING USERS: ", error);
      }
    };

    fetchEveryUser();
  }, []);

  return (
    <div className="flex flex-col py-4">
      {isFetchingUsers ? (
        <LoadingProfileCard />
      ) : (
        allUsers?.map((user) => <ProfileCard key={user?.address} user={user} />)
      )}
    </div>
  );
}
