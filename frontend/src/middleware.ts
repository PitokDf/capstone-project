import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    console.log(token);
    console.log(req.cookies);

    const loginUrl = new URL('/admin/login', req.url)

    if (!token) {
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.next()
        }
        return NextResponse.redirect(loginUrl)
    }

    try {
        console.log(process.env.JWT_SECREET);

        const secret = new TextEncoder().encode(process.env.JWT_SECREET)
        await jwtVerify(token, secret)

        // kalau token valid tapi lagi akses /admin/login, redirect ke home
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/', req.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error('Token verification failed:', error)

        // bikin response redirect dan hapus cookie
        const response = NextResponse.redirect(loginUrl)
        response.cookies.set({
            name: 'token',
            value: '',
            maxAge: 0,
            path: '/',
        })

        return response
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}
