import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
