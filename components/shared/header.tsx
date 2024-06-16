"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { cn, shortenAddress } from "@/lib/utils";

//? ICONS
import { RiSearch2Line } from "react-icons/ri";
import ProfilePicture from "./profile-picture";
import { Button } from "../ui/button";
import { Bell, Plus } from "lucide-react";
import { nav_links } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./logo";
import { useGlobalContext } from "@/providers/global-provider";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { LogOutModal } from "./logout-modal";
import { useEffect, useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const pathname = usePathname();

  const [time, setTime] = useState("");

  const { open } = useWeb3Modal();

  const { isAuthenticated, setIsAuthenticated, credentials, isFetchingUser } =
    useGlobalContext();

  return (
    <header className="px-4 py-3 flex items-center justify-between md:justify-normal backdrop-blur-md gap-6 md:gap-0 sticky top-0 z-50">
      <div className="w-max xl:w-[350px]">
        <Logo path="/" />
      </div>

      {isAuthenticated && (
        <nav
          className={cn(
            "hidden md:flex items-center justify-start gap-4 px-4 mx-auto w-full max-w-full lg:max-w-[820px]",
            {
              "lg:max-w-[960px]":
                pathname === "/" ||
                pathname === "/create" ||
                pathname.includes("/event/"),
            }
          )}>
          {nav_links.map((link) => {
            const isActive = link.path === pathname;

            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300",
                  {
                    "text-initial hover:text-initial": isActive,
                  }
                )}>
                <link.icon className="w-4 h-4 mr-1.5" />
                <p className="text-xs md:text-sm capitalize font-semibold">
                  {link.name}
                </p>
              </Link>
            );
          })}
        </nav>
      )}

      <div
        className={cn("flex items-center gap-4 w-[350px] justify-end", {
          "w-[380px] ml-auto": !isAuthenticated,
        })}>
        {!isAuthenticated ? (
          <Button
            size="sm"
            className="rounded-full h-[30px]"
            variant="secondary"
            asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        ) : (
          <>
            <Link
              href="/create"
              className="text-xs md:text-sm font-semibold text-primary/80 hover:text-primary transition-colors duration-300 hidden md:flex">
              Create Event
            </Link>

            <RiSearch2Line
              size={16}
              className="text-muted-foreground hover:text-primary transition-all cursor-pointer"
            />
            <Bell
              size={16}
              className="text-muted-foreground hover:text-primary transition-all cursor-pointer"
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <ProfilePicture
                  size="sm"
                  src={
                    credentials && credentials?.avatar
                      ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                      : "/assets/logo.png"
                  }
                  initials={"AS"}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4 mt-2 w-[260px]">
                <DropdownMenuLabel asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 flex-1 p-3 hover:bg-secondary/50 rounded-sm">
                    <ProfilePicture
                      size="default"
                      src={
                        credentials && credentials?.avatar
                          ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${credentials?.avatar}`
                          : "/assets/logo.png"
                      }
                      initials={"AS"}
                    />

                    <div className="flex flex-col whitespace-pre-wrap w-full overflow-x-hidden">
                      <p className="text-sm truncate font-semibold flex-1">
                        {credentials && credentials?.email
                          ? credentials?.email
                          : "anonymous@example.com"}
                      </p>
                      <p className="text-xs truncate font-semibold flex-1 text-muted-foreground">
                        {credentials && credentials?.address
                          ? shortenAddress(credentials?.address)
                          : shortenAddress(
                              "0x0000000000000000000000000000000000000000"
                            )}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="py-2 px-3 text-[13px] cursor-pointer font-medium">
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-2 px-3 text-[13px] cursor-pointer font-medium"
                  onClick={async () => await open()}>
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogOutModal />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger className="flex md:hidden">
                <CgMenuRightAlt size={17} className="text-primary" />
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col mt-10 w-full">
                  {nav_links.map((link) => {
                    const isActive = link.path === pathname;

                    return (
                      <SheetClose key={link.path} asChild>
                        <Link
                          href={link.path}
                          className={cn(
                            "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 py-3 border-b",
                            {
                              "text-initial hover:text-initial": isActive,
                            }
                          )}>
                          <link.icon size={16} className="mr-2" />
                          <p className="text-sm capitalize font-medium">
                            {link.name}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                  <SheetClose asChild>
                    <Link
                      href="/create"
                      className={cn(
                        "flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 py-3 border-b",
                        {
                          "text-initial hover:text-initial":
                            pathname === "/create",
                        }
                      )}>
                      <Plus size={16} className="mr-2" />
                      <p className="text-sm capitalize font-medium">
                        Create Event
                      </p>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </header>
  );
}
