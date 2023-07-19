import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sbError from '../errors/sbError';
import { SERVER_ERR, VALIDATION_ERR } from '../errors/errorTypes';

interface TokenInputs {
    id: string;
    email: string;
}

const createToken = (inputs: TokenInputs) => {
    const token = jwt.sign({ id: inputs.id, email: inputs.email }, 'secret');
    return token;
}

const hashPassword = async (password:string) => {
    let hashedPassword = "";
    try {
        hashedPassword = await bcrypt.genSalt(10).then(salt => { return bcrypt.hash(password, salt) });
    } catch (err) {
        console.log(err);
        throw new sbError(SERVER_ERR, '')
    }
    if (!hashedPassword) {
        throw new sbError(VALIDATION_ERR, 'password')
    }
    return hashedPassword;
}


export { createToken, hashPassword };