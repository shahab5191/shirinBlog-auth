import request from 'supertest'
import app from '../../app'
import { randomInt } from 'crypto'
import { hashPassword } from '../../utils/encryption'
import User from '../../models/user'

interface CreateUserAttr {
  email?: string
  password?: string
}

interface FakeUserResponse {
  email: string
  password: string
}

interface CreateUserResponse {
  email: string
  password: string
  headers: Record<string, string>
}

const fakeUser = (): FakeUserResponse => {
  const email = `test${randomInt(0, 9999)}@test${randomInt(0, 9999)}.com`
  const password = `password${randomInt(0, 9999)}`
  return { email, password }
}
const createUserWithSignup = async (attr: CreateUserAttr): Promise<CreateUserResponse> => {
  const { email, password } = fakeUser()
  const response = await request(app)
    .post('/api/v1/users/signup')
    .send({ email: attr.email === null ? attr.email : email, password: attr.password === null ? attr.password : password })
    .expect(201)
  return { email, password, headers: response.headers }
}

const createUserWithMongo = async (attr: CreateUserAttr): Promise<FakeUserResponse> => {
  const { email, password } = fakeUser()

  const hashedPassword = await hashPassword(password)

  const newUser = new User({ email, password: hashedPassword, accessLevel: 'user' })
  await newUser.save()
  return { email, password }
}
export { createUserWithSignup, createUserWithMongo }
