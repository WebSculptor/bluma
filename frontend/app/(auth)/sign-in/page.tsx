"use client";

//? OTHER IMPORT
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { createAvatar } from "@dicebear/core";
import { loreleiNeutral } from "@dicebear/collection";
import { authSchema } from "@/lib/validators";
import { toast } from "sonner";
import { Authenticating } from "@/constants";
import { useState } from "react";
import { base64ToBlob, blobToFile, uploadBannerToPinata } from "@/lib/utils";

//? COMPONENTS IMPORT
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//? ICONS IMPORT
import { Asterisk, Loader, ScanFace } from "lucide-react";
import { IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { createAccount } from "@/services";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const { STOP, START, GENERATING } = Authenticating;

  const { isAuthenticated } = useGlobalContext();

  const [isRegistering, setIsRegistering] = useState<string | boolean>(STOP);
  const [userAvatar, setUserAvatar] = useState("");

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authSchema>) {
    if (!address) {
      return toast.error("Please connect your wallet");
    }
    setIsRegistering(START);
    const avatar = createAvatar(loreleiNeutral, {
      seed: `${address + values.email}`,
    });

    const png = await avatar.png().toDataUri();

    try {
      // Extract the content type from the data URI
      const contentType = png?.match(/data:(.*);base64,/)?.[1];

      // Convert the base64 data URI to Blob
      const blob = base64ToBlob(png, contentType);

      // Convert the Blob to File
      const file = blobToFile(blob, "avatar.png");

      // Upload the File to Pinata
      setIsRegistering(GENERATING);
      const fileUrl = await uploadBannerToPinata(file);
      toast.success("Avatar created successfully! 🎉");

      const refinedValues = {
        address: `${address}`,
        email: values.email,
        avatar: fileUrl,
      };

      setUserAvatar(refinedValues.avatar);
      setIsRegistering(START);

      new Promise<IUserCredentials>((resolve, reject) => {
        createAccount(refinedValues)
          .then((tx) => {
            console.log(tx);
            if (tx !== undefined) {
              toast.success("Account created successfully! 🎉");
              setTimeout(() => {
                toast.loading("Redirecting, please hold...");

                router.push("/home");
                resolve(tx);
              }, 2000);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.error("Error processing avatar upload:", error);
      setIsRegistering(STOP);
    }
  }

  return (
    <div className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/30 flex flex-col">
      <div className="px-6 py-5 border-b">
        <div className="w-full">
          <div className="rounded-full w-16 h-16 bg-secondary/60 flex items-center justify-center relative">
            {userAvatar ? (
              <Image
                src={`https://gateway.pinata.cloud/ipfs/${userAvatar}`}
                // src={`data:image/svg+xml;utf8,${encodeURIComponent(
                //   userAvatar
                // )}`}
                alt="avatar"
                fill
                className="object-cover rounded-[inherit]"
              />
            ) : (
              <ScanFace size={36} className="text-muted-foreground" />
            )}
          </div>
        </div>

        <h1 className="mt-3 text-lg md:text-[22px] font-bold">
          Welcome to Luma
        </h1>
        <p className="text-xs md:text-sm opacity-75">
          Please sign in or sign up below.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              disabled={
                !isConnected ||
                !address ||
                isRegistering !== STOP ||
                isAuthenticated
              }
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full mt-4">
                  <FormLabel>
                    Email Address <Asterisk size={12} className="text-xs" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={
                !isConnected ||
                !address ||
                isRegistering !== STOP ||
                isAuthenticated
              }>
              {isRegistering === START ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Please wait...
                </>
              ) : isRegistering === GENERATING ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Creating Avatar...
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="py-4 px-6 flex flex-col">
        <Button
          className="w-full h-10"
          variant="secondary"
          type="button"
          disabled={isConnected || isRegistering !== STOP}
          onClick={async () => await open()}>
          <IoWalletOutline size={16} className="mr-2" />{" "}
          {isConnected ? "Wallet Connected" : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}
