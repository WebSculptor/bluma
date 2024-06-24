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

export const bannerCIDs = [
  "QmX68bpuiS63MgMXSnAS7V3k5xhiYA3L9n7qDmfZ6dqXa4",
  "QmT2Atp4Pn9SBkpD25ePuGMngxuSeRRYMzdqDnLDbWEe58",
  "QmdehrtoeNwcFdbKQFqcEVnViEHhuFN226riLZYbXNTrqV",
  "QmY2y49AKysZgTPkaQHArx9u1Uag6Rpe8DRbyZ8j8eajwD",
  "QmVYzRHesrW23MkdeUtj5qafbFqaBb5FJzLGHdskJrwM12",
  "QmdbdSZDBQQ2tkrCcquZMhcFqWfxauvg5oyAnLm2zgg5E6",
  "QmVgzAKuLzQimJJ5Hhy3Gd7KRME2dRm93xuMuoQM4bU4CL",
  "QmdynREFrT5rRqxsnF8i8BYGiGs7irHwdsaJrmyEsYgR8k",
];
