import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Core Tables

export const teachers = sqliteTable('teachers',
    {
        teacher_id: text('teacher_id').notNull().primaryKey(),
        teacher_name: text('teacher_name').notNull(),
        teacher_email: text('teacher_email').notNull().unique(),
        joined_date: text('joined_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
        updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    }
)

export const classes = sqliteTable('classes',
    {
        class_id: text('class_id').notNull().primaryKey(),
        class_name: text('class_name').notNull(),
        class_language: text('class_language').notNull(),
        class_grade: text('class_grade', { enum: ["1","2","3","4","5"] }),
        created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
        updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    }
)

export const students = sqliteTable('students',
    {
        student_id: text('student_id').notNull().primaryKey(),
        student_name_en: text('student_name_en').notNull(),
        student_name_ko: text('student_name_ko').notNull(),
        student_sex: text('student_sex', { enum: ["m", "f"] }),
        student_number: integer('student_number', { mode: 'number' }),
        student_email: text('student_email').unique(),
        joined_date: text('joined_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
        updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    }
)

export const subject_achievement_comments = sqliteTable('subject_achievement_comments',
    {
        grade: text('grade', { enum: ['1','2','3','4','5']}).notNull().primaryKey(),
        reading: text('reading', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string, 
        }>(),
        writing: text('writing', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
        speaking: text('speaking', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
        listening: text('listening', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
        use_of_english: text('use_of_english', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
        mathematics: text('mathematics', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
        social_studies: text('social_studies', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
        science: text('science', { mode: 'json' }).$type<{ 
            s1l1: string, 
            s1l2: string,
            s1l3: string,
            s1l4: string,
            s1l5: string,
            s2l1: string,
            s2l2: string,
            s2l3: string,
            s2l4: string,
            s2l5: string,
         }>(),
    }
)

// Junction Tables

export const student_classes = sqliteTable('student_classes',
    {
        enrollment_id: text('enrollment_id').notNull().primaryKey(),
        student_id: text('student_id').notNull().references(() => students.student_id),
        class_id: text('class_id').notNull().references(() => classes.class_id),
        enrollment_date: text('enrollment_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    }
)

export const teacher_classes = sqliteTable('teacher_classes',
    {
        assignment_id: text('assignment_id').notNull().primaryKey(),
        teacher_id: text('teacher_id').notNull().references(() => teachers.teacher_id),
        class_id: text('class_id').notNull().references(() => classes.class_id),
        role: text('role', { enum: ["primary", "assistant"] }),
        assigned_date: text('assigned_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    }
)

export const student_fields = sqliteTable('student_fields',
    {
        field_id: text("field_id").notNull().primaryKey(),

        student_id: text('student_id').notNull().references(() => students.student_id),

        responsibility: text('responsibility', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        organization: text('organization', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        collaboration: text('collaboration', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        communication: text('communication', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        thinking: text('thinking', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        inquiry: text('inquiry', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        risk_taking: text('risk_taking', { mode: 'json' }).$type<{ s1: string, s2: string }>(),
        open_minded: text('open_minded', { mode: 'json' }).$type<{ s1: string, s2: string }>(),

        skills_and_habits: text('skills_and_habits', { mode: 'json' }).$type<{ s1: string, s2: string }>(),

        reading: text('reading', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        writing: text('writing', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        speaking: text('speaking', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        listening: text('listening', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        use_of_english: text('use_of_english', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        mathematics: text('mathematics', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        social_studies: text('social_studies', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
        science: text('science', { mode: 'json' }).$type<{ s1: string, s1_comment: string, s2: string, s2_comment: string }>(),
    }
)

// export const student_fields = sqliteTable('student_fields',
//   {
//       field_id: text("field_id").notNull().primaryKey(),

//       student_id: text('student_id').notNull().references(() => students.student_id),
//       // 21st Century Skills
//       responsibility_s1: text('responsibility_s1', { enum: ["CD","P","NY","AB"] }),
//       responsibility_s2: text('responsibility_s2', { enum: ["CD","P","NY","AB"] }),
//       organization_s1: text('organization_s1', { enum: ["CD","P","NY","AB"] }),
//       organization_s2: text('organization_s2', { enum: ["CD","P","NY","AB"] }),
//       collaboration_s1: text('collaboration_s1', { enum: ["CD","P","NY","AB"] }),
//       collaboration_s2: text('collaboration_s2', { enum: ["CD","P","NY","AB"] }),
//       communication_s1: text('communication_s1', { enum: ["CD","P","NY","AB"] }),
//       communication_s2: text('communication_s2', { enum: ["CD","P","NY","AB"] }),
//       thinking_s1: text('thinking_s1', { enum: ["CD","P","NY","AB"] }),
//       thinking_s2: text('thinking_s2', { enum: ["CD","P","NY","AB"] }),
//       inquiry_s1: text('inquiry_s1', { enum: ["CD","P","NY","AB"] }),
//       inquiry_s2: text('inquiry_s2', { enum: ["CD","P","NY","AB"] }),
//       risk_taking_s1: text('risk_taking_s1', { enum: ["CD","P","NY","AB"] }),
//       risk_taking_s2: text('risk_taking_s2', { enum: ["CD","P","NY","AB"] }),
//       open_minded_s1: text('open_minded_s1', { enum: ["CD","P","NY","AB"] }),
//       open_minded_s2: text('open_minded_s2', { enum: ["CD","P","NY","AB"] }),
//       // The big comment, like 300 words or so
//       skills_and_habits_s1: text('skills_and_habits_s1'),
//       skills_and_habits_s2: text('skills_and_habits_s2'),

//       // Subject Achievement Scores and comments,
//       // comments are taken from the db, just pasted in
//       reading_s1: text('reading_s1', { enum: ["1","2","3","4","5"] }),
//       reading_s1_comment: text('reading_s1_comment'),
//       reading_s2: text('reading_s1', { enum: ["1","2","3","4","5"] }),
//       reading_s2_comment: text('reading_s1_comment'),

//       writing_s1: text('writing_s1', { enum: ["1","2","3","4","5"] }),
//       writing_s1_comment: text('writing_s1_comment'),
//       writing_s2: text('writing_s2', { enum: ["1","2","3","4","5"] }),
//       writing_s2_comment: text('writing_s2_comment'),

//       speaking_s1: text('speaking_s1', { enum: ["1","2","3","4","5"] }),
//       speaking_s1_comment: text('speaking_s1_comment'),
//       speaking_s2: text('speaking_s2', { enum: ["1","2","3","4","5"] }),
//       speaking_s2_comment: text('speaking_s2_comment'),

//       listening_s1: text('listening_s1', { enum: ["1","2","3","4","5"] }),
//       listening_s1_comment: text('listening_s1_comment'),
//       listening_s2: text('listening_s2', { enum: ["1","2","3","4","5"] }),
//       listening_s2_comment: text('listening_s2_comment'),

//       use_of_english_s1: text('use_of_english_s1', { enum: ["1","2","3","4","5"] }),
//       use_of_english_s1_comment: text('use_of_english_s1_comment'),
//       use_of_english_s2: text('use_of_english_s2', { enum: ["1","2","3","4","5"] }),
//       use_of_english_s2_comment: text('use_of_english_s2_comment'),

//       mathematics_s1: text('mathematics_s1', { enum: ["1","2","3","4","5"] }),
//       mathematics_s1_comment: text('mathematics_s1_comment'),
//       mathematics_s2: text('mathematics_s2', { enum: ["1","2","3","4","5"] }),
//       mathematics_s2_comment: text('mathematics_s2_comment'),

//       social_studies_s1: text('social_studies_s1', { enum: ["1","2","3","4","5"] }),
//       social_studies_s1_comment: text('social_studies_s1_comment'),
//       social_studies_s2: text('social_studies_s2', { enum: ["1","2","3","4","5"] }),
//       social_studies_s2_comment: text('social_studies_s2_comment'),

//       science_s1: text('science_s1', { enum: ["1","2","3","4","5"] }),
//       science_s1_comment: text('science_s1_comment'),
//       science_s2: text('science_s2', { enum: ["1","2","3","4","5"] }),
//       science_s2_comment: text('science_s2_comment'),
//   }
// )