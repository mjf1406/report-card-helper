"use server"

import { db } from "~/server/db/index";
import { 
    classes as classesTable, 
    teacher_classes as teacherClassesTable, 
    students as studentTable, 
    student_classes as studentClassesTable,
    users as usersTable,
    student_fields as studentFieldTable 
} from "../db/schema";
import { sql, eq } from "drizzle-orm";
import { isTeacherInClass } from "./isTeacherInClass";
import { auth } from "@clerk/nextjs/server";

const downloadReportsBySemester = async (classId: string, semester: string) => {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated")
    if (!classId || semester) throw new Error("Missing class id and/or semester")

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

export { downloadReportsBySemester }