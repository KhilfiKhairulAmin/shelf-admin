"use client"

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useShelfModal } from "@/hooks/useShelfModal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

const SetupPage = () => {

  const onOpen = useShelfModal((state) => state.onOpen)
  const isOpen = useShelfModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return (
    <div className="p-4">
      Root Page
    </div>
  )
}

export default SetupPage