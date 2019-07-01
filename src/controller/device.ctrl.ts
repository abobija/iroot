import Broker from "../model/broker"
import http from 'http'
import Device from "../model/device"
import basicAuth from 'basic-auth'
import WebSocket from 'ws'
import Message from "../model/message"
import Channel from "../model/channel"

enum DeviceAuthorizeResult {
    AUTHORIZED,
    INVALID_CREDENTIALS,
    ALREADY_CONNECTED
}

export default class DeviceController {
    private broker: Broker

    constructor(broker: Broker) {
        this.broker = broker
    }

    handleDeviceConnection(ws: WebSocket, req: http.IncomingMessage): void {
        let dev = new Device(ws)
        let auth = this.authorize(dev, req)

        if(auth != DeviceAuthorizeResult.AUTHORIZED) {
            if(auth == DeviceAuthorizeResult.ALREADY_CONNECTED) {
                throw Error(`Device with same name has been already connected so they cannot be authorized`)
            }
            else if(auth == DeviceAuthorizeResult.INVALID_CREDENTIALS) {
                throw Error(`Device not authorized. Invalid credentials`)
            }
        }
        
        dev.events.on('message', (msg: Message) => {
            console.log(`Message from device ${dev.uuid}`)
            console.log(msg)

            this.processMessageFromDevice(msg, dev)
        })

        dev.events.on('subscribed', (channel: Channel) => {
            console.log(`Device ${dev.uuid} subscribed to channel ${channel.path}`)
        })

        dev.events.on('unsubscribed', (channel: Channel) => {
            console.log(`Device ${dev.uuid} unsubscribed from channel ${channel.path}`)
        })
        
        dev.events.on('dismiss', () => this.broker.removeDevice(dev))

        this.broker.addDevice(dev)
        this.broker.getMainChannel().subscribe(dev)
    }

    protected authorize(device: Device, req: http.IncomingMessage): DeviceAuthorizeResult {
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

    protected processMessageFromDevice(message: Message, device: Device): void {
        try {
            if(message.isSubscribe()) {
                let channel = this.broker.getChannelByPath(message.channel)

                if(channel != null && ! channel.hasSubscriber(device)) {
                    channel.subscribe(device)
                }
            } else if(message.isPublish()) {
                this.publish(device, message)
            }
        }
        catch(err) {
            console.error(err)
        }
    }

    protected publish(device: Device, message: Message): number {
        let channel = this.broker.getChannelByPath(message.channel)

        if(channel == null) {
            throw Error(`Channel "${message.channel}" does not exist`)
        }

        return channel.subscriberBroadcast(device, message)
    }
}