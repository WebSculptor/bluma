"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { site } from "@/constants";
import { shortenAddress } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { mintSchema } from "@/lib/validators";
import { Transactions } from "@/components/shared/transactions";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function MarketPage() {
  const { isConnected, address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const [copied, setCopied] = useState(false);
  const [mintedTokens, setMintedTokens] = useState<IPayment[]>([]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof mintSchema>>({
    resolver: zodResolver(mintSchema),
    defaultValues: {
      tokens: "",
      address: address ? address : "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof mintSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setMintedTokens((prev) => [
      ...prev,
      {
        id: String(1),
        tokens: Number(values.tokens),
        status: "success",
        address: String(values.address),
      },
    ]);
  }

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        toast.success(`Copied ${shortenAddress(text)}`);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        toast.error("Failed to copy");
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 items-start justify-start sm:flex-row sm:justify-end sm:items-center sm:gap-4 w-full">
        {isConnected && (
          <div className="p-1.5 bg-secondary rounded-lg w-full sm:w-max">
            <div className="px-4 sm:px-3 py-2.5 sm:py-1.5 bg-background rounded-md">
              <p className="text-xs md:text-sm">
                Balance: <b>0 BLUM</b>
              </p>
            </div>
          </div>
        )}
        {isConnected ? (
          <div className="p-1.5 bg-secondary rounded-lg cursor-pointer w-full sm:w-max">
            <div
              className="px-4 sm:px-3 py-2.5 sm:py-1.5 bg-background rounded-md"
              onClick={() => address && handleCopy(`${address}`)}>
              <p className="text-xs md:text-sm">
                {copied ? "Copied" : "Account"}:{" "}
                <b>{shortenAddress(`${address}`)}</b>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-1.5 bg-secondary rounded-lg cursor-pointer w-max">
            <div className="px-4 sm:px-3 py-2.5 sm:py-1.5 bg-background rounded-md">
              <p
                className="text-xs md:text-sm"
                onClick={async () => await open()}>
                Connect Wallet
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start justify-between gap-6 md:gap-12 flex-col md:flex-row">
        <div className="flex flex-col w-full md:max-w-[400px] gap-4">
          <h1 className="font-bold text-xl md:text-2xl">Token Analytics</h1>

          <div className="relative w-full h-full">
            {!isConnected && (
              <div className="size-full z-10 absolute top-0 left-0 backdrop-blur-xl" />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col bg-secondary rounded-lg p-1.5 sm:p-2">
                <div className="size-full py-2 sm:py-3 px-3.5 sm:px-4 rounded-md bg-background">
                  <p className="text-xs sm:text-sm font-medium opacity-75">
                    Name
                  </p>
                  <h1 className="text-base sm:text-lg font-bold">
                    {site.name} Token
                  </h1>
                </div>
              </div>
              <div className="flex flex-col bg-secondary rounded-lg p-1.5 sm:p-2">
                <div className="size-full py-2 sm:py-3 px-3.5 sm:px-4 rounded-md bg-background">
                  <p className="text-xs sm:text-sm font-medium opacity-75">
                    Symbol
                  </p>
                  <h1 className="text-base sm:text-lg font-bold">BLUM</h1>
                </div>
              </div>
              <div className="flex flex-col bg-secondary rounded-lg p-1.5 sm:p-2">
                <div className="size-full py-2 sm:py-3 px-3.5 sm:px-4 rounded-md bg-background">
                  <p className="text-xs sm:text-sm font-medium opacity-75">
                    Total Supply
                  </p>
                  <h1 className="text-base sm:text-lg font-bold">1,000,000</h1>
                </div>
              </div>
              <div className="flex flex-col bg-secondary rounded-lg p-1.5 sm:p-2">
                <div className="size-full py-2 sm:py-3 px-3.5 sm:px-4 rounded-md bg-background">
                  <p className="text-xs sm:text-sm font-medium opacity-75">
                    Tokens Left
                  </p>
                  <h1 className="text-base sm:text-lg font-bold">500,000</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 w-full md:w-max gap-4">
          <h1 className="font-bold text-xl md:text-2xl">Mint your token</h1>

          <div className="relative w-full h-full">
            {!isConnected && (
              <div className="size-full z-10 absolute top-0 left-0 backdrop-blur-xl" />
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tokens to Mint</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 px-4"
                          placeholder="Enter number of tokens"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can only mint at least 2000 tokens
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 px-4"
                          disabled={!!address && isConnected}
                          placeholder="Enter wallet address"
                          type="string"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-4">
                  Mint Tokens
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col flex-1 gap-2">
        <h1 className="font-bold text-xl md:text-2xl">Transactions</h1>

        <div className="relative w-full h-full">
          {!isConnected && (
            <div className="size-full z-10 absolute top-0 left-0 backdrop-blur-xl" />
          )}
          <Transactions data={mintedTokens} />
        </div>
      </div>
    </div>
  );
}
