import express from 'express'
import Broker from '../model/Broker'
import channelsRoute from './api/channels'
import devicesRoute from './api/devices'

export default (broker: Broker): express.Router => express.Router()
    .use(channelsRoute(broker))
    .use(devicesRoute(broker))