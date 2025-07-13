import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const json = await request.json();
  console.log('Payload:', json);

  return NextResponse.json({
    message: 'Callback diterima',
    data: json,
  }, { status: 200 });
}