import { ArrowUp, ChevronLeft, FileText, Maximize, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { DocumentWithId, PersonId, PersonWithId } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { SelectDate } from "../components/ui/select-date";
import { SelectReady, SelectReadyElement } from "../components/ui/select-ready";
import { DocumentTypes } from "../constants";
import { Badge } from "../components/ui/badge";
import { PersonCard } from "./personCard";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { usePersonStore } from "../store/personStore";
import { useDocumentStore } from "../store/documentStore";
import { toast } from "../components/ui/use-toast";
import { getFileFromDexie, saveFileToDexie } from "../services/fileService";

interface DocumentFormProps {
    document?: DocumentWithId
}

const emptyDocumentData: DocumentWithId = {
    id: '',
    title: '',
    date: new Date(),
    type: 'acta',
    urlDoc: '',
    peopleInDoc: [],
    keywords: [],
    abstract: ''
}

const emptyPersonData: PersonWithId = {
    id: 'per--1',
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    dni: ''
}

export const DocumentForm: FC<DocumentFormProps> = ({ document }) => {
    const initialState = document ? { ...document } : emptyDocumentData
    const [documentData, setDocumentData] = useState<DocumentWithId>(initialState)
    const [isEdit, setIsEdit] = useState(document ? false : true)
    const editDocumentById = useDocumentStore(st => st.editDocumentById)
    const createDocument = useDocumentStore(st => st.createDocument)
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()
    const backurl = '/documents'

    const initialStatep = emptyPersonData
    const [personData, setPersonData] = useState<PersonWithId>(initialStatep)
    const persons = usePersonStore(st => st.persons)
    const createPerson = usePersonStore(st => st.createPerson)
    const getPersonById = usePersonStore(st => st.getPersonById)
    const [searchPerson, setSearchPerson] = useState('')
    const [personsFiltered, setPersonsFiltered] = useState<PersonWithId[]>([])

    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState('No se selecciono ningun archivo')

    function backProducts() {
        document
            ? isEdit
                ? confirm('Seguro que desea cancelar la edicion?') && navigate(backurl)
                : navigate(backurl)
            : confirm('Seguro que desea cancelar la creacion?') && navigate(backurl)
    }

    function toggleEditFields() {
        if (isEdit) {
            if (confirm('Seguro que desea cancelar la edicion?')) {
                setDocumentData(initialState)
                setIsEdit(false)
            }
        }
        else {
            setIsEdit(true)
        }
    }

    function handleOnChangeP(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = event.target
        setPersonData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    function handleOnSubmitP(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // create a new person
        const { id, ...newPerson } = personData
        const newId = createPerson(newPerson)

        // add person in document
        addPersonId(newId)

        setPersonData(initialStatep)
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = event.target
        if (id === 'keyword')
            setKeyword(value)

        else if (id === 'searchPerson') {
            if (value !== '') {
                const filtered = persons.filter(person => {
                    if (!person) return
                    const { name, paternalSurname, maternalSurname, dni } = person
                    const allData = `${name} ${paternalSurname} ${maternalSurname} ${dni}`
                    return allData.toLocaleLowerCase().includes(value)
                })
                setPersonsFiltered(filtered)
            }
            else
                setPersonsFiltered([])
            setSearchPerson(value)
        }

        else {
            setDocumentData(prev => ({
                ...prev,
                [id]: value
            }))
        }
    }

    function handleOnSelectDate(ndate: Date | undefined) {
        if (!ndate) return
        setDocumentData(prev => ({
            ...prev,
            date: ndate
        }))
    }

    function handleOnSelect(event: SelectReadyElement) {
        const { id, value } = event
        setDocumentData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const { id, ...newDocumentData } = documentData
        if (document) {
            editDocumentById(id, newDocumentData)
            toast({ title: "Se edito el documento correctamente." })
        }
        else {
            const newId = createDocument(newDocumentData)
            console.log(newId)
            navigate(`/document/${newId}`)
            toast({ title: "Se creo correctamente." })
        }
        setIsEdit(false)
    }

    function addKeyword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const newArray = documentData.keywords
        newArray.push(keyword)
        const newDocumentData: DocumentWithId = { ...documentData, keywords: newArray }
        setDocumentData(newDocumentData)
        const { id, ...data } = newDocumentData
        editDocumentById(id, data)
        setKeyword('')
    }

    function delKeyword(keyword: string) {
        const newArray = documentData.keywords.filter(str => str !== keyword)
        const newDocumentData: DocumentWithId = { ...documentData, keywords: newArray }
        setDocumentData(newDocumentData)
        const { id, ...data } = newDocumentData
        editDocumentById(id, data)
    }

    function addPersonId(personId: PersonId) {
        const newArray = documentData.peopleInDoc
        newArray.push(personId)
        const newDocumentData: DocumentWithId = { ...documentData, peopleInDoc: newArray }
        setDocumentData(newDocumentData)
        const { id, ...data } = newDocumentData
        editDocumentById(id, data)
        setKeyword('')

        setPersonsFiltered([])
        setSearchPerson('')
    }

    function delPersonId(personId: PersonId) {
        const newArray = documentData.peopleInDoc.filter(str => str !== personId)
        const newDocumentData: DocumentWithId = { ...documentData, peopleInDoc: newArray }
        setDocumentData(newDocumentData)
        const { id, ...data } = newDocumentData
        editDocumentById(id, data)
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null

        if (selectedFile) {
            let fileId = ''
            const nameFile = selectedFile.name.split('.')[0]
            const fileURL = URL.createObjectURL(selectedFile)
            const newDocumentData: DocumentWithId = { ...documentData, title: nameFile, urlDoc: fileURL }

            if (document) {
                fileId = document.id
                editDocumentById(fileId, newDocumentData)
            }
            else {
                const { id, ...document } = newDocumentData
                fileId = createDocument(document)
                console.log(newDocumentData)
                navigate(`/document/${fileId}`)
                toast({ title: "Se creo un nuevo producto." })
            }

            await saveFileToDexie(fileId, selectedFile)
            console.log(fileURL)
            setPreview(fileURL)
            setFileName(selectedFile.name)
            setDocumentData(newDocumentData)

        }
        else
            setFileName('No se selecciono ningun archivo')
    }

    useEffect(() => {
        const loadFile = async () => {
            const fileBlob = await getFileFromDexie(document ? document.id : '')
            if (fileBlob) {
                const fileURL = URL.createObjectURL(fileBlob)
                console.log(fileURL)
                setPreview(fileURL)
                setFileName(fileName)
            }
        }

        loadFile()
    }, [documentData.id])

    return (
        <section className='mx-auto my-5'>

            <nav className="flex justify-between items-center gap-4 mb-1">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" type='button' onClick={backProducts} >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>

                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {documentData.title}
                    </h1>
                </div>


                <div>
                    <Button variant='link' size='sm' type='button'>
                        <Maximize className="w-5 h-5 mr-1" />
                        {preview && <Link to={preview} target='_blank'>Ver PDF</Link>}
                    </Button>
                </div>

            </nav>

            <div className="grid grid-cols-2 gap-3">
                <div className="w-full mx-auto">
                    {preview && (
                        <iframe
                            src={preview}
                            title="Vista previa PDF"
                            className="w-full h-[530px] rounded-sm"
                        ></iframe>
                    )}
                </div>

                <div className="grid grid-cols-2 w-full">
                    <section className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <form onSubmit={handleOnSubmit}>
                            <Card x-chunk="dashboard-07-chunk-0">
                                <CardHeader>
                                    <CardTitle className="flex justify-between">
                                        Document Details
                                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                                            {isEdit
                                                ? (
                                                    <>
                                                        <Button variant="outline" size="sm" type='button' onClick={document ? toggleEditFields : backProducts}>
                                                            Discard
                                                        </Button>
                                                        <Button size="sm" type='submit'>
                                                            Save Product
                                                        </Button>
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        <Button variant='ghost' size="sm" type='button' onClick={toggleEditFields}>
                                                            Edit
                                                        </Button>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-7">
                                    <div>
                                        <label>Title</label>
                                        <div className="flex justify-between items-center">
                                            <Input
                                                id="title"
                                                value={documentData.title}
                                                className='disabled:cursor-default my-1'
                                                disabled={!isEdit}
                                                onChange={handleOnChange}
                                            />

                                        </div>
                                        {
                                            isEdit && (

                                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                                                    <Input
                                                        id="file-input"
                                                        type='file'
                                                        accept='application/pdf'
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    />


                                                    <label htmlFor="file-input" className='cursor-pointer flex gap-1'>
                                                        <FileText /> {`${documentData.title}.pdf`}
                                                    </label>
                                                    <p className="text-muted-foreground flex items-center">
                                                        Click <ArrowUp className="w-4 h-4 mx-1" /> para actualizar el archivo PDF
                                                    </p>
                                                </div>
                                            )
                                        }

                                    </div>

                                    <div>
                                        <label>Abstract</label>
                                        <Textarea
                                            id='abstract'
                                            value={documentData.abstract}
                                            className="min-h-20 disabled:cursor-default my-1"
                                            disabled={!isEdit}
                                            onChange={handleOnChange}
                                        />
                                    </div>

                                    <div className="flex justify-between">

                                        <div className="w-5/12">
                                            <label>Fecha de Expiracion</label>
                                            <SelectDate
                                                className="w-full my-1"
                                                date={documentData.date}
                                                disabled={!isEdit}
                                                disabledFutureDates={false}
                                                OnSelectDate={handleOnSelectDate}
                                            />
                                        </div>

                                        <div className="w-5/12">
                                            <label>Type</label>
                                            <SelectReady
                                                className="w-full my-1"
                                                id='type'
                                                value={documentData.type}
                                                onValueChange={handleOnSelect}
                                                disabled={!isEdit}
                                                options={Object.entries(DocumentTypes).map(([key, value]) => ({ value: key, label: value }))}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </section>


                    <section className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 mt-4">
                        <Card x-chunk="dashboard-07-chunk-0">
                            <CardHeader>
                                <CardTitle>
                                    To Search
                                </CardTitle>
                                <CardDescription>
                                    Add some features that help you to find this document
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-7">
                                <div>
                                    <form onSubmit={addKeyword}>
                                        <label className="font-semibold">Keywords</label>
                                        <Input
                                            id="keyword"
                                            value={keyword}
                                            className='disabled:cursor-default my-1 w-9/12'
                                            onChange={handleOnChange}
                                            placeholder="add keyword"
                                        />
                                        <button type='submit' className="hidden" />
                                    </form>

                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {documentData.keywords.map((keyword, index) => (
                                            <Badge key={index} className="flex items-center justify-between" variant='outline'>
                                                {keyword}
                                                <X
                                                    className="ml-1 w-4 h-4 hover:cursor-pointer min-w-4 min-h-4"
                                                    onClick={() => delKeyword(keyword)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <label className="font-semibold">Persons in Document</label>

                                        <div className={`absolute w-12/12 bottom-12 -left-1 bg-black rounded flex flex-col gap-1 ${personsFiltered.length !== 0 ? 'border' : ''}`}>
                                            {
                                                personsFiltered.map(person => (
                                                    <div key={person.id}>
                                                        {
                                                            person && (
                                                                <div className="flex gap-1 justify-between text-sm hover:cursor-pointer hover:bg-slate-500 p-2" onClick={() => addPersonId(person.id)}>
                                                                    <p>{`${person.name} ${person.paternalSurname} ${person.maternalSurname}`}</p>
                                                                    <span>{person.dni}</span>
                                                                </div>
                                                            )

                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <div className="flex gap-3 items-center">
                                            <Input
                                                id="searchPerson"
                                                value={searchPerson}
                                                className='disabled:cursor-default my-1 w-10/12'
                                                placeholder="type to search"
                                                onChange={handleOnChange}
                                            />
                                            <button hidden type='submit' />

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline">New</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-96">
                                                    <div className="grid gap-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium leading-none">Nueva Persona</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                añada una nueva persona si no esta en el buscador
                                                            </p>
                                                        </div>
                                                        <form className="grid gap-2" onSubmit={handleOnSubmitP}>
                                                            <div className="grid grid-cols-3 items-center gap-4">
                                                                <label>Nombres</label>
                                                                <Input
                                                                    id="name"
                                                                    value={personData.name}
                                                                    className="col-span-2 h-8"
                                                                    onChange={handleOnChangeP}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-3 items-center gap-4">
                                                                <label>Ap. Paterno</label>
                                                                <Input
                                                                    id="paternalSurname"
                                                                    value={personData.paternalSurname}
                                                                    className="col-span-2 h-8"
                                                                    onChange={handleOnChangeP}

                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-3 items-center gap-4">
                                                                <label>Ap. Materno</label>
                                                                <Input
                                                                    id="maternalSurname"
                                                                    value={personData.maternalSurname}
                                                                    className="col-span-2 h-8"
                                                                    onChange={handleOnChangeP}
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-3 items-center gap-4">
                                                                <label>DNI</label>
                                                                <Input
                                                                    id="dni"
                                                                    value={personData.dni}
                                                                    className="col-span-2 h-8"
                                                                    onChange={handleOnChangeP}
                                                                />
                                                            </div>
                                                            <Button type='submit'>Save & Add</Button>
                                                        </form>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {documentData.peopleInDoc.map((personId, index) => {
                                            const person = getPersonById(personId)
                                            return (
                                                person &&
                                                <div key={index} className="relative">
                                                    <X
                                                        className="w-4 h-4 absolute right-0 mt-1 mr-1 hover:cursor-pointer"
                                                        onClick={() => delPersonId(personId)}
                                                    />
                                                    {person && <PersonCard className="border pr-10" person={person} />}
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    </section>

                </div >
            </div>


        </section >
    )
}
