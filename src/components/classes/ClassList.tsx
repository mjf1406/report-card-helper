"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Download, SquarePen, School, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
// import EventBus from "~/lib/EventBus";
import Link from "next/link";
import { type TeacherCourse } from "~/server/db/types";
import removeClassFromTeacher from "~/server/actions/removeClassFromTeacher";
import { useToast } from "../ui/use-toast";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Data = {
  classes: {
    class_id: string;
    class_name: string;
    class_language: string;
    class_grade: string;
    created_date: string;
    updated_date: string;
    complete: boolean;
  };
  teacher_classes: {
    assigned_date: string;
    role: string;
  };
};

export async function databaseClassesToCourseMap(
  data: Data[],
): Promise<TeacherCourse[]> {
  const classes: TeacherCourse[] = [];
  for (const element of data) {
    classes.push({
      class_id: element.classes.class_id,
      class_name: element.classes.class_name,
      class_language: element.classes.class_language,
      class_grade: element.classes.class_grade,
      created_date: element.classes.created_date,
      updated_date: element.classes.updated_date,
      assigned_date: element.teacher_classes.assigned_date,
      role: element.teacher_classes.role,
      complete: element.classes.complete,
    });
  }
  return classes;
}

async function fetchClassroomData(): Promise<TeacherCourse[]> {
  try {
    const response = await fetch("/api/getClasses");
    if (!response.ok) {
      throw new Error("Failed to fetch classes data");
    }
    const text: string = await response.text(); // Make this operation await so it completes here
    const data: Data[] = JSON.parse(text) as Data[];
    const classes: TeacherCourse[] = await databaseClassesToCourseMap(data);
    return classes;
  } catch (err) {
    const error = err as Error;
    console.error("failed to parse course", error);
    throw new Error("failed to parse course");
  }
}

export default function ClassList() {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [deleteCourseText, setDeleteCourseText] = useState("");
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleDeleteClass(classId: string, className: string) {
    if (className !== deleteCourseText) {
      return toast({
        title: "Class names do not match!",
        description:
          "This is case-sensitive. Please double check what you typed and try again.",
        variant: "destructive",
      });
    }
    try {
      setLoadingButtonId(`delete-${classId}`);
      await removeClassFromTeacher(classId);
      setCourses(courses.filter((course) => course.class_id !== classId)); // remove the class from the list
      toast({
        title: "Class deleted successfully!",
        description: `${className} has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete class!",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  }

  const handleMyClassesClick = (id: string) => {
    setLoadingButtonId(id);
  };

  useEffect(() => {
    fetchClassroomData()
      .then((data) => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const err = error as Error;
        console.error("failed to fetch classes data", err);
        throw new Error("failed to fetch classes", err);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl bg-foreground/5 p-5">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading classes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto flex w-full max-w-3xl flex-col gap-4">
      {courses.length === 0 ? (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl bg-foreground/5 p-5">
            <div className="flex items-center justify-center gap-2">
              <div>Add a class by clicking the button above.</div>
            </div>
          </div>
        </div>
      ) : (
        courses.map((course) => (
          <div
            key={course.class_id}
            className="m-auto flex w-full gap-10 rounded-2xl bg-card-foreground/10 p-3"
          >
            <div className="flex flex-1 flex-col justify-center self-start">
              <div className="text-base font-bold lg:text-xl">
                {course.class_name}
              </div>
              <div className="text-sm italic lg:text-sm">
                {course.role} teacher
              </div>
              <div className="text-sm italic">grade {course.class_grade}</div>
            </div>
            <div className="m-auto flex h-full flex-1 items-end justify-end gap-2 self-end">
              {course.complete ? (
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Reports
                </Button>
              ) : (
                <></>
              )}
              {loadingButtonId === `open-${course.class_id}` ? (
                <Button
                  key={`open-${course.class_id}`}
                  variant={"outline"}
                  disabled
                >
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Open
                </Button>
              ) : (
                <Button
                  key={`open-${course.class_id}`}
                  asChild
                  variant={"outline"}
                  onClick={() =>
                    handleMyClassesClick(`open-${course.class_id}`)
                  }
                >
                  <Link
                    href={{
                      pathname: `/classes/${course.class_id}`,
                      query: {
                        class_name: course?.class_name,
                      },
                    }}
                  >
                    <School className="mr-2 h-4 w-4" />
                    Open
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant={"ghost"}
                className="bg-inherit px-2 py-1"
              >
                <Link href={`/classes/${course.class_id}/edit`}>
                  <SquarePen className="h-5 w-5" />
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"destructive"}
                    className=" px-2 py-1"
                    onClick={() => setCourseToDelete(course.class_name)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete class</DialogTitle>
                    <DialogDescription>
                      Please type the class name,{" "}
                      <span id="class-id" className="font-bold">
                        {courseToDelete}
                      </span>
                      , below in order to confirm deletion. Deleting a class is{" "}
                      <b>IRREVERSIBLE</b>.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Class to delete
                      </Label>
                      <Input
                        id="class-to-delete"
                        value={deleteCourseText}
                        onChange={(e) => setDeleteCourseText(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    {loadingButtonId === `delete-${course.class_id}` ? (
                      <Button
                        key={`delete-${course.class_id}`}
                        variant={"destructive"}
                        disabled
                      >
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Deleting...
                      </Button>
                    ) : (
                      <Button
                        key={`delete-${course.class_id}`}
                        onClick={() =>
                          handleDeleteClass(course.class_id, course.class_name)
                        }
                        variant={"destructive"}
                      >
                        Delete class
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
