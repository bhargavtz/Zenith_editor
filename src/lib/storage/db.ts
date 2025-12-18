import Dexie, { Table } from 'dexie'

export interface Document {
    id: string
    name: string
    content: string
    createdAt: Date
    updatedAt: Date
    pinned: boolean
    tags: string[]
}

export class ZenithDatabase extends Dexie {
    documents!: Table<Document>

    constructor() {
        super('ZenithDatabase')
        this.version(1).stores({
            documents: 'id, name, updatedAt, pinned, *tags'
        })
    }
}

export const db = new ZenithDatabase()
