import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest, { params }: { params: { fundiId: string } }) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get('authorization');
        const bearerToken = authHeader?.replace('Bearer ', '');
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get("fundilink_token")?.value;
        const token = cookieToken || bearerToken;

        if (!token) {
            return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 });
        }

        // Log the ID to debug
        console.log("Fundi ID from params:", params.fundiId);

        if (!params.fundiId) {
            return NextResponse.json({ error: 'Fundi ID is required' }, { status: 400 });
        }

        const backendUrl = process.env.BACKEND_URL;
        const response = await fetch(`${backendUrl}api/fundi/v1/verify/${params.fundiId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                // Match the field name expected by the backend
                verificationStatus: body.verificationStatus,
                reason: body.reason,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error:", errorData);
            throw new Error(errorData.message || 'Failed to update fundi status');
        }

        const result = await response.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error updating fundi status:", error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Failed to update fundi status" 
        }, { status: 500 });
    }
}
