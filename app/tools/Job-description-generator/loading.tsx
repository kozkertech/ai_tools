import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--cloud)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#ff7a59]/10 border border-[#ff7a59]/20 rounded-xl">
              <Briefcase className="h-8 w-8 text-[#ff7a59]" />
            </div>
            <Skeleton className="h-10 w-80 bg-[var(--iron)]" />
          </div>
          <Skeleton className="h-6 w-96 mx-auto bg-[var(--iron)]/50" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <Card className="card border-[var(--iron)] bg-[var(--cloud)] overflow-hidden">
            <CardHeader className="bg-[var(--mist)] border-b border-[var(--iron)]">
              <Skeleton className="h-6 w-48 bg-[var(--steel)]/30" />
              <Skeleton className="h-4 w-64 bg-[var(--steel)]/20" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-[var(--iron)]" />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-[var(--iron)]" />
                    <Skeleton className="h-10 w-full bg-[var(--iron)]/50" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-[var(--iron)]" />
                    <Skeleton className="h-10 w-full bg-[var(--iron)]/50" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 bg-[var(--iron)]" />
                    <Skeleton className="h-10 w-full bg-[var(--iron)]/50" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-[var(--iron)]" />
                    <Skeleton className="h-10 w-full bg-[var(--iron)]/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-[var(--iron)]" />
                  <Skeleton className="h-24 w-full bg-[var(--iron)]/50" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-36 bg-[var(--iron)]" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28 bg-[var(--iron)]" />
                  <Skeleton className="h-16 w-full bg-[var(--iron)]/50" />
                  <Skeleton className="h-10 w-full bg-[var(--iron)]/50" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Skeleton className="h-10 w-48 bg-[var(--iron)]" />
                <Skeleton className="h-10 w-40 bg-[var(--iron)]" />
                <Skeleton className="h-10 w-32 bg-[var(--iron)]" />
              </div>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card className="card border-[var(--iron)] bg-[var(--cloud)] overflow-hidden">
            <CardHeader className="bg-[var(--mist)] border-b border-[var(--iron)] text-white rounded-t-lg">
              <Skeleton className="h-6 w-56 bg-[var(--steel)]/30" />
              <Skeleton className="h-4 w-72 bg-[var(--steel)]/20" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ff7a59]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-[#ff7a59]" />
                </div>
                <Skeleton className="h-4 w-64 mx-auto bg-[var(--iron)]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
