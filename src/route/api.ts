import express from 'express'
import Broker from '../model/Broker'
import channelsRoute from './api/channels'
import devicesRoute from './api/devices'
import Result from '../helpers/Result'

export default (broker: Broker): express.Router => express.Router()
    .use(channelsRoute(broker))
    .use(devicesRoute(broker))
    .get('/', (_req, res) => {
        res.send(new Result({
            homepage: 'https://github.com/abobija/iroot'
        }))
    })