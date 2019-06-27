export default class Message {
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

    static isTypeValid(type: string): boolean {
        return type === 'subscribe' || type === 'publish'
    }

    static parse(plain: string): Message | null {
        try {
            var json = JSON.parse(plain)
            
            if(Message.isTypeValid(json.type) && typeof(json.channel) === 'string') {
                return new Message(json.type, json.channel, json.topic, json.data)
            }
        }
        catch(_) {}

        return null
    }
}