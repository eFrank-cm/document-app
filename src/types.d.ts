import { DocumentTypes } from "./constants"

export interface Person {
    name: string,
    paternalSurname: string,
    maternalSurname: string,
    dni: string,
}
export type PersonId = `per-${number}`
export interface PersonWithId extends Person {
    id: PersonId
}

export type DocumentType = keyof typeof DocumentTypes
export interface Document {
    title: string,
    date: Date,
    type: DocumentType,
    urlDoc: string,
    abstract: string,
    keywords: string[],
    peopleInDoc: PersonId[]
}
export interface DocumentWithId extends Document {
    id: string
}

export interface User {
    username: string,
    email: string,
    password: string
    type: 'admin' | 'normal'
}

// export interface Item {
//     id: number,
//     name: string,
//     subject: string, // asuntp
//     createAt: Date // de prueba, el createAt de la primera mark deberia ser
// }

// export interface Track {
//     id: number,
//     type: "original" | "copy",
//     itemId: number
// }

// export interface Mark {
//     id: number,
//     location: string,
//     createAt: Date,
//     isHere: boolean, // de prueba
//     trackId: number
// }

// export interface Instance extends Mark {
//     type: 'original' | 'copy',
// }

// export interface ItemSet extends Item {
//     instances: Instance[]
// }


// export interface Payment {
//     id: string,
//     amount: number,
//     status: "pending" | "processing" | "success" | "failed",
//     email: string
// }
