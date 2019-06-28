import express from 'express'
import http from 'http'
import Broker from './model/broker'
import api from './route/api'
import path from 'path'
import { jsonIgnoreReplacer } from 'json-ignore'

const app = express()
const server = http.createServer(app)
const broker = new Broker(server)

app.disable('etag')
app.set('json replacer', jsonIgnoreReplacer)
app.set('json spaces', 2)

app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')))
app.use('/api', api(broker))

server.listen(8080, () => console.log('Server has been started.'))