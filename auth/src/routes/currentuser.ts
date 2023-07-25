import express, { type Response } from 'express'
import { type CurrentUserRequest } from '../types/types'

const router = express.Router()

router.get('/api/users/current', async (req: CurrentUserRequest, res: Response) => {
  res.status(200).send({ id: req.currentUser?.id, email: req.currentUser?.email })
})

export { router as currentUserRouter }
