"use client";

import { cn, formatDate, shortenAddress } from "@/lib/utils";
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
import moment from "moment";

export default function EventCard({
  event,
  hide,
}: {
  event: IEvent;
  hide?: boolean;
}) {
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
    <div
      className={cn(
        "flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group",
        {
          "mb-10 last:mb-0": !hide,
          "mb-4 last:mb-0": hide,
        }
      )}>
      {!hide && (
        <div className="flex-1 h-full hidden sm:block md:sticky md:top-20">
          <p className="relative font-semibold text-sm sm:text-base md:pb-10">
            {moment(eventStartsTime).format("MMM Do")}
            <br />
            <span className="text-muted-foreground text-xs sm:text-sm font-medium">
              {moment(eventStartsTime).format("dddd")}
            </span>
            <span className="hidden md:flex absolute top-0 -right-[5.5px] size-2.5 rounded-full bg-secondary" />
            <span className="hidden md:flex absolute top-0 -right-px w-px bg-gradient-to-b from-secondary via-secondary/30 to-transparent h-[200px]" />
          </p>
        </div>
      )}

      <Link
        className={cn(
          "max-w-full md:max-w-[612px] w-full transition-transform duration-300 cursor-pointer",
          {
            "group-hover:-translate-y-3": !hide,
          }
        )}
        href={`/event/${eventId}`}>
        <div className="w-full rounded-xl border p-3 sm:pl-4 bg-secondary/50 flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-6">
          <div className="flex flex-col flex-1 w-full sm:w-max">
            <p className="text-sm font-medium text-muted-foreground">
              {eventStatus === "OPEN" ? (
                <>Starts {moment(eventStartsTime).endOf("day").fromNow()}</>
              ) : eventStatus === "PENDING" ? (
                <>
                  {moment(eventStartsTime).format("MMMM Do YYYY")} -{" "}
                  {moment(eventEndsTime).format("MMMM Do YYYY")}
                </>
              ) : (
                "Event has ended"
              )}
            </p>

            <h1 className="my-1 text-base md:text-lg font-semibold line-clamp-1">
              {title}
            </h1>

            <div className="text-sm flex items-center gap-2 w-max group">
              <span className="size-5 bg-secondary rounded-xl border relative">
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
                  className={`size-full rounded-[inherit] ${
                    credentials?.avatar ? "rounded-full" : ""
                  }`}
                />
              </span>
              <b>
                {credentials?.address === owner ? (
                  "Hosted by You"
                ) : (
                  <>
                    {hide ? "Owned by" : "Hosted by"} {shortenAddress(owner)}
                  </>
                )}
              </b>
            </div>

            {/* //?SEPERATOR */}
            <div className="my-2 py-2 flex-1 flex flex-col">
              <span className="w-full h-px bg-secondary" />
            </div>
            {/* //?SEPERATOR */}

            <div className="mb-1 flex items-center gap-2">
              <p className="text-sm flex items-center font-medium text-muted-foreground">
                Ticket Price:
              </p>
              <p className="text-sm flex items-center font-medium">
                {eventType === "PAID" ? `${ticketPrice} ETH` : "Free"}
              </p>
            </div>

            <div className="mt-auto flex gap-2 items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Registration:
              </span>
              {regStatus === "PENDING" ? (
                <Badge variant="pending" className="w-max text-xs font-medium">
                  Coming Soon
                </Badge>
              ) : regStatus === "OPEN" ? (
                <Badge variant="success" className="w-max text-xs font-medium">
                  On Going
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="w-max text-xs font-medium">
                  Ended
                </Badge>
              )}
            </div>
          </div>

          <div className="bg-background/50 w-full sm:w-[155px] aspect-[1.2] sm:aspect-square rounded-lg overflow-hidden">
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
