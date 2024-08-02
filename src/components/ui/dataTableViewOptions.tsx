import { Table } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { Button } from "./button"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

export const DataTableViewOptions = <TData,>({ table }: DataTableViewOptionsProps<TData>) => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                    <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel className="m-2 text-sm font-bold ">Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {
                    table.getAllColumns().filter(column => (
                        typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )).map(column => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={value => column.toggleVisibility(!!value)}
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))
                }

            </DropdownMenuContent>
        </DropdownMenu>
    )
}