const ws = require('ws')
const uuidv4 = require('uuid/v4')
const basicAuth = require('basic-auth')

const lifetimeThreshold = 10 // sec
const lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

class Client {
    constructor(broker, ws) {
        let self = this
        this.broker = broker
        this.ws = ws
        this.uuid = uuidv4()
        this.refreshLifetime()

        ws.on('pong', () => self.refreshLifetime())

        ws.on('message', msg => {
            self.refreshLifetime()

            console.log('received from client', self.uuid, ':', msg)
            //ws.send(msg)
        })

        console.log('client', this.uuid, 'connected')
    }

    refreshLifetime() {
        this.lifetime = lifetimeThreshold
    }

    isAlive() {
        return this.lifetime >= 0
    }

    isAuthorized(req) {
        let user = basicAuth(req)

        if(user != null) {
            // TODO: Fetch user from db
            if(user.name === 'dev32' && user.pass === 'test1234') {
                return true
            }
        }

        return false
    }

    dismiss() {
        console.log('client', this.uuid, 'disconnected')
        this.broker.clients.delete(this)
        return this.ws.terminate()
    }

    heartbeat() {
        this.lifetime--

        if(! this.isAlive()) {
            return this.dismiss()
        }
        
        if(this.lifetime == lifeTimePingSendSecond) {
            this.ws.ping(() => {})
        }
    }
}

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