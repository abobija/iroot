import express from 'express'
import Broker from './broker'

export default function api(broker: Broker): express.Router {
    let router = express.Router()

    router.get('/dev', (req, res) => {
        res.json({ this_is_hardcoded: true });
    })
    
    return router
}