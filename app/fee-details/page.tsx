import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeeDetailsPage() {
  const feeStructure = [
    {
      class: "Class 1-5",
      fee: "₹1,000",
      subjects: "All Subjects",
      boards: "ICSE, CBSE, UP Board",
    },
    {
      class: "Class 6-8",
      fee: "₹1,500",
      subjects: "All Subjects",
      boards: "ICSE, CBSE, UP Board",
    },
    {
      class: "Class 9-10",
      fee: "₹2,000",
      subjects: "All Subjects",
      boards: "ICSE, CBSE, UP Board",
    },
    {
      class: "Class 11-12 (PCM)",
      fee: "₹3,000",
      subjects: "Physics, Chemistry, Mathematics",
      boards: "ICSE, CBSE, UP Board",
    },
    {
      class: "Class 11-12 (PCB)",
      fee: "₹3,000",
      subjects: "Physics, Chemistry, Biology",
      boards: "ICSE, CBSE, UP Board",
    },
  ]

  const additionalInfo = [
    "Fees are to be paid monthly by the 10th of each month",
    "One-time admission fee of ₹500 for new students",
    "Sibling discount: 10% off on the second child's fee",
    "Study materials are provided at no additional cost",
    "Scholarship available for meritorious students",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-sankalp-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Fee Structure</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Affordable education for all classes and boards
                </p>
              </div>
            </div>

            <Card className="mx-auto max-w-4xl">
              <CardHeader>
                <CardTitle>Monthly Fee Structure</CardTitle>
                <CardDescription>Fees for different classes and boards at Sankalp95 Coaching</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Monthly fees applicable for the academic year 2023-24</TableCaption>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="font-bold">Class</TableHead>
                      <TableHead className="font-bold">Monthly Fee</TableHead>
                      <TableHead className="font-bold">Subjects</TableHead>
                      <TableHead className="font-bold">Boards</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((item, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-sankalp-50"}>
                        <TableCell className="font-medium">{item.class}</TableCell>
                        <TableCell>{item.fee}</TableCell>
                        <TableCell>{item.subjects}</TableCell>
                        <TableCell>{item.boards}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="mx-auto max-w-4xl mt-8">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {additionalInfo.map((info, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-sankalp-600">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                For more information about our fee structure or to discuss scholarship opportunities, please contact us.
              </p>
              <Link href="/contact">
                <Button className="bg-sankalp-600 hover:bg-sankalp-700 text-black">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
