import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Core Tables

export const users = sqliteTable('users',
    {
        user_id: text('user_id').notNull().primaryKey(),
        user_name: text('user_name').notNull(),
        user_email: text('user_email').notNull().unique(),
        user_role: text('user_role', { enum: ["teacher","admin"] }), // All users who sign up will be assigned the teacher role. Will need to manually assign admins.
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
        class_year: text('class_year'),
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
        grade: text('grade').notNull().primaryKey(),
        semester: text('semester'),
        year: text('year'),
        reading: text('reading', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        writing: text('writing', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        speaking: text('speaking', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        listening: text('listening', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        use_of_english: text('use_of_english', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        mathematics: text('mathematics', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        social_studies: text('social_studies', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
        science: text('science', { mode: 'json' }).$type<{ l1: string, l2: string, l3: string, l4: string, l5: string }>(), // remember to JSON.parse() this when reading
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
        user_id: text('user_id').notNull().references(() => users.user_id),
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

        comment: text('comment', { mode: 'json' }).$type<{ s1: string, s2: string }>(),

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