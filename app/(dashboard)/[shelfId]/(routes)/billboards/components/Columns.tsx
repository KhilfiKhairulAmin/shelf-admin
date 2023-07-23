"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./CellAction"

export type BillboardColumn = {
  id: string
  label: string
  updatedAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
