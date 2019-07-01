export default class Credentials {
    uid: string
    pwd: string

    constructor(uid: string, pwd: string) {
        this.uid = uid
        this.pwd = pwd
    }
    
    static fromJSON(json: any): Credentials {
        return new Credentials(json.uid, json.pwd)
    }
}