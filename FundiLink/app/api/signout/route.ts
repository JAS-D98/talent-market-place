import { cookies } from "next/headers";
import {NextResponse, NextRequest} from "next/server";

export async function POST(req: NextRequest) {
    try {
        // delete cookie fundilink_token
        const cookieStore = await cookies();
        cookieStore.delete("fundilink_token");
        return NextResponse.json({ success: true, message: "You have been signed out successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error signing out:", error);
        return NextResponse.json({ success: false, message: "Failed to sign out" }, { status: 500 });
    }
}
