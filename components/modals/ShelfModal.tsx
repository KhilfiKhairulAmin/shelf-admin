"use client"

import { useShelfModal } from "@/hooks/useShelfModal"
import { Modal } from "@/components/ui/modal"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { redirect } from "next/dist/server/api-utils"

const formSchema = z.object({
  name: z.string().min(1).max(100)
})

export const StoreModal = () => {

  const shelfModal = useShelfModal()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const { data } = await axios.post('/api/stores', values)

      toast.success('Shelf created!')

      window.location.assign(`/${data.id}`)

    } catch(error) {
      toast.error('Something went wrong!')

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="Create shelf"
      description="Add a new shelf to manage products and categories"
      isOpen={shelfModal.isOpen}
      onClose={shelfModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} placeholder="My First Shelf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={isLoading} type="button" variant="outline" onClick={shelfModal.onClose}>Cancel</Button>
                <Button disabled={isLoading} type="submit">Create</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}