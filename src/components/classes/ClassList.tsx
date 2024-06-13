"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Settings, SquarePen, ScrollText } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import Logo from "~/components/brand/Logo";
import EventBus from "~/lib/EventBus";
import Link from "next/link";

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
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    classes.push({
      class_id: element?.classes?.class_id,
      class_name: element?.classes?.class_name,
      class_language: element?.classes?.class_language,
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
      throw new Error("Failed to fetch ClassQuest classes data");
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
      {courses.map((course) => (
        <div
          key={course.class_id}
          className="m-auto flex w-full gap-10 rounded-2xl bg-card-foreground/10 p-3"
        >
          <div className="flex flex-1 flex-col justify-center self-start">
            <div className="text-base font-bold lg:text-xl">
              {course.class_name}
            </div>
            <div className="text-sm italic lg:text-sm">{course.role}</div>
          </div>
          <div className="m-auto flex h-full flex-1 items-end justify-end gap-2 self-end">
            <Button
              asChild
              variant={"outline"}
              className="flex gap-2 bg-inherit"
            >
              <Link href={`/classes/${course.class_id}`}>
                <ScrollText className="h-5 w-5"></ScrollText>
                <span className="hidden md:block">Quest</span>
              </Link>
            </Button>
            <Button variant={"ghost"} className="px-2 py-1">
              <Settings className="h-5 w-5"></Settings>
            </Button>
            <Button variant={"ghost"} className="px-2 py-1">
              <SquarePen className="h-5 w-5"></SquarePen>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
