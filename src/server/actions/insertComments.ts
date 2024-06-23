"use server"

import { db } from "~/server/db/index";
import { 
    subject_achievement_comments as subjectAchievementCommentsTable
} from "~/server/db/schema";
import type { CommentsDb } from "../db/types";

export type Data = {
    example: object;
    listening: object;
    mathematics: object;
    reading: object;
    science: object;
    social_studies: object;
    speaking: object;
    use_of_english: object;
    writing: object;
}

export default async function insertComments(data: Data, semester: string, year: string, classGrade: string) {
    const commentData: CommentsDb = {
        grade: classGrade,
        semester: semester,
        year: year,
        listening: JSON.stringify(data.listening),
        mathematics: JSON.stringify(data.mathematics),
        reading: JSON.stringify(data.reading),
        science: JSON.stringify(data.science),
        social_studies: JSON.stringify(data.social_studies),
        speaking: JSON.stringify(data.speaking),
        use_of_english: JSON.stringify(data.use_of_english),
        writing: JSON.stringify(data.writing),
    }
    await db.insert(subjectAchievementCommentsTable).values(commentData)
}