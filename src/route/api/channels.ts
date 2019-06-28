import express from 'express'
import Broker from "../../model/broker";

export default (broker: Broker): express.Router  => express.Router()
    .get('/channels', (req, res) => {
        res.json(broker.getChannels())
    })
    .get('/channel/:id', (req, res) => {
        res.json(broker.getChannelById(parseInt(req.params.id)))
    })
    .get('/channel/:id/subscribers', (req, res) => {
        let channel = broker.getChannelById(parseInt(req.params.id))

        if(channel == null) {
            res.status(404).end()
        }
        else {
            res.json(channel.getSubscribers())
        }
    })