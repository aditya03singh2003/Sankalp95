import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Parent from "@/models/Parent"
import Student from "@/models/Student"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const parentId = searchParams.get("id")

  await dbConnect()

  try {
    if (parentId) {
      // Get a specific parent with populated children
      const parent = await Parent.findById(parentId).populate("children")
      if (!parent) {
        return NextResponse.json({ error: "Parent not found" }, { status: 404 })
      }
      return NextResponse.json(parent)
    }

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }
    }

    const parents = await Parent.find(query).sort({ createdAt: -1 })
    return NextResponse.json(parents)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch parents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()

  try {
    const data = await request.json()

    // Create a new parent
    const parent = new Parent({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      children: data.children || [],
      notifications: [],
    })

    await parent.save()

    // If children IDs are provided, update the students with parent reference
    if (data.children && data.children.length > 0) {
      await Student.updateMany(
        { _id: { $in: data.children } },
        {
          parentName: data.name,
          parentEmail: data.email,
          parentPhone: data.phone,
        },
      )
    }

    return NextResponse.json(parent, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
