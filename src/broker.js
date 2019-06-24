const ws = require('ws')
const uuidv4 = require('uuid/v4')
const basicAuth = require('basic-auth')

const lifetimeThreshold = 10 // sec

class Broker {
    constructor(server) {
        this.wss = new ws.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))
        this.heartbeat()
    }

    onConnection(ws, req) {
        if(! this.wsIsAuthorized(req)) {
            console.log("ws not authorized")
            return ws.terminate()
        }

        ws.uuid = uuidv4()

        console.log('ws', ws.uuid, 'connected')
        console.log('connected clients', this.wss.clients.size)

        ws.refreshLifetime = () => ws.lifetime = lifetimeThreshold
        ws.isAlive = () => ws.lifetime >= 0

        ws.refreshLifetime()

        ws.on('pong', ws.refreshLifetime)

        ws.on('message', msg => {
            ws.refreshLifetime()

            console.log('received from ws', ws.uuid, ':', msg)
            ws.send(msg)
        })
    }

    wsIsAuthorized(req) {
        let user = basicAuth(req)
        
        if(user != null) {
            console.log(user)
            return true
        }

        return false
    }

    heartbeat() {
        let lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)
        let wss = this.wss

        setInterval(() => {
            wss.clients.forEach(ws => {
                ws.lifetime--

                if(! ws.isAlive()) {
                    console.log('ws', ws.uuid, 'disconnected')
                    return ws.terminate()
                }
                
                if(ws.lifetime == lifeTimePingSendSecond) {
                    ws.ping(() => {})
                }
            })
        }, 1000)
    }
}

module.exports = server => new Broker(server)