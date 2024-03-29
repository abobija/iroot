import express from 'express'
import Broker from "../../model/Broker"
import Joi from '@hapi/joi'
import { celebrate } from 'celebrate'
import Result, { NotFoundResult } from '../../helpers/Result'

const deviceParamsValidator = celebrate({ params: { name: Joi.string().min(4).required() } })

export default (broker: Broker): express.Router  => express.Router()
    .get('/devices', (req, res) => {
        res.send(new Result(broker.devices))
    })
    .get('/device/:name', deviceParamsValidator, (req, res) => {
        const dev = broker.getDeviceByName(req.params.name)

        if(dev == null) {
            return res.send(new NotFoundResult())
        }
        
        res.send(new Result(dev))
    })