import { NextResponse, NextRequest } from "next/server"; 

export async function GET(req: NextRequest) {
    try {      
        const BACKEND_URL=process.env.BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}api/locations/v1/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
