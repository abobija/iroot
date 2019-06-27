const ws = require('ws')
const Subscriber = require('./subscriber')

class Broker {
    subscribers = new Set()

    constructor(server) {
        this.wss = new ws.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))
        this.heartbeater()
    }

    onConnection(ws, req) {
        let subscriber = new Subscriber(this, ws)
        this.subscribers.add(subscriber)

        if(! subscriber.isAuthorized(req)) {
            console.log("subscriber not authorized")
            /*return*/ subscriber.dismiss()
        }

        console.log('connected subscriber', this.subscribers.size)
    }

    heartbeater() {
        setInterval(() => this.subscribers.forEach(subscriber => subscriber.heartbeat()), 1000)
    }
}

module.exports = server => new Broker(server)