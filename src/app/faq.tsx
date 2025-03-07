import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function Questions() {
  return (
    <>
      <h2 className="mt-8 text-xl font-bold">FAQs</h2>
      <Accordion
        type="single"
        collapsible
        className="mt-4 w-full max-w-sm sm:max-w-md"
      >
        <AccordionItem value="question-1">
          <AccordionTrigger>How does it work?</AccordionTrigger>
          <AccordionContent>
            <p>
              It uses Princeton University&apos;s{" "}
              <Link href="https://wordnet.princeton.edu/">WordNet</Link>{" "}
              database as a main dictionary, and{" "}
              <Link href="https://www.npmjs.com/package/english-plurals-list">
                english-plurals-list
              </Link>{" "}
              as a source for irregular plurals.
            </p>
            <p>
              The app tries to match every permutation of one, two, three and
              four of the given strings, with words from those sources.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-2">
          <AccordionTrigger>Does it find every word?</AccordionTrigger>
          <AccordionContent>
            <p>
              No. The sources are fairly complete but they still don&apos;t
              contain conjugations and other forms. For example, it can find the
              noun <em>titanic</em> but not the adverb <em>titanically</em> for
              the puzzle on{" "}
              <Link href="https://apple.news/JRrLVNobiS1Tzk0BzMVnNlQ">
                March 2nd, 2025
              </Link>
              .
            </p>
            <p>
              Also, the dictionary contains many words that the game
              doesn&apos;t accept, especially chemical elements which account
              for over 100 two-letter combinations.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-3">
          <AccordionTrigger>Are there improvements coming?</AccordionTrigger>
          <AccordionContent>
            Probably. The plurals list is only for irregular plurals, and the
            dictionary does not contain them, so at the moment it doesn&apos;t
            find even seemingly simple words like <em>lakes</em> (
            <Link href="https://apple.news/JjljapuXyTO_fCQHxK2dPLQ">
              March 4th, 2025
            </Link>
            ).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-4">
          <AccordionTrigger>Can I contribute?</AccordionTrigger>
          <AccordionContent>
            Yes! Pull requests are welcome if you know what that means. If not,
            my email is on my website, just drop me a note with suggestions or
            comments.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
