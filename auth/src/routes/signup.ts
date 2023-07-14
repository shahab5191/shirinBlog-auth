import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import sbError from '../errors/sbError';
import { VALIDATION_ERR } from '../errors/errorTypes';

const router = express.Router();


router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email is not Valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
], (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new sbError(VALIDATION_ERR, errors.array())
    }

    const { email, password } = req.body;

    console.log('Create user');
    res.send({});

});

export { router as signupRouter };