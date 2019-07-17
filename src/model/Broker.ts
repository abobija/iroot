import Device from './Device'
import WebSocket from 'ws'
import http from 'http'
import Channel from './Channel'
import Message from './Message'
import DeviceController from '../controller/device.ctrl'
import IRootDatabase from '../db'
import Credentials from './Credentials';
import IRootError from '../helpers/IRootError';

export default class Broker {
    private db: IRootDatabase
    private wss: WebSocket.Server
    private _channels: Channel[]

    private _devices:Device[] = []

    constructor(server: http.Server, db: IRootDatabase) {
        this.db = db

        this._channels = this.db.channels()

        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', (ws, req) => this.onConnection(ws, req))

        // Heartbeats...
        setInterval(() => this._devices.forEach(dev => dev.heartbeat()), 1000)
    }
    
    protected onConnection(ws: WebSocket, req: http.IncomingMessage): void {
        try {
            new DeviceController(this).handleDeviceConnection(ws, req)
        }
        catch(err) {
            console.error(err)
        }
    }

    getChannelByPath(path: String): Channel | null {
        for(let i in this._channels) {
            if(this._channels[i].path === path) {
                return this._channels[i]
            }
        }

        return null
    }

    getChannelById(id: number): Channel | null {
        for(let i in this._channels) {
            if(this._channels[i].id === id) {
                return this._channels[i]
            }
        }

        return null
    }

    addDevice(device: Device): void {
        this._devices.push(device)
        
        console.log(`Device ${device.uuid} added`)
        console.log(`Total devices ${this._devices.length}`)
    }

    removeDevice(device: Device): void {
        this._devices = this._devices.filter(dev => dev !== device)
        
        console.log(`Device ${device.uuid} removed`)
        console.log(`Total devices ${this._devices.length}`)
    }

    getDeviceByName(name: string): Device | null {
        for(let i in this._devices) {
            if(this._devices[i].name === name) {
                return this._devices[i]
            }
        }

        return null
    }
    
    publish(message: Message): number {
        let channel = this.getChannelByPath(message.channel)

        if(channel == null) {
            throw new IRootError(`Channel "${message.channel}" does not exist`)
        }

        return channel.broadcast(message)
    }

    credentials(): Credentials[] {
        return this.db.credentials()
    }

    get mainChannel(): Channel {
        return this.getChannelByPath(IRootDatabase.MainChannelPath)!
    }

    get channels(): Channel[] {
        return this._channels
    }

    get devices(): Device[] {
        return this._devices
    }
}