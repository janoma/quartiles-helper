"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { HyperText } from "../components/magicui/hyper-text";
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

  return (
    <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
      <div className="flex rounded-lg border p-4 shadow-lg sm:p-8">
        <Form {...form}>
          {state.error && <div className="text-red-500">{state.error}</div>}
          <form action={formAction} className="grid items-center">
            <div className="grid grid-cols-4 gap-2">
              {keys.map((key) => (
                <FormField
                  control={form.control}
                  key={key}
                  name={key as keyof z.output<typeof schema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-12 max-w-16 border-b-2 border-b-gray-300 text-center font-semibold"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button className="mt-4 gap-0" type="submit" disabled={isPending}>
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
        <div className="h-80 overflow-y-auto">
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
