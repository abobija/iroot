import express from 'express'
import Broker from './broker'

export default function api(broker: Broker): express.Router {
    return express.Router()
        .get('/channels', (req, res) => {
            res.json(broker.getChannels())
        })
}