import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-[500px] w-full md:w-1/3 rounded-lg" />
        <Skeleton className="h-[500px] w-full md:w-2/3 rounded-lg" />
      </div>
    </div>
  )
}
