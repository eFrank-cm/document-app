import Dexie from 'dexie'

interface FileEntry {
    id: string,
    data: Blob
}

class MyAppDB extends Dexie {
    public files: Dexie.Table<FileEntry, string>

    public constructor() {
        super('MyAppDB')
        this.version(1).stores({
            files: 'id'
        })

        this.files = this.table('files')
    }
}

export const db = new MyAppDB()