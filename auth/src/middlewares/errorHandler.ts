import { NextFunction, Request, Response } from "express";
import sbError from "../errors/sbError";
import { DATABASE_CONNECTION_ERR, NOT_FOUND_ERR, SERVER_ERR, USER_CREATION_ERR, WRONG_CREDENTIALS, VALIDATION_ERR } from "../errors/errorTypes";

interface ErrorResponseType {
    message: string
    field: string
}

export const errorHandler = (err: sbError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 400;
    let errors: ErrorResponseType[] = [];

    switch (err.errorType) {
        case VALIDATION_ERR:
            statusCode = 403;
            errors = validationErrorHandler(err);
            break;
        case DATABASE_CONNECTION_ERR:
            statusCode = 500;
            errors = databaseConnectionErrorHandler(err);
            break;
        case NOT_FOUND_ERR: {
            statusCode = 404;
            errors = notFoundErrorHandler(err);
            break;
        }
        case SERVER_ERR: {
            statusCode = 500;
            errors = serverError(err);
            break;
        }
        case USER_CREATION_ERR: {
            statusCode = 400;
            errors = userCreationError(err);
            break;
        }
        case WRONG_CREDENTIALS: {
            statusCode = 404;
            errors = userDoesNotExist(err);
            break;
        }
        default:
            console.log(err)
    }

    res.status(statusCode).json({ errors });
    return next();
}


const validationErrorHandler = (err: sbError): ErrorResponseType[] => {
    let errors = [];
    for (let index in err.param) {
        errors.push({ message: err.param[index].msg, field: err.param[index].path })
    }
    return errors;
}

const databaseConnectionErrorHandler = (err: sbError): ErrorResponseType[] => {
    let errors = [{ message: 'Error connecting to database', field: 'database' }];
    return errors;
}

const notFoundErrorHandler = (err: sbError): ErrorResponseType[] => {
    let errors = [{ message: 'Requested rotue was not found!', field: err.param }]
    console.log(errors)
    return errors;
}

const serverError = (err: sbError): ErrorResponseType[] => {
    let errors = [{ message: 'Somthing went wrong! Please try again later', field: err.param }];
    return errors;
}

const userCreationError = (err: sbError): ErrorResponseType[] => {
    let errors = [{ message: 'Cannot create this user!', field: err.param }];
    return errors;
}

const userDoesNotExist = (err: sbError): ErrorResponseType[] => {
    let errors = [{ message: 'Wrong credentials', field: err.param }];
    return errors
}