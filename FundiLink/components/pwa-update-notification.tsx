"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, X } from "lucide-react"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { useState } from "react"

export function PWAUpdateNotification() {
  const { updateAvailable, updateServiceWorker } = useServiceWorker()
  const [dismissed, setDismissed] = useState(false)

  if (!updateAvailable || dismissed) return null

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 card-premium animate-slide-up shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Update Available</h3>
            <p className="text-sm text-muted-foreground">A new version of FundiLink is ready to install</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={updateServiceWorker} size="sm" className="btn-primary text-xs px-3 py-2">
              Update
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="p-2 hover:bg-muted/50 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
