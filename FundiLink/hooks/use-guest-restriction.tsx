"use client"

import { useState } from "react"
import { useApp } from "@/components/providers"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"

export function useGuestRestriction() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    feature: string
    description?: string
  }>({
    isOpen: false,
    feature: "",
    description: "",
  })

  const { state } = useApp()

  const checkGuestRestriction = (feature: string, description?: string): boolean => {
    if (state.isGuest) {
      setModalState({
        isOpen: true,
        feature,
        description,
      })
      return false // Blocked
    }
    return true // Allowed
  }

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
  }

  const GuestRestrictionModalComponent = () => (
    <GuestRestrictionModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      feature={modalState.feature}
      description={modalState.description}
    />
  )

  return {
    checkGuestRestriction,
    GuestRestrictionModal: GuestRestrictionModalComponent,
  }
}
