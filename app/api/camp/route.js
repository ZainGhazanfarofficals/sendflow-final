import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  const { id } = params;
  const { email, appPassword, subject, body } = await request.json();

  try {
    await prisma.campaign.update({
      where: { id },
      data: { email, appPassword, subject, body },
    });
    return NextResponse.json({ message: "Email updated" });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('campaignid');
  console.log("id", id);

  try {
    const emailData = await prisma.campaign.findUnique({ where: { id } });

    if (!emailData) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(emailData);
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
