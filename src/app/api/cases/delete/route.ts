import { NextRequest, NextResponse } from "next/server";
import { Cases } from "@/models";
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

    if (!body._id) {
      throw Error("Cases id missing");
    }

    await Cases.findOneAndDelete({_id:body._id});
    return NextResponse.json({ message: "Case deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message },{status:500});
  }
}
