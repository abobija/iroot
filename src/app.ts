import express from 'express'
import http from 'http'
import Broker from './model/broker'
import api from './route/api'
import path from 'path'
import { jsonIgnoreReplacer } from 'json-ignore'

const app = express()
const server = http.createServer(app)
const broker = new Broker(server)

app.use(express.json())
app.set('json replacer', jsonIgnoreReplacer)
app.set('json spaces', 2)
app.disable('etag')

app.use('/api', api(broker))
app.get('/dashboard', (_req, res) => res.sendFile(path.join(__dirname, '../static/dashboard.html')))
app.use('/static', express.static(path.join(__dirname, '../static')))
app.use('/lib/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')))
app.use('/lib/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')))

server.listen(8080, () => console.log('Server has been started.'))