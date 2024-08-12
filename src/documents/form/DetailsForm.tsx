import { ChevronLeft, FileText } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { SelectDate } from '../../components/ui/select-date'
import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { toast } from '../../components/ui/use-toast'
import { Document } from '../../types'
import { useNavigate } from 'react-router-dom'
import { Label } from '../../components/ui/label'
import { createDocument, deleteDocumentById, editDocument } from '../../services/services'

const emptyDocumentData: Document = {
    id: '',
    createAt: new Date(),
    name: '',
    date: new Date(),
    filePath: '',
    keywords: [],
    subject: '',
    location: '',
    fileName: '',
    persons: []
}

interface DetailsFormProps {
    document?: Document
    preview: string | null
    setPreview: (url: string) => void
}

// handle 'name', 'abstract', 'date' and file PDF
export const DetailsForm: FC<DetailsFormProps> = ({ document, preview, setPreview }) => {
    const initialState = document ? { ...document } : emptyDocumentData
    const [isEdit, setIsEdit] = useState(document ? false : true)
    const [fields, setFields] = useState<Document>(initialState)
    const navigate = useNavigate()
    const backurl = '/documents'

    const [pdfFile, setPdfFile] = useState<File | null>(null)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (document) {
            const file = pdfFile
            editDocument(fields, file)
                .then(res => {
                    if (res) {
                        toast({ title: "Se edito correctamente." })
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            if (pdfFile) {
                createDocument(fields, pdfFile)
                    .then(res => {
                        if (res) {
                            navigate(`/document/${res[0].id}`, { state: res[0] })
                            toast({ title: "Se creo correctamente." })
                        }
                    })
                    .catch(err => console.log('hubo un error', err))
            }
        }

        setIsEdit(false)

        if (!pdfFile) {
            alert('Por favor suba un archivo PDF.')
            setIsEdit(true)
        }
    }


    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null

        if (selectedFile) {
            const nameFile = selectedFile.name
            const fileURL = URL.createObjectURL(selectedFile)
            setPdfFile(selectedFile)
            setPreview(fileURL)
            setFields(prev => ({
                ...prev,
                name: nameFile.replace('.pdf', ''),
                fileName: nameFile,
            }))
        }
    }

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = event.target

        setFields(prev => ({
            ...prev,
            [id]: value
        }))
    }

    function toggleEditFields() {
        if (isEdit) {
            if (confirm('Seguro que desea cancelar la edicion?')) {
                setFields(initialState)
                setIsEdit(false)
                setPreview(preview ? preview : '')
            }
        }
        else
            setIsEdit(true)
    }

    function backProducts() {
        document
            ? isEdit
                ? confirm('Seguro que desea cancelar la edicion?') && navigate(backurl)
                : navigate(backurl)
            : confirm('Seguro que desea cancelar la creacion?') && navigate(backurl)
    }

    function handleOnSelectDate(ndate: Date | undefined) {
        if (!ndate) return
        setFields(prev => ({
            ...prev,
            date: ndate
        }))
    }

    function handleDelete() {
        if (document && confirm('Seguro de eliminar el archivo?')) {
            deleteDocumentById(fields.id, fields.filePath)
                .then(() => {
                    navigate('/documents')
                }).catch(err => console.log(err))
        }
    }

    return (
        <form className="my-3" onSubmit={handleSubmit}>
            <nav className="grid grid-cols-4 items-center gap-4 mb-2">
                <div className="col-span-3 flex gap-2 items-center">
                    <Button variant="outline" size="icon" className="h-7 w-7" type='button' onClick={backProducts} >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Input
                        className="font-semibold text-xl px-1 w-full"
                        id='name'
                        value={fields.name}
                        onChange={handleChange}
                        disabled={!isEdit}
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    {
                        isEdit
                            ? (
                                <>
                                    <Button variant='secondary' size='sm' type='button' onClick={toggleEditFields}>
                                        Cancelar
                                    </Button>
                                    <Button variant='default' size='sm' type='submit'>
                                        Guardar
                                    </Button>
                                </>
                            )
                            : (
                                <>
                                    <Button variant='secondary' size='sm' type='button' onClick={toggleEditFields}>
                                        Editar
                                    </Button>
                                    <Button variant='destructive' size='sm' type='button' onClick={handleDelete}>
                                        Eliminar
                                    </Button>
                                </>
                            )
                    }

                </div>
            </nav>

            <div className="p-3 border rounded-md">
                <Textarea
                    id="subject"
                    value={fields.subject}
                    onChange={handleChange}
                    className="max-h-[50px] p-1 my-1"
                    placeholder="Digite el asunto..."
                    disabled={!isEdit}
                />

                <div className="grid grid-cols-3">
                    <div className="flex flex-col justify-end">
                        <Input
                            id="file-input"
                            type='file'
                            accept='application/pdf'
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            disabled={!isEdit}

                        />
                        <Label className="mb-1 ml-0.5 text-muted-foreground">Archivo PDF</Label>
                        <label
                            htmlFor="file-input"
                            className={`flex items-center border text-sm rounded-md px-2 py-2.5 hover:underline ${isEdit ? 'cursor-pointer' : 'border-transparent cursor-default'}`}
                        >
                            <FileText className="min-h-5 min-w-5 mr-1" />
                            {fields.fileName === '' ? 'Elegir archivo' : `${fields.fileName}`}
                        </label>
                    </div>

                    <div className="mx-auto">
                        <Label className='text-muted-foreground'>Fecha de Emision</Label>
                        <SelectDate
                            className="min-w-52"
                            date={fields.date}
                            disabled={!isEdit}
                            OnSelectDate={handleOnSelectDate}
                        />
                    </div>

                    <div>
                        <Label className='text-muted-foreground'>Ejemplar fisico en</Label>
                        <Input
                            id='location'
                            value={fields.location}
                            disabled={!isEdit}
                            onChange={handleChange}
                        />
                    </div>
                </div>


            </div>
        </form>
    )
}
