import uuidv4 from 'uuid/v4'
import basicAuth from 'basic-auth'
import Broker from './broker'
import WebSocket from 'ws'
import http from 'http'
import events from 'events'

const lifetimeThreshold = 10 // sec
const lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

export default class Subscriber extends events.EventEmitter {
    uuid: string
    private lifetime: number = 0
    private ws: WebSocket

    constructor(ws: WebSocket) {
        super()

        let self = this
        this.ws = ws
        this.uuid = uuidv4()
        this.refreshLifetime()

        ws.on('pong', () => self.refreshLifetime())

        ws.on('message', msg => {
            self.refreshLifetime()

            console.log('received from subscriber', self.uuid, ':', msg)
            //ws.send(msg)
        })
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
        this.emit('dismiss')
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