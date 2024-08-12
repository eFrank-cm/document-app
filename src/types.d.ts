import { DOCUMENT_TYPES } from "./constants"

// -------------------------------------- DOCUMENT ---------------------------------------------
export type DocumentType = keyof typeof DOCUMENT_TYPES
export interface Document {
    id: string,
    createAt: Date,
    name: string,
    subject: string,
    date: Date, // emision date from the document
    location: string,
    filePath: string,
    fileName: string,
    keywords: string[], // separated by '||'
    persons: Person[]
}

// -------------------------------------- PERSON ---------------------------------------------
export type PersonId = `per-${number}`
export interface Person {
    id: string
    name: string,
    paternalSurname: string,
    maternalSurname: string,
    dni: string,
}

// -------------------------------------- USER ---------------------------------------------
export type Role = 'admin' | 'consultor'
export interface User {
    id: string
    email: string
    token: string
    role: Role
}