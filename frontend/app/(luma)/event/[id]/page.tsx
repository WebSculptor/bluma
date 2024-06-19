"use client";

import { Button } from "@/components/ui/button";
import { EventStatus, EventType, RegStatus } from "@/enums";
import {
  calculateDateDifference,
  formatDate,
  getExpiryDate,
  shortenAddress,
} from "@/lib/utils";
import {
  getAllTicketsOfAnEvent,
  getEthereumContracts,
  getEventById,
  getEventGroupById,
  getGroupMembersOfAnEvent,
  getUser,
  joinGroup,
  purchaseTicket,
} from "@/services";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdPayments } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { AlarmClock, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import LoadDetails from "@/components/shared/load-details";
import { format } from "date-fns";
import { PiWechatLogoDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useGlobalContext } from "@/providers/global-provider";

let ethereum: any;
if (typeof window !== "undefined") ethereum = (window as any).ethereum;

export default function EventDetails({ params }: { params: { id: number } }) {
  const { credentials } = useGlobalContext();

  const [isFetchingEventDetails, setIsFetchingEventDetails] =
    useState<boolean>(true);
  const [event, setEvent] = useState<IEvent | undefined>();
  const [eventOwner, setEventOwner] = useState<IUserCredentials | undefined>();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [numTicket, setNumTicket] = useState();

  const [ticketBuyers, setTicketBuyers] = useState<any[] | undefined>([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [hasBoughtTicket, setHasBoughtTicket] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const currentDate = new Date();
  const endTimestamp = currentDate.getTime();

  const fetchEventData = async (eventId: number) => {
    try {
      // ? GETTING EVENT
      const event = await getEventById(eventId);
      if (event) {
        setEvent(event);

        console.log(event);

        // ? GET EVENT OWNER
        const currentEventOwner = await getUser(event?.owner);
        setEventOwner(currentEventOwner);

        if (
          currentEventOwner?.address.toLowerCase().toString() ===
          credentials?.address.toLowerCase().toString()
        ) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }

      // ? GET ALL TICKET BUYERS
      const whoBoughtTicket = await getAllTicketsOfAnEvent(eventId);
      if (whoBoughtTicket) {
        setTicketBuyers(whoBoughtTicket);

        // ? CHECK IF CURRENT USER HAS BOUGHT TICKET
        const hasBoughtTicket = whoBoughtTicket?.some(
          (user: any) => user?.address === credentials?.address
        );
        setHasBoughtTicket(hasBoughtTicket);
      }

      // ? GET EVENT GROUP MEMBERS
      const members = await getGroupMembersOfAnEvent(eventId);
      if (members) {
        setGroupMembers(members);

        // ? CHECK IF CURRENT USER IS IN GROUP
        const isMemberInGroup = members?.some(
          (member: any) => member?.address === credentials?.address
        );
        setHasJoinedGroup(isMemberInGroup);
      }

      return true;
    } catch (error: any) {
      console.log("FAILD TO FETCH EVENT:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingEventDetails(true);
      try {
        const data = await fetchEventData(Number(params?.id));
        if (data) {
          setIsFetchingEventDetails(false);
        }
      } catch (error: any) {
        console.log("FAILD TO FETCH EVENT:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials?.address, params?.id]);

  useEffect(() => {
    const listenForEvent = async () => {
      const contract = await getEthereumContracts();

      contract.on(
        "TicketPurchased",
        async (buyer, _eventId, numberOfTickets) => {
          await fetchEventData(Number(params?.id));
        }
      );

      return () => {
        contract.removeAllListeners("TicketPurchased");
      };
    };

    listenForEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const purchaseTicketProps: any = {
    eventId: params?.id,
    isPurchasing,
    setIsPurchasing,
    setNumTicket,
    numTicket,
    seats: event?.seats,
    capacity: event?.capacity,
    eventType: event?.eventType,
  };

  const joinGroupProps: any = {
    eventId: params?.id,
    title: event?.title,
  };

  if (isFetchingEventDetails) return <LoadDetails />;

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8">
      <div className="flex flex-col gap-4 max-w-full md:max-w-[350px] w-full h-max md:sticky md:top-[86px]">
        <div className="w-full bg-secondary/50 rounded-xl aspect-square relative">
          <Image
            src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${event?.imageUrl}`}
            alt="banner"
            fill
            priority
            className="rounded-[inherit] size-full pointer-events-none"
          />
        </div>
        <div className="flex flex-col gap-6">
          {!isAdmin && (
            <div className="flex flex-col w-full">
              <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
                Hosted By
              </p>

              <Link
                href={`/user/${eventOwner?.address}`}
                className="text-sm flex items-center gap-2 w-max group">
                <span className="size-5 bg-secondary rounded-full border relative">
                  <Image
                    alt={eventOwner?.address as string}
                    src={
                      eventOwner?.avatar
                        ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${eventOwner?.avatar}`
                        : "/assets/logo.png"
                    }
                    width={20}
                    height={20}
                    priority
                    className={`size-full ${
                      eventOwner?.avatar ? "rounded-full" : ""
                    }`}
                  />
                </span>
                <b className="group-hover:underline">
                  {shortenAddress(eventOwner?.address as string)}
                </b>
              </Link>
            </div>
          )}

          <div className="flex flex-col w-full">
            <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
              {!ticketBuyers
                ? "None signed up."
                : `${ticketBuyers?.length} Going`}
            </p>

            <div className="flex flex-col">
              <div className="flex items-center">
                {ticketBuyers?.slice(0, 6)?.map((member) => (
                  <span
                    className="size-8 bg-secondary rounded-full relative border-4 border-background first:-ml-1 -ml-3"
                    key={member?.email}>
                    <Image
                      alt={member?.address as string}
                      src={
                        member?.avatar
                          ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${member?.avatar}`
                          : "/assets/logo.png"
                      }
                      width={32}
                      height={32}
                      priority
                      className={`size-full ${
                        member?.avatar ? "rounded-full" : ""
                      }`}
                    />
                  </span>
                ))}
              </div>

              {ticketBuyers && ticketBuyers?.length === 1 ? (
                <p className="text-sm font-medium">
                  {shortenAddress(ticketBuyers[0]?.address)} only.
                </p>
              ) : ticketBuyers && ticketBuyers?.length === 2 ? (
                <p className="text-sm font-medium">
                  {shortenAddress(ticketBuyers[0]?.address)}, and{" "}
                  {shortenAddress(ticketBuyers[1]?.address)} only.
                </p>
              ) : ticketBuyers && ticketBuyers?.length >= 3 ? (
                <p className="text-sm font-medium">
                  {shortenAddress(ticketBuyers[0]?.address)}, and{" "}
                  {shortenAddress(ticketBuyers[1]?.address)} and{" "}
                  {ticketBuyers?.length - 2} others.
                </p>
              ) : (
                <p className="text-sm font-medium">No one has registered.</p>
              )}
            </div>
          </div>

          {!isAdmin && (
            <div className="flex flex-col w-full">
              <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
                Stay up to date
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  {calculateDateDifference({
                    startTimestamp: Number(event?.regStartsTime),
                    endTimestamp: Number(endTimestamp),
                    endedMessage: "Registration has ended",
                    notStartedMessage: "Registration has not started yet",
                  })}
                </p>
                {event?.regStartsTime && event?.regStartsTime < Date.now() ? (
                  <>
                    <p className="text-sm font-medium">
                      Keep track of the latest information and updates on the
                      event: <b>{event?.title}</b>
                    </p>
                    <div className="flex items-center gap-2">
                      {!hasBoughtTicket ? (
                        <BuyTicketPopup {...purchaseTicketProps} />
                      ) : hasJoinedGroup ? (
                        <Button variant="secondary" className="w-full" asChild>
                          <Link
                            className="flex items-center"
                            href={`/rooms/${Number(event?.eventId)}`}>
                            <PiWechatLogoDuotone size={16} className="mr-2" />
                            Go to Room
                          </Link>
                        </Button>
                      ) : (
                        <JoinGroupPopup {...joinGroupProps} />
                      )}
                    </div>
                  </>
                ) : event?.regStartsTime &&
                  event?.regStartsTime > Date.now() ? (
                  <p className="text-sm font-medium">
                    Registration starts on{" "}
                    <b>{format(event?.regStartsTime!, "LLL dd")}</b> and ends on{" "}
                    <b>{format(event?.regEndsTime!, "LLL dd")}</b>
                  </p>
                ) : (
                  event?.regEndsTime &&
                  Date.now() > event?.regEndsTime && (
                    <p className="text-sm font-medium">Registration closed</p>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2"></div>
      </div>

      <div className="flex-1 h-max flex flex-col gap-4 md:gap-6">
        <h1 className="w-full border border-x-0 text-2xl sm:text-3xl md:text-4xl font-extrabold py-4 border-y first-letter:uppercase">
          {event?.title}
        </h1>

        <div className="flex flex-col gap-2">
          <div className="flex justify-start items-center gap-3">
            <AlarmClock size={32} />
            Ends in {getExpiryDate(event?.eventEndsTime!)} day(s)
          </div>

          <div className="flex justify-start">
            {/* {eventLocationType(
              event?.location as string,
              32,
              true,
              "flex-row-reverse text-base text-foreground gap-3"
            )} */}
          </div>
        </div>

        {/* //TODO: IF USER HAS PURCHASED TICKET */}
        {/* <div className="p-4 border rounded-lg bg-secondary aspect-[2.5]"></div> */}
        {/* //TODO: IF USER HAS PURCHASED TICKET */}

        {event && Date.now() < event?.eventEndsTime && (
          <>
            <span>
              {calculateDateDifference({
                startTimestamp: Number(event?.eventEndsTime),
                endTimestamp: Number(endTimestamp),
                endedMessage: "Event has already ended",
                notStartedMessage: "Event has not started yet",
              })}
            </span>
          </>
        )}
        <span>{event && event?.capacity - event?.seats} seat(s) left</span>

        {event && event?.eventStartsTime > Date.now() && (
          <p className="text-gray-600">
            Starts on {formatDate(event?.eventStartsTime)}
          </p>
        )}

        {event &&
          Date.now() > event?.eventStartsTime &&
          getExpiryDate(event.eventEndsTime) !== 0 && (
            <p className="text-orange-500">
              Ends in {getExpiryDate(event.eventEndsTime)} day(s)
            </p>
          )}

        {event && Date.now() > event.eventEndsTime && (
          <p className="text-red-500">Expired</p>
        )}

        <div className="flex flex-col w-full">
          <p className="text-muted-foreground text-sm font-medium mb-4 pb-2 border-b">
            About Event
          </p>

          <ReactMarkdown
            className="overflow-hidden leading-6 whitespace-pre-wrap break-words flex-1 text-sm"
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className="text-sm leading-6 markdown prose w-full break-words"
                />
              ),
              code: ({ node, ...props }) => (
                <code
                  className="text-primary bg-secondary px-1 py-0.5 text-sm markdown prose break-words rounded-sm"
                  {...props}
                />
              ),
            }}>
            {event?.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

const BuyTicketPopup = ({
  eventId,
  isPurchasing,
  setIsPurchasing,
  numTicket,
  setNumTicket,
  seats,
  capacity,
  eventType,
}: {
  eventId: number;
  setIsPurchasing: any;
  isPurchasing: boolean;
  numTicket: number;
  setNumTicket: any;
  seats: number;
  capacity: number;
  eventType: string;
}) => {
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!numTicket) {
      toast.info("Please provide the number of tickets.");
      return;
    } else if (numTicket < 1) {
      toast.info("You need to purchase at least 1 ticket");
      return;
    } else if (numTicket > 10) {
      toast.info("You can only purchase at most 10 tickets");
      return;
    } else if (Number(numTicket) + Number(seats) > Number(capacity)) {
      toast.info("Not enough seats available");
      return;
    }

    // _event.seats + _numberOfTickets > _event.capacity;

    setIsPurchasing(true);
    try {
      const someonePurchaseTicket = await purchaseTicket(
        Number(eventId),
        Number(numTicket)
      );

      if (someonePurchaseTicket) {
        console.log(someonePurchaseTicket);
        toast.success("You now have a space in this event.");
        setIsPurchasing(false);
      }
    } catch (error: any) {
      console.log("FAILED TO PURCHASE TICKET:", error);
      setIsPurchasing(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={isPurchasing} className="w-1/2">
        <Button variant="default" className="w-full">
          {isPurchasing ? (
            <>
              <Loader size={16} className="animate-spin mr-2" /> Please wait...
            </>
          ) : (
            <>
              <MdPayments size={16} className="mr-2" />
              {eventType === "FREE" ? "Get Ticket" : "Buy Ticket"}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <MdPayments size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">Purchase Ticket</h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          {eventType === "FREE"
            ? "You will not be charged for the ticket, only"
            : "You will be charged for the ticket"}
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>Number of Tickets</Label>

            <Input
              onChange={(e: any) => setNumTicket(e.target.value)}
              placeholder="3 Tickets"
              className="h-10"
              type="number"
              minLength={1}
              maxLength={10}
              disabled={isPurchasing}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              disabled={isPurchasing}
              onClick={handleSubmit}
              type="submit"
              className="w-1/2">
              {isPurchasing ? (
                <Loader size={16} className="animate-spin" />
              ) : eventType === "FREE" ? (
                "Get Ticket"
              ) : (
                "Buy Ticket"
              )}
            </Button>
            <AlertDialogCancel className="w-1/2" disabled={isPurchasing}>
              Cancel
            </AlertDialogCancel>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const JoinGroupPopup = ({
  title,
  eventId,
}: {
  title: string;
  eventId: number;
}) => {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoiningGroup = async () => {
    setIsJoining(true);
    try {
      const joined = await joinGroup(Number(eventId));
      if (joined) {
        toast.success("Successfully joined group");
        router.push(`/rooms/${Number(eventId)}`);
        return;
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      console.log("FAILD TO JOIN GROUP:", error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-1/2">
        <Button variant="secondary" className="w-full">
          {isJoining ? (
            <>
              <Loader size={16} className="animate-spin mr-2" /> Joining...
            </>
          ) : (
            <>
              <PiWechatLogoDuotone size={16} className="mr-2" />
              Join Group
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/60 flex flex-col gap-4">
        <div className="w-full">
          <div className="rounded-full size-16 bg-secondary/80 flex items-center justify-center border">
            <PiWechatLogoDuotone size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-lg md:text-[22px] font-bold">Join Group Chat</h1>
        <p className="text-xs md:text-sm text-muted-foreground -mt-2">
          Follow the Most Recent News and Updates on the <b>{title}</b> group
          chat.
        </p>

        <div className="flex items-center flex-col sm:flex-row sm:gap-3 w-full">
          <Button
            className="w-full"
            onClick={handleJoiningGroup}
            disabled={isJoining}>
            {isJoining ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Join"
            )}
          </Button>
          <AlertDialogCancel disabled={isJoining} className="w-full">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
