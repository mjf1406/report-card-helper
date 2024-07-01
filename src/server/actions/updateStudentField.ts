"use server"

import { db } from "~/server/db/index";
import { 
    student_fields as StudentFieldsTable
} from "~/server/db/schema";
import type { StudentField } from "../db/types";
import { eq } from "drizzle-orm";

export default async function updateStudentField(data: StudentField) {
    await db
        .update(StudentFieldsTable)
        .set(data)
        .where(eq(StudentFieldsTable.field_id, data.field_id))
}