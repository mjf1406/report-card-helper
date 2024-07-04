"use server"

import { db } from "~/server/db/index";
import { classes as classesTable, 
    teacher_classes as teacherClassesTable, 
    students as studentTable, 
    student_classes as studentClassesTable,
    users as usersTable,
student_fields as studentFieldTable } from "../db/schema";
import { sql, eq } from "drizzle-orm";
import { type Course, type Teacher, type Student, type StudentField } from "../db/types";
import { isTeacherInClass } from "./isTeacherInClass";

const getClassById = async (classId: string, userId: string | undefined) => {
    if (!userId) throw new Error("User not authenticated")

    const isTeacherInClassBool: boolean = await isTeacherInClass(userId, classId)
    if (!isTeacherInClassBool) throw new Error("Unauthorized! You are not a teacher in this class.")
        
    try {
        const classData = await db
            .select()
            .from(classesTable)
            .innerJoin(teacherClassesTable, eq(classesTable.class_id, teacherClassesTable.class_id))
            .innerJoin(usersTable, eq(teacherClassesTable.user_id, usersTable.user_id))
            .where(eq(teacherClassesTable.class_id, classId))
        const students = await db
            .select()
            .from(studentTable)
            .innerJoin(studentClassesTable, eq(studentTable.student_id, studentClassesTable.student_id))
            .where(sql`${studentClassesTable.class_id} = ${classId}`)
            .orderBy(studentTable.student_number)
        const studentFields = await db
            .select()
            .from(studentFieldTable)
            .innerJoin(studentClassesTable, eq(studentFieldTable.student_id, studentClassesTable.student_id))
            .where(sql`${studentClassesTable.class_id} = ${classId}`)

        return { class: classData, students: students, studentFields: studentFields }
    } catch (error) {
        console.error('Error fetching class:', error);
        throw new Error('Failed to fetch class.');
    }
}

async function databaseClassToCourseMap(
    data: {
    class: {
        teacher_classes: {
            assigned_date: string | undefined,
            assignment_id: string | undefined,
            role: string | undefined,
            user_id: string | undefined,
            class_id: string | undefined,
            class_name: string | undefined,
            class_language: string | undefined,
            created_date: string | undefined,
            updated_date: string | undefined,
            class_grade: string | undefined,
            complete: {
                s1: boolean,
                s2: boolean
            };
        },
        classes: {
            assigned_date: string | undefined,
            assignment_id: string | undefined,
            role: string | undefined,
            user_id: string | undefined,
            class_id: string | undefined,
            class_name: string | undefined,
            class_language: string | undefined,
            class_year: string | undefined,
            created_date: string | undefined,
            updated_date: string | undefined,
            class_grade: string | undefined,
            complete: {
                s1: boolean,
                s2: boolean
            };
        },
        users: {
            user_name: string | undefined,
            user_email: string | undefined,
            joined_date: string | undefined,
            updated_date: string | undefined,
        }
    }[],
    students: {
        student_classes: {
            enrollment_date: string | undefined,
            enrollment_id: string | undefined,
            student_id: string
        },
        students: {
            student_name_en: string | undefined,
            student_name_ko: string | undefined,
            student_email: string | undefined,
            joined_date: string | undefined,
            updated_date: string | undefined,
            student_sex: "m" | "f",
            student_number: string
        },
        student_fields: {
            field_id: string;
            student_id: string;
            collaboration: { s1: string, s2: string };
            communication: { s1: string, s2: string };
            inquiry: { s1: string, s2: string };
            listening: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            mathematics: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            open_minded: { s1: string, s2: string };
            organization: { s1: string, s2: string };
            reading: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            responsibility: { s1: string, s2: string };
            risk_taking: { s1: string, s2: string };
            science: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            social_studies: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            speaking: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            thinking: { s1: string, s2: string };
            use_of_english: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            writing: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            comment: { s1: string, s2: string };
        }[]
    }[],
    studentFields: {
        student_fields: {
            field_id: string;
            student_id: string;
            collaboration: { s1: string, s2: string };
            communication: { s1: string, s2: string };
            inquiry: { s1: string, s2: string };
            listening: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            mathematics: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            open_minded: { s1: string, s2: string };
            organization: { s1: string, s2: string };
            reading: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            responsibility: { s1: string, s2: string };
            risk_taking: { s1: string, s2: string };
            science: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            social_studies: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            speaking: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            thinking: { s1: string, s2: string };
            use_of_english: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            writing: { s1: string, s1_comment: string, s2: string, s2_comment: string };
            comment: { s1: string, s2: string };
        }
    }[]
}): Promise<Course | undefined> {
    if (!data) return undefined
    const teachers: Teacher[] = [];

    for (const teacher of data.class) {
        const teacherData = teacher.teacher_classes;

        const teach: Teacher = {
            assigned_date: teacherData.assigned_date,
            assignment_id: teacherData.assignment_id,
            role: teacherData.role,
            user_id: teacherData.user_id,
            user_name: teacher.users.user_name,
            user_email: teacher.users.user_email,
            joined_date: teacher.users.joined_date,
            updated_date: teacher.users.updated_date,
        }
        teachers.push(teach);
    }
  
    const students: Student[] = [];

    for (let index = 0; index < data.students.length; index++) {
        const student = data.students[index];

        const studentField: StudentField = {
            field_id: data.studentFields[index]?.student_fields.field_id ?? "",
            student_id: data.studentFields[index]?.student_fields.student_id ?? "",
            collaboration: data.studentFields[index]?.student_fields.collaboration ?? {s1: "", s2: ""},
            communication: data.studentFields[index]?.student_fields.communication ?? {s1: "", s2: ""},
            inquiry: data.studentFields[index]?.student_fields.inquiry ?? {s1: "", s2: ""},
            listening: data.studentFields[index]?.student_fields.listening ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            mathematics: data.studentFields[index]?.student_fields.mathematics ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            open_minded: data.studentFields[index]?.student_fields.open_minded ?? {s1: "", s2: ""},
            organization: data.studentFields[index]?.student_fields.organization ?? {s1: "", s2: ""},
            reading: data.studentFields[index]?.student_fields.reading ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            responsibility: data.studentFields[index]?.student_fields.responsibility ?? {s1: "", s2: ""},
            risk_taking: data.studentFields[index]?.student_fields.risk_taking ?? {s1: "", s2: ""},
            science: data.studentFields[index]?.student_fields.science ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            social_studies: data.studentFields[index]?.student_fields.social_studies ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            speaking: data.studentFields[index]?.student_fields.speaking ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            thinking: data.studentFields[index]?.student_fields.thinking ?? {s1: "", s2: ""},
            use_of_english: data.studentFields[index]?.student_fields.use_of_english ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            writing: data.studentFields[index]?.student_fields.writing ?? { s1: "", s1_comment: "", s2: "", s2_comment: "" },
            comment: data.studentFields[index]?.student_fields.comment ?? {s1: "", s2: ""},
        }

        students.push({
            enrollment_date: student?.student_classes.enrollment_date,
            enrollment_id: student?.student_classes.enrollment_id,
            student_id: student?.student_classes.student_id,
            student_name_en: student?.students.student_name_en,
            student_name_ko: student?.students.student_name_ko,
            student_email: student?.students.student_email,
            joined_date: student?.students.joined_date,
            updated_date: student?.students.updated_date,
            student_sex: student?.students.student_sex === "m" ? "male" : "female",
            student_number: student?.students.student_number,
            student_fields: studentField,
        })
    }
  
    const classData: Course = {
        class_id: data?.class[0]?.classes.class_id,
        class_name: data?.class[0]?.classes.class_name,
        class_language: data?.class[0]?.classes.class_language,
        class_year: data?.class[0]?.classes.class_year,
        class_grade: data?.class[0]?.classes.class_grade,
        created_date: data?.class[0]?.classes.created_date,
        updated_date: data?.class[0]?.classes.updated_date,
        complete: data?.class[0]?.classes.complete ? data?.class[0]?.classes.complete : { s1: false, s2: false },
        teachers: teachers,
        students: students,
    };
    return classData;
}

export { getClassById, databaseClassToCourseMap }

