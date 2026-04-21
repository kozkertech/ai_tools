import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-4 w-32 bg-zinc-800 mx-auto rounded-full" />
          <Skeleton className="h-16 w-3/4 bg-zinc-800 mx-auto rounded-xl" />
          <Skeleton className="h-6 w-2/3 bg-zinc-900 mx-auto rounded-lg" />
        </div>

        {/* Form Skeleton */}
        <Card className="bg-zinc-900 border-zinc-800 border-dashed">
          <CardHeader className="border-b border-zinc-800 pb-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 bg-zinc-800 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-zinc-800" />
                <Skeleton className="h-4 w-64 bg-zinc-900" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {/* Section 1 Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-4 w-40 bg-orange-500/10 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                  <Skeleton className="h-10 w-full bg-zinc-950" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                  <Skeleton className="h-10 w-full bg-zinc-950" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-zinc-800" />
                <Skeleton className="h-32 w-full bg-zinc-950" />
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <Skeleton className="h-16 w-full bg-zinc-800 rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
