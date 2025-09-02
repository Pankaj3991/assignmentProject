import {NextRequest, NextResponse } from "next/server";
import { getDB } from "@/config/db"; // your DB connection helper

const db = await getDB();

// GET /api/schools/123
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await context.params;
    const [rows]: any = await db.query(
      `
      SELECT s.id, s.name, s.address, s.city, s.state, s.contact, s.image, s.email,
             u.id as user_id, u.name as created_by_name, u.email as created_by_email
      FROM Schools s
      JOIN Users u ON s.created_by = u.id
      WHERE s.id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error("Error fetching school detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch school detail" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schoolId = await params.id;
    const body = await req.json();

    // Allowed fields to update
    const allowed = [
      "name",
      "address",
      "city",
      "state",
      "contact",
      "image",
      "email",
    ];
    const updates: string[] = [];
    const values: any[] = [];

    for (const field of allowed) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Check school exists and get creator
    const [existing]: any = await db.query(
      `SELECT id, created_by FROM Schools WHERE id = ?`,
      [schoolId]
    );
    if (!existing.length) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    const createdBy = existing[0].created_by;

    // Build and execute update
    const sql = `UPDATE Schools SET ${updates.join(", ")} WHERE id = ?`;
    values.push(schoolId);
    const [result]: any = await db.query(sql, values);

    // Return the updated record
    const [rows]: any = await db.query(
      `
      SELECT s.id, s.name, s.address, s.city, s.state, s.contact, s.image, s.email, s.created_by,
             u.id as user_id, u.name as created_by_name, u.email as created_by_email
      FROM Schools s
      JOIN Users u ON s.created_by = u.id
      WHERE s.id = ?
      `,
      [schoolId]
    );

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error("Error updating school:", error);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

// DELETE /api/schools/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schoolId = await params.id;

    // Check school exists and creator
    const [existing]: any = await db.query(
      `SELECT id, created_by FROM Schools WHERE id = ?`,
      [schoolId]
    );
    if (!existing.length) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    const createdBy = existing[0].created_by;

    const [result]: any = await db.query(`DELETE FROM Schools WHERE id = ?`, [
      schoolId,
    ]);

    return NextResponse.json({ message: "School deleted" });
  } catch (error: any) {
    console.error("Error deleting school:", error);
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}
