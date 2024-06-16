"use client";

import EventCard from "@/components/cards/event-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { site } from "@/constants";
import { EventStatus, EventType, RegStatus } from "@/enums";
import {
  getAllEventGroups,
  getAllEvents,
  getEthereumContracts,
  getEventGroupById,
} from "@/services";
import { ethers } from "ethers";
import { CalendarSearch, Plus } from "lucide-react";
import { IoCalendarOutline } from "react-icons/io5";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<IEvent[] | undefined>([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);

  useEffect(() => {
    document.title = `Events ・ ${site.name}`;
    const fetchEvents = async () => {
      setIsFetchingEvents(true);

      try {
        const evt: IEvent[] | any = await getAllEvents();

        if (evt) {
          const refinedEvents = evt.map((event: any) => ({
            eventId: Number(event[0]),
            title: String(ethers.decodeBytes32String(event[1])),
            imageUrl: String(event[2]),
            location: String(event[3]),
            description: String(event[4]),
            owner: String(event[5]),
            seats: Number(event[6]),
            capacity: Number(event[7]),
            regStartsTime: Number(event[8]),
            regEndsTime: Number(event[9]),
            regStatus: RegStatus[Number(event[10])],
            eventStatus: EventStatus[Number(event[11])],
            eventType: EventType[Number(event[12])],
            eventStartsTime: Number(event[13]),
            eventEndsTime: Number(event[14]),
            ticketPrice: Number(event[15]),
            totalSales: Number(event[16]),
            createdAt: Number(event[17]),
            isEventPaid: Boolean(event[18]),
          }));

          setEvents(refinedEvents);

          // const allEvtGrp = await getAllEventGroups();

          // const evtGrp = allEvtGrp.map((grp: any) => ({
          //   eventId: Number(grp[0]),
          //   title: String(ethers.decodeBytes32String(grp[1])),
          //   imageUrl: grp[2],
          //   description: grp[3],
          //   members: grp[4],
          // }));

          // for (const group of evtGrp) {
          //   const groupDetails = await getEventGroupById(group.eventId);
          //   const redefinedGroup = groupDetails.map((grp: any) => ({
          //     eventId: Number(grp[0]),
          //     title: String(ethers.decodeBytes32String(grp[1])),
          //     imageUrl: grp[2],
          //     description: grp[3],
          //     members: grp[4],
          //   }));

          //   console.log("refined groups", redefinedGroup);
          // }
        }
      } catch (error: any) {
        console.log("COULD NOT FETCH EVENT", error);
      } finally {
        setIsFetchingEvents(false);
      }
    };

    const listenForEvent = async () => {
      const contract = await getEthereumContracts();

      contract.on(
        "EventCreated",
        async (_totalEventsId, _seatNumber, _capacity) => {
          try {
            const evt: IEvent[] | any = await getAllEvents();

            if (evt) {
              const refinedEvents = evt.map((event: any) => ({
                eventId: Number(event[0]),
                title: event[1],
                imageUrl: String(event[2]),
                location: String(event[3]),
                description: String(event[4]),
                owner: String(event[5]),
                seats: Number(event[6]),
                capacity: Number(event[7]),
                regStartsTime: Number(event[8]),
                regEndsTime: Number(event[9]),
                regStatus: RegStatus[Number(event[10])],
                eventStatus: EventStatus[Number(event[11])],
                eventType: EventType[Number(event[12])],
                eventStartsTime: Number(event[13]),
                eventEndsTime: Number(event[14]),
                ticketPrice: Number(event[15]),
                totalSales: Number(event[16]),
                createdAt: Number(event[17]),
                isEventPaid: Boolean(event[18]),
              }));

              setEvents(refinedEvents);
            }
          } catch (error: any) {
            console.log("COULD NOT FETCH EVENT", error);
          } finally {
            setIsFetchingEvents(false);
          }
        }
      );

      return () => {
        contract.removeAllListeners("EventCreated");
      };
    };

    fetchEvents();
    listenForEvent();
  }, []);

  return (
    <div className="flex-1 h-full">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl md:text-2xl">Events</h1>

        <div className="bg-secondary/50 p-[2px] rounded-lg flex items-center">
          <div className="py-1.5 px-3 rounded-md bg-secondary text-xs text-center font-semibold cursor-pointer w-[83px]">
            Upcoming
          </div>
          <div className="py-1.5 px-3 rounded-md bg-transparent text-xs text-center font-semibold cursor-pointer w-[83px]">
            Past
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-12 flex flex-col h-full">
        {isFetchingEvents ? (
          Array.from({ length: 5 }).map((_, _key) => (
            <div
              className="flex items-start flex-col md:flex-row w-full gap-4 md:gap-6 group"
              key={_key}>
              <div className="flex-1 h-full hidden sm:block md:sticky md:top-20">
                <div className="relative font-semibold text-sm sm:text-base md:pb-10 flex flex-col gap-2">
                  <Skeleton className="w-28 h-4" />
                  <Skeleton className="w-16 h-4" />
                  <span className="hidden md:flex absolute top-0 -right-[5.5px] size-2.5 rounded-full bg-secondary" />
                  <span className="hidden md:flex absolute top-0 -right-px w-px bg-gradient-to-b from-secondary via-secondary/30 to-transparent h-[200px]" />
                </div>
              </div>

              <div className="mb-10 max-w-full md:max-w-[612px] w-full">
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
        ) : events?.length === 0 ? (
          <div className="flex items-center justify-center flex-col py-28">
            <IoCalendarOutline className="text-muted-foreground mb-4 opacity-50 w-28 h-28" />
            <h1 className="text-base md:text-xl font-bold">
              No Upcoming Events
            </h1>
            <p className="text-muted-foreground text-sm">
              You have no upcoming events. Why not host one?
            </p>
            <Button variant="secondary" className="mt-4 pl-3" asChild>
              <Link href="/create" className="flex items-center">
                <Plus size={16} className="mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        ) : (
          events &&
          events
            .slice()
            .reverse()
            .map((event: IEvent) => (
              <EventCard {...event} key={event.eventId} />
            ))
        )}
      </div>
    </div>
  );
}