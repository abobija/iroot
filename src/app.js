const express = require('express')
const app = express()
const server = require('http').createServer(app)
const broker = require('./broker')(server);

var api = express.Router()

api.get('/dev', (req, res) => {
    broker.wss.clients.forEach(client => {
        console.log(client.readyState);
    });

    res.json({ count: broker.wss.clients.size  });
})

app.use('/api', api)

server.listen(8080, () => console.log('Server has been started.'))