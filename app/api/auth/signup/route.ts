export const runtime = "nodejs"; // force Node runtime for bcrypt & JWT

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/config/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const db = await getDB();

    // check if user exists
    const [rows]: any = await db.query("SELECT id FROM users WHERE email=?", [email]);
    if (rows.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name,
      email,
      hashedPassword,
      role
    ]);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
