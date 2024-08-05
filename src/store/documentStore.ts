import { create } from "zustand";
import { persist, PersistStorage } from 'zustand/middleware'
import { Document, DocumentWithId } from "../types";
import documentsJSON from './../../public/documents.json'
import { PersonId, DocumentType } from "../types"

// ---------------------------------------------- SERIALIZAR ----------------------------------------------
const documentsData: DocumentWithId[] = documentsJSON.map(document => ({
    ...document,
    date: new Date(document.date),
    type: document.type as DocumentType,
    peopleInDoc: document.peopleInDoc as PersonId[]
}))

// ---------------------------------------------- STORE ----------------------------------------------
const customStore: PersistStorage<State> = {
    getItem: (name: string) => {
        const storedValue = localStorage.getItem(name)
        if (!storedValue) return null
        const parsedValue = JSON.parse(storedValue)
        parsedValue.state.documents.forEach((document: any) => {
            document.date = new Date(document.date)
        })
        return parsedValue
    },
    setItem: (name: string, value: any) => {
        localStorage.setItem(name, JSON.stringify(value))
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name)
    }
}

interface State {
    documents: DocumentWithId[],
    getDocumentById: (id: string) => DocumentWithId | undefined,
    editDocumentById: (id: string, data: Document) => void,
    createDocument: (newDocument: Document) => string
}

export const useDocumentStore = create<State>()(
    persist(
        (set, get) => ({
            documents: documentsData,

            createDocument: (newDocument) => {
                const id = String(Math.floor(Math.random() * 100))
                set({ documents: [...get().documents, { id, ...newDocument }] })
                return id
            },

            editDocumentById: (id, data) => set({
                documents: get().documents.map(document => {
                    if (document.id !== id) return document
                    return {
                        ...document,
                        ...data
                    }
                })
            }),

            getDocumentById: (id) => get().documents.find(doc => doc.id === id)
        })
        , {
            name: "___documents__",
            storage: customStore
        }
    )
)