import { type NextFunction, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { INTERNAL_ERROR, USER_IS_NOT_LOGGED_IN, USER_NOT_FOUND, WRONG_CREDENTIALS } from '../errors/errorTypes'
import User from '../models/user'
import SBError from '../errors/sbError'
import { type CurrentUserRequest } from '../types/types'

export const protectRoutes = async (req: CurrentUserRequest, _: Response, next: NextFunction): Promise<void> => {
  if (req.session === null || req.session === undefined) {
    next(new SBError(USER_IS_NOT_LOGGED_IN, 'Token not found!')); return
  }
  if (req.session.jwt === undefined) {
    next(new SBError(USER_IS_NOT_LOGGED_IN, 'Token not found!')); return
  }
  const token = req.session?.jwt

  let decodedToken
  try {
    if (process.env.JWT_SECRET === undefined) {
      next(new SBError(INTERNAL_ERROR, 'jwt secret was not found')); return
    }
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    next(new SBError(WRONG_CREDENTIALS, 'token is not valid')); return
  }

  if (typeof decodedToken === 'string') {
    next(new SBError(USER_IS_NOT_LOGGED_IN, 'Token is not valid!')); return
  }

  let id = ''
  let requestedUser
  if (typeof decodedToken !== 'string') {
    id = decodedToken.id
    requestedUser = await User.findById(id)
  }
  if (requestedUser == null) {
    next(new SBError(USER_NOT_FOUND, '')); return
  }

  req.currentUser = { id, email: requestedUser.email, accessLevel: requestedUser.accessLevel }
  next()
}
