import express from 'express'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import { handleSocket } from './socket.js'

const app = express()
app.use(bodyParser.json())
app.use(cors())

userRoutes(app)

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
handleSocket(io)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

// export { app }
export { server as app }
