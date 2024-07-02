"use client";

import { useState, useEffect } from "react";
import SkillsSelectGroup from "~/components/ui/SkillSelectGroup";
import { Label } from "~/components/ui/label";
import TopNav from "~/components/ui/navigation/TopNav";
import { Textarea } from "~/components/ui/textarea";
import updateStudentField from "~/server/actions/updateStudentField";
import type { StudentField, Student, CommentsDb } from "~/server/db/types";
import { useToast } from "~/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface Params {
  student_id: string;
  student: string;
  class_id: string;
  class_year: string;
  class_grade: string;
}
const skillToFieldKeyMap: Record<
  string,
  keyof Omit<StudentField, "field_id" | "student_id">
> = {
  Responsibility: "responsibility",
  Organization: "organization",
  Collaboration: "collaboration",
  Communication: "communication",
  Thinking: "thinking",
  Inquiry: "inquiry",
  "Risk-taking": "risk_taking",
  "Open-minded": "open_minded",
  Comment: "comment",
  Reading: "reading",
  Writing: "writing",
  Speaking: "speaking",
  Listening: "listening",
  "Use of English": "use_of_english",
  Mathematics: "mathematics",
  "Social Studies": "social_studies",
  Science: "science",
};

type stud = {
  student_name_en: string | undefined;
  student_number: string | undefined;
};

type TransformedData = {
  student_fields: StudentField;
  student: stud;
};

type Data = {
  students: Student;
  student_fields: StudentField;
};

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

const twentyFirstCenturySkillsItems = [
  {
    value: "AB",
    valueLong: "Absent",
    label: "AB",
    desc: "Insufficient evidence to assign a level.",
  },
  {
    value: "CD",
    valueLong: "Consistently Demonstrates",
    label: "CD",
    desc: "The student applies the skill, trait, or work habit consistently with minimal teacher support.",
  },
  {
    value: "P",
    valueLong: "Progressing",
    label: "P",
    desc: "The student applies the skill, trait, or work habit regularly, though, needs additional teacher support at times.",
  },
  {
    value: "NY",
    valueLong: "Not Yet",
    label: "NY",
    desc: "The student has not yet applied the skill, trait, or work habit appropriately or does so with much teacher support.",
  },
];
const subjectAchievementOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
]; // This value fetches the Strengths/Next Steps for Improvement

// function generateSkill(): string {
//   const options = ["AB", "CD", "P", "NY"];
//   const randomIndex = Math.floor(Math.random() * options.length);
//   return options[randomIndex];
// }
// function generateSubjectAchievementScore(): number {
//   return Math.floor(Math.random() * 5) + 1;
// }

async function fetchStudent(
  studentId: string,
  classId: string,
  userId: string | null | undefined,
): Promise<TransformedData> {
  if (!userId) throw new Error("User not authenticated");
  try {
    const url = new URL("/api/getStudent", window.location.origin);
    url.searchParams.append("studentId", studentId);
    url.searchParams.append("classId", classId);
    url.searchParams.append("userId", userId);

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Failed to fetch student roster");
      throw new Error("Failed to fetch student roster");
    }
    const text: string = await response.text();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedData = JSON.parse(text);
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("Unexpected data format from API");
    }
    const data: Data = parsedData[0] as Data;

    const studentFields: StudentField = {
      field_id: data.student_fields.field_id,
      student_id: data.student_fields.student_id,
      collaboration: data.student_fields.collaboration,
      communication: data.student_fields.communication,
      inquiry: data.student_fields.inquiry,
      listening: data.student_fields.listening,
      mathematics: data.student_fields.mathematics,
      open_minded: data.student_fields.open_minded,
      organization: data.student_fields.organization,
      reading: data.student_fields.reading,
      responsibility: data.student_fields.responsibility,
      risk_taking: data.student_fields.risk_taking,
      science: data.student_fields.science,
      social_studies: data.student_fields.social_studies,
      speaking: data.student_fields.speaking,
      thinking: data.student_fields.thinking,
      use_of_english: data.student_fields.use_of_english,
      writing: data.student_fields.writing,
      comment: data.student_fields.comment,
    };

    const student: stud = {
      student_name_en: data.students.student_name_en,
      student_number: data.students.student_number,
    };

    const transformedData: TransformedData = {
      student_fields: studentFields,
      student: student,
    };
    return transformedData;
  } catch (err) {
    const error = err as Error;
    console.error("failed to parse course", error);
    throw new Error("failed to parse course");
  }
}
async function fetchSubjectComments(
  userId: string | null | undefined,
  grade: string,
  year: string,
): Promise<CommentsDb[]> {
  try {
    const url = new URL("/api/getSubjectComments", window.location.origin);
    url.searchParams.append("userId", String(userId));
    url.searchParams.append("grade", grade);
    url.searchParams.append("year", year);

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Failed to fetch student roster");
      throw new Error("Failed to fetch student roster");
    }
    const text: string = await response.text();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = JSON.parse(text);
    return data as CommentsDb[];
  } catch (err) {
    const error = err as Error;
    console.error("failed to parse course", error);
    throw new Error("failed to parse course");
  }
}

type ParsedComment = Record<string, string>;

function getSubjectCommentBySubjectAndSemester(
  comments: CommentsDb[] | undefined,
  subject: string,
  sem: string,
  level: string,
): string | undefined {
  if (!comments) return "";
  const filteredComment = comments.find((e) => e.semester === sem);
  const raw = filteredComment?.[subject] ?? "";
  if (!raw) return "";
  return raw?.[`l${level}` as keyof typeof raw] as string;
}
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

// const newFields: StudentField = JSON.stringify({
//   field_id: undefined,
//   collaboration: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   communication: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   inquiry: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   listening: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   mathematics: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   open_minded: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   organization: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   reading: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   responsibility: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   risk_taking: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   science: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   skills_and_habits: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   social_studies: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   speaking: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   thinking: {
//     s1: generateSkill(),
//     s2: generateSkill(),
//   },
//   use_of_english: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   writing: {
//     s1: generateSubjectAchievementScore(),
//     s2: generateSubjectAchievementScore(),
//   },
//   comment: { s1: "Semester 1", s2: "Semester 2" },
// }); // TODO: comment out when building

export default function StudentReport({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Params;
}) {
  const { toast } = useToast();
  const { userId } = useAuth();
  const [studentFields, setFields] = useState<StudentField>();
  const [student, setStudent] = useState<Student>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState("");
  const [comments, setComments] = useState<CommentsDb[]>([]);

  const studentId = searchParams.student_id;
  const classId = searchParams.class_id;
  const classGrade = searchParams.class_grade;
  const classYear = searchParams.class_year;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    void fetchStudent(studentId, classId, userId)
      .then((data) => {
        const studentFields: StudentField = data.student_fields;
        const student: Student = data.student as Student;
        setFields(studentFields);
        setStudent(student);
        setIsLoading(false);
      })
      .catch((err) => {
        const error = err as Error;
        setError(String(error));
        toast({
          title: "Error!",
          variant: "destructive",
          description: `${String(error)}`,
        });
      });
  }, [studentId, classId, userId, toast]);

  useEffect(() => {
    void fetchSubjectComments(userId, classGrade, classYear)
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        const error = err as Error;
        setError(String(error));
        toast({
          title: "Error!",
          variant: "destructive",
          description: `${String(error)}`,
        });
      });
  }, [userId, classGrade, classYear, toast]);

  // const studentFields = JSON.parse(newFields) as StudentField; // TODO: comment out when building

  const handleValueChange = (
    skill: keyof Omit<StudentField, "field_id" | "student_id">,
    semester: "s1" | "s2",
    value: string,
  ) => {
    setFields((prevFields: StudentField | undefined) => {
      if (!prevFields) {
        console.error("prevFields is undefined");
        return prevFields; // or return a new StudentField object with default values
      }

      const otherSemester = semester === "s1" ? "s2" : "s1";
      const updatedFields = {
        ...prevFields,
        [skill]: {
          ...prevFields[skill],
          [otherSemester]: prevFields[skill]?.[otherSemester] || "",
          [semester]: value,
        },
      };

      // Call updateStudentField here, inside the setState callback
      updateStudentField(updatedFields)
        .then(() => {
          toast({
            title: "Data saved!",
            description: `${semester.toUpperCase()} of ${skill} was updated successfully!`,
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            variant: "destructive",
            title: "Error updating the database!",
            description: `${semester.toUpperCase()} of ${skill} did not update! Please select another value, then the same one again.`,
          });
        });

      return updatedFields;
    });
  };

  if (isError)
    return (
      <>
        <TopNav />
        <main className="text-text flex min-h-screen flex-col items-center bg-background">
          <div className="container flex flex-col items-center gap-12 px-4 py-16">
            <h1 className="flex flex-col gap-3 text-5xl">
              <span>Error!</span>
              <span>{isError}</span>
            </h1>
          </div>
        </main>
      </>
    );

  return (
    <>
      <TopNav />
      <main className="text-text flex min-h-screen flex-col items-center bg-background">
        <div className="container flex flex-col items-center gap-12 px-4 py-16">
          {isLoading ? (
            <h1 className="flex flex-row gap-3 text-5xl">
              <Loader2 className="h-12 w-12 animate-spin" />
              <span>Loading...</span>
            </h1>
          ) : (
            <>
              <h1 className="flex flex-col gap-4 text-center text-4xl">
                <span className="text-xl">Filling out the report for</span>
                <span>
                  ({student?.student_number}) {student?.student_name_en}
                </span>
              </h1>
              <h2 className="text-2xl">
                21st Century Skills, Learner Traits, and Work Habits
              </h2>
              <div className="flex flex-row flex-wrap gap-5">
                <div className="m-auto flex h-full flex-col items-center justify-center gap-2">
                  {[
                    "Responsibility",
                    "Organization",
                    "Collaboration",
                    "Communication",
                    "Thinking",
                    "Inquiry",
                    "Risk-taking",
                    "Open-minded",
                  ].map((skill) => {
                    const fieldKey = skillToFieldKeyMap[skill];
                    if (!fieldKey) {
                      console.error(
                        `fieldKey is undefined for skill: ${skill}`,
                      );
                      return null;
                    }
                    return (
                      <SkillsSelectGroup
                        key={skill}
                        label={skill}
                        className="rounded-lg bg-foreground/10 px-3 py-2"
                        items={twentyFirstCenturySkillsItems}
                        selected={
                          studentFields?.[fieldKey] ?? { s1: "", s2: "" }
                        }
                        onValueChange={(semester, value) => {
                          if (fieldKey) {
                            handleValueChange(fieldKey, semester, value);
                          } else {
                            console.error(
                              `fieldKey is undefined for skill: ${skill}`,
                            );
                          }
                        }}
                      />
                    );
                  })}
                </div>
                <div className="m-auto flex h-full max-w-lg flex-col justify-center gap-2 text-left text-xs">
                  {[
                    {
                      code: "AB",
                      description: "Insufficient evidence to assign a level.",
                    },
                    {
                      code: "CD",
                      description:
                        "The student applies the skill, trait, or work habit consistently with minimal teacher support.",
                    },
                    {
                      code: "P",
                      description:
                        "The student applies the skill, trait, or work habit regularly, though, needs additional teacher support at times.",
                    },
                    {
                      code: "NY",
                      description:
                        "The student has not yet applied the skill, trait, or work habit appropriately or does so with much teacher support. Additional practice is required.",
                    },
                  ].map(({ code, description }) => (
                    <div key={code}>
                      <span className="font-bold">{code} = </span>
                      <span>{description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="text-2xl">Skills and Habits Comment</h2>
              <div className="flex w-full max-w-5xl flex-wrap justify-center gap-5">
                <div className="m-auto h-full max-w-lg grow space-y-6">
                  <div className="text-xl">Semester 1</div>
                  <Textarea
                    className="m-auto h-full w-full"
                    placeholder="Skill and Habits comment. I recommend you write this in Google Docs, then copy it over."
                    value={studentFields?.comment?.s1}
                    onChange={(event) =>
                      handleValueChange("comment", "s1", event.target.value)
                    }
                  />
                  <div className="text-xl">Semester 2</div>
                  <Textarea
                    className="m-auto h-full w-full"
                    placeholder="Skill and Habits comment. I recommend you write this in Google Docs, then copy it over."
                    value={studentFields?.comment?.s2}
                    onChange={(event) =>
                      handleValueChange("comment", "s2", event.target.value)
                    }
                  />
                </div>
                <div className="flex max-w-lg flex-col gap-2 text-xs">
                  <div className="text-lg font-bold">FOLLOW THIS TEMPLATE</div>
                  {[
                    {
                      text: "Moonjung has made remarkable progress over the course of semester one, both in her participation as well as her academic effort.",
                      note: "general positive statement",
                    },
                    {
                      text: "She is responsible, she is aware of her own actions in and around the school and can be trusted by the teachers to be honest. Moonjung is organized. She can follow a plan and process for completing her work most of the time. She is also able to monitor, assess, and revise her plans to complete any class work.",
                      note: "student strengths",
                    },
                    {
                      text: "When collaborating with other students, Moonjung always shares her expertise with other students communicating effectively, so her peers listen and respect what she is saying. This was most evident during our S.T.E.M activities. Occasionally, her willingness to help causes her time management problems, because she ends up giving too much of herself to other students and her own work suffers in return. Despite this, she always approaches tasks with a positive attitude and isn’t afraid to take risks. Now and again, Moonjung could practice saying ‘no’ to her peers to ensure she has the time she deserves to do the very best job possible.",
                      note: "specific example, next steps",
                    },
                    {
                      text: "Moonjung perseveres and reflects on her strengths and weaknesses. She makes an effort when responding to any challenge. I know she will do well in semester two.",
                      note: "closing statement/ bonus next step if required",
                    },
                  ].map(({ text, note }, index) => (
                    <div key={index}>
                      <b>
                        ({index + 1}. {note})
                      </b>{" "}
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="mt-10 text-center text-2xl">
                Subject Achievement
              </h2>
              <div className="2-full flex w-full max-w-5xl flex-1 flex-row flex-wrap justify-center gap-5">
                <div className="m-auto flex w-full flex-col items-center gap-4">
                  {[
                    "Reading",
                    "Writing",
                    "Speaking",
                    "Listening",
                    "Use of English",
                    "Mathematics",
                    "Social Studies",
                    "Science",
                  ].map((subject) => {
                    const fieldKey = skillToFieldKeyMap[subject];
                    if (!fieldKey) {
                      console.error(
                        `fieldKey is undefined for subject: ${subject}`,
                      );
                      return null;
                    }
                    const values = studentFields?.[fieldKey] ?? {
                      s1: "",
                      s2: "",
                    };
                    const s1value = values?.s1;
                    const s2value = values?.s2;

                    const s1Comment = getSubjectCommentBySubjectAndSemester(
                      comments,
                      fieldKey,
                      "1",
                      s1value,
                    );
                    const s2Comment = getSubjectCommentBySubjectAndSemester(
                      comments,
                      fieldKey,
                      "2",
                      s2value,
                    );
                    return (
                      <div
                        key={subject}
                        className="m-auto flex w-full flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3"
                      >
                        <div>
                          <SkillsSelectGroup
                            label={subject}
                            className=""
                            items={subjectAchievementOptions}
                            selected={
                              studentFields?.[fieldKey] ?? { s1: "", s2: "" }
                            }
                            onValueChange={(semester, value) =>
                              handleValueChange(fieldKey, semester, value)
                            }
                          />
                        </div>
                        <div className="flex grow flex-row items-center gap-2">
                          <Label>S1</Label>
                          <Textarea
                            className="text-3xs m-auto h-fit w-full"
                            placeholder="Select an option in the dropdown to load the comment..."
                            defaultValue={s1Comment}
                          />
                          <Label>S2</Label>
                          <Textarea
                            className="text-3xs m-auto h-fit w-full"
                            placeholder="Select an option in the dropdown to load the comment..."
                            defaultValue={s2Comment}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
