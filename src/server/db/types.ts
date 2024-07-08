// Server Types
export type UserDb = {
    user_id: string;
    user_name: string;
    user_email: string;
    user_role: "teacher" | "admin",
    joined_date: string | undefined;
    updated_date: string | undefined;
}
export type CommentsDb = {
    id: string,
    grade: string;
    semester: string;
    year: string;
    listening: { l1: string, l2: string, l3: string, l4: string, l5: string};
    mathematics: { l1: string, l2: string, l3: string, l4: string, l5: string};
    reading: { l1: string, l2: string, l3: string, l4: string, l5: string};
    science: { l1: string, l2: string, l3: string, l4: string, l5: string};
    social_studies: { l1: string, l2: string, l3: string, l4: string, l5: string};
    speaking: { l1: string, l2: string, l3: string, l4: string, l5: string};
    use_of_english: { l1: string, l2: string, l3: string, l4: string, l5: string};
    writing: { l1: string, l2: string, l3: string, l4: string, l5: string};
    [key: string]: string | { l1: string, l2: string, l3: string, l4: string, l5: string}; // Index signature
}
// Transformed Types
export type Course = {
    class_id: string | undefined;
    class_name: string | undefined;
    class_language: string | undefined;
    class_year: string | undefined;
    class_grade: string | undefined;
    updated_date: string | undefined;
    created_date: string | undefined;
    students: Student[];
    teachers: Teacher[];
    complete: {
        s1: boolean,
        s2: boolean
    };
}

export type Teacher = {
    assigned_date: string | undefined;
    assignment_id: string | undefined;
    role: string | undefined;
    user_id: string | undefined;
    user_name: string | undefined;
    user_email: string | undefined;
    joined_date: string | undefined;
    updated_date: string | undefined;
}

export type TeacherCourse = {
    class_id: string;
    class_name: string;
    class_language: string;
    class_grade: string;
    class_year: string;
    created_date: string;
    updated_date: string;
    assigned_date: string;
    role: string;
    complete: {
        s1: boolean,
        s2: boolean
    };
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
    // [key: string]: string | { s1: string; s2: string }; // Index signature
}