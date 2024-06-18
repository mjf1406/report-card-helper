import React, { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

/**
 * Custom select component.
 * @param {Object} props - The component props.
 * @param {string} props.placeholder - The placeholder text.
 * @param {Array<{ value: string, label: string | number}>} props.items - The list of select items.
 * @returns {JSX.Element} The custom select component.
 */
const CustomSelect: FC<{
  placeholder: string;
  items: Array<{ value: string; label: string | number }>;
}> = ({ placeholder, items }) => {
  return (
    <Select>
      <SelectTrigger className="w-[75px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
