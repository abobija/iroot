module.exports = function(server) {
    let ws = require('ws')
    let wss = new ws.Server({ server })

    wss.on('connection', ws => {
        console.log('ws client connected');
    
        ws.on('message', msg => {
            console.log('received from ws client: ', msg);
            ws.send(msg);
        });
    });

    return wss
}