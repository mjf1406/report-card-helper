"use server"

import { db } from "~/server/db/index";
import { classes as classesTable, 
    teacher_classes as teacherClassesTable, 
    students as studentTable, 
    student_classes as studentClassesTable,
    teachers as teachersTable,
student_fields as studentFieldTable } from "../db/schema";
import { eq } from "drizzle-orm";

const downloadReportCards = async (classId: string, userId: string) => {
    try {
        const classData = await db
            .select()
            .from(classesTable)
            .innerJoin(teacherClassesTable, eq(classesTable.class_id, teacherClassesTable.class_id))
            .innerJoin(teachersTable, eq(teacherClassesTable.teacher_id, teachersTable.teacher_id))
            .where(eq(teacherClassesTable.class_id, classId),)

        return { class: classData, students: students, studentFields: studentFields }
    } catch (error) {
        console.error('Error fetching Reparper class:', error);
        throw new Error('Failed to fetch class.');
    }
}

export { downloadReportCards }

