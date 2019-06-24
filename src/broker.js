const ws = require('ws')
const Client = require('./client')

class Broker {
    clients = new Set()

    constructor(server) {
        this.wss = new ws.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))
        this.heartbeater()
    }

    onConnection(ws, req) {
        let client = new Client(this, ws)
        this.clients.add(client)

        if(! client.isAuthorized(req)) {
            console.log("client not authorized")
            /*return*/ client.dismiss()
        }

        console.log('connected clients', this.clients.size)
    }

    heartbeater() {
        setInterval(() => this.clients.forEach(client => client.heartbeat()), 1000)
    }
}

module.exports = server => new Broker(server)