"use client";

import SkillsSelectGroup from "~/components/ui/SkillSelectGroup";
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
    label: "Absent",
    desc: "Insufficient evidence to assign a level.",
  },
  {
    value: "CD",
    label: "Consistently Demonstrates",
    desc: "The student applies the skill, trait, or work habit consistently with minimal teacher support.",
  },
  {
    value: "P",
    label: "Progressing",
    desc: "The student applies the skill, trait, or work habit regularly, though, needs additional teacher support at times.",
  },
  {
    value: "NY",
    label: "Not Yet",
    desc: "The student has not yet applied the skill, trait, or work habit appropriately or does so with much teacher support.",
  },
];
const subjectAchievementOptions = [1, 2, 3, 4, 5]; // This value fetches the Strengths/Next Steps for Improvement

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
          <div className="flex flex-col gap-4">
            {/* 21st Century Skills */}
            <SkillsSelectGroup
              label="Responsibility"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Organization"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Collaboration"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Communication"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Thinking"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Inquiry"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Risk-taking"
              items={twentyFirstCenturySkillsItems}
            />
            <SkillsSelectGroup
              label="Open-minded"
              items={twentyFirstCenturySkillsItems}
            />
            <Textarea placeholder="Skill and Habits comment. No more than 350 words." />
            {/* Subject Achievement */}
            <div></div>
          </div>
        </div>
      </main>
      <div></div>
    </div>
  );
}
