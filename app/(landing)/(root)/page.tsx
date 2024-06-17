import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function RootPage() {
  return (
    <div className="flex justify-center items-center flex-1 flex-col lg:flex-row py-10 sm:py-0 gap-8 md:gap-4">
      <div className="size-full fixed top-0 left-0 min-h-svh backdrop-blur-3xl opacity-50 -z-10">
        <Image
          src="/assets/gradient-dark.png"
          alt="gradient"
          priority
          fill
          className="object-cover size-full blur-3xl"
        />
      </div>
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-start">
        <Logo size="w-[50px] md:w-[80px] opacity-50 mb-4" />
        <h1 className="font-bold md:font-black text-4xl md:text-5xl lg:text-6xl lg:leading-[66px]">
          Delightful events
        </h1>
        <h1 className="font-bold md:font-black text-4xl md:text-5xl lg:text-6xl lg:leading-[66px] text-transparent bg-clip-text bg-gradient-to-r from-[#4479F5] via-[#EF57C6] to-[#FF6F48]">
          start here.
        </h1>

        <p className="font-medium text-base md:text-lg mt-2 md:mt-5 mb-4 md:mb-7">
          Set up an event page, invite friends and sell tickets. Host a
          memorable event today.
        </p>

        <Button asChild size="lg">
          <Link href="/create" className="w-max">
            Create Your First Event
          </Link>
        </Button>
      </div>
      <div className="max-w-[550px] w-full relative px-4 lg:px-0">
        <video
          autoPlay
          loop
          muted
          className="size-full select-none pointer-events-none"
          src="/assets/landing.webm"
        />
      </div>
    </div>
  );
}
