import { NextFunction, Request, Response } from "express";
import sbError from "../errors/sbError";
import { VALIDATION_ERR } from "../errors/errorTypes";

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
        default:
            console.log('unknow error')
    }

    res.status(statusCode).json({ errors });
    return next();
}


const validationErrorHandler = (err: sbError): ErrorResponseType[] => {
    let errors = [];
    for (let index in err.message) {
        errors.push({ message: err.message[index].msg, field: err.message[index].path })
    }
    return errors;
}