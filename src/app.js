const app = require('express')();
const appWs = require('express-ws')(app);

app.ws('/', ws => {
    console.log('ws client connected.');

    ws.on('message', msg => {
        console.log('ws received message: ', msg);
        ws.send(msg);
    });
});

app.listen(8080, () => console.log('Server has been started.'));