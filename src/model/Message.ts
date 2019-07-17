import Joi from '@hapi/joi'

export default class Message {
    static Subscribe: string = 'subscribe'
    static Publish: string = 'publish'

    static Schema: Joi.ObjectSchema = Joi.object({
        type: Joi.string().valid(Message.Subscribe, Message.Publish).required(),
        channel: Joi.string().min(5).max(255).required(),
        topic: Joi.string().min(3).max(50).when('type', { is: Message.Publish, then: Joi.required() }),
        data: Joi.string().max(255).when('type', { is: Message.Publish, then: Joi.required() })
    })

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
        return this.isSubscribe() || (
                this.isPublish() 
                && typeof(this.topic) === 'string'
                && typeof(this.data) === 'string'
            )
    }

    static fromJSON(json: string): Message {
        return Message.fromObject(JSON.parse(json))
    }

    static fromObject(obj: any): Message {
        return new Message(obj.type, obj.channel, obj.topic, obj.data)
    }
}