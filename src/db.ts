import path from 'path'
import fs from 'fs'
import Channel from './model/channel';

export default class IRootDatabase {
    private path: string 
    
    constructor(path: string) {
        this.path = path
        
        this.createStructureIfNotExist()
    }

    createStructureIfNotExist(): IRootDatabase {
        if(! fs.existsSync(this.path)) {
            fs.mkdirSync(this.path)
        }

        ['channels'].forEach(filenameWithoutExtension => {
            let filename = path.join(this.path, `${filenameWithoutExtension}.json`)

            if(! fs.existsSync(filename)) {
                fs.writeFileSync(filename, '[]')
            }
        })

        return this
    }

    loadChannels() {
        let result: Channel[] = []

        let id = 1
        this.load('channels').forEach(raw => result.push(new Channel(id++, raw.path)))

        return result
    }

    protected load(filenameWithoutExtension: string): any[] {
        return JSON.parse(fs.readFileSync(path.join(this.path, `${filenameWithoutExtension}.json`)).toString())
    }
}