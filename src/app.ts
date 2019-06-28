import express from 'express'
import http from 'http'
import Broker from './model/broker'
import api from './api'
import { jsonIgnoreReplacer } from 'json-ignore'

const app = express()
const server = http.createServer(app)
const broker = new Broker(server)

app.use('/api', api(broker))

app.disable('etag')

app.set('json replacer', jsonIgnoreReplacer)
app.set('json spaces', 2)

server.listen(8080, () => console.log('Server has been started.'))