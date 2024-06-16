"use client";

import SkillsSelectGroup from "~/components/ui/SkillSelectGroup";
import { Label } from "~/components/ui/label";
import TopNav from "~/components/ui/navigation/TopNav";
import { Textarea } from "~/components/ui/textarea";

interface Params {
  studentId: string;
  student: string;
}

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
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
]; // This value fetches the Strengths/Next Steps for Improvement

export default function EditStudent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Params;
}) {
  const student = JSON.parse(searchParams?.student);
  console.log("🚀 ~ EditStudent ~ student:", student);

  return (
    <div>
      <TopNav />
      <main className="text-text flex min-h-screen flex-col items-center bg-background">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="flex flex-col gap-4 text-center text-4xl">
            <span className="text-xl">Filling out the report for</span>
            <span>
              ({student.student_number}) {student.student_name_en}
            </span>
          </h1>
          <h2 className="text-2xl">
            21st Century Skills, Learner Traits, and Work Habits
          </h2>
          <div className="flex flex-row flex-wrap gap-5">
            <div className="m-auto flex h-full flex-col items-center justify-center gap-2">
              <SkillsSelectGroup
                label="Responsibility"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Organization"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Collaboration"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Communication"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Thinking"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Inquiry"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Risk-taking"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
              <SkillsSelectGroup
                label="Open-minded"
                className={"rounded-lg bg-foreground/10 px-3 py-2"}
                items={twentyFirstCenturySkillsItems}
              />
            </div>
            <div className="m-auto flex h-full max-w-lg flex-col justify-center gap-2 text-left text-xs">
              <div>
                <span className="font-bold">AB = Absent: </span>
                <span>Insufficient evidence to assign a level.</span>
              </div>
              <div>
                <span className="font-bold">
                  CD = Consistently Demonstrates:{" "}
                </span>
                <span>
                  The student applies the skill, trait, or work habit
                  consistently with minimal teacher support.
                </span>
              </div>
              <div>
                <span className="font-bold">P = Progressing: </span>
                <span>
                  The student applies the skill, trait, or work habit regularly,
                  though, needs additional teacher support at times.
                </span>
              </div>
              <div>
                <span className="font-bold">NY = Not Yet: </span>
                <span>
                  The student has not yet applied the skill, trait, or work
                  habit appropriately or does so with much teacher support.
                  Additional practice is required.
                </span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl">Skills and Habits Comment</h2>
          <div className="2-full flex w-full max-w-5xl flex-1 flex-row flex-wrap justify-center gap-5">
            <div className="m-auto h-full max-w-lg grow">
              <Textarea
                className="m-auto h-full w-full"
                placeholder="Skill and Habits comment. I recommend you write this in Google Docs, then copy it over."
              />
            </div>
            <div className="flex max-w-lg flex-col gap-2 text-xs">
              <div className="text-lg font-bold">FOLLOW THIS TEMPLATE</div>
              <div>
                <b>(1. general positive statement)</b> Moonjung has made
                remarkable progress over the course of semester one, both in her
                participation as well as her academic effort.
              </div>
              <div>
                <b>(2. student strengths)</b> She is responsible, she is aware
                of her own actions in and around the school and can be trusted
                by the teachers to be honest. Moonjung is organized. She can
                follow a plan and process for completing her work most of the
                time. She is also able to monitor, assess, and revise her plans
                to complete any class work.
              </div>
              <div>
                <b>(3. specific example, next steps)</b> When collaborating with
                other students, Moonjung always shares her expertise with other
                students communicating effectively, so her peers listen and
                respect what she is saying. This was most evident during our
                S.T.E.M activities. Occasionally, her willingness to help causes
                her time management problems, because she ends up giving too
                much of herself to other students and her own work suffers in
                return. Despite this, she always approaches tasks with a
                positive attitude and isn’t afraid to take risks.{" "}
                <b>(next step)</b>&nbsp; Now and again, Moonjung could practice
                saying ‘no’ to her peers to ensure she has the time she deserves
                to do the very best job possible.
              </div>
              <div>
                <b>(4. closing statement/ bonus next step if required)</b>{" "}
                Moonjung perseveres and reflects on her strengths and
                weaknesses. She makes an effort when responding to any
                challenge. I know she will do well in semester two.
              </div>
            </div>
          </div>
          <h2 className="mt-10 text-center text-2xl">Subject Achievement</h2>
          <div className="2-full flex w-full max-w-5xl flex-1 flex-row flex-wrap justify-center gap-5">
            <div className="m-auto flex w-full flex-col items-center gap-4">
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Reading"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Writing"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Speaking"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Listening"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Use of English"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Mathematics"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Social Studies"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row flex-wrap items-center gap-5 rounded-lg bg-foreground/10 p-3">
                <div>
                  <SkillsSelectGroup
                    label="Science"
                    items={subjectAchievementOptions}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label>S1</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                  <Label>S2</Label>
                  <Textarea
                    className="m-auto w-full text-xs"
                    placeholder="Select an option in the dropdown to load the comment..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div></div>
    </div>
  );
}
