"use client";

import { Plus, Info, ExternalLink } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
import insertClass from "~/server/actions/insertClass";
import React, { useState } from "react";
import type { Data } from "~/server/actions/insertClass";
import { useToast } from "~/components/ui/use-toast";
import EventBus from "~/lib/EventBus";
import Link from "next/link";

export default function NewClassDialog() {
  const { userId } = useAuth();
  const [className, setClassName] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [classLanguage, setClassLanguage] = useState("en"); // Default to English
  const [teacherRole, setTeacherRole] = useState("primary"); // Default to primary
  const [open, setOpen] = useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const { toast } = useToast();

  const handleCreateClass = async () => {
    if (!userId) {
      alert("User not authenticated.");
      return;
    }
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    if (!className || className === "") {
      alert("Please input a class name");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const text = event?.target?.result;
      const newClass: Data = {
        class_id: undefined,
        class_name: className,
        class_language: classLanguage,
        class_grade: classGrade,
        role: teacherRole,
        fileContents: String(text),
      };

      try {
        await insertClass(newClass, userId);
        setOpen(false);
        toast({
          title: "Class created successfully!",
          description: `${className} was successfully created with you as ${teacherRole} teacher.`,
        });
        // EventBus.emit("classAdded", newClass);
      } catch (error) {
        console.error("Failed to create class:", error);
        toast({
          variant: "destructive",
          title: "Failed to create the class!",
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
              <Plus></Plus>
            </span>
            New Class
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new class</DialogTitle>
            <DialogDescription>
              Create a new class to add to your class list.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start gap-2 space-x-2">
            <h2 className="flex items-center gap-1 text-2xl">
              Step 1
              <span className="">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info width={18}></Info>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        <b>
                          Where&apos;s the Google Classroom import? Why must I
                          use Google Sheets?
                        </b>{" "}
                        There is no Google Classroom import because importing
                        from Google Classroom does not include the student
                        number. So, you would have to add this on the website,
                        which I think has more friction than using Google Sheets
                        because it&apos;s probable that teachers already have 2
                        or 3 out of the 4 columns available in a Google Sheet.{" "}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </h2>
            <Link
              href={
                "https://docs.google.com/spreadsheets/d/1esh8Wu7e2nNYWg_puYzogWoWbwgRs1PK_8sVoXi0ysY/edit?usp=sharing"
              }
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center underline"
            >
              Make a copy of and fill out the Class Template{" "}
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col items-start gap-2 space-x-2">
            <h2 className="text-2xl">Step 2</h2>
            <p>
              <Label>
                From Google Sheets, download the Class Template as{" "}
                <b>Comma-separated values (.csv)</b>.
              </Label>
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 space-x-2">
            <h2 className="text-2xl">Step 3</h2>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="class-template-upload">
                Upload the Class Template
              </Label>
              <Input
                id="class-template-upload"
                type="file"
                onChange={(e) => {
                  const file =
                    e.target.files && e.target.files.length > 0
                      ? e.target.files[0]
                      : null;
                  setFile(file ?? null);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-start space-x-2">
            <h2 className="text-2xl">Step 4</h2>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="class-name" className="flex items-center">
                Class name{" "}
                <span className="pl-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info width={16}></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is the display name of your class.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </Label>
              <Input
                id="class-name"
                placeholder="Enter class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start space-x-2">
            <h2 className="text-2xl">Step 5</h2>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="class-name" className="flex items-center">
                Class grade{" "}
                <span className="pl-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info width={16}></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Choose your grade so you can compare to the other
                          classes therein.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </Label>
              <Select onValueChange={setClassGrade}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Class grade" />
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
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateClass}>
                Create class
              </Button>
            </DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
