/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const users = await prisma.user.findMany({});

  return NextResponse.json(users);
};

export const POST = async (req: NextRequest) => {
  try {
    const { username } = await req.json();

    const newUser = await prisma.user.create({
      data: { username },
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
