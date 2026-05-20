import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // In a real production environment, you would use an email service here.
    // Example: Resend, SendGrid, Amazon SES
    // For now, we simulate a successful email send to plsinspectnow@gmail.com
    
    console.log("================ NEW LEAD ================");
    console.log(`Name: ${data.name}`);
    console.log(`Phone: ${data.phone}`);
    console.log(`Email: ${data.email}`);
    console.log(`Message: ${data.message}`);
    console.log("==========================================");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}
