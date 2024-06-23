"use client";

import TopNav from "~/components/ui/navigation/TopNav";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, SquarePen, Newspaper, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { databaseClassToCourseMap } from "~/server/actions/getClassById";
import type { Student, Course } from "~/server/db/types";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import removeStudentFromClass from "~/server/actions/removeStudentFromClass";

type Params = {
  classId: string;
};

type data = {
  class: [];
  studentFields: [];
  students: [];
};

async function fetchStudentRoster(
  classId: string,
  userId: string | null | undefined,
): Promise<Course | undefined> {
  try {
    const url = new URL("/api/getClass", window.location.origin);
    url.searchParams.append("classId", classId);
    url.searchParams.append("userId", String(userId));
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("Failed to fetch student roster");
      throw new Error("Failed to fetch student roster");
    }
    const text: string = await response.text();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: data = JSON.parse(text);
    const classData: Course | undefined = await databaseClassToCourseMap(data);
    return classData;
  } catch (err) {
    const error = err as Error;
    console.error("failed to parse course", error);
    throw new Error("failed to parse course");
  }
}

export default function ClassDetails({ params }: { params: Params }) {
  const [course, setCourse] = useState<Course>();
  const [students, setStudents] = useState<Student[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState<string | undefined>(
    undefined,
  );
  const [deleteStudentText, setDeleteStudentText] = useState("");
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);

  const { userId } = useAuth();
  const { toast } = useToast();

  const classId = params.classId;

  useEffect(() => {
    if (!isLoading && course?.students) {
      setStudents(course.students);
    }
  }, [isLoading, course]);

  async function handleDeleteStudent(
    studentId: string | undefined,
    studentName: string | undefined,
    classId: string | undefined,
  ) {
    if (studentName !== deleteStudentText) {
      return toast({
        title: "Student names do not match!",
        description:
          "This is case-sensitive. Please double check what you typed and try again.",
        variant: "destructive",
      });
    }
    try {
      setLoadingButtonId(`delete-${studentId}`);
      await removeStudentFromClass(studentId, classId);
      setStudents(
        students?.filter((student) => student.student_id !== studentId),
      ); // remove the class from the list
      toast({
        title: "Student deleted successfully!",
        description: `${studentName} has been successfully deleted.`,
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
    void fetchStudentRoster(classId, userId).then((data) => {
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
              <h1 className="text-5xl">{course?.class_name}</h1>

              <div className="m-auto flex w-full flex-1 shrink flex-col items-center justify-center gap-4">
                {students?.map((student) => (
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
                      {loadingButtonId === `open-${student.student_id}` ? (
                        <Button
                          key={`open-${student.student_id}`}
                          variant={"outline"}
                          disabled
                        >
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Fill out
                        </Button>
                      ) : (
                        <Button
                          key={`open-${student.student_id}`}
                          asChild
                          variant={"outline"}
                          onClick={() =>
                            handleMyClassesClick(`open-${student.student_id}`)
                          }
                        >
                          <Link
                            href={{
                              pathname: `/students/${student.student_id}/report`,
                              query: {
                                student: JSON.stringify(student),
                                class_name: course?.class_name,
                                class_id: course?.class_id,
                              },
                            }}
                          >
                            <Newspaper className="mr-2 h-4 w-4" />
                            Fill out
                          </Link>
                        </Button>
                      )}
                      <Button variant={"ghost"} className="px-2 py-1">
                        {/* <Link href={`/students/${student.student_id}/edit`}> */}
                        <Link href={`/students/${student.student_id}/edit`}>
                          <SquarePen className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"destructive"}
                            className=" px-2 py-1"
                            onClick={() =>
                              setStudentToDelete(student.student_name_en)
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Delete student</DialogTitle>
                            <DialogDescription>
                              Please type the student&apos;s name,{" "}
                              <span id="class-id" className="font-bold">
                                {studentToDelete}
                              </span>
                              , below in order to confirm deletion. Deleting a
                              student is <b>IRREVERSIBLE</b>.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="link" className="sr-only">
                                Class to delete
                              </Label>
                              <Input
                                id="class-to-delete"
                                value={deleteStudentText}
                                onChange={(e) =>
                                  setDeleteStudentText(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            {loadingButtonId ===
                            `delete-${student.student_id}` ? (
                              <Button
                                key={`delete-${student.student_id}`}
                                variant={"destructive"}
                                disabled
                              >
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Deleting...
                              </Button>
                            ) : (
                              <Button
                                key={`delete-${student.student_id}`}
                                onClick={() =>
                                  handleDeleteStudent(
                                    student.student_id,
                                    student.student_name_en,
                                    course?.class_id,
                                  )
                                }
                                variant={"destructive"}
                              >
                                Delete student
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
