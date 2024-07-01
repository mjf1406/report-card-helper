import { useState } from "react";
import React, { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const CustomSelect: FC<{
  placeholder: string;
  items: Array<{ value: string; label: string | number }>;
  selected: string | undefined;
  onValueChange: (value: string) => void;
}> = ({ placeholder, items, selected, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    String(selected),
  );

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[75px]">
        <SelectValue placeholder={""} />
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
