import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import sbError from '../errors/sbError';
import { USER_IS_NOT_LOGGED_IN, USER_NOT_FOUND, WRONG_CREDENTIALS } from '../errors/errorTypes';
import User from '../models/user';

declare global {
    namespace Express {
        interface Request {
            currentUser?: {
                id: string;
                email: string;
                accessLevel: string;
            }
        }
    }
}

export const protectRoutes = async (req: Request, _: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        return next(new sbError(USER_IS_NOT_LOGGED_IN, "Token not found!"))
    }
    const token = req.session?.jwt;

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
        return next(new sbError(WRONG_CREDENTIALS, 'token is not valid'))
    }

    if (!decodedToken) {
        return next(new sbError(USER_IS_NOT_LOGGED_IN, 'Token is not valid!'));
    }

    let id = '';
    let requestedUser;
    if (typeof decodedToken !== 'string') {
        id = decodedToken.id;
        requestedUser = await User.findById(id);
    }
    if (!requestedUser) {
        return next(new sbError(USER_NOT_FOUND, ''));
    }

    req.currentUser = { id, email: requestedUser.email, accessLevel: requestedUser.accessLevel };
    return next();
}