import { NextRequest, NextResponse } from "next/server"
import { checkServerSideSession } from "./auth/auth"

export const protectedAuthPaths = [
    '/'
]

export const authMiddleware = async (request: NextRequest) => {
    if (await checkServerSideSession(request)) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/authentication/login', request.url))
}