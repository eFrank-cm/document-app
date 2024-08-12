import { Download, Maximize } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FC, useEffect, useState } from "react";
import { Document } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { DetailsForm } from "./DetailsForm";
import { KeywordsForm } from "./KeywordsForm";
import { PeopleForms } from "./PeopleForms";
import { getUrlFromPDF } from "../../services/services";

interface DocumentFormProps {
    document?: Document
}

export const DocumentForm: FC<DocumentFormProps> = ({ document }) => {
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        if (document) {
            getUrlFromPDF(document.filePath)
                .then(res => {
                    setPreview(res.signedUrl)
                })
                .catch(err => console.log(err))
        }
    }, [])

    return (
        <section className='mx-auto my-5'>

            <DetailsForm document={document} preview={preview} setPreview={setPreview} />

            <div className="rounded-md overflow-hidden">
                <div className="grid grid-cols-2 gap-3">

                    <div className={`border rounded-md ${(!preview && !document) && 'hidden'}`}>
                        {preview
                            && (
                                <>
                                    <iframe
                                        src={preview}
                                        title="Vista previa PDF"
                                        className="w-full h-[580px] rounded-sm"
                                    />

                                    <div className="flex justify-between px-2 hidden">
                                        <Button variant='link' className="p-1 mr-2">
                                            <Maximize className="w-5 h-5 mr-1" />
                                            Maximizar
                                        </Button>
                                        <Button variant='link' className="p-1">
                                            <Download className="w-5 h-5 mr-1" />
                                            Descargar
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                    </div>

                    {
                        document && (
                            <Card className="border rounded-md">
                                <CardHeader>
                                    <CardTitle>Datos de Busqueda</CardTitle>
                                    <CardDescription>
                                        Añada algunas referencias que faciliten la busqueda de este documento
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>

                                    <KeywordsForm keywordsList={document.keywords} id={document.id} />

                                    <hr className="my-5" />

                                    <PeopleForms documentId={document.id} />

                                </CardContent>
                            </Card>
                        )
                    }
                </div>
            </div>


        </section >
    )
}
