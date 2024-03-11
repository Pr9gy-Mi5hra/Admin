import { NextRequest, NextResponse } from "next/server";
import { Services } from "@/models";
import dbConnect from "@/lib/dbconnect";
import { verifyToken } from "@/middlewares/verifyToken";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const verificationResult = await verifyToken(req);
    if (verificationResult && !verificationResult.role) {
     return verificationResult;
    }
    const body = await req.json();

    if (
      !body.title ||
      !body.short_description ||
      !body.long_description ||
      !body.cover_image||
      !body.slug
    ) {
      throw Error("Please enter the missing fields");
    }

    await Services.create(body);
    return NextResponse.json({
      success: true,
      message: "Services added successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message },{status:500});
  }
}
