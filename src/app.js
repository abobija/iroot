const express = require('express')
const app = express()
const server = require('http').createServer(app)
const WebSocket = require('ws')

const wss = new WebSocket.Server({ server: server });

wss.on('connection', ws => {
    console.log('ws client connected');

    ws.on('message', msg => {
        console.log('received from ws client: ', msg);
        ws.send(msg);
    });
});

var api = express.Router()

api.get('/dev', (req, res) => {
    res.json({ count: wss.clients.size  });
})

app.use('/api', api)

server.listen(8080, () => console.log('Server has been started.'))