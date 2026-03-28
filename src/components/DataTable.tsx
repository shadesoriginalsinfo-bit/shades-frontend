import { useEffect, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { ArrowDown, ArrowUp } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  // detect small screen with matchMedia (avoids reading window.innerWidth in render)
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width:640px)').matches : false
  )

  console.log(isMobile)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width:640px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    // modern browsers use addEventListener
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler)
    } else {
      // fallback
      // @ts-ignore
      mq.addListener(handler)
    }
    setIsMobile(mq.matches)
    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', handler)
      } else {
        // @ts-ignore
        mq.removeListener(handler)
      }
    }
  }, [])

  return (
    <div className="relative z-0 p-0">
      {/* Table Container with Horizontal Scroll */}
      <div className="rounded-t-none rounded-b-xl overflow-x-auto">
        <div className="min-w-full">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gray-100 hover:bg-gray-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="min-w-[130px]">
                      {header.isPlaceholder ? null : (
                        <div
                          className="w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-4 flex items-center cursor-pointer justify-start text-xs sm:text-sm font-semibold text-black"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="text-center whitespace-nowrap">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getIsSorted() === 'asc' && (
                            <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 ml-1" />
                          )}
                          {header.column.getIsSorted() === 'desc' && (
                            <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 ml-1" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={row.getIsSelected() ? 'bg-gray-100' : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-center text-xs sm:text-sm text-gray-700 py-3 sm:py-4 min-w-[120px]"
                      >
                        <span className="flex flex-col items-start justify-start px-2 sm:px-4 lg:px-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={Math.max(1, columns.length)}
                    className="h-16 sm:h-20 lg:h-24 text-center text-sm text-gray-500"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
