import dotenv from 'dotenv'
dotenv.config()
export default {
  Memory: (process.env.DEVEL === 'true'),
  IP: process.env.DEVEL === 'true' ? "mongo" : 'localhost',
  Port: '27017',
  Database: 'testdb'
}
