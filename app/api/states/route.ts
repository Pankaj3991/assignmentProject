import { NextResponse } from "next/server";
import {getDB} from "@/config/db"; // your MySQL connection helper

// GET /api/schools/states
export async function GET() {
  try {
    // DISTINCT ensures unique states (filters duplicates)
    const db = await getDB();
    const [rows]: any = await db.query(
      `SELECT DISTINCT state 
       FROM Schools 
       WHERE state IS NOT NULL 
       ORDER BY state ASC`
    );

    // Extract into simple array
    const states = rows.map((row: any) => row.state);

    return NextResponse.json({ states });
  } catch (error: any) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      { error: "Failed to fetch states" },
      { status: 500 }
    );
  }
}
