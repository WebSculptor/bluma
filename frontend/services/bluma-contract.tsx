import { EnEvent, EnStatus } from "@/enums";
import { getStatus } from "@/lib/utils";
import { getBlumaContracts, ethereum } from "./index";
import { ethers } from "ethers";

export const checkIfUserIsRegistered = async (address: string) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const isRegistered: boolean = await contract.isRegistered(address);

    return isRegistered;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getUser = async (
  address: string
): Promise<IUserCredentials | undefined> => {
  try {
    const contract = await getBlumaContracts();
    const user = await contract.getUser(address);

    const structuredUser: IUserCredentials = {
      email: user[0],
      address: user[1],
      isRegistered: user[2],
      avatar: user[3],
      balance: Number(user[4]),
    };

    if (
      structuredUser?.address.toString() ===
      process.env.NEXT_PUBLIC_ADDRESS_ZERO?.toString()
    ) {
      return undefined;
    }

    return structuredUser;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<
  IUserCredentials[] | undefined
> => {
  try {
    const contract = await getBlumaContracts();
    const users = await contract.getAllUser();

    const redefinedUsers: IUserCredentials[] = await users?.map((usr: any) => ({
      email: usr[0],
      address: usr[1],
      isRegistered: usr[2],
      avatar: usr[3],
      balance: Number(usr[4]),
    }));

    return redefinedUsers;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const createAccount = async (
  credentials: IUserCredentials
): Promise<IUserCredentials> => {
  if (!ethereum) {
    reportError("Please install a browser provider");
    return Promise.reject(new Error("Browser provider not installed"));
  }

  try {
    const contract = await getBlumaContracts();
    const tx = await contract.createAccount(
      credentials.email,
      credentials.address,
      credentials.avatar
    );
    await tx.wait();

    return Promise.resolve(tx);
  } catch (error) {
    reportError(error);
    return Promise.reject(error);
  }
};

export const createEvent = async (event: ICreateEvent) => {
  if (!ethereum) {
    reportError("Please install a browser provider");
    return Promise.reject(new Error("Browser provider not installed"));
  }

  const isEventPaid = event.ticketPrice === 0 ? false : true;
  const newTicketPrice = event.ticketPrice === 0 ? 10 : event.ticketPrice;

  try {
    const contract = await getBlumaContracts();

    // Log parameters for debugging
    const redefinedEventData = {
      _title: event.title,
      _imageUrl: event.imageUrl,
      _description: event.description,
      _location: event.location,
      _capacity: event.capacity,
      _regStartsTime: event.regStartsTime,
      _regEndsTime: event.regEndsTime,
      _eventStartsTime: event.eventStartsTime,
      _eventEndsTime: event.eventEndsTime,
      _ticketPrice: newTicketPrice,
      _isEventPaid: isEventPaid,
      _nftUrl: event.nftUrl,
    };

    const tx = await contract.createEvent(
      redefinedEventData._title,
      redefinedEventData._imageUrl,
      redefinedEventData._description,
      redefinedEventData._location,
      redefinedEventData._capacity,
      redefinedEventData._regStartsTime,
      redefinedEventData._regEndsTime,
      redefinedEventData._eventStartsTime,
      redefinedEventData._eventEndsTime,
      redefinedEventData._ticketPrice,
      redefinedEventData._isEventPaid,
      redefinedEventData._nftUrl,
      {
        gasPrice: 100000000000,
        gasLimit: 456902,
      }
    );

    const result = await tx.wait();
    if (!result.status) {
      reportError("ERROR CREATING EVENT...");
      return Promise.reject("ERROR CREATING EVENT...");
    }
    console.log("REFINED EVENT DATA: ", redefinedEventData);

    return Promise.resolve(tx);
  } catch (error) {
    reportError(error);
    console.error("Transaction failed:", error); // Log error for debugging
    return Promise.reject(error);
  }
};

export const getAllEvents = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const events: IEvent[] = await contract.getAllEvents();

    if (!events) {
      console.log("No events found");
      return undefined;
    }

    const refinedEvents = events.map((event: any) => ({
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
      regStatus:
        EnStatus[getStatus(Date.now(), Number(event[8]), Number(event[9]))],
      eventStatus:
        EnStatus[getStatus(Date.now(), Number(event[13]), Number(event[14]))],
      eventType: EnEvent[Number(event[12])],
      nftUrl: String(event[13]),
      eventStartsTime: Number(event[14]),
      eventEndsTime: Number(event[15]),
      ticketPrice: Number(event[16]),
      totalSales: Number(event[17]),
      createdAt: Number(event[18]),
      isEventPaid: Boolean(event[19]),
    }));

    return refinedEvents;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getEventById = async (
  eventId: any
): Promise<IEvent | undefined> => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const events = await getAllEvents();

    if (!events) {
      console.log("No event found");
      return undefined;
    }

    const refinedEvent = events?.find(
      (event: IEvent) => event?.eventId === eventId
    );

    return refinedEvent;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const purchaseTicket = async (eventId: any, numberOfTickets: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const tx = await contract.purchaseTicket(eventId, numberOfTickets);

    const result = await tx.wait();

    if (!result.status) throw new Error("Failed to purchase ticket");

    return result;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllEventGroups = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const rooms = await contract.getAllEventGroups();

    if (!rooms) {
      console.log("No groups found");
      return undefined;
    }

    const evtGrp = rooms?.map((grp: any) => ({
      eventId: Number(grp[0]),
      title: String(ethers.decodeBytes32String(grp[1])),
      imageUrl: grp[2],
      description: grp[3],
      members: grp[4],
    }));

    return evtGrp;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getGroupMembersOfAnEvent = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const members = await contract.getGroupMembers(Number(eventId));

    const redefinedMembers = await members?.map((member: any) => ({
      address: String(member[0]),
      timestamp: Number(member[1]),
    }));

    if (!redefinedMembers) {
      console.log("No members found");
      return undefined;
    }

    return redefinedMembers;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getEventGroupById = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const group = await contract.getEventGroup(eventId);

    if (!group) {
      console.log("No group with the id found");
      return undefined;
    }

    // Fetch user credentials for each member
    const membersPromises = (group[4] || []).map(async (mb: any) => {
      const user = await getUser(String(mb[0]));
      return {
        timestamp: Number(mb[1]),
        ...user,
      };
    });

    // // Fetch user credentials for each sender
    const senderPromises = (group[5] || []).map(async (sd: any) => {
      const user = await getUser(String(sd[0]));
      return {
        sender: String(sd[0]),
        email: String(sd[1]),
        content: String(sd[2]),
        timestamp: Number(sd[3]),
        ...user,
      };
    });

    // Resolve promises
    const members = await Promise.all(membersPromises);
    const messages = await Promise.all(senderPromises);

    const redefinedGroup = {
      eventId: Number(group[0]),
      title: String(ethers.decodeBytes32String(group[1])),
      imageUrl: String(group[2]),
      description: String(group[3]),
      members: members,
      messages: messages,
    };

    return redefinedGroup;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllTicketsOfAUser = async (address: string) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const tickets = await contract.getTicket(address);

    const redefinedTickets = {
      ticketId: Number(tickets[0]),
      eventId: Number(tickets[1]),
      buyer: String(tickets[2]),
      ticketCost: Number(tickets[3]),
      purchaseTime: Number(tickets[4]),
      numberOfTicket: Number(tickets[5]),
    };

    if (!redefinedTickets) {
      console.log("No tickets bought");
      return undefined;
    }

    const allTickets = await getAllTickets();

    const userTickets = allTickets?.filter((tk) => tk?.buyer === address);

    return userTickets;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllTickets = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const tickets = await contract.getAllTickets();

    const redefinedTickets = tickets?.map((ticket: any) => ({
      ticketId: Number(ticket[0]),
      eventId: Number(ticket[1]),
      buyer: String(ticket[2]),
      ticketCost: Number(ticket[3]),
      purchaseTime: Number(ticket[4]),
      numberOfTicket: Number(ticket[5]),
    }));

    if (!redefinedTickets) {
      console.log("No tickets bought");
      return undefined;
    }

    // Consolidate tickets by buyer
    const ticketMap = new Map();

    redefinedTickets.forEach((ticket: ITicket) => {
      if (ticketMap.has(ticket.buyer)) {
        const existingTicket = ticketMap.get(ticket.buyer);
        existingTicket.numberOfTicket += ticket.numberOfTicket;
        existingTicket.ticketCost += ticket.ticketCost;
        existingTicket.purchaseTime = Math.max(
          existingTicket.purchaseTime,
          ticket.purchaseTime
        );
      } else {
        ticketMap.set(ticket.buyer, { ...ticket });
      }
    });

    // Convert the map back to an array
    const consolidatedTickets = Array.from(ticketMap.values());

    // Fetch user details for each unique buyer
    const promises = consolidatedTickets.map(async (ticket) => {
      const user: IUserCredentials | undefined = await getUser(ticket?.buyer);
      return {
        ...ticket,
        ...user,
      };
    });

    const ticketsWithUserDetails = await Promise.all(promises);

    return ticketsWithUserDetails;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllTicketsOfAnEvent = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    // Retrieve all tickets
    const allTickets = await getAllTickets();

    if (!allTickets) {
      console.log("No tickets here");
      return;
    }

    // Filter tickets by eventId
    const eventTickets = allTickets?.filter(
      (ticket) => Number(ticket.eventId) === Number(eventId)
    );

    return eventTickets;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const joinGroup = async (eventId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const joined = await contract.joinGroup(eventId);

    if (!joined) {
      console.log("Cound not join group");
      return false;
    }

    return true;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getAllGroupMessages = async (groupId: number) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getBlumaContracts();
    const groupMessages = await contract.getGroupMessages(Number(groupId));

    if (!groupMessages) {
      console.log("No groups found");
      return [];
    }

    const redefinedGroupMessages: IMessage[] = await Promise.all(
      groupMessages.map(async (message: any) => {
        const structuredMessage: IMessage = {
          sender: String(message[0]),
          email: String(message[1]),
          content: String(message[2]),
          timestamp: Number(message[3]),
        };

        const user = await getUser(structuredMessage.sender);

        return {
          ...structuredMessage,
          ...user,
        };
      })
    );

    return redefinedGroupMessages;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const sendMessage = async (groupId: number, msg: string) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }
    console.log("GETTING CONTRACT...");
    const contract = await getBlumaContracts();
    console.log("CONTRACT IS AVAILABLE...");
    console.log("SENDING MESSAGE...");
    const message = await contract.groupChat(groupId, msg);
    console.log("MESSAGE SENT...");

    console.log("WAITING FOR TRANSACTION...");
    const result = await message.wait();
    console.log("TRANSACTION SENT...");

    if (!result.status) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.log("FAILED SENDING MESSAGE...", {
      errorMessage: error,
      msg,
      groupId,
    });
    reportError(error);
    throw error;
  }
};
