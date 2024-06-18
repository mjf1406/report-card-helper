"use server"

import { db } from "~/server/db/index";
import { classes as classesTable, 
    teacher_classes as teacherClassesTable, 
    students as studentTable, 
    student_classes as studentClassesTable,
    teachers as teachersTable,
student_fields as studentFieldTable } from "../db/schema";
import { sql, eq } from "drizzle-orm";
import { type Course, type Teacher, type Student, type StudentField } from "../db/types";

const getClassById = async (classId: string, userId: string | undefined) => {
    try {
        if (!userId) throw new Error("User not authenticated")
        const classData = await db
            .select()
            .from(classesTable)
            .innerJoin(teacherClassesTable, eq(classesTable.class_id, teacherClassesTable.class_id))
            .innerJoin(teachersTable, eq(teacherClassesTable.teacher_id, teachersTable.teacher_id))
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
  
/**
 * Converts database data to a strongly typed Course object.
 * 
 * @param data - Object containing class, students, and studentFields arrays.
 * @returns A Course object with strongly typed properties.
 */
function databaseClassToCourseMap(
    data: {
    class: {
        teacher_classes: {
            assigned_date: string | undefined,
            assignment_id: string | undefined,
            role: string | undefined,
            teacher_id: string | undefined,
            class_id: string | undefined,
            class_name: string | undefined,
            class_language: string | undefined,
            created_date: string | undefined,
            updated_date: string | undefined,
            class_grade: string | undefined,
            complete: boolean | undefined,
        },
        teachers: {
            teacher_name: string | undefined,
            teacher_email: string | undefined,
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
            field_id: string | undefined,
            collaboration: string | undefined,
            communication: string | undefined,
            inquiry: string | undefined,
            listening: string | undefined,
            mathematics: string | undefined,
            open_minded: string | undefined,
            organization: string | undefined,
            reading: string | undefined,
            responsibility: string | undefined,
            risk_taking: string | undefined,
            science: string | undefined,
            skills_and_habits: string | undefined,
            social_studies: string | undefined,
            speaking: string | undefined,
            thinking: string | undefined,
            use_of_english: string | undefined,
            writing: string
        }[]
    }[],
    studentFields: {
        student_fields: {
            field_id: string | undefined,
            collaboration: string | undefined,
            communication: string | undefined,
            inquiry: string | undefined,
            listening: string | undefined,
            mathematics: string | undefined,
            open_minded: string | undefined,
            organization: string | undefined,
            reading: string | undefined,
            responsibility: string | undefined,
            risk_taking: string | undefined,
            science: string | undefined,
            skills_and_habits: string | undefined,
            social_studies: string | undefined,
            speaking: string | undefined,
            thinking: string | undefined,
            use_of_english: string | undefined,
            writing: string
        }
    }[]
}): Course | undefined {
    if (!data) return undefined

    const teachers: Teacher[] = [];

    for (const teacher of data.class) {
        const teacherData = teacher.teacher_classes;

        const teach: Teacher = {
            assigned_date: teacherData.assigned_date,
            assignment_id: teacherData.assignment_id,
            role: teacherData.role,
            teacher_id: teacherData.teacher_id,
            teacher_name: teacher.teachers.teacher_name,
            teacher_email: teacher.teachers.teacher_email,
            joined_date: teacher.teachers.joined_date,
            updated_date: teacher.teachers.updated_date,
        }
        teachers.push(teach);
    }
  
    const students: Student[] = [];

    for (let index = 0; index < data.students.length; index++) {
        const student = data.students[index];

        const studentField: StudentField = {
            field_id: data.studentFields[index]?.student_fields.field_id,
            collaboration: data.studentFields[index]?.student_fields.collaboration,
            communication: data.studentFields[index]?.student_fields.communication,
            inquiry: data.studentFields[index]?.student_fields.inquiry,
            listening: data.studentFields[index]?.student_fields.listening,
            mathematics: data.studentFields[index]?.student_fields.mathematics,
            open_minded: data.studentFields[index]?.student_fields.open_minded,
            organization: data.studentFields[index]?.student_fields.organization,
            reading: data.studentFields[index]?.student_fields.reading,
            responsibility: data.studentFields[index]?.student_fields.responsibility,
            risk_taking: data.studentFields[index]?.student_fields.risk_taking,
            science: data.studentFields[index]?.student_fields.science,
            skills_and_habits: data.studentFields[index]?.student_fields.skills_and_habits,
            social_studies: data.studentFields[index]?.student_fields.social_studies,
            speaking: data.studentFields[index]?.student_fields.speaking,
            thinking: data.studentFields[index]?.student_fields.thinking,
            use_of_english: data.studentFields[index]?.student_fields.use_of_english,
            writing: data.studentFields[index]?.student_fields.writing,
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
        class_id: data?.class[0]?.teacher_classes.class_id,
        class_name: data?.class[0]?.teacher_classes.class_name,
        class_language: data?.class[0]?.teacher_classes.class_language,
        created_date: data?.class[0]?.teacher_classes.created_date,
        updated_date: data?.class[0]?.teacher_classes.updated_date,
        class_grade: data?.class[0]?.teacher_classes.class_grade,
        complete: data?.class[0]?.teacher_classes.complete,
        teachers: teachers,
        students: students,
    };

    return classData;
}

export { getClassById, databaseClassToCourseMap }

