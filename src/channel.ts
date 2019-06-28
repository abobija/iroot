import Device from "./device"
import { jsonIgnore } from 'json-ignore'

export default class Channel {
    id: number
    path: string
    subscribersCount: number = 0
    
    @jsonIgnore()
    private subscribers: Device[] = []

    constructor(id: number, path: string) {
        this.id = id
        this.path = path
    }

    hasSubscriber(device: Device): boolean {
        return this.subscribers.indexOf(device) != -1
    }

    subscribe(device: Device): Channel {
        device.events.on('dismiss', () => this.unsubscribe(device))

        this.subscribers.push(device)
        this.subscribersCount++
        device.events.emit('subscribed', this)

        return this
    }

    unsubscribe(device: Device): Channel {
        let index = this.subscribers.indexOf(device)

        if(index != -1) {
            this.subscribers.splice(index, 1)
            this.subscribersCount--
            device.events.emit('unsubscribed', this)
        }

        return this
    }

    getSubscribers(): Device[] {
        return this.subscribers
    }
}