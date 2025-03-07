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
      <div className="flex rounded-lg border p-4 sm:p-8">
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
                          className="h-12 max-w-16 text-center font-semibold"
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
      <div className="w-full overflow-y-auto rounded-lg border p-4 sm:p-8">
        <h2 className="text-2xl font-bold" id="suggestions">
          Suggestions {state.words.length > 0 && `(${state.words.length})`}
        </h2>
        <pre>{state.words.join("\n")}</pre>
      </div>
    </div>
  );
}
