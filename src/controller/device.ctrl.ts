import Broker from "../model/broker";
import http from 'http'
import Device from "../model/device";
import basicAuth from 'basic-auth'

export enum DeviceAuthorizeResult {
    AUTHORIZED,
    INVALID_CREDENTIALS,
    ALREADY_CONNECTED
}

export default class DeviceController {
    private broker: Broker

    constructor(broker: Broker) {
        this.broker = broker
    }

    authorize(device: Device, req: http.IncomingMessage): DeviceAuthorizeResult {
        let credentials = basicAuth(req)

        if(credentials != null) {
            if(this.broker.getDeviceByName(credentials.name)) {
                return DeviceAuthorizeResult.ALREADY_CONNECTED
            }
            
            // TODO: Fetch user from db
            if(['dev32', 'dev32-led'].indexOf(credentials.name) != -1 && credentials.pass === 'test1234') {
                device.name = credentials.name
                return DeviceAuthorizeResult.AUTHORIZED
            }
        }

        return DeviceAuthorizeResult.INVALID_CREDENTIALS
    }
}