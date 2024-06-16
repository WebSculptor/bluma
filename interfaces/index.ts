interface ILayout {
  children: React.ReactNode;
}

interface IAvatar {
  src?: string;
  initials?: string;
  size: "sm" | "default";
}

interface IUserCredentials {
  address: string;
  email: string;
  avatar: string;
  isRegistered?: boolean;
  balance?: number;
}

interface ITicket {
  ticketId: number;
  eventId: number;
  buyer: string;
  ticketCost: number;
  purchaseTime: number;
  numberOfTicket: number;
}

interface IEventGroup {
  eventId: number;
  title: string;
  imageUrl: string;
  description: string;
  members: string[];
}

type IGroupMembers = IUserCredentials & ITicket & IEventGroup;

interface IWrapper {
  children: React.ReactNode;
  className?: string;
}

interface IEvent {
  eventId: number;
  title: any;
  imageUrl: string;
  location: string;
  description: string;
  owner: string;
  seats: number;
  capacity: number;
  regStartsTime: number;
  regEndsTime: number;
  regStatus: string | number;
  eventStatus: string | number;
  eventType: string | number;
  eventStartsTime: number;
  eventEndsTime: number;
  ticketPrice: number;
  totalSales: number;
  createdAt: number;
  isEventPaid: boolean;
}

type ICreateEvent = Pick<
  IEvent,
  | "title"
  | "ticketPrice"
  | "capacity"
  | "location"
  | "imageUrl"
  | "description"
  | "regEndsTime"
  | "regStartsTime"
  | "eventEndsTime"
  | "eventStartsTime"
>;

interface IMessage {
  sender: string;
  email: string;
  message: string;
  timestamp: number;
}
