import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

const extractToken = (authHeader?: string) => {
    if (!authHeader) return null;
    return authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
};

const authenticate = async (token: string | null | undefined) => {
    if (!process.env.JWT_SECRET) throw { status: 500, message: "Server misconfiguration: JWT_SECRET is not set" };
    if (!token) throw { status: 401, message: "Unauthorized access" };

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown;
    if (!decoded || typeof decoded === "string") throw { status: 401, message: "Invalid token" };

    const payload = decoded as TokenPayload;
    if (!payload.id && !payload.email) throw { status: 401, message: "Invalid token payload" };

    return payload;
};

export const auth = (...args: any[]) => {
    // If used directly as middleware: auth(req, res, next)
    if (args.length > 0 && args[0] && typeof args[0].headers !== "undefined") {
        const [req, res, next] = args as [Request, Response, NextFunction];
        (async () => {
            try {
                const token = extractToken(req.headers.authorization as string | undefined);
                const payload = await authenticate(token);
                req.user = payload as any;
                next();
            } catch (err: any) {
                const status = err && err.status ? err.status : 401;
                const message = err && err.message ? err.message : "Authentication error";
                res.status(status).json({ success: false, message });
            }
        })();
        return;
    }

    // Otherwise args are role strings: auth('maintainer') -> returns middleware
    const roles = args as string[];
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = extractToken(req.headers.authorization as string | undefined);
            const payload = await authenticate(token);

            if (roles.length > 0) {
                if (!payload.role || !roles.includes(payload.role)) {
                    return res.status(403).json({ success: false, message: "Forbidden access" });
                }
            }

            req.user = payload as any;
            next();
        } catch (err: any) {
            const status = err && err.status ? err.status : 401;
            const message = err && err.message ? err.message : "Authentication error";
            res.status(status).json({ success: false, message });
        }
    };
};
