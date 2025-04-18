"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"

export function PaymentResetScheduler() {
  const { data: session } = useSession()
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Function to check for payments that need to be reset
  const checkPaymentsToReset = async () => {
    if (!session || session.user.role !== "admin") return

    try {
      // Get the last checked time from localStorage
      const storedLastChecked = localStorage.getItem("lastPaymentResetCheck")
      const lastCheckedTime = storedLastChecked ? new Date(storedLastChecked) : null

      // Only check once per day
      if (lastCheckedTime) {
        const now = new Date()
        const timeDiff = now.getTime() - lastCheckedTime.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        if (hoursDiff < 24) {
          console.log(`Last payment reset check was ${hoursDiff.toFixed(1)} hours ago. Skipping.`)
          setLastChecked(lastCheckedTime)
          return
        }
      }

      // Call the API to check and reset payments
      const response = await fetch("/api/payments/reset-status")

      if (!response.ok) {
        throw new Error("Failed to check payment statuses")
      }

      const data = await response.json()

      // Update the last checked time
      const now = new Date()
      localStorage.setItem("lastPaymentResetCheck", now.toISOString())
      setLastChecked(now)

      // Show a toast notification if any payments were reset
      const studentCount = data.studentPayments.count
      const teacherCount = data.teacherSalaries.count
      const totalCount = studentCount + teacherCount

      if (totalCount > 0) {
        toast({
          title: "Payment Statuses Reset",
          description: `${studentCount} student payments and ${teacherCount} teacher salaries have been reset for the new payment cycle.`,
        })
      }
    } catch (error) {
      console.error("Error checking payment statuses:", error)
    }
  }

  useEffect(() => {
    // Check for payments to reset when the component mounts
    checkPaymentsToReset()

    // Set up a daily check
    const intervalId = setInterval(checkPaymentsToReset, 24 * 60 * 60 * 1000) // 24 hours

    return () => clearInterval(intervalId)
  }, [session])

  // This component doesn't render anything visible
  return null
}
