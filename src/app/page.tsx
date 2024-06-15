"use client";

import NewClassDialog from "~/components/classes/NewClassDialog";
import { Button } from "~/components/ui/button";
import TopNav from "~/components/ui/navigation/TopNav";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";

async function printPDF() {
  const formUrl =
    "https://utfs.io/f/5234b4e8-92e5-4934-bc32-2fe376e43760-1javl8.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  const codeField = form.getTextField("Code");
  codeField.setFontSize(3);

  for (const studentLetter of studentLetters) {
    const prefixArray = Object.entries(prefixes).map(([key, value]) => ({
      name: key,
      prefix: value,
    }));
    for (const element of prefixArray) {
      const name = element?.name;
      const prefix = element?.prefix;
      if (!prefix.includes("Text")) continue;
      const fieldName = `${element?.prefix}${studentLetter}${studentLetter}`;
      const field = form.getTextField(fieldName);
      field.setText(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      );
    }
  }

  // form.flatten();
  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "updated-document.pdf";
  link.click();
  window.URL.revokeObjectURL(link.href);
}

export default function HomePage() {
  return (
    <>
      <TopNav />
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background text-foreground">
        <Button className="px-8" asChild>
          <Link href="/classes">My classes</Link>
        </Button>
      </main>
    </>
  );
}
