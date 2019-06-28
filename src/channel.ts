import Subscriber from "./subscriber"
import { jsonIgnore } from 'json-ignore'

export default class Channel {
    id: number
    path: string
    
    @jsonIgnore()
    private subscribers: Subscriber[] = []

    constructor(id: number, path: string) {
        this.id = id
        this.path = path
    }

    hasSubscriber(subscriber: Subscriber): boolean {
        return this.subscribers.indexOf(subscriber) != -1
    }

    subscribe(subscriber: Subscriber): Channel {
        subscriber.on('dismiss', () => this.unsubscribe(subscriber))
        this.subscribers.push(subscriber)

        subscriber.emit('subscribed', this)

        return this
    }

    unsubscribe(subscriber: Subscriber): Channel {
        this.subscribers = this.subscribers.filter(s => s !== subscriber)
        
        subscriber.emit('unsubscribed', this)

        return this
    }

    getSubscribers(): Subscriber[] {
        return this.subscribers
    }
}