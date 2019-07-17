export default class Result {
    statusCode: number
    error: boolean = false
    message: string | null = null
    data: any | null = null

    constructor(data: any | null = null, message: string | null = null, statusCode: number = 200) {
        this.statusCode = statusCode
        this.message = message
        this.data = data
    }
}

export class ErrorResult extends Result {
    constructor(message: string, statusCode: number = 400) {
        super(null, message, statusCode)
        this.error = true
    }
}

export class NotFoundResult extends Result {
    constructor() {
        super(null, 'Not found', 404)
    }
}