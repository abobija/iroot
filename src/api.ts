import express from 'express'
import Broker from './broker'

export default function api(broker: Broker): express.Router {
    let router = express.Router()

    router.get('/channels', (req, res) => {
        res.json(broker.getChannels())
    })
    
    return router
}