// app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import * as jose from "jose";
import bcrypt from "bcryptjs";
import { getDB } from "@/config/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const db = await getDB();

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Generate JWT with jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "supersecret"
    );

    const token = await new jose.SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
