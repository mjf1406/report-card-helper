import React, { type FC } from "react";
import CustomSelect from "./CustomSelect"; // Ensure this path is correct based on your project structure

/**
 * Renders a group of skills select components.
 * @param label - The label for the group.
 * @param items - The items to be displayed in the select components.
 * @param className - Additional CSS class for the container.
 * @returns A JSX.Element representing the group of skills select components.
 */

type Item = {
  value: string;
  label: string | number;
};
const SkillsSelectGroup: FC<{
  label: string;
  items: Item[];
  className?: string;
}> = ({ label, items, className }) => {
  return (
    <div
      className={
        "m-auto flex w-full flex-wrap items-center justify-start gap-4 " +
        className
      }
    >
      <div className="mr-5 grow">{label}</div>
      <div className="flex items-center justify-center gap-2">
        <div>S1</div>
        <CustomSelect placeholder="S1" items={items} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div>S2</div>
        <CustomSelect placeholder="S2" items={items} />
      </div>
    </div>
  );
};

export default SkillsSelectGroup;
