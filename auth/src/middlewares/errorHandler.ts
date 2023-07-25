import { type NextFunction, type Request, type Response } from 'express'
import type SBError from '../errors/sbError'
import { DATABASE_CONNECTION_ERR, NOT_FOUND_ERR, SERVER_ERR, USER_CREATION_ERR, WRONG_CREDENTIALS, VALIDATION_ERR, USER_IS_NOT_LOGGED_IN, USER_NOT_FOUND } from '../errors/errorTypes'

interface ErrorResponseType {
  message: string
  field: string
}

export const errorHandler = (err: SBError, _: Request, res: Response, next: NextFunction): void => {
  let statusCode = 400
  let errors: ErrorResponseType[] = []

  switch (err.errorType) {
    case VALIDATION_ERR:
      statusCode = 403
      errors = validationErrorHandler(err)
      break
    case DATABASE_CONNECTION_ERR:
      statusCode = 500
      errors = databaseConnectionErrorHandler()
      break
    case NOT_FOUND_ERR: {
      statusCode = 404
      errors = notFoundErrorHandler(err)
      break
    }
    case SERVER_ERR: {
      statusCode = 500
      errors = serverError(err)
      break
    }
    case USER_CREATION_ERR: {
      statusCode = 400
      errors = userCreationError(err)
      break
    }
    case WRONG_CREDENTIALS: {
      statusCode = 404
      errors = userDoesNotExist(err)
      break
    }
    case USER_IS_NOT_LOGGED_IN: {
      statusCode = 403
      errors = userIsNotLoggedIn(err)
      break
    }
    case USER_NOT_FOUND: {
      statusCode = 404
      errors = userNotFound(err)
      break
    }
    default:
      console.log(err)
  }

  res.status(statusCode).send({ errors })
  next()
}

const validationErrorHandler = (err: SBError): ErrorResponseType[] => {
  const errors = []
  for (const index in err.param) {
    errors.push({ message: err.param[index].msg, field: err.param[index].path })
  }
  return errors
}

const databaseConnectionErrorHandler = (): ErrorResponseType[] => {
  const errors = [{ message: 'Error connecting to database', field: 'database' }]
  return errors
}

const notFoundErrorHandler = (err: SBError): ErrorResponseType[] => {
  const errors = [{ message: 'Requested rotue was not found!', field: err.param }]
  console.log(errors)
  return errors
}

const serverError = (err: SBError): ErrorResponseType[] => {
  const errors = [{ message: 'Somthing went wrong! Please try again later', field: err.param }]
  return errors
}

const userCreationError = (err: SBError): ErrorResponseType[] => {
  const errors = [{ message: 'Cannot create this user!', field: err.param }]
  return errors
}

const userDoesNotExist = (err: SBError): ErrorResponseType[] => {
  const errors = [{ message: 'Wrong credentials', field: err.param }]
  return errors
}

const userIsNotLoggedIn = (err: SBError): ErrorResponseType[] => {
  const errors = [{ message: 'User is not logged in', field: err.param }]
  return errors
}

const userNotFound = (err: SBError): ErrorResponseType[] => {
  const errors = [{ message: 'User was not found', field: err.param }]
  return errors
}
