const ws = require('ws')

class Broker {
    constructor(server) {
        let self = this
        this.wss = new ws.Server({ server })
        
        this.wss.on('connection', ws => {
            console.log('ws client connected')
            
            ws.isAlive = true
            ws.on('pong', () => ws.isAlive = true)

            ws.on('message', msg => {
                console.log('received from ws client: ', msg)
                ws.send(msg)
            })
        })

        setInterval(() => {
            self.wss.clients.forEach(ws => {
                if(ws.isAlive === false) {
                    console.log('ws client disconnected')
                    return ws.terminate()
                }
                
                ws.isAlive = false
                ws.ping(() => {});
            })
        }, 30000)
    }
}

module.exports = server => new Broker(server)