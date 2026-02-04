import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.replace('Bearer ', '');
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("fundilink_token")?.value;
  const token = cookieToken || bearerToken;

  if (!token) {
    return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 });
  }

  try {
    // Decode the token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: 'JWT secret is not configured' }, { status: 500 });
    }
    const decoded = jwt.verify(token, jwtSecret) as unknown as { id?: string };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL;
    const response = await fetch(`${backendUrl}api/fundi/v1/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Backend request failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error("Token verification failed", err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
