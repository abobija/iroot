import Device from './device'
import WebSocket from 'ws'
import http from 'http'
import Channel from './channel'
import Message from './message'
import DeviceController, { DeviceAuthorizeResult } from '../controller/device.ctrl';

export default class Broker {
    private wss: WebSocket.Server
    mainChannel: Channel
    private channels: Channel[] = []

    private _devices:Device[] = []

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))

        // All devices will be automatically subscribed to main channel
        this.addChannel(this.mainChannel = new Channel(0, '/main'))

        // Heartbeats...
        setInterval(() => this._devices.forEach(dev => dev.heartbeat()), 1000)
    }
    
    protected onConnection(ws: WebSocket, req: http.IncomingMessage): void {
        let dev = new Device(ws)
        this.addDevice(dev)

        console.log(`device ${dev.uuid} connected`)

        dev.events.on('message', (msg: Message) => {
            console.log(`message from device ${dev.uuid}`)
            console.log(msg)

            this.processMessageFromDevice(msg, dev)
        })

        dev.events.on('subscribed', (channel: Channel) => {
            console.log(`device ${dev.uuid} subscribed to channel ${channel.path}`)
        })

        dev.events.on('unsubscribed', (channel: Channel) => {
            console.log(`device ${dev.uuid} unsubscribed from channel ${channel.path}`)
        })
        
        dev.events.on('dismiss', () => {
            this.removeDevice(dev)

            console.log(`device ${dev.uuid} dismissed`)
            console.log(`total devices ${this._devices.length}`)
        })

        let auth = new DeviceController(this).authorize(dev, req)

        if(auth != DeviceAuthorizeResult.AUTHORIZED) {
            if(auth == DeviceAuthorizeResult.ALREADY_CONNECTED) {
                console.log(`device with same name has been already connected so they cannot be authorized`)
            }
            else if(auth == DeviceAuthorizeResult.INVALID_CREDENTIALS) {
                console.log(`device not authorized. invalid credentials`)
            }

            dev.dismiss()
        }
        else {
            this.mainChannel.subscribe(dev)
            console.log(`total devices ${this._devices.length}`)
        }
    }

    protected processMessageFromDevice(message: Message, device: Device): void {
        try {
            if(message.isSubscribe()) {
                let channel = this.getChannelByPath(message.channel)
    
                if(channel != null && ! channel.hasSubscriber(device)) {
                    channel.subscribe(device)
                }
            } else if(message.isPublish()) {
                this.publishMessageFromDevice(device, message)
            }
        }
        catch(err) {
            console.error(err)
        }
    }

    protected getChannelByPath(path: String): Channel | null {
        for(let i in this.channels) {
            if(this.channels[i].path === path) {
                return this.channels[i]
            }
        }

        return null
    }

    getChannels(): Channel[] {
        return this.channels
    }

    getChannelById(id: number): Channel | null {
        for(let i in this.channels) {
            if(this.channels[i].id === id) {
                return this.channels[i]
            }
        }

        return null
    }

    addChannel(channel: Channel): Broker {
        this.channels.push(channel)
        return this
    }

    getDevices(): Device[] {
        return this._devices
    }

    private addDevice(device: Device): void {
        this._devices.push(device)
    }

    private removeDevice(device: Device): void {
        this._devices = this._devices.filter(dev => dev !== device)
    }

    getDeviceByName(name: string): Device | null {
        for(let i in this._devices) {
            if(this._devices[i].name === name) {
                return this._devices[i]
            }
        }

        return null
    }
    
    publishMessage(message: Message): number {
        let channel = this.getChannelByPath(message.channel)

        if(channel == null) {
            throw Error(`Channel "${message.channel}" does not exist`)
        }

        return channel.broadcast(message)
    }

    publishMessageFromDevice(device: Device, message: Message): number {
        let channel = this.getChannelByPath(message.channel)

        if(channel == null) {
            throw Error(`Channel "${message.channel}" does not exist`)
        }

        return channel.subscriberBroadcast(device, message)
    }
}