import express from 'express'
import Broker from "../../model/broker";

export default (broker: Broker): express.Router  => express.Router()
    .get('/devices', (req, res) => {
        res.json(broker.devices)
    })
    .get('/device/:name', (req, res) => {
        res.json(broker.getDeviceByName(req.params.name))
    })