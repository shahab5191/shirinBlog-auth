import dotenv from 'dotenv'
dotenv.config()
export = {
  Memory: (process.env.DEVEL === 'true'),
  IP: 'mongo',
  Port: '27017',
  Database: 'testdb'
}
