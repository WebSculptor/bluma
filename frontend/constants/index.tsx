import { Ticket, PencilLine, ShoppingCart } from "lucide-react";

export const nav_links = [
  {
    name: "Events",
    icon: Ticket,
    path: "/home",
  },
  {
    name: "What's New",
    icon: PencilLine,
    path: "/update",
  },
  {
    name: "Get Token",
    icon: ShoppingCart,
    path: "/market",
  },
];

export const site = {
  name: "Bluma",
  description: "Delightful events start here.",
  url: "https://bluma.vercel.app",
  icon: "/assets/logo.png",
  author: "Abdullahi Salihu",
  profile: "https://ttatyz.vercel.app/",
};

export const CreatingEvent = {
  START: true,
  STOP: false,
  UPLOADING: "uploading",
  APPROVING: "approving",
};

export const Authenticating = {
  START: true,
  STOP: false,
  GENERATING: "generating",
};
