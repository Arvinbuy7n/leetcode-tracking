import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const product = await prisma.task.findMany({});

  return NextResponse.json(product);
};

export const POST = async (req: NextRequest) => {
  const { name, taskSlugs } = await req.json();

  const task = await prisma.task.create({
    data: { name, taskSlugs },
  });

  return NextResponse.json(task);
};
