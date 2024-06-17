"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { browserNotification, cn } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import {
  getAllGroupMessages,
  getEthereumContracts,
  getEventGroupById,
} from "@/services";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

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

  const fetchMessages = async (groupId: number) => {
    try {
      const group = await getEventGroupById(Number(groupId));
      return group;
    } catch (error: any) {
      console.log("SOMETHING WENT WRONG:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingMessages(true);
      try {
        const data = await fetchMessages(Number(params?.groupId));
        setAllMessages(data?.messages);
        setGroupMembers(data?.members);
        console.log(data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetchingMessages(false);
      }
    };
    fetchData();
  }, [params?.groupId]);

  useEffect(() => {
    let contract: any; // Declare contract variable outside useEffect

    const fetchData = async () => {
      setIsFetchingMessages(true);
      try {
        const data = await fetchMessages(Number(params?.groupId));
        setAllMessages(data?.messages);
        console.log(data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetchingMessages(false);
      }
    };
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
            const data = await fetchMessages(Number(params?.groupId));
            setAllMessages(data?.messages);

            const sender = data?.messages?.map((mg) => mg.sender);
            if (sender !== credentials?.address) {
              browserNotification(
                "New Message",
                `There's a new message in the ${data?.title} event room`
              );
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

  return (
    <div className="flex flex-col">
      {isFetchingMessages ? (
        Array.from({ length: 3 }).map((_, _key) => (
          <div
            key={_key}
            className="w-full flex justify-start p-4 md:py-6 bg-background border-t first:border-t-0"
          >
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
          {groupMembers?.map((member) => (
            <div
              className="flex items-center w-full justify-center gap-4 py-4"
              key={member?.timestamp}
            >
              <span className="h-px flex-1 bg-secondary" />
              <p className="text-sm text-muted-foreground">
                {member?.email} joined {member?.timestamp}
              </p>
              <span className="h-px flex-1 bg-secondary" />
            </div>
          ))}
          {allMessages?.map((msg) => (
            <div
              className={cn(
                "w-full flex justify-start p-4 md:py-6 border-t first:border-t-0 bg-background",
                {
                  "bg-secondary/40": msg?.sender === credentials?.address,
                }
              )}
              key={msg.timestamp}
            >
              <div className="flex gap-3">
                <div className="rounded-full hidden sm:flex bg-secondary size-8 relative">
                  {/* <Image src={? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${ms}`
                      : "/assets/logo.png"} alt={message?.sender.toString()} fill priority className="size-full rounded-full" /> */}
                </div>

                <div className="flex flex-col items-start gap-1 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {msg.sender === credentials?.address ? "You" : msg.email}
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
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
