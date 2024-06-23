"use client";

import { ExternalLink, Loader2, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import Link from "next/link";
import insertComments from "~/server/actions/insertComments";
import type { Data } from "~/server/actions/insertComments";

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Handle escaped quotes
        currentField += '"';
        i++;
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
      } else {
        // Inside quoted field
        currentField += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ",") {
        // End of field
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n") {
        // End of row
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        // Regular character
        currentField += char;
      }
    }
  }

  // Add the last field and row if not empty
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

type SubjectData = Record<string, Record<string, string>>;

function transformData(data: string[][]): SubjectData {
  const headers = data[0]?.map((header) => header.trim()) ?? [];
  const transformedData: SubjectData = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row?.[0]) {
      continue;
    }
    const level = row[0].trim();

    for (let j = 1; j < headers.length; j++) {
      const subject = headers[j]?.replace("\r", "").trim();
      const value = row[j]?.replace("\r", "").trim() ?? "";

      if (subject) {
        if (!transformedData[subject]) {
          transformedData[subject] = {};
        }
        transformedData[subject]![level] = value;
      }
    }
  }
  return transformedData;
}
const validateSubject = (subject: Record<string, string | null>): boolean => {
  const requiredFields = ["l1", "l2", "l3", "l4", "l5"];
  return requiredFields.every(
    (field) => subject[field] !== null && subject[field] !== "",
  );
};

export default function NewClassDialog() {
  const { userId } = useAuth();
  const [classGrade, setClassGrade] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isCsvValid, setCsvValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateCsv = (file: File | null) => {
    if (!file) {
      console.error("Failed to create class:");
      toast({
        variant: "destructive",
        title: "Failed to create the class!",
        description: "Please upload a file.",
      });
      throw new Error("Please upload a file");
    }

    setFile(file);

    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const text = event?.target?.result as string;
        const data = parseCSV(text);
        const json = transformData(data);
        console.log("🚀 ~ json:", json);

        let isValid = true;
        for (const subject of Object.values(json)) {
          if (!validateSubject(subject)) {
            const errorMsg =
              "One (or more) of the required fields is (are) empty. The required fields are l1, l2, l3, l4, and l5.";
            console.error("Failed to create class:", errorMsg);
            toast({
              variant: "destructive",
              title: "Invalid CSV!",
              description: errorMsg,
            });
            isValid = false;
            break;
          }
        }

        if (isValid) setCsvValid(true);
      } catch (error) {
        console.error("An error occurred while reading the file:", error);
        toast({
          variant: "destructive",
          title: "Error!",
          description: "An error occurred while processing the file.",
        });
      }
    };

    reader.readAsText(file);
  };
  const handleUpload = async () => {
    if (!isCsvValid) {
      const errorMsg =
        "Invalid CSV: One (or more) of the required fields is (are) empty. Only the example column can be blank.";
      console.error("Failed to upload comments:", errorMsg);
      return toast({
        variant: "destructive",
        title: "Failed to upload comments!",
        description: errorMsg,
      });
    }
    if (!userId) {
      alert("User not authenticated.");
      return;
    }
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    if (!semester) {
      alert("Select a semester.");
      return;
    }
    if (!year) {
      return alert("input a year.");
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      if (!event?.target?.result) {
        console.error("FileReader result is null");
        return;
      }
      const text = event.target.result as string;
      const data = parseCSV(text);
      const json = transformData(data);

      try {
        setLoading(true);
        await insertComments(json as Data, semester, year, classGrade);
        setOpen(false);
        toast({
          title: "Comments uploaded!",
          description: `The comments were successfully uploaded.`,
        });
      } catch (error) {
        setLoading(false);
        console.error("Failed to upload comments:", error);
        toast({
          variant: "destructive",
          title: "Failed to upload the comments!",
          description: "Please try again.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <span className="pr-2">
              <Upload />{" "}
            </span>
            Upload comments
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload subject achievement comments</DialogTitle>
            <DialogDescription>
              Upload comments for your whole grade to use.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start gap-2 space-x-2">
            <h2 className="flex items-center gap-1 text-2xl">Step 1</h2>
            <span>
              Make a copy of and fill out the
              <Link
                href={
                  "https://docs.google.com/spreadsheets/d/1u277GDdX-56mExqmJrKHLZ1PslTXkcjne9Ischi5QXM/edit?usp=sharing"
                }
                rel="noopener noreferrer"
                target="_blank"
                className="flex items-center underline"
              >
                Subject Achievement Comments Template{" "}
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </span>
            <span className="text-xs font-normal">
              Put different items within a single level on a new line that
              begins with a dash and a space (- ).
            </span>
          </div>
          <div className="flex flex-col items-start gap-2 space-x-2">
            <h2 className="text-2xl">Step 2</h2>
            <p>
              <Label>
                From Google Sheets, download the Subject Achievement Comments
                Template as <b>Comma-separated values (.csv)</b>.
              </Label>
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 space-x-2">
            <h2 className="text-2xl">Step 3</h2>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="class-template-upload">
                Upload the Subject Achievement Comments Template
              </Label>
              <Input
                id="class-template-upload"
                type="file"
                onChange={(e) => {
                  const file =
                    e.target.files && e.target.files.length > 0
                      ? e.target.files[0]
                      : null;
                  validateCsv(file ?? null);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-start space-x-2">
            <h2 className="text-2xl">Step 4</h2>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="class-name" className="flex items-center">
                Grade level
              </Label>
              <Select onValueChange={setClassGrade}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col items-start space-x-2">
            <h2 className="text-2xl">Step 5</h2>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="year" className="flex items-center">
                Year
              </Label>
              <Input
                id="year"
                placeholder="Enter year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start space-x-2">
            <h2 className="text-2xl">Step 6</h2>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="semester" className="flex items-center">
                Semester
              </Label>
              <Select onValueChange={setSemester}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogFooter>
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Uploading...
                </Button>
              ) : (
                <Button type="submit" onClick={handleUpload}>
                  <Upload className="mr-2" />
                  Upload comments
                </Button>
              )}
            </DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
