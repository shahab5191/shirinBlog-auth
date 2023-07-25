import express, { type Application } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/currentuser'
import { signinRouter } from './routes/signin'
import { signupRouter } from './routes/signup'
import { signoutRouter } from './routes/signout'
import { errorHandler } from './middlewares/errorHandler'
import SBError from './errors/sbError'
import { INTERNAL_ERROR, NOT_FOUND_ERR } from './errors/errorTypes'
import { protectRoutes } from './middlewares/protect-routes'

dotenv.config()

const app: Application = express()
if (process.env.JWT_SECRET === undefined) {
  throw new SBError(INTERNAL_ERROR, 'jwt secret was not found')
}

app.set('trust proxy', true)
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieSession({
  name: 'session',
  signed: false,
  secure: false
}))

app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.use(protectRoutes)

app.use(currentUserRouter)

app.all('*', () => {
  throw new SBError(NOT_FOUND_ERR, 'Auth')
})

app.use(errorHandler)
export default app
