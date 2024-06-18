"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { sendMessageSchema } from "@/lib/validators";
import TextareaAutosize from "react-textarea-autosize";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { sendMessage } from "@/services";
import { toast } from "sonner";
import { CornerDownLeft, Loader, Plus } from "lucide-react"; // Import the CooldownTimer component

export default function SendMessage() {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {},
  });

  const handleCooldownComplete = () => {
    setIsCooldown(false);
  };

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    if (isCooldown) {
      toast.error(
        "Please wait for the cooldown period to end before sending another message."
      );
      return;
    }

    setIsSendingMessage(true);
    try {
      const data = await sendMessage(4, values?.message);
      if (data?.success) {
        toast.success("Message sent successfully! 🎉");
        form.reset({ message: "" });
        setIsCooldown(true); // Start cooldown
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setIsSendingMessage(false);
    }
  }

  return (
    <div className="flex w-full sticky bottom-0 bg-background border border-b-0 p-4 rounded-t-md">
      {isCooldown ? (
        <CooldownTimer
          initialSeconds={60}
          onCooldownComplete={handleCooldownComplete}
        />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full gap-4">
            <Button
              variant="secondary"
              size="icon"
              disabled
              className="size-8 rounded-full">
              <Plus size={16} />
              <span className="sr-only">Attachment</span>
            </Button>
            <FormField
              disabled={isSendingMessage}
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <TextareaAutosize
                      {...field}
                      minRows={1}
                      maxRows={4}
                      autoFocus
                      autoComplete="off"
                      placeholder="What would you like to say?"
                      disabled={isSendingMessage}
                      className="w-full bg-transparent outline-none border-none text-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="icon"
              variant="secondary"
              disabled={isSendingMessage}>
              {isSendingMessage ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <CornerDownLeft size={16} />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

// Cooldown Timer Component
const CooldownTimer = ({
  initialSeconds,
  onCooldownComplete,
}: {
  initialSeconds: any;
  onCooldownComplete: any;
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds: any) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval on component unmount
    } else {
      onCooldownComplete();
    }
  }, [seconds, onCooldownComplete]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `00:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between w-full">
        <p className="text-sm font-medium text-muted-foreground">Timeout</p>
        <p className="text-sm font-medium">{formatTime(seconds)}</p>
      </div>
    </div>
  );
};
