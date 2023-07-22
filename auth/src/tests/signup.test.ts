import request from 'supertest'
import app from '../app'
import mongoose from 'mongoose';

describe.skip('testing signup route', () => {
    it('should return token inside cookie and id with same email as user signed up with', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com", password: "password" })
            .expect(201)
        expect(response.body.email).toBe('test@test.com');
        expect(response.body.id).toBeDefined();
        expect(response.get('Set-Cookie')).toBeDefined();
    })

    it('should return error if email is not in right format', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({ email: "test@.com", password: "password" })
            .expect(403)

        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].message).toBe('Email is not Valid');
    })

    it('should return error if email already exists', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com", password: "password" })
            .expect(201)

        const response = await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com", password: "password" })
            .expect(400)
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].message).toBe('Cannot create this user!');
    })

    it('should return error if password is not between 6 and 20 chars', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com", password: "pas" })
            .expect(403);

        await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com", password: "pas456789012345678901" })
            .expect(403);
    })

    it('should return error if password or email are empty', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({ email: "", password: "password" })
            .expect(403)
        await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com", password: "" })
            .expect(403);
        await request(app)
            .post('/api/users/signup')
            .send({ email: "", password: "" })
            .expect(403);
    })
})
