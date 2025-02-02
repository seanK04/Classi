import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/api/users/${userId}/rankings`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch rankings');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Rankings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}
