"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, Clock, AlertCircle, CreditCard } from "lucide-react"

export default function StudentPaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentData, setPaymentData] = useState({
    paymentStatus: "pending",
    paymentHistory: [],
  })
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && session.user.role !== "student") {
      router.push("/dashboard")
      return
    }

    if (status === "authenticated" && session.user.role === "student") {
      fetchPaymentData()
    }
  }, [status, session, router])

  const fetchPaymentData = async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/students/${session.user.id}/payment`)

      if (response.ok) {
        const data = await response.json()
        setPaymentData(data)
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to fetch payment data")
      }
    } catch (error) {
      console.error("Error fetching payment data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch payment data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch(`/api/students/${session.user.id}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Update local state
        setPaymentData({
          ...paymentData,
          paymentStatus: data.paymentStatus,
        })

        // Reset form
        setFormData({
          amount: "",
          notes: "",
        })

        // Refresh payment data
        fetchPaymentData()

        toast({
          title: "Success",
          description: "Payment approval requested successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to request payment approval")
      }
    } catch (error) {
      console.error("Error requesting payment approval:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to request payment approval",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Paid
          </Badge>
        )
      case "requested":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="h-3 w-3 mr-1" /> Requested
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Your current payment status and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Current Status</h3>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Status:</span>
                  {getPaymentStatusBadge(paymentData.paymentStatus)}
                </div>

                {paymentData.paymentStatus === "requested" && (
                  <p className="mt-2 text-sm text-blue-600">
                    Your payment approval request is pending. The admin will review it soon.
                  </p>
                )}

                {paymentData.paymentStatus === "paid" && (
                  <p className="mt-2 text-sm text-green-600">Your payment has been approved. Thank you!</p>
                )}

                {paymentData.paymentStatus === "pending" && (
                  <p className="mt-2 text-sm text-amber-600">
                    Your payment is pending. Please submit a payment request.
                  </p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium mb-2">Payment History</h3>
            {paymentData.paymentHistory && paymentData.paymentHistory.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentData.paymentHistory.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>₹{payment.amount}</TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell>{payment.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground border rounded-md">No payment history found</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Payment Approval</CardTitle>
            <CardDescription>Submit your payment details for approval</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentData.paymentStatus === "requested" ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-700">
                <h3 className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Payment Approval Pending
                </h3>
                <p className="mt-2 text-sm">
                  Your payment approval request is currently being reviewed by the admin. You'll be notified once it's
                  approved.
                </p>
              </div>
            ) : paymentData.paymentStatus === "paid" ? (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-700">
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Payment Approved
                </h3>
                <p className="mt-2 text-sm">Your payment has been approved. Thank you for your payment!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount (₹)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        className="pl-8"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Payment Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional information about your payment"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Request Payment Approval
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Note: Payment approval is subject to verification by the admin.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
