import { NextRequest, NextResponse } from "next/server";
import { Blog } from "@/models";
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
      !body.short_description ||
      !body.long_description ||
      !body.cover_image
    ) {
      throw Error("Please enter the missing fields");
    }

    await dbConnect();
    body.created_by = id
    body.updated_by = id
    await Blog.create(body);
    return NextResponse.json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message },{status:500});
  }
}
