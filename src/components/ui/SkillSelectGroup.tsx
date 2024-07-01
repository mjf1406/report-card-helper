import React, { type FC } from "react";
import CustomSelect from "./CustomSelect"; // Ensure this path is correct based on your project structure

type Item = {
  value: string;
  label: string | number;
};

const skillDescriptions: Record<string, string[]> = {
  Responsibility: [
    "Completes and submits class work, homework, and assignments on time",
    "Takes responsibility for and manages own behaviour",
    "Follows instructions with minimal supervision",
  ],
  Organization: [
    "Follows a plan and process",
    "Establishes priorities and manages independent time appropriately to complete tasks",
  ],
  Collaboration: [
    "Accepts various roles in a group",
    "Works with others to achieve a common goal",
  ],
  Communication: [
    "Expresses thoughts, ideas, and emotions using oral, written, ICT and nonverbal communication skills",
    "Listens effectively to comprehend meaning in a variety of forms and contexts",
  ],
  Thinking: [
    "Looks for and acts on new ideas and opportunities for learning",
    "Builds logical connections between ideas and uses information and knowledge to achieve a solution",
  ],
  Inquiry: [
    "Demonstrates curiosity and interest in learning",
    "Generates questions for further inquiry",
    "Investigates and obtains information independently",
  ],
  "Risk-taking": [
    "Takes educated risks and makes an effort when responding to challenges",
    "Sees failure as an opportunity to learn and grow",
  ],
  "Open-minded": [
    "Open to perspectives, values and traditions of others",
    "Familiar with seeking and evaluating a range of points of view",
  ],
};

const SkillsSelectGroup: FC<{
  label: string;
  items: Item[];
  className?: string;
  selected?: { s1: string; s2: string };
  onValueChange: (semester: "s1" | "s2", value: string) => void;
}> = ({ label, items, className, selected, onValueChange }) => {
  const descriptions = skillDescriptions[label];
  return (
    <>
      <div
        className={
          "m-auto flex w-full flex-wrap items-center justify-start gap-4 " +
          className
        }
      >
        <div className="mr-5 grow">{label}</div>
        <div className="flex items-center justify-center gap-2">
          <div>S1</div>
          <CustomSelect
            placeholder="S1"
            items={items}
            selected={selected?.s1}
            onValueChange={(value) => onValueChange("s1", value)}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div>S2</div>
          <CustomSelect
            placeholder="S2"
            items={items}
            selected={selected?.s2}
            onValueChange={(value) => onValueChange("s2", value)}
          />
        </div>
      </div>
      <div className="m-auto flex w-full max-w-md flex-col items-start text-left text-xs">
        {!descriptions ? (
          <></>
        ) : (
          descriptions.map((item: string, index: number) => (
            <div key={index}>• {item}</div>
          ))
        )}
      </div>
    </>
  );
};

export default SkillsSelectGroup;
// •
