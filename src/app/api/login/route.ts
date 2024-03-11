import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import jwt from "jsonwebtoken"; 
import crypto from 'crypto';
import { superadmins } from "@/superadmins";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
  
    try {
      await dbConnect();
      const user = await User.findOne({ email: body.email });
      if (!user) {
        return NextResponse.json({ message: "User doesn't exist with this email" },{status:404});
      }
  
      const isMatch = await new Promise<boolean>((resolve, reject) => {
        user.comparePassword(body.password, (err: any, isMatch: boolean) => {
          if (err) reject(err);
          resolve(isMatch);
        });
      });
  
      if (isMatch) {
        const token = jwt.sign(
          {
            role: superadmins.includes(body.email) ? "superadmin" : "admin",
            access: ["read", "write"],
            data: user,
          },
          "campaign_Kart_654!",
          {
            expiresIn: 86400,
          }
        );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    user.refresh_token = refreshToken;
    await user.save();
  
        const userObject = user.toObject();
        userObject.role= superadmins.includes(body.email) ? "superadmin" : "admin",
        delete userObject.password;
  
        const userDetails = {
          message: "Login successful!",
          token_type: "Bearer",
          token,
          refresh_token: refreshToken,
          data: userObject,
          role: superadmins.includes(body.email) ? "superadmin" : "admin",
        };
  
        return NextResponse.json(userDetails);
      } else {
        return NextResponse.json({ message: "Email or password is incorrect" },{status:404});
      }
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: error.message },{status:500});
    }
  }
  