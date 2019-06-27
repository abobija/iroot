const uuidv4 = require('uuid/v4')
const basicAuth = require('basic-auth')

const lifetimeThreshold = 10 // sec
const lifeTimePingSendSecond = Math.ceil(lifetimeThreshold / 3)

module.exports = class {
    constructor(broker, ws) {
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

    refreshLifetime() {
        this.lifetime = lifetimeThreshold
    }

    isAlive() {
        return this.lifetime >= 0
    }

    isAuthorized(req) {
        let user = basicAuth(req)

        if(user != null) {
            // TODO: Fetch user from db
            if(user.name === 'dev32' && user.pass === 'test1234') {
                return true
            }
        }

        return false
    }

    dismiss() {
        console.log('subscriber', this.uuid, 'disconnected')
        this.broker.subscribers.delete(this)
        return this.ws.terminate()
    }

    heartbeat() {
        this.lifetime--

        if(! this.isAlive()) {
            return this.dismiss()
        }
        
        if(this.lifetime == lifeTimePingSendSecond) {
            this.ws.ping(() => {})
        }
    }
}