"use client"

import { AlertModal } from "@/components/modals/AlertModal"
import { ApiAlert } from "@/components/ui/ApiAlert"
import { Heading } from "@/components/ui/Heading"
import ImageUpload from "@/components/ui/ImageUpload"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/useOrigin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Shelf } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"

interface BillboardFormProps {
  initialData: Billboard | null
}

const formSchema = z.object({
  label: z.string().min(1).max(190),
  imageUrl: z.string().url()
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {

  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard created'
  const action = initialData ? 'Save changes' : 'Create'

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        await axios.patch(`/api/${params.shelfId}/billboards/${params.billboardId}`, data)
      }
      else {
        await axios.post(`/api/${params.shelfId}/billboards`, data)
      }

      router.refresh()
      router.push(`/${params.shelfId}/billboards`)
      toast.success(toastMessage)

    } catch (error) {
      toast.error('Something went wrong!')

    } finally {
      setLoading(false)

    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.shelfId}/billboards/${params.billboardId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted')

    } catch (error) {
      toast.error('Make sure you have removed all categories in this billboard first.')

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
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
  
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading} onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
          )} />
          <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="label" render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Billboard label" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}

export default BillboardForm