// middleware.js - Simplified
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    // Hanya handle redirect ke login page, verification di client-side
    if (req.nextUrl.pathname.startsWith('/admin/login')) {
        return NextResponse.next()
    }

    // Biarkan request lewat, verification akan dilakukan di client
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}