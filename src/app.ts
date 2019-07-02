import express from 'express'
import http from 'http'
import Broker from './model/broker'
import api from './route/api'
import path from 'path'
import { jsonIgnoreReplacer } from 'json-ignore'
import IRootDatabase from './db'

const app = express()
const server = http.createServer(app)
const db = new IRootDatabase(path.join(__dirname, '../db'))
const broker = new Broker(server, db)

app.use(express.json())
app.set('json replacer', jsonIgnoreReplacer)
app.set('json spaces', 2)
app.disable('etag')

app.use('/api', api(broker))

server.listen(8080, () => console.log('Server has been started.'))