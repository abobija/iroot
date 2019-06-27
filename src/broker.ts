import Subscriber from './subscriber'
import WebSocket from 'ws'
import http from 'http'

export default class Broker {
    private wss: WebSocket.Server
    subscribers:Subscriber[] = []

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))

        // Heartbeats
        setInterval(() => 
            this.subscribers.forEach(subscriber => subscriber.heartbeat()),
            1000
        )
    }
    
    onConnection(ws: WebSocket, req: http.IncomingMessage): void {
        let subscriber = new Subscriber(this, ws)
        this.subscribers.push(subscriber)

        if(! subscriber.isAuthorized(req)) {
            console.log("subscriber not authorized")
            /*return*/ subscriber.dismiss()
        }

        console.log('connected subscriber', this.subscribers.length)
    }
}