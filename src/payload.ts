export default class Payload {
    action: string 
    channel: string
    data?: string

    constructor(action: string, channel: string, data?: string) {
        this.action = action
        this.channel = channel
        this.data = data
    }

    static isValidAction(action: string): boolean {
        return action === 'subscribe' || action === 'publish'
    }

    static parse(plain: string): Payload | null {
        try {
            var json = JSON.parse(plain)
            
            if(Payload.isValidAction(json.action) && typeof(json.channel) === 'string') {
                return new Payload(json.action, json.channel, json.data)
            }
        }
        catch(_) {}

        return null
    }
}