import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function middleware(req: Request) {
    const sessionCookie = (await cookies()).get("session");

    if (!sessionCookie || !sessionCookie.value) {
        // return NextResponse.redirect(new URL("/auth/login", req.url));
        return
    }

    const sessionData = await verifyToken(sessionCookie?.value);

    if (!sessionData || !sessionData.user || new Date(sessionData.expires) < new Date()) {
        // return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
