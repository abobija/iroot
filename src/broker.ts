import Subscriber from './subscriber'
import WebSocket from 'ws'
import http from 'http'
import Channel from './channel';

export default class Broker {
    private wss: WebSocket.Server
    mainChannel:Channel = new Channel('/main')
    private channels:Channel[] = [ this.mainChannel ]

    private _subscribers:Subscriber[] = []

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))

        this.heartbeats()
    }
    
    onConnection(ws: WebSocket, req: http.IncomingMessage): void {
        let subscriber = new Subscriber(ws)
        this._subscribers.push(subscriber)

        console.log(`subscriber ${subscriber.uuid} connected`)
        console.log(`total subscribers ${this._subscribers.length}`)

        this.mainChannel.subscribe(subscriber)

        subscriber.on('dismiss', () => {
            this._subscribers = this._subscribers.filter(s => s !== subscriber)
            this.unsubscribeFromAllChannels(subscriber)

            console.log(`subscriber ${subscriber.uuid} dismissed`)
            console.log(`total subscribers ${this._subscribers.length}`)
        })

        if(! subscriber.isAuthorized(req)) {
            console.log(`subscriber ${subscriber.uuid} not authorized`)
            subscriber.dismiss()
        }
    }

    unsubscribeFromAllChannels(subscriber: Subscriber): void {
        this.channels.forEach(channel => channel.unsubscribe(subscriber))
    }

    heartbeats(): void {
        setInterval(
            () => this._subscribers.forEach(subscriber => subscriber.heartbeat()),
            1000
        )
    }
}