import personsJSON from './../../public/persons.json'
import { Person, PersonId } from "../types";
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

// ---------------------------------------------- SERIALIZAR ----------------------------------------------
const personsData: Person[] = personsJSON.map(person => ({
    ...person,
    id: person.id
}))

// ---------------------------------------------- STORE ----------------------------------------------
interface State {
    persons: Person[]
    createPerson: (newPerson: Person) => string,
    getPersonById: (id: PersonId) => Person | undefined,
}

export const usePersonStore = create<State>()(
    persist(
        (set, get) => ({
            persons: personsData,
            createPerson: (newPerson) => {
                const { id, ...data } = newPerson
                if (id) return ''
                const newId = `${Math.floor(100 + Math.random() * 900)}`
                set({ persons: [...get().persons, { id: newId, ...data }] })
                return newId
            },
            getPersonById: (id) => get().persons.find(per => per.id === id)
        })
        , {
            name: '__persons__'
        }
    )
)