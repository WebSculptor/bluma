import { ethers } from "ethers";
import CONTRACT_ABI from "@/json/luma.json";
import { EventStatus, EventType, RegStatus } from "@/enums";

let ethereum: any;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

if (typeof window !== "undefined") ethereum = (window as any).ethereum;

export const getEthereumContracts = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await ethereum?.request({ method: "eth_accounts" });

    let provider;
    let signer;

    if (accounts?.length > 0) {
      provider = new ethers.BrowserProvider(ethereum);
      signer = await provider.getSigner();
    } else {
      // provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      provider = new ethers.WebSocketProvider(
        process.env.NEXT_PUBLIC_WEB_SOCKET!
      );
      const wallet = ethers.Wallet.createRandom();
      signer = wallet.connect(provider);
    }

    const contracts = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};

export const checkIfUserIsRegistered = async (address: string) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getEthereumContracts();
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
    const contract = await getEthereumContracts();
    const user = await contract.getUser(address);

    if (!user) {
      return undefined;
    }

    const structuredUser: IUserCredentials = {
      email: user[0],
      address: user[1],
      isRegistered: user[2],
      avatar: user[3],
      balance: Number(user[4]),
    };

    return structuredUser;
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
    const contract = await getEthereumContracts();
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
    const contract = await getEthereumContracts();

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
    };
    console.log(redefinedEventData);

    const tx = await contract.createEvent(
      event.title,
      event.imageUrl,
      event.description,
      event.location,
      event.capacity,
      event.regStartsTime,
      event.regEndsTime,
      event.eventStartsTime,
      event.eventEndsTime,
      newTicketPrice,
      isEventPaid
    );

    await tx.wait();

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

    const contract = await getEthereumContracts();
    const events: IEvent[] = await contract.getAllEvents();

    if (!events) {
      console.log("No events found");
      return undefined;
    }

    return events;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const getEventById = async (eventId: any) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getEthereumContracts();
    const event = await contract.getEventById(eventId);

    const refinedEvents: IEvent = {
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
    };

    if (!refinedEvents) {
      console.log("No event found");
      return undefined;
    }

    return refinedEvents;
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

    const contract = await getEthereumContracts();
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

    const contract = await getEthereumContracts();
    const event = contract.getAllEventGroups();

    if (!event) {
      console.log("No groups found");
      return undefined;
    }

    return event;
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

    const contract = await getEthereumContracts();
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

    const contract = await getEthereumContracts();
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

export const getAllTickets = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install a browser provider");
    }

    const contract = await getEthereumContracts();
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

    const contract = await getEthereumContracts();
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

    const contract = await getEthereumContracts();
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

    const contract = await getEthereumContracts();
    const message = await contract.groupChat(Number(groupId), String(msg));

    const result = await message.wait();

    if (!result.status) {
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (error) {
    reportError(error);
    throw error;
  }
};
