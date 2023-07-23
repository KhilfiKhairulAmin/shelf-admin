import prismadb from "@/lib/prismadb"
import { BillboardClient } from "./components/Client"
import { BillboardColumn } from "./components/Columns"
import { format } from "date-fns"

const Billboards = async ({
  params
}: { params: { shelfId: string }}) => {

  const billboards = await prismadb.billboard.findMany({
    where: {
      shelfId: params.shelfId
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    updatedAt: item.updatedAt.getDay() === new Date().getDay() ? `Today, ${format(item.updatedAt, 'hh:mm bbb')}` : format(item.updatedAt, 'PPpp')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default Billboards