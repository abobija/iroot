import Subscriber from "./subscriber";

export default class Channel {
    path: string
    private subscribers: Subscriber[] = []

    constructor(path: string) {
        this.path = path
    }

    subscribe(subscriber: Subscriber): Channel {
        subscriber.on('dismiss', () => this.unsubscribe(subscriber))
        this.subscribers.push(subscriber)

        return this
    }

    unsubscribe(subscriber: Subscriber): Channel {
        this.subscribers = this.subscribers.filter(s => s !== subscriber)
        
        return this
    }
}