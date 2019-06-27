import express from 'express'
import http from 'http'
import Broker from './broker'
import api from './api'

const app = express()
const server = http.createServer(app)
const broker = new Broker(server)

app.use('/api', api(broker))

server.listen(8080, () => console.log('Server has been started.'))