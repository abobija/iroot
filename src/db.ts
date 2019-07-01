import path from 'path'
import fs from 'fs'
import Channel from './model/channel'
import Credentials from './model/credentials'

enum Files {
    Channels = 'channels',
    Credentials = 'credentials'
}

export default class IRootDatabase {
    static MainChannelPath: string = '/main'
    private path: string 
    
    // Channels can be loaded only once per instance
    // This flag will hold load status
    private channelsLoaded: boolean = false

    constructor(path: string) {
        this.path = path
        
        this.createStructureIfNotExist()
    }

    createStructureIfNotExist(): IRootDatabase {
        if(! fs.existsSync(this.path)) {
            fs.mkdirSync(this.path)
        }

        [Files.Channels, Files.Credentials].forEach(filenameWithoutExtension => {
            let filename = path.join(this.path, `${filenameWithoutExtension}.json`)

            if(! fs.existsSync(filename)) {
                fs.writeFileSync(filename, '[]')
            }
        })

        return this
    }

    channels(): Channel[] {
        if(this.channelsLoaded) {
            throw Error('Channels has been already loaded. They can be loaded only once per DB instance')
        }

        this.channelsLoaded = true

        let result: Channel[] = []

        result.push(new Channel(0, IRootDatabase.MainChannelPath))

        let id = 1
        this.load(Files.Channels).forEach(raw => result.push(new Channel(id++, raw.path)))

        return result
    }

    credentials(): Credentials[] {
        let result: Credentials[] = []

        this.load(Files.Credentials).forEach(raw => result.push(Credentials.fromJSON(raw)))

        return result
    }

    protected load(filenameWithoutExtension: string): any[] {
        return JSON.parse(fs.readFileSync(path.join(this.path, `${filenameWithoutExtension}.json`)).toString())
    }
}