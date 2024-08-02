import { useParams } from "react-router-dom"
// import { getDocumentById } from "../services/docTracking.api"
import { Header } from "../components/Header"
import { DocumentForm } from "./form"
import { useDocumentStore } from "../store/documentStore"


export const DocumentFormPage = () => {
    const { id } = useParams()
    const getDocumentById = useDocumentStore(st => st.getDocumentById)
    const document = getDocumentById(id ? id : '')
    console.log(id)

    return (
        <main className='w-10/12 m-auto'>
            <Header />
            {
                document
                    ? <DocumentForm document={document} />
                    :  id === 'create'
                        ? <DocumentForm />
                        : <div>El documento no existe {id}</div>
            }

        </main>
    )
}
