"use client";

import SendMessage from "@/components/shared/send-message";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, shortenAddress } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import { getEthereumContracts, getEventGroupById } from "@/services";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function GroupChatPage({
  params,
}: {
  params: { groupId: number };
}) {
  const { credentials } = useGlobalContext();

  const [allMessages, setAllMessages] = useState<IMessage[] | undefined>([]);
  const [groupMembers, setGroupMembers] = useState<any[] | undefined>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const messagesEndRef: any = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const fetchData = async () => {
    setIsFetchingMessages(true);
    try {
      const data = await getEventGroupById(Number(params?.groupId));
      setAllMessages(data?.messages);
      setGroupMembers(data?.members);
      console.log(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsFetchingMessages(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params?.groupId]);

  useEffect(() => {
    let contract: any;
    fetchData();

    const listenForEvent = async () => {
      contract = await getEthereumContracts(); // Assign contract here

      const messageSentHandler = async (
        sender: any,
        groupId: number,
        text: string,
        timestamp: number
      ) => {
        try {
          // Check if the new message belongs to the current group
          if (Number(groupId) === Number(params?.groupId)) {
            const data = await getEventGroupById(Number(params?.groupId));
            setAllMessages(data?.messages);
            setGroupMembers(data?.members);
            setAllMessages(data?.messages);

            if (sender !== credentials?.address) {
              toast.info("You have a new message", {
                description: `There's a new message in the ${data?.title} event room`,
              });
            }
          }
        } catch (error: any) {
          console.log(error);
        }
      };

      contract.on("MessageSent", messageSentHandler);

      // Return cleanup function to remove the event listener when component unmounts
      return () => {
        if (contract) {
          contract.off("MessageSent", messageSentHandler);
        }
      };
    };

    listenForEvent();

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      if (contract) {
        contract.removeAllListeners("MessageSent");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once when component mounts

  // Merge messages and member join events, then sort by timestamp
  const mergedItems = [
    ...(allMessages?.map((msg) => ({ type: "message", ...msg })) || []),
    ...(groupMembers?.map((member) => ({ type: "member", ...member })) || []),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      <div className="flex flex-col">
        {isFetchingMessages ? (
          Array.from({ length: 3 }).map((_, _key) => (
            <div
              key={_key}
              className="w-full flex justify-start p-4 md:py-6 bg-background border-t first:border-t-0">
              <div className="flex gap-3 w-full">
                <Skeleton className="rounded-full hidden md:flex size-8" />

                <div className="flex flex-col items-start gap-1 flex-1">
                  <Skeleton className="h-3 w-28" />

                  <div className="w-full max-w-lg mt-4 gap-2 flex flex-col">
                    <Skeleton className="h-3 w-[calc(100%-30%)]" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[calc(100%-10%)]" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            {mergedItems.map((item) =>
              item.type === "member" ? (
                <div
                  className="flex items-center w-full justify-center gap-4 py-4"
                  key={item.timestamp}>
                  <span className="h-px flex-1 bg-secondary" />
                  <p className="text-xs text-muted-foreground">
                    {shortenAddress(item.address)} joined
                  </p>
                  <span className="h-px flex-1 bg-secondary" />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-full flex justify-start p-4 md:py-6 bg-background",
                    {
                      "bg-secondary/40": item.sender === credentials?.address,
                    }
                  )}
                  key={item.timestamp}>
                  <div className="flex gap-3">
                    <div className="rounded-lg hidden sm:flex bg-secondary size-8 relative">
                      <Image
                        src={
                          item.avatar
                            ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${item.avatar}`
                            : "/assets/logo.png"
                        }
                        alt={item.sender.toString()}
                        fill
                        priority
                        className="size-full rounded-[inherit]"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-1 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {item.sender === credentials?.address
                          ? "You"
                          : item.email}
                      </p>

                      <ReactMarkdown
                        className="overflow-hidden leading-6 whitespace-pre-wrap break-words flex-1 text-sm"
                        components={{
                          pre: ({ node, ...props }) => (
                            <pre
                              {...props}
                              className="text-sm leading-6 markdown prose w-full break-words"
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="text-primary bg-secondary px-1 py-0.5 text-sm markdown prose break-words rounded-sm"
                              {...props}
                            />
                          ),
                        }}>
                        {item.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <SendMessage />
    </>
  );
}
