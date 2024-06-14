import { sqliteTable, text } from "drizzle-orm/sqlite-core";
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
        created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
        updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    }
)

export const students = sqliteTable('students',
    {
        student_id: text('student_id').notNull().primaryKey(),
        student_name: text('student_name').notNull(),
        student_email: text('student_email').unique(),
        joined_date: text('joined_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
        updated_date: text('updated_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
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