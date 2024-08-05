import { ColumnDef } from "@tanstack/react-table"
import { Header } from "../components/Header"
import { DocumentWithId } from "../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DataTable } from "../documents/data-table"
import { ColumnHeader } from "../components/ui/columnHeader"
import { Link } from "react-router-dom"
import { Badge } from "../components/ui/badge"
import { MONTHS } from "../constants"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { PersonCard } from "../documents/personCard"
import { useDocumentStore } from "../store/documentStore"
import { usePersonStore } from "../store/personStore"
import { useUserStore } from "../store/userStore"

export const SearchLocation = () => {
    const data = useDocumentStore(st => st.documents)
    const getPersonById = usePersonStore(st => st.getPersonById)
    const user = useUserStore(st => st.user)

    const colDef: ColumnDef<DocumentWithId>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => <ColumnHeader column={column} title="Nombre del Archivo" />
        },
        // {
        //     accessorKey: 'type',
        //     header: "Type",
        //     cell: ({ row }) => <Badge>{row.original.type}</Badge>
        // },
        {
            accessorKey: 'keywords',
            header: 'Palabras Clave / Referencias',
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap gap-1">
                        {row.original.keywords.map((keyword, index) => (
                            <Badge variant='outline' key={index}>{keyword}</Badge>
                        ))}
                    </div>
                )
            },
            accessorFn: row => row.keywords.join(' ')
        },
        {
            accessorKey: 'peopleInDoc',
            header: 'Personas Mencionadas',
            cell: ({ row }) => {
                const peopleInDoc = row.original.peopleInDoc.map(personId => getPersonById(personId))
                return (
                    <div className="flex flex-wrap gap-1">
                        {
                            peopleInDoc.map((person, index) => (
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
                            ))
                        }
                    </div>
                )
            },
            accessorFn: row => {
                const peopleInDoc = row.peopleInDoc.map(personId => {
                    const person = getPersonById(personId)
                    return `${person?.name} ${person?.paternalSurname} ${person?.maternalSurname} ${person?.dni}`
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
                const document = row.original
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
                                {
                                    user?.type === 'admin' && (
                                        <DropdownMenuItem>
                                            <Link to={`/document/${document.id}`}>Detalles</Link>
                                        </DropdownMenuItem>
                                    )
                                }

                                <DropdownMenuItem disabled={document.urlDoc === ''}>
                                    <Link to={document.urlDoc} target='_blank'>Ver PDF</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )
            }
        }
    ]


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
