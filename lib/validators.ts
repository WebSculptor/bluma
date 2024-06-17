import { z } from "zod";

export const authSchema = z.object({
  email: z.string().min(3),
});

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Event Title too short, minimum is 3 characters",
    })
    .max(30, {
      message: "Event Title too long, maximun is 30 characters",
    }),
  location: z.string(),
  capacity: z.coerce
    .number()
    .min(2, {
      message: "Capacity can not be less than 2",
    })
    .max(50000, {
      message: "Capacity can not be more than 50000",
    })
    .optional(),
  ticketCost: z.coerce
    .number()
    .min(1, {
      message: "Ticket cost must not be less than 1 ETH",
    })
    .max(100, {
      message: "Ticket cost must not be more than 100 ETH",
    })
    .optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(2).max(700),
});
