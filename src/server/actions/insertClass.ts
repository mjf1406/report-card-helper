"use server"

import { db } from "~/server/db/index";
import { 
    classes as classesTable, 
    teacher_classes as teacherClassesTable,
    students as studentsTable, 
    student_classes as studentClassesTable,
    student_fields as studentFieldTable
} from "~/server/db/schema";
import { randomUUID } from 'crypto'

interface Student {
    student_id: string; 
    student_name_en: string;
    student_name_ko: string;
    student_sex: string;
    student_number: number;
    student_email: string | null;
}

interface ClassData {
    class_id: string;
    class_name: string;
    class_language: string;
    class_grade: string;
}

export interface Data {
    class_id: string;
    class_name: string;
    class_language: string;
    class_grade: string;
    role: string;
    fileContents: string;

}

interface TeacherClassData {
    assignment_id: string;
    teacher_id: string;
    class_id: string;
    role: string;
}

interface CSVStudent {
    name_en: string;
    name_ko: string;
    sex: string;
    number: string; // Parsing as string initially to handle potential non-numeric input gracefully
}

function generateUuidWithPrefix(prefix: string){
    return `${prefix}${randomUUID()}`
}
function csvToJson(csvString: string): CSVStudent[] {
    const lines = csvString.split('\n');
    const result = [];
    const headers = lines[0].split(',');
  
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      const currentline = lines[i].split(',');
  
      if (currentline.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj as CSVStudent);
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

    const studentsJson = csvToJson(data.fileContents)
    const studentsData: Student[] = [];
    for (const student of studentsJson) {
        const stud: Student = {
            student_id: generateUuidWithPrefix('student_'),
            student_name_en: student.name_en,
            student_name_ko: student.name_ko,
            student_sex: student.sex,
            student_number: parseInt(student.number),
            student_email: null,
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
}