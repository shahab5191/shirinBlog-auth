import request from "supertest";
import app from "../../app";
import { randomBytes, randomFill, randomInt } from "crypto";

interface CreateUserAttr {
    email?: string;
    password?: string;
}

const createUser = async (attr: CreateUserAttr) => {
    const email = `test${randomInt(0, 9999)}@test${randomInt(0, 9999)}.com`
    const password = `password${randomInt(0, 9999)}`;
    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: attr.email ? attr.email : email, password: attr.password ? attr.password : password })
        .expect(201)

    return { email, password, headers: response.headers };
}

export { createUser }