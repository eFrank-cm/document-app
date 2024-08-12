/* cols in db                           cols person

    1. id                               1. id                              (auto)
    2. create_at                        2. create_at                       (auto)
  ----------------                  ---------------------------
    3. name                             3. name
    4. subject                          4. paternal_surname
    5. date                             5. maternal_surname
    6. location                         6. dni
    7. file_name                        7. document_id
    8. file_path
    9. keywords
*/

import { KEYWORD_SEPARATOR } from "../constants";
import { Document, Person } from "../types";

export function serializerDocument(data: any) {
    const document: Document = {
        id: data.id,
        createAt: new Date(data.created_at),
        name: data.name,
        subject: data.subject,
        date: new Date(data.date),
        location: data.location,
        fileName: data.file_name,
        filePath: data.file_path,
        keywords: !data.keywords ? [] : data.keywords.split(KEYWORD_SEPARATOR),
        persons: !data.persons ? [] : data.persons.map((per: any) => serializerPerson(per))
    }
    return document
}

export function serializerPerson(data: any) {
    const person: Person = {
        id: data.id,
        name: data.name,
        paternalSurname: data.paternal_surname,
        maternalSurname: data.maternal_surname,
        dni: data.dni,
    }
    return person
}