import express from 'express'
import Broker from "../../model/broker";

export default (broker: Broker): express.Router  => express.Router()
    .get('/channels', (req, res) => {
        res.json(broker.getChannels())
    })
    .get('/channel/:channelId', (req, res) => {
        let channel = broker.getChannelById(parseInt(req.params.channelId))

        if(channel == null) {
            res.status(404).end()
        }
        else {
            res.json(channel)
        }
    })
    .get('/channel/:channelId/subscribers', (req, res) => {
        let channel = broker.getChannelById(parseInt(req.params.channelId))

        if(channel == null) {
            res.status(404).end()
        }
        else {
            res.json(channel.getSubscribers())
        }
    })