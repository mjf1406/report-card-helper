// Server Types
export type TeacherDb = {
    teacher_id: string;
    teacher_name: string;
    teacher_email: string;
    joined_date: string | undefined;
    updated_date: string | undefined;
}
export type CommentsDb = {
    grade: string;
    semester: string;
    year: string;
    listening: string;
    mathematics: string;
    reading: string;
    science: string;
    social_studies: string;
    speaking: string;
    use_of_english: string;
    writing: string;
}
// Transformed Types
export type Course = {
    class_id: string | undefined;
    class_name: string | undefined;
    class_language: string | undefined;
    updated_date: string | undefined;
    created_date: string | undefined;
    class_grade: string | undefined;
    students: Student[];
    teachers: Teacher[];
    complete: boolean | undefined;
}

export type Teacher = {
    assigned_date: string | undefined;
    assignment_id: string | undefined;
    role: string | undefined;
    teacher_id: string | undefined;
    teacher_name: string | undefined;
    teacher_email: string | undefined;
    joined_date: string | undefined;
    updated_date: string | undefined;
}

export type TeacherCourse = {
    class_id: string;
    class_name: string;
    class_language: string;
    class_grade: string;
    created_date: string;
    updated_date: string;
    assigned_date: string;
    role: string;
    complete: boolean;
  }

export type Student = {
    enrollment_date: string | undefined;
    enrollment_id: string | undefined;
    student_id: string | undefined;
    student_name_en: string | undefined;
    student_name_ko: string | undefined;
    student_email: string | undefined;
    joined_date: string | undefined;
    updated_date: string | undefined;
    student_sex: string | undefined;
    student_number: string | undefined;
    student_fields: StudentField;
}

export type StudentField = {
    field_id: string | undefined;
    collaboration: string | undefined;
    communication: string | undefined;
    inquiry: string | undefined;
    listening: string | undefined;
    mathematics: string | undefined;
    open_minded: string | undefined;
    organization: string | undefined;
    reading: string | undefined;
    responsibility: string | undefined;
    risk_taking: string | undefined;
    science: string | undefined;
    skills_and_habits: string | undefined;
    social_studies: string | undefined;
    speaking: string | undefined;
    thinking: string | undefined;
    use_of_english: string | undefined;
    writing: string | undefined;
}
