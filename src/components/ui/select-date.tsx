import { FC } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./calendar"
import { formatDate } from "date-fns"


interface SelectDateProps {
    date: Date | undefined,
    className?: string,
    disabled: boolean,
    OnSelectDate: (date: Date | undefined) => void
    disabledFutureDates?: boolean
}

export const SelectDate: FC<SelectDateProps> = ({ date, disabled, OnSelectDate, className, disabledFutureDates = false }) => {

    return (
        <Popover>
            <PopoverTrigger className={className} asChild>
                <Button
                    variant='outline'
                    disabled={disabled}
                    type='button'
                    className="pl-3 text-left font-normal flex justify-between disabled:border-transparent"
                >
                    {date
                        ? formatDate(date, 'PPP')
                        : (<span>Pick a date</span>)
                    }
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align='start'>
                <Calendar
                    mode='single'
                    defaultMonth={date}
                    selected={date}
                    onSelect={OnSelectDate}
                    disabled={date => {
                        if (disabledFutureDates)
                            return date > new Date() || date < new Date('1900-01-01')
                        else
                            return date < new Date('1900-01-01')
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
