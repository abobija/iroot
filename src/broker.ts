import Device from './device'
import WebSocket from 'ws'
import http from 'http'
import Channel from './channel'
import Message from './message'

export default class Broker {
    private wss: WebSocket.Server
    mainChannel: Channel
    private channels: Channel[] = []

    private _devices:Device[] = []

    constructor(server: http.Server) {
        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))

        this.addChannel(this.mainChannel = new Channel(0, '/main'))

        // Heartbeats...
        setInterval(() => this._devices.forEach(dev => dev.heartbeat()), 1000)
    }
    
    protected onConnection(ws: WebSocket, req: http.IncomingMessage): void {
        let dev = new Device(ws)
        this._devices.push(dev)

        console.log(`device ${dev.uuid} connected`)
        console.log(`total devices ${this._devices.length}`)

        this.mainChannel.subscribe(dev)

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
            this._devices = this._devices.filter(d => d !== dev)

            console.log(`device ${dev.uuid} dismissed`)
            console.log(`total devices ${this._devices.length}`)
        })

        if(! dev.isAuthorized(req)) {
            console.log(`device ${dev.uuid} not authorized`)
            dev.dismiss()
        }
    }

    protected processMessageFromDevice(message: Message, device: Device): void {
        if(message.isSubscribe()) {
            let channel = this.getChannelByPath(message.channel)

            if(channel != null && ! channel.hasSubscriber(device)) {
                channel.subscribe(device)
            }
        } else if(message.isPublish()) {

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
}