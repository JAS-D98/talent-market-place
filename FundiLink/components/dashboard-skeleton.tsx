"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Header Skeleton */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-2">
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
            <Skeleton className="h-4 w-32 sm:w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
            <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-premium overflow-hidden">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
                    <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                    <Skeleton className="h-3 w-16 sm:w-20" />
                  </div>
                  <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex-shrink-0" />
                </div>
                <Skeleton className="h-1 w-full mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <Card className="card-premium overflow-hidden">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 sm:h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 sm:h-20 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 sm:h-10 flex-1" />
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <Skeleton className="h-5 sm:h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 sm:h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <Skeleton className="h-5 sm:h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 sm:h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <Card className="card-premium overflow-hidden">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
            <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
            <Skeleton className="h-3 w-16 sm:w-20" />
          </div>
          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex-shrink-0" />
        </div>
        <Skeleton className="h-1 w-full mt-3" />
      </CardContent>
    </Card>
  )
}
