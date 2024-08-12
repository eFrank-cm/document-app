import { KEYWORD_SEPARATOR } from "../constants"
import { generate4Token } from "../lib/utils"
import { Document, Person } from "../types"
import { supabase } from "./client"
import { serializerDocument, serializerPerson } from "./serializer"

// --------------------------------------------- READ DATA ---------------------------------------------
export async function fetchDocuments() {
    const { data: documents, error } = await supabase.from('documents').select('*')
    if (error) throw error
    if (!documents) return []
    const newData: Document[] = documents.map(doc => serializerDocument(doc))
    return newData
}

export async function fetchDocumentById(id: string) {
    if (id === '') return
    const { data: documents, error } = await supabase.from('documents').select('*').eq('id', id)
    if (error) console.log(error)
    if (!documents) return
    return serializerDocument(documents[0])
}

export async function getUrlFromPDF(path: string) {
    // url validate by 6h
    const { data, error } = await supabase.storage.from('pdfs').createSignedUrl(path, 3600 * 6)
    if (error) throw error
    return data
}

export async function fetchPersons() {
    const { data, error } = await supabase.from('persons').select('*')
    if (error) throw error
    const newData: Person[] = data.map(person => serializerPerson(person))
    return newData
}

export async function fetchPersonsByDocument(documentId: string) {
    const { data, error } = await supabase.from('persons').select('*').eq('document_id', documentId)
    if (error) throw error
    const newData: Person[] = data.map(person => serializerPerson(person))
    return newData
}
// --------------------------------------------- CREATE ---------------------------------------------
export async function pushFilePDF(file: File) {
    // modify file name to avoid duplicates errors - it should be done in backend
    const fileName = file.name.replace('.pdf', `__${generate4Token()}.pdf`)
    const { data, error } = await supabase.storage.from('pdfs').upload(fileName, file)
    if (error) throw error
    return data
}

export async function pushDocument(document: Document) {
    // cols name equal to table in supabase
    const { data, error } = await supabase.from('documents').insert([{
        name: document.name,
        subject: document.subject,
        date: document.date,
        location: document.location,
        file_name: document.fileName,
        file_path: document.filePath,
        keywords: '',
    }]).select()

    if (error) throw error
    const docs = data.map(doc => serializerDocument(doc))
    return docs
}

export async function pushPerson(person: Person) {
    // cols name equal to table in supabase
    const { data, error } = await supabase.from('persons').insert([{
        name: person.name,
        paternal_surname: person.paternalSurname,
        maternal_surname: person.maternalSurname,
        dni: person.dni,
    }]).select()
    if (error) throw error
    const per = serializerPerson(data[0])
    return per
}

export async function createDocument(document: Document, file: File) {
    // subir el archivo pdf
    const fileData = await pushFilePDF(file)

    // si no se subio el archivo, se cancela todo
    if (!fileData) return

    // insertar datos del pdf en el obj document
    const objToInsert: Document = {
        ...document,
        fileName: file.name,
        filePath: fileData.path
    }

    // ingresar obj a la bd
    const doc = await pushDocument(objToInsert)
    return doc
}

// --------------------------------------------- DELETE ---------------------------------------------
export async function removeDocumentById(id: string) {
    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) throw error
}

export async function removeFilePDF(path: string) {
    const { error } = await supabase.storage.from('pdfs').remove([path])
    if (error) throw error
}

export async function deleteDocumentById(id: string, filePath: string) {
    await removeDocumentById(id)
    await removeFilePDF(filePath)
}

// --------------------------------------------- EDIT ---------------------------------------------
export async function updateDocumentById(documentId: string, objToUpdate: any) {
    const { data, error } = await supabase.from('documents').update({
        ...objToUpdate
    }).eq('id', documentId).select('*')
    if (error) throw error
    const docs = data.map(doc => serializerDocument(doc))
    return docs
}

export async function editDocument(document: Document, file: File | null) {
    let fileName = document.fileName
    let filePath = document.filePath
    if (file) {
        await removeFilePDF(document.filePath)
        fileName = file.name
        const fileData = await pushFilePDF(file)
        filePath = fileData.path
        console.log('se edito el archivo')
    }

    // generamos el objToUpdate {}
    const objToUpdate = {
        name: document.name,
        subject: document.subject,
        date: document.date,
        location: document.location,
        file_name: fileName,
        file_path: filePath,
        keywords: document.keywords.join(KEYWORD_SEPARATOR)
    }

    const doc = await updateDocumentById(document.id, objToUpdate)
    return doc
}

export async function addKeywordsToDocById(id: string, keywords: string[]) {
    const objToUpdate = {
        keywords: keywords.join(KEYWORD_SEPARATOR)
    }

    const doc = await updateDocumentById(id, objToUpdate)
    return doc
}

export async function updatePersonById(personId: string, objToUpdate: any) {
    const { data, error } = await supabase.from('persons').update({
        ...objToUpdate
    }).eq('id', personId).select('*')
    if (error) throw error
    return data
}

export async function addDocumentToPersonById(personId: string, documentId: string | null) {
    const objToUpdate = {
        document_id: documentId
    }

    const person = await updatePersonById(personId, objToUpdate)
    return person
}

// -------------------------------------------- CUSTOM -----------------------------------------
export async function customServices() {
    const { data, error } = await supabase.from('documents')
        .select(`
            id, 
            created_at, 
            name, 
            subject, 
            date, 
            location,
            file_name,
            file_path,
            keywords, 
            persons (id, name, paternal_surname, maternal_surname, dni, document_id)
        `)
    if (error) throw error
    const docs: Document[] = data.map(doc => serializerDocument(doc))
    return docs
}

