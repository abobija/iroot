import Subscriber from './subscriber'
import WebSocket from 'ws'
import http from 'http'
import Channel from './channel';
import Payload from './payload';

export default class Broker {
    private wss: WebSocket.Server
    mainChannel: Channel
    private channels: Channel[]

    private _subscribers:Subscriber[] = []

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))

        this.mainChannel = new Channel('/main')
        this.channels = [ this.mainChannel ]

        this.heartbeats()
    }
    
    protected onConnection(ws: WebSocket, req: http.IncomingMessage): void {
        let subscriber = new Subscriber(ws)
        this._subscribers.push(subscriber)

        console.log(`subscriber ${subscriber.uuid} connected`)
        console.log(`total subscribers ${this._subscribers.length}`)

        this.mainChannel.subscribe(subscriber)

        subscriber.on('payload', (pl: Payload) => {
            console.log(`payload from subscriber ${subscriber.uuid}`)
            console.log(pl)
        })

        subscriber.on('dismiss', () => {
            this._subscribers = this._subscribers.filter(s => s !== subscriber)

            console.log(`subscriber ${subscriber.uuid} dismissed`)
            console.log(`total subscribers ${this._subscribers.length}`)
        })

        if(! subscriber.isAuthorized(req)) {
            console.log(`subscriber ${subscriber.uuid} not authorized`)
            subscriber.dismiss()
        }
    }

    getChannelByPath(path: String): Channel | null {
        for(let i in this.channels) {
            if(this.channels[i].path === path) {
                return this.channels[i]
            }
        }

        return null
    }

    private heartbeats(): void {
        setInterval(
            () => this._subscribers.forEach(subscriber => subscriber.heartbeat()),
            1000
        )
    }
}