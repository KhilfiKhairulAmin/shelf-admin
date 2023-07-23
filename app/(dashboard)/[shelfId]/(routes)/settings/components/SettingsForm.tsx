"use client"

import { AlertModal } from "@/components/modals/AlertModal"
import { ApiAlert } from "@/components/ui/ApiAlert"
import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Shelf } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

interface SettingsFormProps {
  initialData: Shelf
}

const formSchema = z.object({
  name: z.string().min(1).max(30)
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {

  const params = useParams()
  const router = useRouter()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true)

      await axios.patch(`/api/shelves/${params.shelfId}`, data)

      router.refresh()

      toast.success('Store updated')

    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/shelves/${params.shelfId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted')

    } catch (error) {
      toast.error('Make sure you have removed all products and categories first.')

    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage shelf preferences"
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}

        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Shelf name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="SHELF_API_URL" description={`${origin}/api/${params.shelfId}`} variant="public" />
    </>
  )
}

export default SettingsForm