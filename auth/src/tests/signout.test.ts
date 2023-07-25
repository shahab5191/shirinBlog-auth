import request from 'supertest'
import app from '../app'
import { createUserWithSignup } from './factory/user'

describe('testing signout functionality', () => {
  it('should delete session cookie', async () => {
    const { headers } = await createUserWithSignup({})
    const Cookie = headers['set-cookie']

    await request(app)
      .get('/api/users/current')
      .set('Cookie', Cookie)
      .send()
      .expect(200)

    const response = await request(app)
      .get('/api/users/signout')
      .set('Cookie', Cookie)
      .send()
      .expect(200)
    expect(response.headers['set-cookie']).not.toBeDefined()

    // we expect after signing out, when we try to signin, server returns error
    await request(app)
      .post('/api/users/signin')
      .send()
      .expect(403)
  })

  it('should return 200 if user is not already signed in', async () => {
    await request(app)
      .get('/api/users/current')
      .send()
      .expect(403)

    await request(app)
      .get('/api/users/signout')
      .send()
      .expect(200)
  })
})
