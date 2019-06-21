const express = require('express')

let api = broker => {
    let route = express.Router()

    route.get('/dev', (req, res) => {
        res.json({ count: broker.wss.clients.size  });
    })

    return route
}

module.exports = broker => api(broker)