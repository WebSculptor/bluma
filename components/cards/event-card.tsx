"use client";

import { formatDate, shortenAddress } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { EventType } from "@/enums";
import { FaEthereum } from "react-icons/fa";
import { TbCashBanknoteOff } from "react-icons/tb";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

export default function EventCard(event: IEvent) {
  const router = useRouter();
  const { credentials } = useGlobalContext();

  const {
    eventId,
    title,
    imageUrl,
    location,
    description,
    owner,
    seats,
    capacity,
    regStartsTime,
    regEndsTime,
    regStatus,
    eventStatus,
    eventType,
    eventStartsTime,
    eventEndsTime,
    ticketPrice,
    totalSales,
    createdAt,
    isEventPaid,
  } = event && event;

  return (
    <div className="flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group mb-10 last:mb-0">
      <div className="flex-1 h-full hidden sm:block md:sticky md:top-20">
        <p className="relative font-semibold text-sm sm:text-base md:pb-10">
          May 31 <br />
          <span className="text-muted-foreground text-xs sm:text-sm font-medium">
            Saturday
          </span>
          <span className="hidden md:flex absolute top-0 -right-[5.5px] size-2.5 rounded-full bg-secondary" />
          <span className="hidden md:flex absolute top-0 -right-px w-px bg-gradient-to-b from-secondary via-secondary/30 to-transparent h-[200px]" />
        </p>
      </div>

      <Link
        className="max-w-full md:max-w-[612px] w-full group-hover:-translate-y-3 transition-transform duration-300 cursor-pointer"
        href={`/event/${eventId}`}>
        <div className="w-full rounded-xl border p-3 sm:pl-4 bg-secondary/50 flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">
              {format(eventStartsTime, "LLL dd, y")} -{" "}
              {format(eventEndsTime, "LLL dd, y")}
            </p>
            <h1 className="my-1 text-base md:text-lg font-semibold line-clamp-1 group-hover:underline">
              {title}
            </h1>
            <div className="text-sm flex items-center gap-2 w-max group mt-1 mb-2">
              <span className="size-5 bg-secondary rounded-full border relative">
                <Image
                  alt={owner}
                  src={
                    credentials && credentials?.avatar
                      ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                      : "/assets/logo.png"
                  }
                  width={20}
                  height={20}
                  priority
                  className={`size-full ${
                    credentials?.avatar ? "rounded-full" : ""
                  }`}
                />
              </span>
              By{" "}
              <b>
                {credentials?.address === owner ? "You" : shortenAddress(owner)}
              </b>
            </div>

            <p>
              {/* {eventLocationType(
                event?.location as string,
                16,
                true,
                "flex-row-reverse justify-start w-max"
              )} */}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <p className="text-xs flex items-center text-[#47C97E] bg-[#1A3029] py-0.5 px-2 rounded-sm font-medium">
                {eventType === "PAID" ? `${ticketPrice} ETH` : "Free"}
              </p>
            </div>

            {/* <div className="mt-2 flex gap-2">
              {eventStatus === "PENDING" ? (
                <Badge variant="pending" className="w-max">
                  Coming Soon
                </Badge>
              ) : eventStatus === "OPEN" ? (
                <Badge variant="success" className="w-max">
                  On Going
                </Badge>
              ) : (
                <Badge variant="destructive" className="w-max">
                  Ended
                </Badge>
              )}
            </div> */}
          </div>

          <div className="bg-background/50 w-full sm:w-[147px] aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden">
            <Image
              src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${imageUrl}`}
              alt={title}
              priority
              width={147}
              height={147}
              className="object-cover size-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
