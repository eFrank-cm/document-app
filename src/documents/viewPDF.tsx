import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUrlFromPDF } from "../services/services";

export const ViewPDF = () => {
    const { url } = useParams()
    // const location = useLocation()
    // console.log(location.state)
    // const { filePath } = location.state
    const [pdfURL, setPdfURL] = useState<string | null>('')
    const navigate = useNavigate()


    useEffect(() => {
        if (url) {
            getUrlFromPDF(url)
                .then(res => setPdfURL(res.signedUrl))
                .catch(err => {
                    navigate('/documents')
                    console.log(err)
                })
        }
    }, [])

    return (
        <main style={{ width: '100%', height: '100vh' }}>
            {pdfURL
                && (
                    <iframe
                        src={pdfURL}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        title="PDF Viewer"
                    />
                )
            }
        </main>
    )
}