import { X } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ChangeEvent, FC, FormEvent, useState } from "react"
import { addKeywordsToDocById } from "../../services/services"
import { useNavigate } from "react-router-dom"

interface KeywordsFormProps {
    keywordsList: string[],
    id: string
}

export const KeywordsForm: FC<KeywordsFormProps> = ({ keywordsList, id }) => {
    const [keywords, setKeywords] = useState<string[]>(keywordsList)
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()

    console.log() 

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { value } = event.target
        setKeyword(value)
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const newKeywords = [...keywords, keyword]
        addKeywordsToDocById(id, newKeywords)
            .then(res => {
                if (res) {
                    // para evitar hacer esto, se puede traer del back, pero eso haria mas lento la app
                    navigate(`/document/${id}`, { state: res[0] })
                }
            })
            .catch(err => console.log(err))

        setKeywords(newKeywords)
        setKeyword('')
    }

    function delKeyword(keyword: string) {
        const newKeywords = keywords.filter(str => str !== keyword)
        addKeywordsToDocById(id, newKeywords)
            .then(res => {
                if (res) {
                    navigate(`/document/${id}`, { state: res[0] })
                }
            })
            .catch(err => console.log(err))
        setKeywords(newKeywords)
    }

    return (
        <>
            <div>
                <Label>Referencias</Label>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={keyword}
                        onChange={handleChange}
                        placeholder="Ejm: Resolucion, Cusco, Declaracion Jurada"
                    />
                    <Button type='submit'>Añadir</Button>
                </form>
            </div>
            <p className="my-3 ml-1 text-sm text-muted-foreground">Las referencias son palabras o frases que ayudan a identificar el documento, como el tipo o lugar mencionado en él.</p>
            <div className="flex flex-wrap my-3 gap-2">
                {
                    keywords.map((keyword, index) => (
                        keyword && (
                            <Badge key={index} className="flex items-center justify-between" variant='secondary'>
                                {keyword}
                                <X
                                    className="ml-1 w-4 h-4 hover:cursor-pointer min-w-4 min-h-4"
                                    onClick={() => delKeyword(keyword)}
                                />
                            </Badge>
                        )
                    ))
                }
            </div>
        </>
    )
}
