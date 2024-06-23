"use client";

import * as React from "react";
import DesktopNav from "~/components/ui/navigation/DesktopNav";
import MobileNav from "~/components/ui/navigation/MobileNav";
import { usePathname, useSearchParams } from "next/navigation";

export interface NavProps {
  page: string;
  course: {
    class_name: string;
    class_id: string;
  };
  student: {
    student_name: string;
    student_id: string;
  };
}

function getClassName(
  pathname: string,
  searchParams: URLSearchParams,
): { class_name: string; class_id: string } {
  if (pathname.includes("/classes")) {
    return {
      class_name: searchParams.get("class_name") ?? "",
      class_id: pathname.replace("/classes/", ""),
    };
  }
  if (pathname.includes("/students/")) {
    return {
      class_name: searchParams.get("class_name") ?? "",
      class_id: searchParams.get("class_id") ?? "",
    };
  }
  return {
    class_name: "",
    class_id: "",
  };
}

function getStudentName(pathname: string, searchParams: URLSearchParams) {
  type Params = {
    student_name_en: string;
    student_id: string;
  };

  if (pathname.includes("/students/")) {
    const student = searchParams.get("student");
    if (student) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const params: Params = JSON.parse(student);
      return {
        student_name: params.student_name_en,
        student_id: params.student_id,
      };
    }
  }
  return {
    student_name: "",
    student_id: "",
  };
}

export default function TopNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const course = getClassName(pathname, searchParams);
  const student = getStudentName(pathname, searchParams);

  return (
    <div className="sticky top-0">
      <div className="sticky top-0 z-10 block md:hidden">
        <MobileNav page={pathname} course={course} student={student} />
      </div>
      <div className="sticky top-0 z-10 hidden sm:hidden md:block">
        <DesktopNav page={pathname} course={course} student={student} />
      </div>
    </div>
  );
}
