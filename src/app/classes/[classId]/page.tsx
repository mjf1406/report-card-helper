"use client";

import TopNav from "~/components/ui/navigation/TopNav";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, SquarePen, Newspaper } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { databaseClassToCourseMap } from "~/server/actions/getClassById";

interface Params {
  classId: string;
}

async function fetchStudentRoster(classId, userId): Promise<Course[]> {
  try {
    const url = new URL("/api/getClass", window.location.origin);
    url.searchParams.append("classId", classId);
    url.searchParams.append("userId", userId);

    // const response = await fetch("/api/getClass");
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch Reparper student roster");
    }
    const text = await response.text(); // Make this operation await so it completes here
    const data: object[] = JSON.parse(text); // Parse the text to JSON
    const classes: object = databaseClassToCourseMap(data); // Convert data to classes
    console.log("🚀 ~ fetchStudentRoster ~ classes:", classes);
    return classes; // Now return the fully populated array
  } catch (error) {
    return [];
  }
}

export default function ClassDetails({ params }: { params: Params }) {
  const [course, setCourse] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const classId = params.classId;

  useEffect(() => {
    fetchStudentRoster(classId, userId).then((data) => {
      setCourse(data);
      setIsLoading(false);
    });
  }, [classId, userId]);

  return (
    <div>
      <TopNav />
      <main className="text-text flex min-h-screen flex-col items-center bg-background">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          {isLoading ? (
            <h1 className="flex flex-row gap-3 text-5xl">
              <Loader2 className="h-12 w-12 animate-spin" />
              <span>Loading...</span>
            </h1>
          ) : (
            <>
              <h1 className="text-5xl">{course.class_name}</h1>

              <div className="m-auto flex w-full flex-1 shrink flex-col items-center justify-center gap-4">
                {course.students.map((student) => (
                  <div
                    key={student.student_id}
                    className="m-auto flex w-full max-w-3xl gap-10 rounded-2xl bg-card-foreground/10 p-3"
                  >
                    <div className="flex flex-1 flex-col justify-center gap-1 self-start">
                      <div className="w-max text-base font-bold lg:text-xl">
                        (
                        {`${student.student_number}) 
                        ${student.student_name_en}`}
                      </div>
                      <div className="text-sm italic lg:text-sm">
                        {student.student_sex}
                      </div>
                      <div className="flex flex-1 shrink flex-row gap-2">
                        <div className="flex w-full max-w-[100px] flex-col items-center justify-center rounded-lg bg-foreground/10 px-1 py-1 text-sm">
                          <div>Sem. 1</div>
                          <div>3 / 17</div>
                        </div>
                        <div className="flex w-full max-w-[100px] flex-col items-center justify-center rounded-lg bg-foreground/10 px-1 py-1 text-sm">
                          <div>Sem. 2</div>
                          <div>0 / 17</div>
                        </div>
                      </div>
                    </div>

                    <div className="m-auto flex h-full flex-1 items-end justify-end gap-2 self-end">
                      <Button
                        asChild
                        variant={"outline"}
                        className="flex gap-2 bg-inherit"
                      >
                        <Link
                          href={{
                            pathname: `/students/${student.student_id}/report`,
                            query: { student: JSON.stringify(student) },
                          }}
                        >
                          <Newspaper className="h-5 w-5" /> Fill out
                        </Link>
                      </Button>
                      <Button variant={"ghost"} className="px-2 py-1">
                        {/* <Link href={`/students/${student.student_id}/edit`}> */}
                        <Link href={`/students/${student.student_id}/edit`}>
                          <SquarePen className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
