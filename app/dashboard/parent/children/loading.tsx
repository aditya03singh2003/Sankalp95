import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>

        <div className="md:col-span-3">
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
