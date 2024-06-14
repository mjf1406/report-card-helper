"use server"

import { db } from "~/server/db/index";
import { classes as classesTable, teacher_classes as teacherClassesTable } from "~/server/db/schema";
import { randomUUID } from 'crypto'

interface ClassData {
    class_id: string;
    class_name: string;
    class_language: string;
}

export interface Data {
    class_id: string;
    class_name: string;
    class_language: string;
    role: string;
}

interface TeacherClassData {
    assignment_id: string;
    teacher_id: string;
    class_id: string;
    role: string;
}

function generateUuidWithPrefix(prefix: string){
    return `${prefix}${randomUUID()}`
}

export default async function insertClass(data: Data, userId: string) {

    if (data.class_language === null || data.class_language === undefined || data.class_language === '') data.class_language = 'en-US'

    const classId = generateUuidWithPrefix('class_')
    const classData: ClassData = {
        class_id: classId,
        class_name: data.class_name,
        class_language: data.class_language,
    }
    await db.insert(classesTable).values(classData)

    const assignmentId = generateUuidWithPrefix('assignment_')
    const teacherClassData: TeacherClassData = {
        assignment_id: assignmentId,
        teacher_id: userId,
        class_id: classId,
        role: data.role,
    }
    await db.insert(teacherClassesTable).values(teacherClassData)
}