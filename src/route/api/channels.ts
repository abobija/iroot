import express from 'express'
import Broker from "../../model/Broker"
import Message from '../../model/Message'
import Result, { NotFoundResult } from '../../helpers/Result'
import Joi from '@hapi/joi'
import { celebrate } from 'celebrate'
import IRootError from '../../helpers/IRootError';

const channelParamsValidator = celebrate({ params: { id: Joi.number().integer().min(0) } })

export default (broker: Broker): express.Router  => express.Router()
    .get('/channels', (req, res) => {
        res.send(new Result(broker.channels))
    })
    .get('/channel/:id', channelParamsValidator, (req, res) => {
        const channel = broker.getChannelById(parseInt(req.params.id))

        if(channel == null) {
            return res.send(new NotFoundResult())
        }

        res.send(new Result(channel))
    })
    .get('/channel/:id/subscribers', channelParamsValidator, (req, res) => {
        const channel = broker.getChannelById(parseInt(req.params.id))

        if(channel == null) {
            throw new IRootError(`Channel ${req.params.id} does not exist`, 404)
        }
        
        res.send(new Result(channel.getSubscribers()))
    })
    .post('/channel/publish', celebrate({ body: Message.Schema }), (req, res) => { 
        const count = broker.publish(Message.fromObject(req.body))
        
        res.send(new Result(count))
    })