"use server";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header missing" },
      { status: 401, statusText: "Missing Token" }
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, "campaign_Kart_654!");
    (req as any).userData = decoded;
    return decoded;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401, statusText: "Invalid Token" }
    );
  }
};
