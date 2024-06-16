"use client";

import { cn } from "@/lib/utils";
import { getAllGroupMessages } from "@/services";
import React, { useEffect, useState } from "react";

export default function GroupChatPage({
  params,
}: {
  params: { groupId: number };
}) {
  const [allMessages, setAllMessages] = useState<IMessage[] | undefined>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);

  const fetchMessages = async (groupId: number) => {
    try {
      const messages = await getAllGroupMessages(groupId);
      if (messages) return messages;
    } catch (error: any) {
      console.log("SOMETHING WENT WRONG:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingMessages(true);
      try {
        const data = await fetchMessages(Number(params?.groupId));
        console.log("ALL MESSAGES:", data);
        setAllMessages(data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetchingMessages(false);
      }
    };

    fetchData();
  }, [params?.groupId]);

  const testMsgs = [
    {
      email: "abdullahisalihuinusa@gmail.com",
      message:
        "Hello guys\nI just registered for this event and hope to see you all there!",
    },
    {
      email: "johndoe@gmail.com",
      message:
        "Regretfully, the project will have to be delayed due to technological issues and the project's extreme complexity. If more action is required, I will, nevertheless, keep you all updated.",
    },
    {
      email: "daniel@gmail.com",
      message: "Not cool man 😩",
    },
  ];

  return (
    <div className="flex flex-col">
      {testMsgs.map((msg, _key) => (
        <div
          className={cn(
            "w-full flex justify-start p-4 md:py-6 border-t first:border-t-0 bg-background",
            {
              "bg-secondary/40 justify-end": msg.email === "johndoe@gmail.com",
            }
          )}
          key={_key}>
          <div
            className={cn("flex gap-3", {
              "flex-row-reverse": msg.email === "johndoe@gmail.com",
            })}>
            <div className="rounded-full hidden md:flex bg-secondary size-8"></div>

            <div
              className={cn("flex flex-col items-start gap-1 flex-1", {
                "items-end": msg.email === "johndoe@gmail.com",
              })}>
              <p className="text-xs text-muted-foreground">{msg.email}</p>

              <div className="flex-1 max-w-lg">
                <pre className="font-sans text-sm whitespace-pre-wrap flex-1 leading-[22px]">
                  {msg.message}
                </pre>
              </div>

              {/* {msg?.image &&
                (msg.email === "johndoe@gmail.com" ? (
                  <div className="mt-4 bg-background max-w-xs w-full flex flex-col rounded-lg">
                    <div className="w-full rounded-[inherit] overflow-hidden p-2">
                      <div className="rounded-[inherit] overflow-hidden relative">
                        <Image
                          src={msg?.image}
                          alt={`Uploaded by ${msg.email}`}
                          width={320}
                          height={320}
                          priority
                          className="size-auto"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-secondary/50 border max-w-xs w-full flex flex-col rounded-lg">
                    <div className="w-inherit rounded-[inherit] overflow-hidden p-2">
                      <div className="w-[inherit] rounded-[inherit] overflow-hidden relative">
                        <Image
                          src={msg?.image}
                          alt={`Uploaded by ${msg.email}`}
                          width={320}
                          height={320}
                          priority
                          className="size-auto"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t p-2">
                      <Button className="w-full" variant="secondary">
                        <Download size={16} className="mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
