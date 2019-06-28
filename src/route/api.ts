import express from 'express'
import Broker from '../model/broker'

export default function api(broker: Broker): express.Router {
    return express.Router()
        .get('/channels', (req, res) => {
            res.json(broker.getChannels())
        })
        .get('/subscribers/:channelId', (req, res) => {
            let channel = broker.getChannelById(parseInt(req.params.channelId))

            if(channel == null) {
                res.status(404).end()
            }
            else {
                res.json(channel.getSubscribers())
            }
        })
}