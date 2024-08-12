import { ColumnDef } from "@tanstack/react-table"
import { Header } from "../components/Header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DataTable } from "./data-table"
import { ColumnHeader } from "../components/ui/columnHeader"
import { Link, useNavigate } from "react-router-dom"
import { Badge } from "../components/ui/badge"
import { MONTHS } from "../constants"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { Document } from "../types"
import { useEffect, useState } from "react"
import { customServices } from "../services/services"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { PersonCard } from "../components/personCard"
import { useAuthStore } from "../store/authStore"

export const SearchDocumentPage = () => {
    const [data, setData] = useState<Document[]>([])
    const navigate = useNavigate()
    const role = useAuthStore(st => st.user?.role)

    const colDef: ColumnDef<Document>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <ColumnHeader column={column} title="Nombre del Archivo" />,
            cell: ({ row }) => <div className="w-60">{row.original.name}</div>
        },
        {
            accessorKey: 'keywords',
            header: 'Palabras Clave / Referencias',
            cell: ({ row }) => {
                const keywords = row.original.keywords
                if (keywords.length === 0) return (<div className="text-muted-foreground">-</div>)
                return (
                    <div className="flex flex-wrap gap-1 w-80">
                        {keywords.map((keyword, index) => (
                            <div key={index}>
                                {keyword && <Badge variant='outline'>{keyword}</Badge>}
                            </div>
                        ))}
                    </div>
                )
            },
            accessorFn: row => row.keywords.join(':')
        },
        {
            accessorKey: 'persons',
            header: 'Participantes',
            cell: ({ row }) => (
                <>{row.original.persons.length === 0
                    ? <div className="text-muted-foreground">-</div>
                    : (
                        <div className="flex flex-wrap gap-1 w-60">
                            {row.original.persons.map((person, index) => (
                                person && (
                                    <Tooltip key={index}>
                                        <TooltipTrigger>
                                            <Avatar>
                                                <AvatarFallback>{`${person.name[0]}${person.paternalSurname[0]}`}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent className="p-0">
                                            <PersonCard person={person} />
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            ))}
                        </div>
                    )
                }</>
            ),
            accessorFn: row => {
                const peopleInDoc = row.persons.map(person => {
                    return `${person.name} ${person.paternalSurname} ${person.maternalSurname} ${person.dni}`
                })

                return peopleInDoc.join(', ')
            }
        },
        {
            accessorKey: 'date',
            header: ({ column }) => (
                <ColumnHeader column={column} title="Date" align='end' />
            ),
            cell: ({ row }) => {
                const date = row.original.date
                const year = date.getFullYear();
                const month = MONTHS[date.getMonth()]
                const day = date.getDate().toString().padStart(2, '0')

                let hours = date.getHours()
                const minutes = date.getMinutes().toString().padStart(2, '0')
                const ampm = hours >= 12 ? 'pm' : 'am'
                hours = hours % 12
                hours = hours ? hours : 12
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

                return (
                    <div className="flex-1 text-xs text-muted-foreground text-right" >
                        {`${year} ${month} ${day}`} < br />
                        {`${formattedTime}`}
                    </div >
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-8 h-8 p-0">
                                    <span className="sr-only">Open Menu</span>
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                {role === 'admin' && (
                                    <DropdownMenuItem onClick={() => navigate(`/document/${row.original.id}`, { state: row.original })}>
                                        Detalles
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem>
                                    <Link to={`/show/${row.original.filePath}`} target='_blank'>Ver PDF</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        customServices()
            .then(data =>
                setData(data)
            )
            .catch(err => console.log(err))
    }, [])


    return (
        <main className="w-10/12 m-auto">
            <Header />

            <section className="mt-16">
                <TooltipProvider>
                    <DataTable columns={colDef} data={data} />
                </TooltipProvider>
            </section>
        </main>
    )
}
