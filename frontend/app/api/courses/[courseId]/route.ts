import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  if (!courseId) {
    return NextResponse.json(
      { error: 'Course ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/api/courses/${courseId}`,
      {
        method: 'DELETE',
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete course');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Course deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
