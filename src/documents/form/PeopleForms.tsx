import { X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { PersonCard } from "../../components/personCard"
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import { Person } from "../../types"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { addDocumentToPersonById, fetchPersons, fetchPersonsByDocument, pushPerson } from "../../services/services"


const emptyPersonData: Person = {
    id: '',
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    dni: ''
}

interface PeopleFormsProps {
    documentId: string
}

export const PeopleForms: FC<PeopleFormsProps> = ({ documentId }) => {
    const [allPersons, setAllPersons] = useState<Person[]>([])
    const [personsInDoc, setPersonsInDoc] = useState<Person[]>([])
    const [personsFiltered, setPersonsFiltered] = useState<Person[]>([])
    const [personfields, setPersonFields] = useState<Person>(emptyPersonData)
    const [searchPerson, setSearchPerson] = useState('')

    useEffect(() => {
        fetchPersons()
            .then(data => {
                if (data) {
                    setAllPersons(data)
                }
            })
            .catch(err => console.log(err))


        fetchPersonsByDocument(documentId)
            .then(data => {
                if (data) {
                    setPersonsInDoc(data)
                }
            })
            .catch(err => console.log(err))
    }, [])

    function searchingPerson(event: ChangeEvent<HTMLInputElement>) {
        const { value } = event.target
        setSearchPerson(value)
        if (value === '') setPersonsFiltered([])
        else {
            const newArray = allPersons.filter(person => {
                if (!person) return
                const { name, paternalSurname, maternalSurname, dni } = person
                const allData = `${name} ${paternalSurname} ${maternalSurname} ${dni}`
                return allData.toLocaleLowerCase().includes(value)
            })
            setPersonsFiltered(newArray)
        }
    }

    function submitPersonForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // crear
        pushPerson(personfields)
            .then(res => {
                addPerson(res)
            })
            .catch(err => console.log(err))
        setPersonFields(emptyPersonData)
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target
        setPersonFields(prev => ({
            ...prev,
            [id]: value
        }))
    }

    function addPerson(person: Person) {
        addDocumentToPersonById(person.id, documentId)
            .then()
            .catch(err => console.log(err))

        setPersonsInDoc(prev => [...prev, person])
        setSearchPerson('')
        setPersonsFiltered([])
    }

    function delPersonId(person: Person) {
        addDocumentToPersonById(person.id, null)
            .then()
            .catch(err => console.log(err))

        setPersonsInDoc(prev => prev.filter(per => per.id !== person.id))
    }

    function isPersonInDoc(person: Person) {
        return personsInDoc.some(per => per.id === person.id)
    }

    return (
        <div>
            <div className="relative">
                <label className="font-semibold text-sm">Participantes</label>

                <div className={`absolute w-12/12 min-w-96 bottom-12 -left-0 bg-black rounded flex flex-col gap-1 ${personsFiltered.length !== 0 ? 'border' : ''}`}>
                    {
                        personsFiltered.map(person => (
                            person && !isPersonInDoc(person) && (
                                <div
                                    key={person.id}
                                    className="flex gap-1 justify-between text-sm hover:cursor-pointer hover:bg-accent p-2"
                                    onClick={() => addPerson(person)}
                                >
                                    <p>{`${person.name} ${person.paternalSurname} ${person.maternalSurname}`}</p>
                                    <span>{person.dni}</span>
                                </div>
                            )
                        ))
                    }
                </div>

                <div className="flex gap-3 items-center">
                    <div className="w-full">
                        <Input
                            value={searchPerson}
                            className='disabled:cursor-default my-1'
                            onChange={searchingPerson}
                        />
                        <Button className="hidden" type='submit'>Enviar</Button>
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button>Nuevo</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Nueva Persona</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Añada una nueva persona si no esta en el buscador
                                    </p>
                                </div>
                                <form className="grid gap-2" onSubmit={submitPersonForm}>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <label>Nombres</label>
                                        <Input
                                            id="name"
                                            value={personfields.name}
                                            className="col-span-2 h-8"
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <label>Ap. Paterno</label>
                                        <Input
                                            id="paternalSurname"
                                            value={personfields.paternalSurname}
                                            className="col-span-2 h-8"
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <label>Ap. Materno</label>
                                        <Input
                                            id="maternalSurname"
                                            value={personfields.maternalSurname}
                                            className="col-span-2 h-8"
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <label>DNI</label>
                                        <Input
                                            id="dni"
                                            value={personfields.dni}
                                            className="col-span-2 h-8"
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </div>
                                    <Button type='submit'>Guardar y Añadir</Button>
                                </form>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>

            <p className="my-3 ml-1 text-sm text-muted-foreground">Los participantes son personas mencionadas en el documento. Puede ser el autor, remitente o el destinatario.</p>

            <div className="flex flex-wrap gap-2 mt-5">
                {personsInDoc.map((person, index) => (
                    person &&
                    <div key={index} className="relative">
                        <X
                            className="w-4 h-4 absolute right-0 mt-1 mr-1 hover:cursor-pointer"
                            onClick={() => delPersonId(person)}
                        />
                        {person && <PersonCard className="border pr-10" person={person} />}
                    </div>
                )
                )}
            </div>

        </div>
    )
}
