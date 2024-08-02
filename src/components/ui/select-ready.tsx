import { FC } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface option {
    value: string,
    label: string
}

export interface SelectReadyElement {
    id: string,
    value: string
}

interface SelectReadyProps {
    id: string,
    className?: string,
    value: string,
    disabled: boolean,
    onValueChange: (event: SelectReadyElement) => void
    options: option[],
}


export const SelectReady: FC<SelectReadyProps> = ({ id, value, disabled, onValueChange, options, className }) => {

    return (
        <Select value={value} disabled={disabled} onValueChange={value => onValueChange({ id, value })} >
            <SelectTrigger className={`${className} disabled:cursor-default`} >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {
                    options.map((option, index) => (
                        <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}
