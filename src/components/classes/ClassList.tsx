"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Download, SquarePen, School } from "lucide-react";
import { Button } from "~/components/ui/button";
import EventBus from "~/lib/EventBus";
import Link from "next/link";
import { downloadReportCards } from "~/server/actions/downloadReportCards";

interface Course {
  class_id: string;
  class_name: string;
  class_language: string;
  created_date: string;
  updated_date: string;
  assigned_date: string;
  role: string;
}

interface Courses {
  course: Course[];
}

export function databaseClassesToCourseMap(data: object[]) {
  const classes = [];
  for (const element of data) {
    classes.push({
      class_id: element?.classes?.class_id,
      class_name: element?.classes?.class_name,
      class_language: element?.classes?.class_language,
      class_grade: element?.classes?.class_grade,
      created_date: element?.classes?.created_date,
      updated_date: element?.classes?.updated_date,
      assigned_date: element?.teacher_classes?.assigned_date,
      role: element?.teacher_classes?.role,
    });
  }
  return classes;
}

async function fetchClassroomData(): Promise<Course[]> {
  try {
    const response = await fetch("/api/getClasses");
    if (!response.ok) {
      throw new Error("Failed to fetch Reparper classes data");
    }
    const text = await response.text(); // Make this operation await so it completes here
    const data = JSON.parse(text); // Parse the text to JSON
    const classes = databaseClassesToCourseMap(data); // Convert data to classes
    return classes; // Now return the fully populated array
  } catch (error) {
    return [];
  }
}

export default function ClassList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClassroomData().then((data) => {
      setCourses(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleNewClass = (newClass: Course) => {
      setCourses((prevCourses) => [...prevCourses, newClass]);
    };

    EventBus.on("classAdded", handleNewClass);
    return () => {
      EventBus.off("classAdded", handleNewClass);
    };
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
                <Button onClick={downloadReportCards}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Reports
                </Button>
              ) : (
                <></>
              )}
              <Button
                asChild
                variant={"outline"}
                className="flex gap-2 bg-inherit"
              >
                <Link href={`/classes/${course.class_id}`}>
                  <School className="h-4 w-4" />
                  <span className="hidden md:block">Open</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={"ghost"}
                className="bg-inherit px-2 py-1"
              >
                <Link href={`/classes/${course.class_id}/edit`}>
                  <SquarePen className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
