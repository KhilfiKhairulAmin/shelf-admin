"use client"

import { Shelf } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useShelfModal } from "@/hooks/useShelfModal"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, PlusCircle, Warehouse as ShelfIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ShelfSwitcherProps extends PopoverTriggerProps {
  items: Shelf[]
}

const ShelfSwitcher = ({
  className,
  items = []
}: ShelfSwitcherProps) => {

  const shelfModal = useShelfModal()
  const params = useParams()
  const router = useRouter()

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }))

  const currentShelf = formattedItems.find((item) => item.value === params.shelfId)

  const [open, setOpen] = useState(false)

  const onStoreSelect = (store: { value: string, label: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a shelf"
          className={cn('w-[200px] justify-between', className)}
        >
          <ShelfIcon className="mr-2 h-4 w-4" />
          {currentShelf?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search shelf..." />
            <CommandEmpty>No shelf found.</CommandEmpty>
            <CommandGroup heading="Shelves">
              {formattedItems.map((shelf) => (
                <CommandItem
                  key={shelf.value}
                  onSelect={() => onStoreSelect(shelf)}
                  className="text-sm"
                >
                  <ShelfIcon className="mr-2 h-4 w-4" />
                  {shelf.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentShelf?.value === shelf.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  shelfModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create shelf
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ShelfSwitcher