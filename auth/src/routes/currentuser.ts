import express, { type Request, type Response } from 'express'

const router = express.Router()

router.get('/api/users/current', (req: Request, res: Response) => {
  res.status(200).send({ id: req.currentUser?.id, email: req.currentUser?.email })
})

export { router as currentUserRouter }
