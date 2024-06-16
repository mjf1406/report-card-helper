import React from "react";
import CustomSelect from "./CustomSelect"; // Ensure this path is correct based on your project structure

const SkillsSelectGroup = ({ label, items, className }) => {
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
