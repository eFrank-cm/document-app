import { FC } from "react"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Person } from "../types"
import { Captions } from "lucide-react"

interface PersonCardProp {
    person: Person,
    className?: string
}

export const PersonCard: FC<PersonCardProp> = ({ person, className }) => {
    const { name, paternalSurname, maternalSurname, dni } = person
    return (
        <div className={`${className} flex gap-3 py-2 px-3 rounded-md`}>
            <Avatar>
                <AvatarFallback>{`${name[0]}${paternalSurname[0]}`}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
                <p>{`${name} ${paternalSurname} ${maternalSurname}`}</p>
                <div className="flex items-center gap-1">
                    <Captions className="inline w-4 h-4" />
                    <span>{dni}</span>
                </div>
            </div>
        </div>
    )
}
