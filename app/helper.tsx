"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleHelp, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  type ClipboardEventHandler,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { HyperText } from "../components/magicui/hyper-text";
import example from "./example.png";
import { schema } from "./formSchema";
import { onSubmitAction } from "./formSubmit";

const rotation = [
  "clueless",
  "lost",
  "confused",
  "helpless",
  "stuck",
  "hopeless",
  "bewildered",
  "dumb",
  "perplexed",
  "puzzled",
  "suffering",
];

function pointsForKey(key: string) {
  switch (key) {
    case "single":
      return (
        <div className="text-quartiles-blue place-self-center font-medium">
          1
        </div>
      );
    case "double":
      return (
        <div className="text-quartiles-blue place-self-center font-medium">
          2
        </div>
      );
    case "triple":
      return (
        <div className="text-quartiles-blue place-self-center font-medium">
          4
        </div>
      );
    case "quad":
      return (
        <div className="bg-quartiles-blue place-self-center rounded px-1 text-center font-medium text-white">
          8
        </div>
      );
  }
}

export default function Helper() {
  const [state, formAction, isPending] = useActionState(onSubmitAction, {
    error: "",
    words: [],
  });

  const [index, setIndex] = useState(0);
  const rotatedWord = rotation[index]!;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % rotation.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [index]);

  const keys = Object.keys(schema.shape);

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(keys.map((key) => [key, ""])),
  });

  /** Save words to local storage before continuing to process. */
  function actionIntercept(data: FormData) {
    const words = Object.fromEntries(data) as Record<
      (typeof keys)[number],
      string
    >;
    localStorage.setItem("words", JSON.stringify(words));
    formAction(data);
  }

  useEffect(() => {
    const data = localStorage.getItem("words");
    if (data) {
      try {
        const words = JSON.parse(data) as Record<(typeof keys)[number], string>;
        for (const key of keys) {
          if (words[key]) {
            form.setValue(key as keyof z.output<typeof schema>, words[key]);
          }
        }
      } catch (error: unknown) {
        console.error(error);
      }
    }
    /* No dependencies! Otherwise we might lose unsaved changes. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = (e) => {
    const pastedData = e.clipboardData.getData("text");
    const words = pastedData.split(" ");

    for (const [index, key] of keys.entries()) {
      if (index < words.length) {
        form.setValue(key as keyof z.output<typeof schema>, words[index]!);
      }
    }
    e.preventDefault();
  };

  return (
    <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
      <div className="flex rounded-lg border p-4 shadow-lg sm:p-8">
        <Form {...form}>
          <form action={actionIntercept} className="grid items-center">
            <div className="grid grid-cols-4 gap-2" onPaste={handlePaste}>
              <h2
                className="col-span-4 flex items-center gap-1 text-xl font-bold"
                id="user-input"
              >
                Enter a game&apos;s strings
                <Popover>
                  <PopoverTrigger asChild>
                    <CircleHelp />
                  </PopoverTrigger>
                  <PopoverContent className="w-64 sm:w-88">
                    <div className="flex flex-col gap-2 text-sm">
                      Simply copy the text from the cells of a game and click
                      the &ldquo;Help&rdquo; button.
                      <Image
                        className="rounded-md"
                        src={example}
                        alt="Example"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </h2>
              {state.error && (
                <div className="text-quartiles-red dark:text-destructive-foreground col-span-4 max-w-72 truncate">
                  {state.error}
                </div>
              )}
              {keys.map((key) => (
                <FormField
                  control={form.control}
                  key={key}
                  name={key as keyof z.output<typeof schema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={cn(
                            "bg-muted/50 h-12 max-w-16 border-b-2 border-b-gray-300",
                            "text-center font-semibold dark:border-b-gray-700",
                          )}
                          maxLength={4}
                          minLength={2}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button
              className="bg-quartiles-blue mt-4 gap-0"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Help me, I&apos;m{" "}
                  <HyperText
                    as="span"
                    animateOnHover={false}
                    className="ps-1"
                    key={index}
                    startOnView
                  >
                    {rotatedWord}
                  </HyperText>
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-full rounded-lg border p-4 shadow-lg sm:p-8">
        <h2 className="text-xl font-bold" id="suggestions">
          {state.words.length} Suggestions Found
        </h2>
        <div className="max-h-72 overflow-y-auto">
          {state.words.map((entry) => (
            <div
              className="flex justify-between border-b border-b-gray-300 pt-2 pb-1"
              key={entry.word}
            >
              <div className="flex-1">{entry.word}</div>
              <div className="w-8 flex-none">
                {pointsForKey(entry.category)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
