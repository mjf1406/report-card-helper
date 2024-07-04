import { type NextRequest, NextResponse } from 'next/server';
import { downloadReportsBySemester } from '~/server/actions/downloadReportsBySemester';

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
    risk_taking: "ref",
    open_minded: "rt",
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

  type ParsedComment = Record<string, string>;

// export async function printPDF() {
//   const formUrl =
//     "https://utfs.io/f/5234b4e8-92e5-4934-bc32-2fe376e43760-1javl8.pdf";
//   const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
//   const pdfDoc = await PDFDocument.load(formPdfBytes);
//   const form = pdfDoc.getForm();

//   const codeField = form.getTextField("Code");
//   codeField.setFontSize(8);

//   for (const studentLetter of studentLetters) {
//     const prefixArray = Object.entries(prefixes).map(([key, value]) => ({
//       name: key,
//       prefix: value,
//     }));
//     for (const element of prefixArray) {
//       const name = element?.name;
//       const prefix = element?.prefix;
//       if (!prefix.includes("Text")) continue;
//       const fieldName = `${element?.prefix}${studentLetter}${studentLetter}`;
//       const field = form.getTextField(fieldName);
//       field.setText(
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//       );
//     }
//   }

//   // form.flatten();
//   const pdfBytes = await pdfDoc.save();

//   const blob = new Blob([pdfBytes], { type: "application/pdf" });
//   const link = document.createElement("a");
//   link.href = window.URL.createObjectURL(blob);
//   link.download = "updated-document.pdf";
//   link.click();
//   window.URL.revokeObjectURL(link.href);
// }

export async function GET(req: NextRequest) {
  try {
    const userId: string | null = req.nextUrl.searchParams.get('userId');
    if (!userId) throw new Error('User ID is null');

    const classId: string | null = req.nextUrl.searchParams.get('classId');
    const semester: string | null = req.nextUrl.searchParams.get('semester');
    if (!classId || !semester) throw new Error("api: missing class id and/or semester")

    const data = await downloadReportsBySemester(classId, semester);

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new NextResponse(JSON.stringify({ message: 'Unable to fetch classes due to an internal error.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

