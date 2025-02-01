import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const left = searchParams.get('left');
    const right = searchParams.get('right');

    const response = await fetch(
      `${API_URL}/api/users/${params.userId}/next-comparison?left=${left || ''}&right=${right || ''}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch next comparison');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Next comparison fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next comparison' },
      { status: 500 }
    );
  }
}
