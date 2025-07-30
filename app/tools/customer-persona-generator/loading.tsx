import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-96 mx-auto mb-2" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
        </Card>

        {/* Form Content */}
        <Card className="border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-96" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Skeleton className="w-8 h-8 mx-auto mb-3 rounded" />
                      <Skeleton className="h-5 w-24 mx-auto mb-1" />
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Skeleton className="h-10 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
