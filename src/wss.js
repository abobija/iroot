module.exports = function(server) {
    let ws = require('ws')
    let wss = new ws.Server({ server })

    wss.on('connection', ws => {
        console.log('ws client connected')

        ws.isAlive = true
        ws.on('pong', () => ws.isAlive = true)
    
        ws.on('message', msg => {
            console.log('received from ws client: ', msg)
            ws.send(msg)
        })
    })

    setInterval(() => {
        wss.clients.forEach(ws => {
            if(ws.isAlive === false) {
                console.log('ws client disconnected')
                return ws.terminate()
            }
            
            ws.isAlive = false
            ws.ping(() => {});
        })
    }, 30000)

    return wss
}