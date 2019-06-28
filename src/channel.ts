import Subscriber from "./subscriber"
import { jsonIgnore } from 'json-ignore'

export default class Channel {
    id: number
    path: string
    subscribersCount: number = 0
    
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
        subscriber.events.on('dismiss', () => this.unsubscribe(subscriber))

        this.subscribers.push(subscriber)
        this.subscribersCount++
        subscriber.events.emit('subscribed', this)

        return this
    }

    unsubscribe(subscriber: Subscriber): Channel {
        let index = this.subscribers.indexOf(subscriber)

        if(index != -1) {
            this.subscribers.splice(index, 1)
            this.subscribersCount--
            subscriber.events.emit('unsubscribed', this)
        }

        return this
    }

    getSubscribers(): Subscriber[] {
        return this.subscribers
    }
}