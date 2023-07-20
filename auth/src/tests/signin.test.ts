import request from 'supertest'
import app from '../app'
import { createUser } from './factory/user';

it('should response with token in cookie when user and password are correct', async () => {
    const { email, password } = await createUser({});
    const response = await request(app)
        .post('/api/users/signin')
        .send({ email, password })
        .expect(200);
    expect(response.headers).toHaveProperty('set-cookie');
})

it('should return user id and email', async () => {
    const { email, password } = await createUser({});
    const response = await request(app)
        .post('/api/users/signin')
        .send({ email, password })
        .expect(200)

    expect(response.body).toHaveProperty('email');
    expect(response.body.email).toBe(email);
    expect(response.body.id).toBeDefined;
})

it('should return error when email or password are wrong', async () => {
    const { email, password } = await createUser({});
    const response = await request(app)
        .post('/api/users/signin')
        .send({ email, password: 'wrongpassword' })
        .expect(404);
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('Wrong credentials');

    const response2 = await request(app)
        .post('/api/users/signin')
        .send({ email: 'wrongemail@test.com', password })
        .expect(404)
    expect(response2.body).toHaveProperty('errors')
    expect(response2.body.errors[0].message).toBe('Wrong credentials');

    const response3 = await request(app)
        .post('/api/users/signin')
        .send({ email: 'wrongemail@test.com', password: 'wrongpassword' })
        .expect(404)
    expect(response3.body).toHaveProperty('errors')
    expect(response2.body.errors[0].message).toBe('Wrong credentials');
})

it('should return error when email or password have not valid form', async () => {
    const { email, password } = await createUser({});
    const response = await request(app)
        .post('/api/users/signin')
        .send({ email, password: '' })
        .expect(403);
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].message).toBe('Enter password');

    const response2 = await request(app)
        .post('/api/users/signin')
        .send({ email: '@test.com', password })
        .expect(403)
    expect(response2.body).toHaveProperty('errors')
    expect(response2.body.errors[0].message).toBe('Email is not in correct form');

    const response3 = await request(app)
        .post('/api/users/signin')
        .send({ email: 'wrongemail@com', password: '' })
        .expect(403)
    expect(response3.body).toHaveProperty('errors')
    expect(response3.body.errors[0].message).toBe('Email is not in correct form');
    expect(response3.body.errors[1].message).toBe('Enter password');
})