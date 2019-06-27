import Subscriber from "./subscriber"

export default class Channel {
    path: string
    private subscribers: Subscriber[] = []

    constructor(path: string) {
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
        
        return this
    }
}