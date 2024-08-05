import { ComponentProps, FC } from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '../../lib/utils'
import { buttonVariants } from './button'

export type CalendarProps = ComponentProps<typeof DayPicker>

export const Calendar: FC<CalendarProps> = ({ className, classNames, showOutsideDays = true, ...props }) => {

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-2', className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-1 sm:space-y-0",
				month: 'space-y-4',
				month_caption: 'flex justify-center pt-1 relative items-center mx-10',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center',
				button_previous: cn(
					buttonVariants({ variant: 'outline' }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-4 top-2"
				),
				button_next: cn(
					buttonVariants({ variant: 'outline' }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-4 top-2"
				),
				chevron: 'fill-current h-4 w-4',
				day: 'text-center font-normal w-9 h-9 aria-selected:opacity-100 s-s hover:bg-accent hover:text-accent-foreground s-s items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				range_end: "day-range-end",
				selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				today: "bg-accent text-accent-foreground",
				outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
				disabled: "text-muted-foreground opacity-50",
				range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
				hidden: "invisible",
				...classNames,
			}}
			{...props}

		/>
	)
}