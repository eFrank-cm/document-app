import { Navigate, useLocation, useParams } from "react-router-dom"
import { Header } from "../components/Header"
import { DocumentForm } from "./form/FormMain"
import { Document } from "../types"

export const DocumentDetailsPage = () => {
    const { id } = useParams()
    const location = useLocation()
    const document = location.state as Document

    return (
        <main className='w-10/12 m-auto'>
            <Header />
            {
                document
                    ? <DocumentForm document={document} />
                    : id === 'create'
                        ? <DocumentForm />
                        : <Navigate to='/documents' />
            }
        </main>
    )
}
