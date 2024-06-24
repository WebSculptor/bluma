"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortenAddress } from "@/lib/utils";
import {
  getAllEvents,
  getAllTicketsOfAUser,
  getAllUsers,
} from "@/services/bluma-contract";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/constants";

export default function AllUsersPage() {
  const [allUsers, setAllUsers] = useState<IUserCredentials[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [ownedEvents, setOwnedEvents] = useState<Record<string, IEvent[]>>({});
  const [purchasedTickets, setPurchasedTickets] = useState<
    Record<string, ITicket[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users: any = await getAllUsers();
        const events = await getAllEvents();

        const userOwnedEventsMap: Record<string, IEvent[] | any> = {};
        const userTicketsMap: Record<string, ITicket[] | any> = {};

        await Promise.all(
          users.map(async (user: any) => {
            const tickets = await getAllTicketsOfAUser(user.address);
            userTicketsMap[user?.address] = tickets;

            const userOwnedEvents = events?.filter(
              (event) => event.owner === user.address
            );
            userOwnedEventsMap[user.address] = userOwnedEvents;
          })
        );

        setAllUsers(users);
        setOwnedEvents(userOwnedEventsMap);
        setPurchasedTickets(userTicketsMap);
      } catch (error) {
        console.log("ERROR FETCHING USERS: ", error);
      } finally {
        setIsFetchingUsers(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col p-4">
      <Table>
        <TableCaption>
          {isFetchingUsers
            ? "Fetching all users..."
            : `A list of all the users in ${site.name}.`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[130px] sm:w-[180px]">Address</TableHead>
            <TableHead>Hosted</TableHead>
            <TableHead>Attended</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingUsers
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell>...</TableCell>
                  <TableCell className="text-right">...</TableCell>
                </TableRow>
              ))
            : allUsers.map((user) => (
                <TableRow key={user.address}>
                  <TableCell className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-secondary">
                      <Image
                        src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${user.avatar}`}
                        alt={user.address}
                        width={20}
                        height={20}
                        className="rounded-[inherit] object-cover"
                        priority
                      />
                    </div>
                    <Link
                      href={`/profile/${user.address}`}
                      className="text-xs md:text-sm font-semibold hover:underline">
                      {shortenAddress(user.address)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {ownedEvents[user.address]?.length || 0}
                  </TableCell>
                  <TableCell>
                    {purchasedTickets[user.address]?.length || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <b>{user.balance}</b> ETH
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
        {!isFetchingUsers && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
