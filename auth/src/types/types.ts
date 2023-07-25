import { type Request } from 'express'
export interface CurrentUserRequest extends Request {
  currentUser?: {
    id: string
    email: string
    accessLevel: string
  }
}
