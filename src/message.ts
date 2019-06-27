export default class Message {
    channel: string
    data: string

    constructor(channel: string, data: string) {
        this.channel = channel
        this.data = data
    }

    static parse(plain: string): Message | null {
        try {
            var json = JSON.parse(plain)

            if(json.channel != null && json.data != null
                && typeof(json.channel) === 'string'
                && typeof(json.data) === 'string') {
                return new Message(json.channel, json.data)
            }
        }
        catch(_) {}

        return null
    }
}