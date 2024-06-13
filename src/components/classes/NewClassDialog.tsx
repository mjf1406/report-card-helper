"use client";

import { Plus, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import Divider from "~/components/ui/divider";
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
  SelectGroup,
  SelectLabel,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import ImportGoogleClassesDialog from "./ImportGoogleClassesDialog";
import { useAuth } from "@clerk/nextjs";
import insertClass from "~/server/actions/insertClass";
import { useState } from "react";
import type { Data } from "~/server/actions/insertClass";
import { useToast } from "~/components/ui/use-toast";
import EventBus from "~/lib/EventBus";

export default function NewClassDialog() {
  const { userId } = useAuth();
  const [className, setClassName] = useState("");
  const [classLanguage, setClassLanguage] = useState("en"); // Default to English
  const [teacherRole, setTeacherRole] = useState("primary"); // Default to primary
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateClass = async () => {
    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    try {
      const newClass: Data = {
        class_id: "", // `class_id` will be generated on the server
        class_name: className,
        class_language: classLanguage,
        role: teacherRole,
      };

      await insertClass(newClass, userId);
      setOpen(false);
      toast({
        title: "Class created successfully!",
        description: `${className} was successfully created with you as ${teacherRole} teacher.`,
      });
      EventBus.emit("classAdded", newClass);
    } catch (error) {
      console.error("Failed to create class:", error);
      toast({
        variant: "destructive",
        title: "Failed to create the class!",
        description: "Please try again.",
      });
    }
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
          <div className="flex items-center space-x-2">
            <ImportGoogleClassesDialog />
          </div>
          <Divider text="Or" />
          <div className="flex items-center space-x-2">
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
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="class-language" className="flex items-center">
                Teacher role{" "}
                <span className="pl-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info width={16}></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is your role in the class as a teacher.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </Label>
              <Select onValueChange={setTeacherRole} value={teacherRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Teacher role</SelectLabel>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="class-language" className="flex items-center">
                Class language{" "}
                <span className="pl-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info width={16}></Info>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          This will set the UI language that your students will
                          be forced to use.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </Label>
              <Select onValueChange={setClassLanguage} value={classLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Class language</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="zhs">简体中文</SelectItem>
                    <SelectItem value="zht">繁體中文</SelectItem>
                  </SelectGroup>
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
