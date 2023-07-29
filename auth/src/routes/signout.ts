import express, { type Request, type Response } from 'express'

const router = express.Router()

router.get('/api/users/signout', (req: Request, res: Response) => {
  req.session = {}
  res.clearCookie('session').status(200).send({ message: 'signed out successfuly' })
})

export { router as signoutRouter }
