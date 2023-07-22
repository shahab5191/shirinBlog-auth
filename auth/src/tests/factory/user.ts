import request from "supertest";
import app from "../../app";
import { randomInt } from "crypto";
import { hashPassword } from "../../utils/encryption";
import User from "../../models/user";

interface CreateUserAttr {
    email?: string;
    password?: string;
}

const fakeUser = () => {
    const email = `test${randomInt(0, 9999)}@test${randomInt(0, 9999)}.com`
    const password = `password${randomInt(0, 9999)}`;
    return { email, password };
}
const createUserWithSignup = async (attr: CreateUserAttr, functionName = "") => {
    const { email, password } = fakeUser();
    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: attr.email ? attr.email : email, password: attr.password ? attr.password : password })
        .expect(201)
    return { email, password, headers: response.headers };
}

const createUserWithMongo = async (attr: CreateUserAttr) => {
    const { email, password } = fakeUser();

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ email, password: hashedPassword, accessLevel: 'user' });
    await newUser.save()


}
export { createUserWithSignup, createUserWithMongo }