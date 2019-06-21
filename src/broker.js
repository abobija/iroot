const ws = require('ws')
const uuidv4 = require('uuid/v4')

const lifetimeThreshold = 10 // sec

class Broker {
    constructor(server) {
        let self = this
        this.wss = new ws.Server({ server })
        
        this.wss.on('connection', ws => {
            ws.uuid = uuidv4()

            console.log('ws', ws.uuid, 'connected')

            ws.refreshLifetime = () => ws.lifetime = lifetimeThreshold
            ws.isAlive = () => ws.lifetime >= 0

            ws.refreshLifetime()

            ws.on('pong', ws.refreshLifetime)

            ws.on('message', msg => {
                ws.refreshLifetime()

                console.log('received from ws', ws.uuid, ':', msg)
                ws.send(msg)
            })
        })

        let lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

        setInterval(() => {
            self.wss.clients.forEach(ws => {
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