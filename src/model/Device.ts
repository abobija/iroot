import uuidv4 from 'uuid/v4'
import WebSocket from 'ws'
import events from 'events'
import Message from './Message'
import { jsonIgnore } from 'json-ignore';
import IRootError from '../helpers/IRootError';

const lifetimeThreshold = 10 // sec
const lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

export default class Device {
    uuid: string
    name?: string

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

    send(message: Message): void {
        if(message == null || ! message.isValid()) {
            throw new IRootError('Invalid message')
        }
        
        if(! message.isPublish()) {
            throw new IRootError('Message need to be publish type')
        }

        this.ws.send(JSON.stringify(message))
    }

    private refreshLifetime(): void {
        this.lifetime = lifetimeThreshold
    }

    private isAlive(): boolean {
        return this.lifetime >= 0
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

    dismiss(): void {
        this.events.emit('dismiss')
        return this.ws.terminate()
    }
}