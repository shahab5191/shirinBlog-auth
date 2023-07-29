import express, { type Request, type Response, type NextFunction } from 'express'

const router = express.Router()

router.get('/api/users/signout', (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('session').status(200).send({ message: 'signed out successfuly' })
})

export { router as signoutRouter }
