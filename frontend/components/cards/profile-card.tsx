"use client";

import { shortenAddress } from "@/lib/utils";
import { Copy, CopyCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileCard({
  currentUser,
  ownedEvents,
  purchasedTickets,
}: {
  currentUser: IUserCredentials | undefined;
  ownedEvents: IEvent[] | undefined;
  purchasedTickets: ITicket[] | undefined;
}) {
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

  return (
    <div
      key={currentUser?.address}
      className="py-6 first:pt-0 flex items-start sm:items-center flex-col sm:flex-row gap-4 sm:gap-6 border-b">
      <div className="size-[112px]">
        <div className="size-full rounded-full bg-secondary gap-4">
          <Image
            src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${currentUser?.avatar}`}
            alt={currentUser?.email as string}
            width={112}
            height={112}
            priority
            className="size-full rounded-[inherit]"
          />
        </div>
      </div>
      <div className="flex flex-col h-full flex-1">
        <h1 className="font-semibold text-lg md:text-xl truncate">
          {currentUser?.email}
        </h1>
        <p className="text-sm md:text-base mt-1 flex items-center gap-2">
          {shortenAddress(currentUser?.address as string)}{" "}
          {copied ? (
            <CopyCheck size={16} className="text-green-500" />
          ) : (
            <Copy
              onClick={() => handleCopy(currentUser?.address as string)}
              size={16}
              className="cursor-pointer"
            />
          )}
        </p>

        <div className="flex items-center w-full pt-2">
          <p className="text-xs md:text-sm border-r pr-4">
            <b>{ownedEvents?.length || 0}</b> Hosted
          </p>
          <p className="text-xs md:text-sm border-r px-4">
            <b>{purchasedTickets?.length || 0}</b> Attended
          </p>
          <p className="text-xs md:text-sm pl-4">
            <b>{currentUser?.balance} ETH</b> Earnings
          </p>
        </div>
      </div>
    </div>
  );
}
