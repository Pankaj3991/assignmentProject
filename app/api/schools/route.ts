import { NextResponse } from "next/server";
import { getDB } from "@/config/db";
import cloudinary from "@/config/cloudinary";

// GET /api/schools?search=abc&state=Delhi&page=1&limit=10
export async function GET(req: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      where += " AND (s.name LIKE ? OR s.city LIKE ? OR s.address LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (state) {
      where += " AND s.state = ?";
      params.push(state);
    }

    const [rows] = await db.query(
      `
      SELECT s.id, s.name, s.address, s.city, s.state, s.contact, s.image, s.email,
             u.id as user_id, u.name as created_by_name, u.email as created_by_email
      FROM Schools s
      LEFT JOIN Users u ON s.created_by = u.id
      ${where}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );
    // const [rows] = await db.query(`SELECT * FROM Schools;`);

    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM Schools s ${where}`,
      params
    );

    const total = (countResult as any)[0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

// POST /api/schools
export async function POST(req: Request) {
  try {
    const db = await getDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const contactValue = formData.get("contact") as string;
    const contact = contactValue ? Number(contactValue) : null;
    const email = formData.get("email") as string;
    const file = formData.get("image") as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const resultImage:any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "nextjs_uploads" }, (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        })
        .end(buffer); // send buffer data
    });
    const image = resultImage.url;
    const [result]: any = await db.query(
      `INSERT INTO Schools (name, address, city, state, contact, image, email, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, contact, image, email, 1]
    );

    return NextResponse.json({ id: result.insertId, name }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
