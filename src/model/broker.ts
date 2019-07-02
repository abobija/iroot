import Device from './device'
import WebSocket from 'ws'
import http from 'http'
import Channel from './channel'
import Message from './message'
import DeviceController from '../controller/device.ctrl'
import IRootDatabase from '../db'
import Credentials from './credentials';

export default class Broker {
    private db: IRootDatabase
    private wss: WebSocket.Server
    private channels: Channel[]

    private _devices:Device[] = []

    constructor(server: http.Server, db: IRootDatabase) {
        this.db = db

        this.channels = this.db.channels()

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

    getMainChannel(): Channel {
        return this.getChannelByPath(IRootDatabase.MainChannelPath)!
    }

    getChannelByPath(path: String): Channel | null {
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

    getDevices(): Device[] {
        return this._devices
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
            throw Error(`Channel "${message.channel}" does not exist`)
        }

        return channel.broadcast(message)
    }

    credentials(): Credentials[] {
        return this.db.credentials()
    }
}