import mongoose from 'mongoose'
import app from './app'

let Port = 4000
if (process.env.PORT !== undefined) {
  Port = Number(process.env.PORT)
}

const startService = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth').then(() => { console.log('connected to db') })
  } catch (err) {
    console.log(err)
    return
  }

  app.listen(Number(Port), () => {
    console.log(`🖥️ is running on port ${Port}!`)
  })
}

void startService()
