"use client";

import NewClassDialog from "~/components/classes/NewClassDialog";
import { Button } from "~/components/ui/button";
import TopNav from "~/components/ui/navigation/TopNav";
import { PDFDocument } from "pdf-lib";

const studentLetters: string[] = [
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
];

const prefixes = {
  // the below just use the student letter
  // e.g. if it's student b, then it would be
  // Student b
  student_name: "Student ", // Student ${studentLetter}
  student_number: "number ",
  // the below use the letter once and the semester number
  // e.g. if the semester is 1 for student b, then it would be
  // Res1b
  responsibility: "Res", // Res${semesterNumber}${studentLetter}
  organization: "Or",
  collaboration: "co",
  communication: "Com",
  thinking: "thin",
  inquiry: "inqu",
  "risk-taking": "ref",
  "open-minded": "rt",
  skills_and_habits: "Skills/Habits ",
  // the below use the letter twice
  // e.g. if the letter is b, then it would be
  // Reading Textbb
  reading: "Reading Text", // Reading Text${studentLetter}${studentLetter}
  writing: "Writing Text",
  speaking: "Speaking Text",
  listening: "Listening Text",
  use_of_english: "Use of English Text",
  mathematics: "math Text",
  social_studies: "S Text",
  science: "SciText",
};

const twentyFirstCentrySkillsOptions = {
  AB: "Absent: Insufficient evidence to assign a level.",
  CD: "Consistently Demonstrates: The student applies the skill, trait, or work habit consistently with minimal teacher support.",
  P: "Progressing: The student applies the skill, trait, or work habit regularly, though, needs additional teacher support at times.",
  NY: "Not Yet: The student has not yet applied the skill, trait, or work habit appropriately or does so with much teacher support.",
};

const subjectAchievementOptions = [1, 2, 3, 4, 5]; // This value fetches the Strengths/Next Steps for Improvement

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
        <NewClassDialog />
        <Button onClick={printPDF}>Print PDF</Button>
      </main>
    </>
  );
}
