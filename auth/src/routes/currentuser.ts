import express from 'express'
import sbError from '../errors/sbError';
import { USER_IS_NOT_LOGGED_IN, USER_NOT_FOUND, WRONG_CREDENTIALS } from '../errors/errorTypes';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = express.Router();

router.get('/api/users/current', async (req, res, next) => {
    if (!req.session?.jwt) {
        return next(new sbError(USER_IS_NOT_LOGGED_IN, "Token not found!"))
    }
    const token = req.session?.jwt;

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return next(new sbError(WRONG_CREDENTIALS, 'token is not valid'))
    }

    if (!decodedToken) {
        return next(new sbError(USER_IS_NOT_LOGGED_IN, 'Token is not valid!'));
    }
    let id = '';
    let email = '';
    let requestedUser;
    if (typeof decodedToken !== 'string') {
        id = decodedToken.id;
        email = decodedToken.email;
        requestedUser = await User.findById(id);
    }

    if (!requestedUser) {
        return next(new sbError(USER_NOT_FOUND, ''));
    }

    res.status(200).send({ id, email })
});

export { router as currentUserRouter };