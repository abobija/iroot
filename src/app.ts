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

app.use('/api', api(broker))
app.use('/dashboard', express.static(path.join(__dirname, '../src/dashboard')))
app.use('/static/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')))
app.use('/static/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')))

server.listen(8080, () => console.log('Server has been started.'))