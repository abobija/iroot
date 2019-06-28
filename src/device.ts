import uuidv4 from 'uuid/v4'
import WebSocket from 'ws'
import events from 'events'
import Message from './message'
import { jsonIgnore } from 'json-ignore';

const lifetimeThreshold = 10 // sec
const lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

export default class Device {
    uuid: string
    username?: string

    @jsonIgnore() private lifetime: number = 0
    @jsonIgnore() private ws: WebSocket
    @jsonIgnore() events: events.EventEmitter = new events.EventEmitter()

    constructor(ws: WebSocket) {
        let self = this
        this.ws = ws
        this.uuid = uuidv4()
        this.refreshLifetime()

        ws.on('pong', () => self.refreshLifetime())

        ws.on('message', data => {
            self.refreshLifetime()
            
            let msg = Message.fromJSON(data.toString())

            if(msg != null && msg.isValid()) {
                this.events.emit('message', msg)
            }
        })
    }

    private refreshLifetime(): void {
        this.lifetime = lifetimeThreshold
    }

    private isAlive(): boolean {
        return this.lifetime >= 0
    }

    dismiss(): void {
        this.events.emit('dismiss')
        return this.ws.terminate()
    }

    heartbeat(): void {
        this.lifetime--

        if(! this.isAlive()) {
            this.dismiss()
            return
        }
        
        if(this.lifetime == lifeTimePingSendSecond) {
            this.ws.ping(() => {})
        }
    }
}