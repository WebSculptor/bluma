"use client";

import { site } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Logo() {
  const pathname = usePathname();

  return (
    <Link
      href={pathname === "/" || pathname === "/home" ? "/" : "/home"}
      className="w-max">
      <h1 className={cn("text-base font-bold")}>{site.name}</h1>
    </Link>
  );
}
