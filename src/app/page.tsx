"use client";

import TopNav from "~/components/ui/navigation/TopNav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function HomePage() {
  return (
    <>
      <TopNav />
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background p-5 text-foreground">
        <div>
          <h2 className="mb-10 mt-10 text-4xl">
            Welcome to your{" "}
            <span className="font-bold text-primary dark:text-secondary">
              Rep
            </span>
            ort C
            <span className="font-bold text-primary dark:text-secondary">
              ar
            </span>
            d Hel
            <span className="font-bold text-primary dark:text-secondary">
              per
            </span>
          </h2>
          <div className="m-auto mb-20 w-full max-w-lg items-center justify-center">
            I hope you find this speeds up your workflow when making your report
            cards for your students. I spent dozens of hours building this site,
            so if you feel like it saved you some time, let me know on Google
            Chat, in the{" "}
            <a className="underline" href="https://forms.gle/LKniM5wXY9F7mx436">
              feedback form
            </a>
            , or if you feel so inclined,{" "}
            <a
              className="underline"
              href="https://ko-fi.com/michaelfitzgerald1406"
            >
              buy me an avocado
            </a>
            , my favorite fruit 🥑!
          </div>
        </div>
        <div className="mb-20">
          <h2 className="mb-10 text-4xl">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-lg">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                ⚠️ IMPORTANT! What does BETA mean?
              </AccordionTrigger>
              <AccordionContent>
                It means that this app is still being tested and you should NOT
                rely on it to keep any data you input into it safe. Make sure
                you have backups in case there is a catastrophic failure of data
                integrity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How is this better than the PDF?
              </AccordionTrigger>
              <AccordionContent>
                You do not have to manually type student names or numbers into
                the PDF. You also do not have to copy and paste any Subject
                Achievement comments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Why can I not import my class from Google Classroom?
              </AccordionTrigger>
              <AccordionContent>
                There are a few reasons: (1) Google Classroom does not have
                student numbers, so you would have to manually input that on
                this site. I think there would be more friction inputting the
                student numbers on the site than in Google Sheets. (2) Not all
                grades use Google Classroom. The template allows all grades to
                use the site. (3) I think it is probable that a large majority
                of teachers already have 2 or 3 of the 4 columns filled in on
                some Google Sheet, so they can easily copy and paste them into
                the template.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                How can I submit feature ideas?
              </AccordionTrigger>
              <AccordionContent>
                Fill out this Google Form:{" "}
                <a
                  className="underline"
                  href="https://forms.gle/R2XKvGxZMbtzHDA68"
                >
                  https://forms.gle/R2XKvGxZMbtzHDA68
                </a>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How can I submit feedback?</AccordionTrigger>
              <AccordionContent>
                Feedback, whether it is a bug, an idea you have to make the UI
                or UX better, or praise, should be submitted on this Google
                Form:{" "}
                <a
                  className="underline"
                  href="https://forms.gle/LKniM5wXY9F7mx436"
                >
                  https://forms.gle/LKniM5wXY9F7mx436
                </a>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Do you have any plans to add more features?
              </AccordionTrigger>
              <AccordionContent>
                I do! Check out the roadmap if you&apos;re curious. Also, be on
                the look out for your ideas if you submitted feedback or a
                feature request 😁
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </>
  );
}
