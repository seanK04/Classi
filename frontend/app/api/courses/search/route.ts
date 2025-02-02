import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error('BACKEND_URL is not set');
      return NextResponse.json({ error: 'Backend configuration error' }, { status: 500 });
    }

    console.log(`Searching courses with query: ${query}`);
    console.log(`Making request to: ${backendUrl}/courses?search=${encodeURIComponent(query)}`);

    // Forward the request to the backend with the search parameter
    const response = await fetch(`${backendUrl}/courses?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const courses = await response.json();
    console.log(`Found ${courses.length} courses`);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
