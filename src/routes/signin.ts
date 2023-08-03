import express, { type Request, type Response, type NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { SBError, WRONG_CREDENTIALS, VALIDATION_ERR } from '@shahab5191/shared/build'
import User from '../models/user'
import { comparePassword, createToken } from '../utils/encryption'

const router = express.Router()

router.get('/api/users/signin', (req, res, next) => {
  res.status(200).send('<h1>Signin</h1>')
})

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email is not in correct form'),
  body('password').trim().notEmpty().withMessage('Enter password')
], async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    next(new SBError(VALIDATION_ERR, errors.array())); return
  }
  const { email, password } = req.body

  const requestedUser = await User.findOne({ email })
  if (requestedUser == null) {
    next(new SBError(WRONG_CREDENTIALS, '')); return
  }

  const validPassword = await comparePassword(password, requestedUser.password)
  if (!validPassword) {
    next(new SBError(WRONG_CREDENTIALS, '')); return
  }

  const token = createToken({ id: requestedUser.id, email: requestedUser.email, accessLevel: requestedUser.accessLevel })
  req.session = { jwt: token }
  res.status(200).send({ email: requestedUser.email, id: requestedUser.id, accessLevel: requestedUser.accessLevel })
})
export { router as signinRouter }
