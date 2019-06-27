import uuidv4 from 'uuid/v4'
import basicAuth from 'basic-auth'
import Broker from './broker'
import WebSocket from 'ws'
import http from 'http'

const lifetimeThreshold = 10 // sec
const lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

export default class Subscriber {
    private lifetime: number = 0
    private broker: Broker
    private ws: WebSocket
    uuid: string

    constructor(broker: Broker, ws: WebSocket) {
        let self = this
        this.broker = broker
        this.ws = ws
        this.uuid = uuidv4()
        this.refreshLifetime()

        ws.on('pong', () => self.refreshLifetime())

        ws.on('message', msg => {
            self.refreshLifetime()

            console.log('received from subscriber', self.uuid, ':', msg)
            //ws.send(msg)
        })

        console.log('subscriber', this.uuid, 'connected')
    }

    refreshLifetime(): void {
        this.lifetime = lifetimeThreshold
    }

    isAlive(): boolean {
        return this.lifetime >= 0
    }

    isAuthorized(req: http.IncomingMessage): boolean {
        let user = basicAuth(req)

        if(user != null) {
            // TODO: Fetch user from db
            if(user.name === 'dev32' && user.pass === 'test1234') {
                return true
            }
        }

        return false
    }

    dismiss(): void {
        console.log('subscriber', this.uuid, 'disconnected')
        this.broker.subscribers = this.broker.subscribers.filter(obj => obj !== this);
        return this.ws.terminate()
    }

    heartbeat(): void {
        this.lifetime--

        if(! this.isAlive()) {
            return this.dismiss()
        }
        
        if(this.lifetime == lifeTimePingSendSecond) {
            this.ws.ping(() => {})
        }
    }
}