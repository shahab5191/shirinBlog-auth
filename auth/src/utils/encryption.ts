import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { SBError, SERVER_ERR, VALIDATION_ERR } from '@shahab5191/shared'

interface TokenInputs {
  id: string
  email: string
  accessLevel: string
}

const createToken = (inputs: TokenInputs): string => {
  const token = jwt.sign({ id: inputs.id, email: inputs.email, accessLevel: inputs.accessLevel }, 'secret')
  return token
}

const hashPassword = async (password: string): Promise<string> => {
  let hashedPassword = ''
  try {
    hashedPassword = await bcrypt.genSalt(10).then(async salt => { return await bcrypt.hash(password, salt) })
  } catch (err) {
    console.log(err)
    throw new SBError(SERVER_ERR, '')
  }
  if (hashedPassword === '' || hashedPassword === undefined) {
    throw new SBError(VALIDATION_ERR, 'password')
  }
  return hashedPassword
}

const comparePassword = async (reqPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(reqPassword, hashedPassword)
}

export { createToken, hashPassword, comparePassword }
