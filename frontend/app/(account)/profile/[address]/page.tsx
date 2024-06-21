"use client";

import EventCard from "@/components/cards/event-card";
import ProfileCard from "@/components/cards/profile-card";
import LoadingProfileCard from "@/components/loaders/loading-profile-card";
import LoadingScreen from "@/components/shared/loading-screen";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, shortenAddress } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import { getAllEvents, getAllTicketsOfAUser, getUser } from "@/services";
import { Copy, CopyCheck, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "sonner";

export default function ProfilePage({
  params: { address },
}: {
  params: { address: string };
}) {
  const { credentials } = useGlobalContext();

  const [activeTab, setActiveTab] = useState("evt");
  const [currentUser, setCurrentUser] = useState<
    IUserCredentials | undefined
  >();
  const [ownedEvents, setOwnedEvents] = useState<IEvent[] | undefined>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<
    ITicket[] | undefined
  >([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        const events = await getAllEvents();
        const currentUser = await getUser(address);
        const tickets = await getAllTicketsOfAUser(address);
        setPurchasedTickets(tickets);

        if (currentUser) {
          setCurrentUser(currentUser);

          // Filter events owned by the current user
          const userOwnedEvents = events?.filter(
            (event) => event.owner === currentUser.address
          );
          setOwnedEvents(userOwnedEvents);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFetchingEvents(false);
        setIsFetchingUser(false);
      }
    };

    fetchUserAndEvents();
  }, [address]);

  const profileProps = {
    purchasedTickets,
    ownedEvents,
    currentUser,
  };

  return (
    <div className="flex flex-col">
      {isFetchingUser ? (
        <LoadingProfileCard />
      ) : (
        <ProfileCard {...profileProps} />
      )}

      <div className="border-t w-full">
        {!isFetchingUser && (
          <div className="flex items-center h-11 sm:h-12">
            <div
              onClick={() => setActiveTab("evt")}
              className={cn(
                "flex-1 h-full hover:bg-secondary/30 text-sm font-medium sm:font-bold cursor-pointer flex items-center justify-center",
                {
                  "bg-secondary/50 hover:bg-secondary/80": activeTab === "evt",
                }
              )}>
              Events
            </div>
            <div
              onClick={() => setActiveTab("nft")}
              className={cn(
                "flex-1 h-full hover:bg-secondary/30 text-sm font-medium sm:font-bold cursor-pointer flex items-center justify-center",
                {
                  "bg-secondary/50 hover:bg-secondary/80": activeTab === "nft",
                }
              )}>
              NFTs
            </div>
          </div>
        )}

        <div className="mt-6">
          {activeTab === "evt" ? (
            <div className="flex flex-col">
              {isFetchingEvents ? (
                Array.from({ length: 5 }).map((_, _key) => (
                  <div
                    className="flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group"
                    key={_key}>
                    <div className="mb-4 max-w-full md:max-w-[612px] w-full">
                      <div className="w-full h-max rounded-xl border p-3 bg-secondary/50 flex flex-col sm:flex-row items-start justify-between gap-4 md:gap-6">
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-6 w-72 my-3" />
                          <div className="text-sm flex items-center gap-2 w-max group mb-2">
                            <Skeleton className="size-4 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <div className="text-sm flex items-center gap-2 w-max group mb-4">
                            <Skeleton className="size-4 rounded-full" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                          <div className="text-sm flex items-center gap-2 w-max group">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="size-4 rounded-full" />
                          </div>
                        </div>

                        <Skeleton className="w-full sm:w-[147px] aspect-[1.3] sm:aspect-square rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))
              ) : ownedEvents?.length === 0 ? (
                <div className="flex items-center justify-center flex-col py-28">
                  <IoCalendarOutline className="text-muted-foreground mb-4 opacity-50 w-28 h-28" />
                  <h1 className="text-base md:text-xl font-bold">
                    No Upcoming Events
                  </h1>
                  {credentials?.address === address ? (
                    <>
                      <p className="text-muted-foreground text-sm">
                        You have no upcoming events. Why not host one?
                      </p>
                      <Button variant="secondary" className="mt-4 pl-3" asChild>
                        <Link href="/create" className="flex items-center">
                          <Plus size={16} className="mr-2" />
                          Create Event
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {currentUser?.email} have no upcoming events.
                    </p>
                  )}
                </div>
              ) : (
                ownedEvents &&
                ownedEvents
                  .slice()
                  .reverse()
                  .map((event: IEvent) => (
                    <EventCard hide event={event} key={event.eventId} />
                  ))
              )}
            </div>
          ) : (
            "NFTs"
          )}
        </div>
      </div>
    </div>
  );
}
