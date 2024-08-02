import { Link } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { ChangeEvent, useEffect, useState } from "react"
import { Input } from "../components/ui/input"
import { getFileFromDexie, saveFileToDexie } from "../services/fileService"

export const HomePage = () => {
	const user = useUserStore(st => st.user)

	const [preview, setPreview] = useState<string | null>(null)
	const [fileName, setFileName] = useState('No se selecciono ningun archivo')
	const fileId = '2'

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files ? event.target.files[0] : null

		if (selectedFile) {
			await saveFileToDexie(fileId, selectedFile)
			const fileURL = URL.createObjectURL(selectedFile)
			console.log(fileURL)
			setPreview(fileURL)
			setFileName(selectedFile.name)
		}
		else
			setFileName('No se selecciono ningun archivo')
	}

	useEffect(() => {
		const loadFile = async () => {
			const fileBlob = await getFileFromDexie(fileId)
			if (fileBlob) {
				const fileURL = URL.createObjectURL(fileBlob)
				setPreview(fileURL)
				setFileName('Archivo cargado desde IndexedDB')
			}
		}

		loadFile()
	}, [fileId])

	return (
		<div>
			HomePage
			{!user && <Link to='/login'>Log In</Link>}
			<Link to='/documents'>Documents</Link>

			<div className="border w-10/12 mx-auto mt-5 p-3">
				<Input
					id="file-input"
					type='file'
					accept='application/pdf'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				{/* el htmlfor = id del input para q el click funcione */}
				<label htmlFor="file-input" style={{ cursor: 'pointer' }}>
					{fileName}
				</label>

				{preview && (
					<iframe
						src={preview}
						title="Vista previa PDF"
						width='600'
						height='400'
					></iframe>
				)}
			</div>
		</div>
	)
}
