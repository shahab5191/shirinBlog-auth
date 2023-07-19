import request from 'supertest'
import app from '../app'

it('should return token inside cookie and id with same email as user signed up with', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({email:"test@test.com",password:"password"})
        .expect(201)
        console.log(response.body)
        expect(response.body.email).toBe('test@test.com');
        expect(response.body.id).toBeDefined();
        expect(response.get('Set-Cookie')).toBeDefined();
})