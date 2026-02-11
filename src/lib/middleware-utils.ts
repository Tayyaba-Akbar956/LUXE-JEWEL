import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes logic
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register') ||
        request.nextUrl.pathname.startsWith('/forgot-password')

    const isProtectedPage = request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/wishlist') ||
        request.nextUrl.pathname.startsWith('/checkout') ||
        request.nextUrl.pathname.startsWith('/dashboard')

    const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

    if (user && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!user && (isProtectedPage || isAdminPage)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin access check (rudimentary check using user metadata)
    if (user && isAdminPage) {
        const isAdmin = user.user_metadata?.role === 'admin'
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}
