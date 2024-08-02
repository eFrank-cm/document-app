// import { ChangeEvent, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getFileFromDexie } from "../services/fileService";

// export const ViewPDF = () => {
//     const { url } = useParams()
//     console.log(url)
//     const pdfUrl = `/src/documents/media/DJ.pdf`;

//     const [preview, setPreview] = useState<string | null>('')
//     const fileId = '2'

//     useEffect(() => {
//         const loadFile = async () => {
//             const fileBlob = await getFileFromDexie(fileId)
//             if (fileBlob) {
//                 const fileURL = URL.createObjectURL(fileBlob)
//                 setPreview(fileURL)
//             }
//         }

//         loadFile()
//     }, [fileId])

//     return (
//         <main style={{ width: '100%', height: '100vh' }}>
//             <iframe
//                 src={preview}
//                 width="100%"
//                 height="100%"
//                 style={{ border: 'none' }}
//                 title="PDF Viewer"
//             />
//         </main>
//     )
// }