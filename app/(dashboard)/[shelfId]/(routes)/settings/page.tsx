import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import SettingsForm from "./components/SettingsForm"

interface SettingsPageProps {
  params: {
    shelfId: string
  }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
  params
}) => {

  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const shelf = await prismadb.shelf.findFirst({
    where: {
      id: params.shelfId,
      userId
    }
  })

  if (!shelf) {
    redirect('/')
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={shelf} />
      </div>
    </div>
  )
}

export default SettingsPage