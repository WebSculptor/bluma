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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function SendMessage() {
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full border border-b-0 rounded-t-xl flex items-center bg-background overflow-hidden sticky bottom-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    minRows={2}
                    maxRows={4}
                    autoFocus
                    autoComplete="off"
                    placeholder="What would you like to say?"
                    className="resize-none w-full rounded-t-xl px-4 py-3 border-0 outline-none text-sm md:text-base bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full px-4 py-2 bg-secondary/50 flex items-center justify-end gap-4">
            <p className="text-xs text-muted-foreground">Image</p>
            <p className="text-xs text-muted-foreground">Link</p>
            <p className="text-xs text-muted-foreground">File</p>
          </div>
        </form>
      </Form>
    </div>
  );
}
