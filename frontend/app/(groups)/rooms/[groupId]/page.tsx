"use client";

import SendMessage from "@/components/shared/send-message";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, shortenAddress } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global-provider";
import { getBlumaContracts } from "@/services";
import { getEventGroupById } from "@/services/bluma-contract";
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
      contract = await getBlumaContracts(); // Assign contract here

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

    return () => {
      if (contract) {
        contract.removeAllListeners("MessageSent");
      }
    };
  }, []);

  const mergedItems = [
    ...(allMessages?.map((msg) => ({ type: "message", ...msg })) || []),
    ...(groupMembers?.map((member) => ({ type: "member", ...member })) || []),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      {isFetchingMessages ? (
        Array.from({ length: 4 }).map((_, _key) => (
          <div className="flex flex-col px-4" key={_key}>
            <div className="flex items-center w-full justify-center gap-4 py-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary" />
              <Skeleton className="h-3 w-36" />

              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary" />
            </div>

            <div className="flex flex-col pb-2">
              <div className="flex items-center gap-3 mb-2 sm:mb-0 flex-row">
                <Skeleton className="rounded-lg hidden sm:flex size-6" />

                <Skeleton className="h-3 w-28" />
              </div>

              <div className="w-full flex justify-start pl-0 sm:pl-9">
                <div className="w-full max-w-[calc(100%-10%)] sm:max-w-lg">
                  <div className="w-full">
                    <Skeleton className="rounded-xl sm:rounded-2xl h-11 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center w-full justify-center gap-4 py-4">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary" />
              <Skeleton className="h-3 w-36" />

              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary" />
            </div>

            <div className="flex flex-col pb-2">
              <div className="flex items-center gap-3 mb-2 sm:mb-0 flex-row-reverse">
                <Skeleton className="rounded-lg hidden sm:flex size-6" />

                <Skeleton className="h-3 w-28" />
              </div>

              <div className="w-full flex justify-end pr-0 sm:pr-9">
                <div className="w-full max-w-[calc(100%-10%)] sm:max-w-lg">
                  <div className="w-full">
                    <Skeleton className="rounded-xl sm:rounded-2xl h-11 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col px-4">
          {mergedItems.map((item) =>
            item.type === "member" ? (
              <div
                key={item.timestamp}
                className="flex items-center w-full justify-center gap-4 py-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary" />
                <p className="text-xs text-muted-foreground italic">
                  {item.email} joined
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary" />
              </div>
            ) : (
              <div key={item.timestamp} className="flex flex-col pb-2">
                <div
                  className={cn("flex items-center gap-3 mb-2 sm:mb-0", {
                    "flex-row-reverse": item?.sender === credentials?.address,
                  })}>
                  <div className="rounded-lg hidden sm:flex bg-secondary size-6 relative"></div>

                  <p className="text-xs text-muted-foreground">{item?.email}</p>
                </div>

                <div
                  className={cn("w-full flex", {
                    "justify-end pr-0 sm:pr-9":
                      item?.sender === credentials?.address,
                    "justify-start pl-0 sm:pl-9":
                      item?.sender !== credentials?.address,
                  })}>
                  <div className="w-max max-w-[calc(100%-10%)] sm:max-w-lg">
                    <div className="w-full">
                      <ReactMarkdown
                        className="overflow-hidden leading-5 sm:leading-6 whitespace-pre-wrap break-words flex-1 text-xs sm:text-sm px-3 py-2 sm:px-4 bg-secondary rounded-xl sm:rounded-2xl"
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
                        {item?.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <SendMessage />
    </>
  );
}

// <div className="flex flex-col">
//   {isFetchingMessages ? (
//   ) : (
//     <>
//       {mergedItems.map((item) =>
//         item.type === "member" ? (
// <div
//   className="flex items-center w-full justify-center gap-4 py-4"
//   key={item.timestamp}>
//   <span className="h-px flex-1 bg-secondary" />
//   <p className="text-xs text-muted-foreground">
//     {shortenAddress(item.address)} joined
//   </p>
//   <span className="h-px flex-1 bg-secondary" />
// </div>
//         ) : (
//           <div
//             className={cn(
//               "w-full flex justify-start p-4 md:py-6 bg-background",
//               {
//                 "bg-secondary/40": item.sender === credentials?.address,
//               }
//             )}
//             key={item.timestamp}>
//   <div className="flex gap-3">
//     <div className="rounded-lg hidden sm:flex bg-secondary size-8 relative">
//       <Image
//         src={
//           item.avatar
//             ? `https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${item.avatar}`
//             : "/assets/logo.png"
//         }
//         alt={item.sender.toString()}
//         fill
//         priority
//         className="size-full rounded-[inherit]"
//       />
//     </div>

//     <div className="flex flex-col items-start gap-1 flex-1">
//       <p className="text-xs text-muted-foreground">
//         {item.sender === credentials?.address
//           ? "You"
//           : item.email}
//       </p>

//       <ReactMarkdown
//         className="overflow-hidden leading-6 whitespace-pre-wrap break-words flex-1 text-sm"
//         components={{
//           pre: ({ node, ...props }) => (
//             <pre
//               {...props}
//               className="text-sm leading-6 markdown prose w-full break-words"
//             />
//           ),
//           code: ({ node, ...props }) => (
//             <code
//               className="text-primary bg-secondary px-1 py-0.5 text-sm markdown prose break-words rounded-sm"
//               {...props}
//             />
//           ),
//         }}>
//         {item.content}
//       </ReactMarkdown>
//     </div>
//   </div>
// </div>
//         )
//       )}
//       <div ref={messagesEndRef} />
//     </>
//   )}
// </div>
