import express from 'express'
import http from 'http'
import Broker from './model/Broker'
import api from './route/api'
import path from 'path'
import { jsonIgnoreReplacer } from 'json-ignore'
import IRootDatabase from './db'
import { errors } from 'celebrate'
import IRootError from './helpers/IRootError'
import { ErrorResult } from './helpers/Result'

const app = express()
const server = http.createServer(app)
const db = new IRootDatabase(path.join(__dirname, '../db'))
const broker = new Broker(server, db)

app.use(express.json())
app.set('json replacer', jsonIgnoreReplacer)
app.set('json spaces', 2)
app.disable('etag')

app.use('/api', api(broker))

// Use celebrate error middleware
app.use(errors())

// Catch IRootError-s and wrap them up in ErrorResult class
app.use((err: IRootError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    return res.status(err.statusCode).send(new ErrorResult(err.message, err.statusCode))
})

const port = process.env.PORT || 8080

server.listen(port, () => console.log(`Server has been started at port :${port}.`))