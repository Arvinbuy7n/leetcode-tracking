/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const LEETCODE_GRAPHQL_API = "https://leetcode.com/graphql";

const RECENT_AC_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const prisma = new PrismaClient();

export const GET = async () => {
  const completed = await prisma.completedProblems.findMany({});

  return NextResponse.json(completed);
};

export const POST = async (req: NextRequest) => {
  try {
    const { usernames, limit } = await req.json();

    const results = await Promise.all(
      usernames.map(async (username: string) => {
        const res = await fetch(LEETCODE_GRAPHQL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: RECENT_AC_SUBMISSIONS_QUERY,
            variables: { username, limit: limit || 20 },
          }),
        });

        const data = await res.json();

        if (data.errors) {
          return { username, error: data.errors[0].message };
        }

        const submissions = data.data.recentAcSubmissionList;

        const records = submissions.map((sub: any) => ({
          username,
          titleSlug: sub.titleSlug,
          completed: true,
          checkedAt: new Date(sub.timestamp * 1000),
        }));

        await prisma.completedProblems.createMany({
          data: records,
          skipDuplicates: true,
        });

        return {
          username,
          submissions,
        };
      })
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
