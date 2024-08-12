import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { DataTablePagination } from "../components/ui/dataTablePagination";
import { Button } from "../components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { ListFilter, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

export const DataTable = <TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowsSelected, setRowsSelected] = useState({})
    const [globalFiltering, setGlobalFiltering] = useState("")
    const [columnFiltering, setColumnFiltering] = useState<ColumnFiltersState>([])
    const navigate = useNavigate()
    const role = useAuthStore(st => st.user?.role)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        getFilteredRowModel: getFilteredRowModel(),

        onColumnVisibilityChange: setColumnVisibility,

        onRowSelectionChange: setRowsSelected,

        onGlobalFilterChange: setGlobalFiltering,

        onColumnFiltersChange: setColumnFiltering,

        state: {
            sorting,
            columnVisibility,
            rowSelection: rowsSelected,
            globalFilter: globalFiltering,
            columnFilters: columnFiltering,
        }
    })

    function toggleFilterByStatus(value: string) {
        const column = table.getColumn('status')
        if (column?.getIsFiltered() && column?.getFilterValue() === value) {
            column?.setFilterValue('')
        }
        else {
            column?.setFilterValue(value)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center py-3">
                <Input
                    placeholder="Digite para buscar en la tabla..."
                    value={globalFiltering}
                    onChange={e => setGlobalFiltering(e.target.value)}
                    className="max-w-sm outline-0"
                />

                <div className="flex justify-end items-center gap-2">


                    <div className="flex justify-end items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1 hidden">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuCheckboxItem
                                    checked={columnFiltering[0]?.value === 'active'}
                                    onClick={() => toggleFilterByStatus('active')}
                                >
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={columnFiltering[0]?.value === 'draft'}
                                    onClick={() => toggleFilterByStatus('draft')}
                                >
                                    Draft
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={columnFiltering[0]?.value === 'archived'}
                                    onClick={() => toggleFilterByStatus('archived')}
                                >
                                    Archived
                                </DropdownMenuCheckboxItem>

                            </DropdownMenuContent>
                        </DropdownMenu>

                        {role === 'admin' && (
                            <Button size="sm" className="h-8 gap-1" onClick={() => navigate('/document/create')}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Nuevo Documento
                                </span>
                            </Button>
                        )}
                    </div>

                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {
                                            header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )

                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length
                                ? (table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )))
                                : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No hay resultados en la tabla
                                        </TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div >
    )
} 