import { Ticket, CircleUser, PencilLine } from "lucide-react";

export const nav_links = [
  {
    name: "Events",
    icon: Ticket,
    path: "/home",
  },
  {
    name: "Profile",
    icon: CircleUser,
    path: "/profile",
  },
  {
    name: "What's New",
    icon: PencilLine,
    path: "/update",
  },
];

export const site = {
  name: "Luma",
  description: "Delightful events start here.",
  url: "",
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
