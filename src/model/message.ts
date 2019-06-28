export default class Message {
    static Subscribe: string = 'subscribe'
    static Publish: string = 'publish'

    type: string
    channel: string
    topic?: string
    data?: string

    constructor(type: string, channel: string, topic?: string, data?: string) {
        this.type = type
        this.channel = channel
        this.topic = topic
        this.data = data
    }

    isSubscribe(): boolean {
        return this.type === Message.Subscribe
    }

    isPublish(): boolean {
        return this.type === Message.Publish
    }

    isValid(): boolean {
        return this.isSubscribe() || (this.isPublish() && typeof(this.topic) === 'string')
    }

    static fromJSON(json: string): Message | null {
        try {
            var raw = JSON.parse(json)

            return new Message(raw.type, raw.channel, raw.topic, raw.data)
        }
        catch(_) {}

        return null
    }
}