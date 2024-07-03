"use server"

import { db } from "~/server/db/index";
import { 
    classes as classesTable, 
    teacher_classes as teacherClassesTable,
    students as studentsTable, 
    student_classes as studentClassesTable,
    student_fields as studentFieldTable
} from "~/server/db/schema";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export type ClassGrade = "1" | "2" | "3" | "4" | "5";
export type Role = "primary" | "assistant"
export type UserRole = "teacher" | "admin"

export type Student = {
    student_id: string;
    student_name_en: string;
    student_name_ko: string | undefined;
    student_sex: "m" | "f" | null;
    student_number: number | null;
    student_email: string | null;
    joined_date?: string;
    updated_date?: string;
}

type ClassData = {
    class_id: string;
    class_name: string;
    class_language: string;
    class_grade: ClassGrade;
    class_year: string | undefined;
}

export type Data = {
    class_id: string | undefined;
    class_name: string;
    class_language: string;
    class_grade: ClassGrade;
    class_year: string | undefined;
    role: Role;
    fileContents: string;
}

type TeacherClassData = {
    assignment_id: string;
    user_id: string;
    class_id: string;
    role: Role;
}

export type CSVStudent = Record<string, string | undefined>;

function generateUuidWithPrefix(prefix: string){
    return `${prefix}${randomUUID()}`
}

function csvToJson(csvString: string): CSVStudent[] {
    console.log("🚀 ~ csvToJson ~ csvString:", csvString)
    const lines = csvString.split('\n');
    const result: CSVStudent[] = [];
    const headers = lines[0]?.split(',') ?? [];
  
    for (let i = 1; i < lines.length; i++) {
      const obj: CSVStudent = {};
      const currentline = lines[i]?.split(',') ?? [];
  
      if (headers.length > 0 && currentline && currentline.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j]?.trim();
            if (header === undefined) continue
            obj[header] = currentline[j]?.trim() ?? '';
        }
        result.push(obj);
      }
    }
    return result;
  }

export default async function insertClass(data: Data, userId: string) {

    if (data.class_language === null || data.class_language === undefined || data.class_language === '') data.class_language = 'en-US'

    const classId = generateUuidWithPrefix('class_')
    const classData: ClassData = {
        class_id: classId,
        class_name: data.class_name,
        class_language: data.class_language,
        class_grade: data.class_grade,
        class_year: data.class_year,
    }
    await db.insert(classesTable).values(classData)

    const assignmentId = generateUuidWithPrefix('assignment_')
    const teacherClassData: TeacherClassData = {
        assignment_id: assignmentId,
        user_id: userId,
        class_id: classId,
        role: data.role,
    }
    await db.insert(teacherClassesTable).values(teacherClassData)

    const studentsJson = csvToJson(data.fileContents)
    const studentsData: Student[] = [];
    for (const student of studentsJson) {
        if (!student.name_en) {
            console.warn(`Skipping student due to missing required field: ${JSON.stringify(student)}`);
            continue
        }
        const stud: Student = {
            student_id: generateUuidWithPrefix('student_'),
            student_name_en: student.name_en,
            student_name_ko: student.name_ko,
            student_sex: (student.sex === "m" || student.sex === "f") ? student.sex : null,
            student_number: student.number ? parseInt(student.number, 10) : null,
            student_email: student.email ?? null,
        };
        studentsData.push(stud)
    }
    await db.insert(studentsTable).values(studentsData)
 
    const studentClassesData = []
    for (const student of studentsData) {
        const stud = {
            enrollment_id: generateUuidWithPrefix('enrollment_'),
            student_id: student.student_id,
            class_id: classId
        }
        studentClassesData.push(stud)
    }
    await db.insert(studentClassesTable).values(studentClassesData)

    const studentFieldData = []
    for (const student of studentsData) {
        const stud = {
            field_id: generateUuidWithPrefix('field_'),
            student_id: student.student_id,
        }
        studentFieldData.push(stud)
    }
    await db.insert(studentFieldTable).values(studentFieldData)
    revalidatePath("/classes");
}