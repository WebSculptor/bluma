"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MaxWrapper({ children, className }: IWrapper) {
  const pathname = usePathname();

  return (
    <section
      className={cn("mx-auto px-4 w-full max-w-[820px]", className, {
        "max-w-[960px]":
          pathname === "/" ||
          pathname === "/create" ||
          pathname.includes("/event/"),
      })}>
      {children}
    </section>
  );
}