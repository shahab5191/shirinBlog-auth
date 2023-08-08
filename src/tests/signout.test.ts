import request from 'supertest'
import app from '../app'
import { createUserWithSignup } from './factory/user'

describe('testing signout functionality', () => {
  it('should delete session cookie', async () => {
    const { headers } = await createUserWithSignup({})
    const Cookie = headers['set-cookie']

    await request(app)
      .get('/api/v1/users/current')
      .set('Cookie', Cookie)
      .send()
      .expect(200)

    const response = await request(app)
      .get('/api/v1/users/signout')
      .set('Cookie', Cookie)
      .send()
      .expect(200)

    // we expect after signing out, when we try to signin, server returns error
    await request(app)
      .post('/api/v1/users/signin')
      .set('Cookie', response.headers['set-cookie'])
      .send()
      .expect(403)
  })

  it('should return 200 if user is not already signed in', async () => {
    await request(app)
      .get('/api/v1/users/current')
      .send()
      .expect(403)

    await request(app)
      .get('/api/v1/users/signout')
      .send()
      .expect(200)
  })
})
