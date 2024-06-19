"use client";

//? OTHER IMPORT
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { createAvatar } from "@dicebear/core";
import { loreleiNeutral } from "@dicebear/collection";
import { authSchema, otpSchema } from "@/lib/validators";
import { toast } from "sonner";
import { Authenticating, site } from "@/constants";
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
import { Asterisk, FileDigit, Loader, ScanFace } from "lucide-react";
import { IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { createAccount, getUser } from "@/services";
import { useGlobalContext } from "@/providers/global-provider";
import { useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { firebaseAuth } from "@/config/firbase";

export default function SignInPage() {
  const router = useRouter();

  const { isAuthenticated } = useGlobalContext();
  const { address, isConnected } = useWeb3ModalAccount();
  const { STOP } = Authenticating;

  const [isRegistering, setIsRegistering] = useState<string | boolean>(STOP);
  const [userCred, setUserCred] = useState<IUserCredentials | undefined>(
    undefined
  );
  const [hasOTPBeenSent, setHasOTPBeenSent] = useState(false);

  const formProps: any = {
    router,
    isRegistering,
    setIsRegistering,
    address,
    isConnected,
    setHasOTPBeenSent,
    setUserCred,
    userCred,
    isAuthenticated,
  };

  return hasOTPBeenSent ? (
    <OtpForm {...formProps} />
  ) : (
    <EmailForm {...formProps} />
  );
}

const EmailForm = ({
  isConnected,
  address,
  isRegistering,
  isAuthenticated,
  setIsRegistering,
  setHasOTPBeenSent,
  setUserCred,
}: {
  isConnected: boolean;
  address: string;
  isRegistering: string | boolean;
  isAuthenticated: boolean;
  setIsRegistering: any;
  setHasOTPBeenSent: any;
  setUserCred: any;
}) => {
  const { open } = useWeb3Modal();

  const { STOP, START, GENERATING } = Authenticating;

  const [userAvatar, setUserAvatar] = useState("");

  const authenticationForm = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleAuthentication(values: z.infer<typeof authSchema>) {
    if (!address) {
      return toast.error("Please connect your wallet");
    }
    setIsRegistering(START);
    const avatar = createAvatar(loreleiNeutral, {
      seed: `${address}`,
    });

    const png = await avatar.png().toDataUri();

    try {
      setIsRegistering(START);
      const checkForUser = await getUser(`${address}`);

      if (!checkForUser) {
        console.log("NO USER FOUND");
        console.log("CREATING ONE...");
        const contentType = png?.match(/data:(.*);base64,/)?.[1];
        const blob = base64ToBlob(png, contentType);
        const file = blobToFile(blob, "avatar.png");

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

        const userCredentials: IUserCredentials = await createAccount(
          refinedValues
        );

        if (userCredentials) {
          setUserCred(refinedValues);

          const otpSent = await sendOTP(
            refinedValues.email,
            refinedValues.address,
            refinedValues.avatar
          );

          if (otpSent) {
            setHasOTPBeenSent(true);
          } else {
            setHasOTPBeenSent(false);
          }
        }
      } else {
        setUserCred(checkForUser);

        const otpSent = await sendOTP(
          checkForUser.email,
          checkForUser.address,
          checkForUser.avatar
        );

        if (otpSent) {
          setHasOTPBeenSent(true);
        } else {
          setHasOTPBeenSent(false);
        }
      }
    } catch (error) {
      console.error("Error processing avatar upload:", error);
    } finally {
      setIsRegistering(STOP);
    }
  }

  async function sendOTP(email: string, address: string, avatar: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RENDER_ENDPOINT}/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, address, avatar }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent to your email");
        return true;
      } else {
        toast.error("Failed to send OTP", {
          description: data.message,
        });
        return false;
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP");
      return false;
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
          Welcome to {site.name}
        </h1>
        <p className="text-xs md:text-sm opacity-75">
          Please sign in or sign up below.
        </p>

        <Form {...authenticationForm}>
          <form
            onSubmit={authenticationForm.handleSubmit(handleAuthentication)}
          >
            <FormField
              disabled={
                !isConnected ||
                !address ||
                isRegistering !== STOP ||
                isAuthenticated
              }
              control={authenticationForm.control}
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
              }
            >
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
          onClick={async () => await open()}
        >
          <IoWalletOutline size={16} className="mr-2" />{" "}
          {isConnected ? "Wallet Connected" : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
};

const OtpForm = ({
  router,
  isConnected,
  address,
  isRegistering,
  setIsRegistering,
  isAuthenticated,
  userCred,
}: {
  router: any;
  isConnected: boolean;
  address: string;
  isRegistering: string | boolean;
  setIsRegistering: any;
  isAuthenticated: boolean;
  userCred: IUserCredentials | undefined;
}) => {
  const { fetchUser } = useGlobalContext();
  const { STOP, START } = Authenticating;

  const verificationForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function handleVerification(values: z.infer<typeof otpSchema>) {
    setIsRegistering(START);
    try {
      if (userCred) {
        const result = await verifyOTP(userCred?.email, values?.pin);
        if (result.user) {
          fetchUser();
          router.push("/home");
        } else {
          console.log(result.error);
          setIsRegistering(STOP);
        }
      } else {
        setIsRegistering(STOP);
        console.log("Something went wrong!!!!!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
      setIsRegistering(STOP);
    }
  }

  async function verifyOTP(email: string, otp: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RENDER_ENDPOINT}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (data.token) {
        await signInWithCustomToken(firebaseAuth, data.token);
        toast.success("Successfully signed in! 🎉");
        return data;
      } else {
        toast.error("Verification failed", {
          description: data.message,
        });
        console.error("Verification failed:", data);
        return { error: data.message };
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
      return { error: error };
    }
  }

  return (
    <div className="max-w-[360px] w-full border rounded-[20px] backdrop-blur-3xl bg-secondary/30 flex flex-col">
      <div className="px-6 py-5 border-b">
        <div className="w-full">
          <div className="rounded-full w-16 h-16 bg-secondary/60 flex items-center justify-center relative">
            <FileDigit size={36} className="text-muted-foreground" />
          </div>
        </div>

        <h1 className="mt-3 text-lg md:text-[22px] font-bold">
          OTP Verification
        </h1>
        <p className="text-xs md:text-sm opacity-75">
          Enter one-time password sent to your email
        </p>

        <Form {...verificationForm}>
          <form onSubmit={verificationForm.handleSubmit(handleVerification)}>
            <FormField
              disabled={
                !isConnected ||
                !address ||
                isRegistering !== STOP ||
                isAuthenticated
              }
              control={verificationForm.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="w-full mt-4">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
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
              }
            >
              {isRegistering === START ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
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
          onClick={async () => await open()}
        >
          <IoWalletOutline size={16} className="mr-2" />{" "}
          {isConnected ? "Wallet Connected" : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
};
