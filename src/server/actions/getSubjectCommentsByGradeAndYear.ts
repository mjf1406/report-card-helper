"use server"

import { db } from "~/server/db/index";
import { subject_achievement_comments as subjectAchievementCommentsTable } from "../db/schema";
import { eq, and } from "drizzle-orm";

const getSubjectCommentsByGradeAndYear = async (
    userId: string, 
    grade: string | null, 
    year: string | null, 
) => { 
    if (!userId) throw new Error("User not authenticated")  
    if (!grade || !year ) throw new Error('Missing grade, year, or semester')
    
    try {
        const data = await db
            .select()
            .from(subjectAchievementCommentsTable)
            .where(
                and(
                    eq(subjectAchievementCommentsTable.grade, grade),
                    eq(subjectAchievementCommentsTable.year, year),
                )
            )
        return data;
    } catch (error) {
        console.error('Error fetching Reparper classes:', error);
        throw new Error('Failed to fetch Reparper classes.');
    }
};

export { getSubjectCommentsByGradeAndYear };