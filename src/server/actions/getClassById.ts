"use server"

import { db } from "~/server/db/index";
import { classes as classesTable, 
    teacher_classes as teacherClassesTable, 
    students as studentTable, 
    student_classes as studentClassesTable,
    teachers as teachersTable,
student_fields as studentFieldTable } from "../db/schema";
import { sql, eq } from "drizzle-orm";

const getClassById = async (classId: string, userId: string) => {
    try {
        const classData = await db
            .select()
            .from(classesTable)
            .innerJoin(teacherClassesTable, eq(classesTable.class_id, teacherClassesTable.class_id))
            .innerJoin(teachersTable, eq(teacherClassesTable.teacher_id, teachersTable.teacher_id))
            .where(eq(teacherClassesTable.class_id, classId),)
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
        console.error('Error fetching Reparper class:', error);
        throw new Error('Failed to fetch class.');
    }
}
  
function databaseClassToCourseMap(data: object[]) {
    const classData = {};
    classData.class_id = data?.class[0]?.classes.class_id;
    classData.class_name = data?.class[0]?.classes.class_name;
    classData.class_language = data?.class[0]?.classes.class_language;
    classData.created_date = data?.class[0]?.classes.created_date;
    classData.updated_date = data?.class[0]?.classes.updated_date;
    classData.class_grade = data?.class[0]?.classes.class_grade;
  
    const teachers = [];
    for (const teacher of data.class) {
        const teacherData = teacher.teacher_classes;
        teachers.push({
            assigned_date: teacherData.assigned_date,
            assignment_id: teacherData.assignment_id,
            role: teacherData.role,
            teacher_id: teacherData.teacher_id,
            teacher_name: teacher.teachers.teacher_name,
            teacher_email: teacher.teachers.teacher_email,
            joined_date: teacher.teachers.joined_date,
            updated_date: teacher.teachers.updated_date,
        });
    }
    classData.teachers = teachers;
  
    const students = [];
    for (let index = 0; index < data.students.length; index++) {
        const student = data.students[index];
        students.push({
            enrollment_date: student.student_classes.enrollment_date,
            enrollment_id: student.student_classes.enrollment_id,
            student_id: student.student_classes.student_id,
            student_name_en: student.students.student_name_en,
            student_name_ko: student.students.student_name_ko,
            student_email: student.students.student_email,
            joined_date: student.students.joined_date,
            updated_date: student.students.updated_date,
            student_sex: student.students.student_sex === "m" ? "male" : "female",
            student_number: student.students.student_number,
            student_fields: {
            field_id: data.studentFields[index].student_fields.field_id,
            collaboration: data.studentFields[index].student_fields.collaboration,
            communication: data.studentFields[index].student_fields.communication,
            inquiry: data.studentFields[index].student_fields.inquiry,
            listening: data.studentFields[index].student_fields.listening,
            mathematics: data.studentFields[index].student_fields.mathematics,
            open_minded: data.studentFields[index].student_fields.open_minded,
            organization: data.studentFields[index].student_fields.organization,
            reading: data.studentFields[index].student_fields.reading,
            responsibility: data.studentFields[index].student_fields.responsibility,
            risk_taking: data.studentFields[index].student_fields.risk_taking,
            science: data.studentFields[index].student_fields.science,
            skills_and_habits:
                data.studentFields[index].student_fields.skills_and_habits,
            social_studies: data.studentFields[index].student_fields.social_studies,
            speaking: data.studentFields[index].student_fields.speaking,
            thinking: data.studentFields[index].student_fields.thinking,
            use_of_english: data.studentFields[index].student_fields.use_of_english,
            writing: data.studentFields[index].student_fields.writing,
            },
        });
    }
    classData.students = students;
  
    return classData;
}

export { getClassById, databaseClassToCourseMap }

