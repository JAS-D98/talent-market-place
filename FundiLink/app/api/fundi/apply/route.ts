import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("fundilink_token")?.value;
    const token = cookieToken || bearerToken;

    const decodedToken = jwt.verify(token as string, process.env.JWT_SECRET as string) as { id: string };
    const userId = decodedToken.id;
    // console.log(userId);        
    // Parse body
    const { serviceId, hourlyRate, locationId, documents } = await req.json()

    if (!serviceId || !hourlyRate || !locationId || !documents) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const BACKEND_URL = process.env.BACKEND_URL
    const response = await fetch(`${BACKEND_URL}api/fundi/v1/apply`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, serviceId, hourlyRate, locationId, documents }),
    });
    const data = await response.json();
    return NextResponse.json(data);
 } catch (error) {
    console.error("Error fetching fundi:", error);
    return NextResponse.json({ error: "Failed to fetch fundi" }, { status: 500 });
 }   
}
