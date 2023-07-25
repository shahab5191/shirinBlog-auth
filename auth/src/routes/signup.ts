import express, { type NextFunction, type Request, type Response } from 'express'
import { body, validationResult } from 'express-validator'
import SBError from '../errors/sbError'
import { USER_CREATION_ERR, VALIDATION_ERR } from '../errors/errorTypes'
import User from '../models/user'
import { createToken, hashPassword } from '../utils/encryption'

const router = express.Router()

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email is not Valid'),
  body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
], async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(new SBError(VALIDATION_ERR, errors.array())); return
  }

  const { email, password } = req.body

  const emailIsUsed = await User.findOne({ email })
  if (emailIsUsed != null) {
    next(new SBError(USER_CREATION_ERR, 'Email exists')); return
  }

  const hashedPassword = await hashPassword(password)

  const newUser = new User({ email, password: hashedPassword, accessLevel: 'user' })
  await newUser.save()

  const token = createToken({ email: newUser.email, id: newUser.id })

  req.session = { jwt: token }

  res.status(201).send({ email: newUser.email, id: newUser.id })
})

export { router as signupRouter }
