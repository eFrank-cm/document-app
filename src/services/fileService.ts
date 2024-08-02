import { db } from "./db"

export const saveFileToDexie = async (fileId: string, file: Blob) => {
    await db.files.put({ id: fileId, data: file })
}

export const getFileFromDexie = async (fileId: string): Promise<Blob | null> => {
    const fileEntry = await db.files.get(fileId)
    return fileEntry ? fileEntry.data : null
}