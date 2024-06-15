import { type NextRequest, NextResponse } from 'next/server';
import { getClasses } from '~/server/db/functions/classes'; // Adjust this path to where your database functions are stored
import { auth } from '@clerk/nextjs/server';

// This is the GET handler for the '/api/classes' endpoint
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error('User ID is null');
    }
    const data = await getClasses(userId);

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

