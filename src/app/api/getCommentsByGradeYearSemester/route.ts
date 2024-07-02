import { type NextRequest, NextResponse } from 'next/server';
import { getSubjectCommentsByGradeYearSemester } from '~/server/actions/getSubjectCommentsByGradeYearSemester';
// This is the GET handler for the '/api/classes' endpoint
export async function GET(req: NextRequest) {
  try {
    const userId: string | null = req.nextUrl.searchParams.get('userId');
    if (!userId) {
        throw new Error('User ID is null');
    }
    const grade: string | null = req.nextUrl.searchParams.get('grade');
    const year: string | null = req.nextUrl.searchParams.get('year');
    const semester: string | null = req.nextUrl.searchParams.get('semester');

    const data = await getSubjectCommentsByGradeYearSemester(userId, grade, year, semester);

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new NextResponse(JSON.stringify({ message: 'Unable to fetch classes due to an internal error.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

