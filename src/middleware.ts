import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware, protectedAuthPaths } from './middleware-handler';


function matchesWildcard(path: string, pattern: string): boolean {
	if (pattern.endsWith('/*')) {
		const basePattern = pattern.slice(0, -2);
		return path.startsWith(basePattern);
	}
	return path === pattern;
}

type RegisterParams = {
	paths: string | string[];
	request: NextRequest;
	handler: (request: NextRequest) => Promise<NextResponse | void>;
};

async function registerMiddleware({ paths, request, handler }: RegisterParams): Promise<NextResponse | void>{
	const pathArray = Array.isArray(paths) ? paths : [paths];
	const pathname = request.nextUrl.pathname;

	if (pathArray.some((path) => matchesWildcard(pathname, path))) {
		return handler(request);
	}
}
 
export async function middleware(request: NextRequest) {
	const middlewares = getMiddlewareRegistration(request);

	for (const middleware of middlewares) {
		const response = await middleware;
		if (response) {
			return response;
		}
	}
	
	return NextResponse.next();
}

function getMiddlewareRegistration(request: NextRequest): Promise<NextResponse | void>[] {
	return [
		registerMiddleware({
			paths: protectedAuthPaths,
			request,
			handler: authMiddleware
		}),
	];
}