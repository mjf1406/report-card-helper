"use server"

import { db } from "~/server/db/index";
import { classes as classesTable, teacher_classes as teacherClassesTable, students as studentTable, student_classes as studentClassesTable } from "../db/schema";
import { sql, eq, and } from "drizzle-orm";

const getClassById = async (classId: string, userId: string) => {
    // const classData = await turso.execute({
    //     sql: "SELECT * FROM classes AS c INNER JOIN teacher_classes AS tc ON c.class_id = tc.class_id WHERE tc.class_id = ? AND tc.teacher_id = ?",
    //     args: [classId, userId],
    // });
    let classData = await db
        .select()
        .from(classesTable)
        .innerJoin(teacherClassesTable, eq(classesTable.class_id, teacherClassesTable.class_id))
        .where(
            // and(
                eq(teacherClassesTable.class_id, classId),
                // eq(teacherClassesTable.teacher_id, userId)
            // )
        )
    classData = classData.filter(element => {
        return element?.teacher_classes?.teacher_id === userId;
    });
    const students = await db
        .select()
        .from(studentTable)
        .innerJoin(studentClassesTable, eq(studentTable.student_id, studentClassesTable.student_id))
        .where(sql`${studentClassesTable.class_id} = ${classId}`);
    return { class: classData[0], students: students[0] }
}

export { getClassById }

// } catch (error) {
    //     console.error('Error fetching Reparper class:', error);
    //     throw new Error('Failed to fetch class.');
    // }