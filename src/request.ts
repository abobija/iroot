export default class Request {
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

    static parse(plain: string): Request | null {
        try {
            var json = JSON.parse(plain)
            
            if(Request.isValidAction(json.action) && typeof(json.channel) === 'string') {
                return new Request(json.action, json.channel, json.data)
            }
        }
        catch(_) {}

        return null
    }
}