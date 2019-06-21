const express = require('express')
const app = express()
const server = require('http').createServer(app)
const wss = require('./wss')(server);

var api = express.Router()

api.get('/dev', (req, res) => {
    wss.clients.forEach(client => {
        console.log(client.readyState);
    });

    res.json({ count: wss.clients.size  });
})

app.use('/api', api)

server.listen(8080, () => console.log('Server has been started.'))