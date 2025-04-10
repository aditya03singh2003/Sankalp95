import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownToLine, Calendar, Check, CreditCard, Download, FileText, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function PaymentsPage() {
  // Sample data for payment history
  const payments = [
    {
      id: "INV-001",
      date: "Mar 15, 2023",
      amount: "₹4,999",
      status: "paid",
      method: "Credit Card",
      description: "Monthly Tuition Fee - March 2023",
    },
    {
      id: "INV-002",
      date: "Feb 15, 2023",
      amount: "₹4,999",
      status: "paid",
      method: "UPI",
      description: "Monthly Tuition Fee - February 2023",
    },
    {
      id: "INV-003",
      date: "Jan 15, 2023",
      amount: "₹4,999",
      status: "paid",
      method: "Net Banking",
      description: "Monthly Tuition Fee - January 2023",
    },
    {
      id: "INV-004",
      date: "Dec 15, 2022",
      amount: "₹4,999",
      status: "paid",
      method: "Credit Card",
      description: "Monthly Tuition Fee - December 2022",
    },
    {
      id: "INV-005",
      date: "Nov 15, 2022",
      amount: "₹4,999",
      status: "paid",
      method: "UPI",
      description: "Monthly Tuition Fee - November 2022",
    },
  ]

  // Sample data for upcoming payments
  const upcomingPayments = [
    {
      id: "INV-006",
      dueDate: "Apr 15, 2023",
      amount: "₹4,999",
      description: "Monthly Tuition Fee - April 2023",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage your payments and view payment history</p>
        </div>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Fees
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Standard</div>
            <p className="text-xs text-muted-foreground">₹4,999/month</p>
          </CardContent>
          <div className="p-4 border-t">
            <h4 className="text-sm font-medium mb-2">Payment Methods:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Cash payment at center</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-muted-foreground"
                >
                  <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="10 8 16 8 16 14"></polyline>
                  <path d="M10 12H4"></path>
                  <path d="M4 12l3-3"></path>
                  <path d="M4 12l3 3"></path>
                </svg>
                <span>UPI: sankalp95@upi</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
                <span>Bank transfer (details at center)</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Apr 15, 2023</div>
            <p className="text-xs text-muted-foreground">Due in 15 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Paid</div>
            <p className="text-xs text-muted-foreground">Last paid: Mar 15, 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,995</div>
            <p className="text-xs text-muted-foreground">For 5 months</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your previous payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "paid" ? "success" : "destructive"}>
                          {payment.status === "paid" ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <X className="mr-1 h-3 w-3" />
                          )}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>View your upcoming payment schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                          Pay Directly
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Download Receipts</CardTitle>
          <CardDescription>Download receipts for your records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="font-medium">Monthly Tuition Fee - March 2023</p>
                <p className="text-sm text-muted-foreground">Paid on Mar 15, 2023</p>
              </div>
              <Button variant="outline" size="sm">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="font-medium">Monthly Tuition Fee - February 2023</p>
                <p className="text-sm text-muted-foreground">Paid on Feb 15, 2023</p>
              </div>
              <Button variant="outline" size="sm">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Monthly Tuition Fee - January 2023</p>
                <p className="text-sm text-muted-foreground">Paid on Jan 15, 2023</p>
              </div>
              <Button variant="outline" size="sm">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
