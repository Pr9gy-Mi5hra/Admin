import { NextRequest, NextResponse } from "next/server";
import { Cases } from "@/models";
import dbConnect from "@/lib/dbconnect";
import convertParams, { FinalQuery } from "@/utils/api/convertParams";

async function getTotalCount(query: any) {
  try {
    return await Cases.countDocuments(query.find);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching total count");
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParamsObject = Object.fromEntries(req.nextUrl.searchParams);

    const finalQuery: FinalQuery = await convertParams(
      Cases,
      searchParamsObject
    );

    const allCases = await Cases.find(finalQuery.find)
      .skip(finalQuery.start)
      .limit(finalQuery.limit);

    const totalCount = await getTotalCount(finalQuery);

    return NextResponse.json({
      allCases,
      pagination: {
        page: finalQuery.start / finalQuery.limit + 1,
        limit: finalQuery.limit,
        total: totalCount,
      },
    });
  } catch (error: any) {
    console.error(error, "API Error");
    return NextResponse.json({ message: error.message });
  }
}

export const dynamic = "force-dynamic";
