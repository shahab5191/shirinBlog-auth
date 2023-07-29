export {}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      session: any
      currentUser?: {
        id: string
        email: string
        accessLevel: string
      }
    }
  }
}
