import { type NextRequest, NextResponse } from 'next/server';
import { getSubjectCommentsByGradeAndYear } from '~/server/actions/getSubjectCommentsByGradeAndYear';

/**
 * Fetches a class by its ID and user ID, and returns it as a JSON response.
 * 
 * @param req The NextRequest object containing the request data.
 * @returns A Promise that resolves to a NextResponse object containing the class data as JSON.
 * @throws An Error if the user ID is null.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId: string | null = req.nextUrl.searchParams.get('userId');
    const grade: string | null = req.nextUrl.searchParams.get('grade');
    const year: string | null = req.nextUrl.searchParams.get('year');
    // const { userId } = auth();
    
    if (!userId) {
      throw new Error('User ID is null');
    }

    const data: unknown = await getSubjectCommentsByGradeAndYear(userId, grade, year);

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


