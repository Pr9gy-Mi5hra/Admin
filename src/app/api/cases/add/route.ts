import { NextRequest, NextResponse } from "next/server";
import { Cases } from "@/models";
import dbConnect from "@/lib/dbconnect";
import { verifyToken } from "@/middlewares/verifyToken";

export async function POST(req: NextRequest) {
 

  try {
    const verificationResult = await verifyToken(req);
    if (verificationResult && !verificationResult.role) {
     return verificationResult;
    }
    const id = verificationResult.data._id;
    const body = await req.json();

    if (
      !body.title ||
      !body.year ||
      !body.timeframe ||
      !body.main_service ||
      !body.extra_service ||
      !body.return_on_investment ||
      !body.cover_image
    ) {
      throw Error("Please enter the missing fields");
    }
    await dbConnect();
    body.created_by = id
    body.updated_by = id
    await Cases.create(body);
    return NextResponse.json({
      success: true,
      message: "Cases added successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message },{status:500});
  }
}
