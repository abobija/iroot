const express = require('express')
const app = express()
const server = require('http').createServer(app)
const broker = require('./broker')(server);

app.use('/api', require('./api')(broker))

server.listen(8080, () => console.log('Server has been started.'))