import express from 'express'
import Broker from '../model/broker'
import channelsRoute from './api/channels'

export default (broker: Broker): express.Router => express.Router()
    .use(channelsRoute(broker))