import request from "supertest";
import app from "../app";
import { createUserWithSignup } from "./factory/user";

describe.skip('testing users/current route', () => {
    it('should return user id and email with correct token', async () => {
        const { headers } = await createUserWithSignup({},'should return user id and email with correct token');
        const cookie = headers['set-cookie']

        const response = await request(app)
            .get('/api/users/current')
            .set('Cookie', cookie[0].split(';')[0])
            .send()
            .expect(200)

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');
        expect(response.body.email).not.toBe('');
        expect(response.body.id).not.toBe('');
    })

    it('should return error if cookie is not available', async () => {
        const response = await request(app)
            .get('/api/users/current')
            .send()
            .expect(403)
    })

    it('should return error with wrong cookie', async () => {
        await request(app)
            .get('/api/users/current')
            .set('Cookie', 'test')
            .send()
            .expect(403)
    })

    it('should return error with wrong token in cookie', async () => {
        const { headers } = await createUserWithSignup({},'should return error with wrong token in cookie');

        //here we tamper with token by decoding cookie and changing token inside it and then encoding it again
        const cookie = headers['set-cookie'];
        const decodedCookie = Buffer.from(cookie[0].split(';')[0].split('=')[1], 'base64').toString('utf-8')
        const token = await JSON.parse(decodedCookie)['jwt'];
        let tamperedToken = '';
        if (token[0] !== 'a') {
            tamperedToken = 'a' + token.slice(1);
        } else {
            tamperedToken = 'b' + token.slice(1);
        }
        const cookieObject = JSON.stringify({ jwt: tamperedToken });
        const encodeSession = `session=${Buffer.from(cookieObject).toString('base64')}`;

        const response = await request(app)
            .get('/api/users/current')
            .set('Cookie', encodeSession)
            .send()
            .expect(404)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].message).toBe('Wrong credentials')
    })
})