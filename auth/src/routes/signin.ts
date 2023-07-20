import express, { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import sbError from '../errors/sbError';
import { WRONG_CREDENTIALS, VALIDATION_ERR } from '../errors/errorTypes';
import User from '../models/user';
import { comparePassword, createToken, verifyToken } from '../utils/encryption';

const router = express.Router();

router.get('/api/users/signin', (req, res, next) => {
    res.status(200).send('<h1>Signin</h1>')
});

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email is not in correct form'),
    body('password').trim().notEmpty().withMessage('Enter password')
], async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new sbError(VALIDATION_ERR, errors.array()));
    }

    const { email, password } = req.body;

    const requestedUser = await User.findOne({ email });
    if (!requestedUser) {
        return next(new sbError(WRONG_CREDENTIALS, ''));
    }

    const validPassword = await comparePassword(password, requestedUser.password);
    if (!validPassword) {
        return next(new sbError(WRONG_CREDENTIALS, ''))
    }

    const token = createToken({ id: requestedUser.id, email: requestedUser.email });

    req.session = { jwt: token };
    res.status(200).send({ email: requestedUser.email, id: requestedUser.id })
});
export { router as signinRouter };