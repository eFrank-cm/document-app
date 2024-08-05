import personsJSON from './../../public/persons.json'
import { Person, PersonId, PersonWithId } from "../types";
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

// ---------------------------------------------- SERIALIZAR ----------------------------------------------
const personsData: PersonWithId[] = personsJSON.map(person => ({
    ...person,
    id: person.id as PersonId
}))

// ---------------------------------------------- STORE ----------------------------------------------
interface State {
    persons: PersonWithId[]
    createPerson: (newPerson: Person) => PersonId,
    getPersonById: (id: PersonId) => PersonWithId | undefined,
}

export const usePersonStore = create<State>()(
    persist(
        (set, get) => ({
            persons: personsData,
            createPerson: (newPerson) => {
                const id: PersonId = `per-${Math.floor(100 + Math.random() * 900)}`
                set({ persons: [...get().persons, { id, ...newPerson }] })
                return id
            },
            getPersonById: (id) => get().persons.find(per => per.id === id)
        })
        , {
            name: '__persons__'
        }
    )
)