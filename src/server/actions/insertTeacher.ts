"use server"

import { db } from "~/server/db/index";
import { 
    teachers as teachersTable, 
} from "~/server/db/schema";
import { type TeacherDb } from "../db/types";
import { clerkClient } from "@clerk/nextjs/server";

export default async function insertTeacher(userId: string) {

    const user = await clerkClient.users.getUser(userId);
    const userName = `${user.firstName} ${user.lastName}`
    const userEmail = user.emailAddresses.find(i => i.id === user.primaryEmailAddressId)?.emailAddress

    const teacherData: TeacherDb = {
        teacher_id: userId,
        teacher_name: userName,
        teacher_email: String(userEmail),
        joined_date: undefined,
        updated_date: undefined,
    }
    console.log("🚀 ~ insertTeacher ~ teacherData:", teacherData)
    await db.insert(teachersTable).values(teacherData)
}