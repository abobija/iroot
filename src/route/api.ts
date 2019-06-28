import express from 'express'
import Broker from '../model/broker'
import channelRoute from './api/channel'

export default (broker: Broker): express.Router => express.Router()
    .use(channelRoute(broker))