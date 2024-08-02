import { buttonVariants } from "./button"
import { DayPicker } from "react-day-picker"
import { ComponentProps } from "react";
import { cn } from "./../../lib/utils"
import "react-day-picker/style.css";

export type CalendarProps = ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-1 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center mx-10",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-4 top-2"
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-4 top-2"
        ),
        chevron: 'fill-current h-4 w-4',
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
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

Calendar.displayName = "Calendar"

export { Calendar }