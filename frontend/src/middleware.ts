import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/admin/login', req.url));
    } else {
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECREET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/admin/login',
    ],
};