import { NextResponse } from 'next/server';

interface PaymentPayload {
  amount: number;
  currency: string;
  // add other fields as needed
}

export async function POST(request: Request) {
  const json = await request.json() as PaymentPayload; // type assertion
  console.log('Payload:', json);

  return NextResponse.json({
    message: 'Callback diterima',
    data: json,
  }, { status: 200 });
}