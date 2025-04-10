"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Send, Clock, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function AdminEmailPage() {
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    recipients: "all", // all, class, individual
    selectedClass: "",
    individualEmail: "",
    includeAttendance: false,
    includeFeeReminder: false,
  })

  const [isSending, setIsSending] = useState(false)
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: "Attendance Reminder",
      subject: "Important: Regular Attendance Reminder",
      message:
        "Dear Parent,\n\nWe would like to remind you about the importance of regular attendance in your child's academic journey. Regular attendance ensures that students don't miss important concepts and lessons.\n\nThank you,\nPankaj Chauhan\nSankalp95 Coaching",
    },
    {
      id: 2,
      name: "Fee Payment Reminder",
      subject: "Fee Payment Reminder for the Month",
      message:
        "Dear Parent,\n\nThis is a friendly reminder that the monthly tuition fee is due by the 10th of this month. Please ensure timely payment to avoid any inconvenience.\n\nThank you,\nPankaj Chauhan\nSankalp95 Coaching",
    },
    {
      id: 3,
      name: "Exam Schedule",
      subject: "Upcoming Examination Schedule",
      message:
        "Dear Parent,\n\nWe are writing to inform you about the upcoming examination schedule for your child. Please ensure that your child prepares well for these exams.\n\nThank you,\nPankaj Chauhan\nSankalp95 Coaching",
    },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmailForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEmailForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEmailForm((prev) => ({ ...prev, [name]: checked }))
  }

  const handleTemplateSelect = (templateId: number) => {
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setEmailForm((prev) => ({
        ...prev,
        subject: template.subject,
        message: template.message,
      }))
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      // In a real application, you would send this data to your API
      // For demonstration purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email sent successfully",
        description: `Email has been sent to ${emailForm.recipients === "all" ? "all parents" : emailForm.recipients === "class" ? `parents of ${emailForm.selectedClass}` : emailForm.individualEmail}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      })

      // Reset form
      setEmailForm({
        subject: "",
        message: "",
        recipients: "all",
        selectedClass: "",
        individualEmail: "",
        includeAttendance: false,
        includeFeeReminder: false,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: "There was an error sending the email. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Communication</h2>
          <p className="text-muted-foreground">Send emails to parents and students</p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList className="bg-sankalp-100 text-black">
          <TabsTrigger value="compose" className="data-[state=active]:bg-sankalp-500">
            Compose Email
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-sankalp-500">
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-sankalp-500">
            Email History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Email</CardTitle>
              <CardDescription>Send emails to parents and students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("recipients", value)}
                    value={emailForm.recipients}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parents</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {emailForm.recipients === "class" && (
                  <div className="space-y-2">
                    <Label htmlFor="selectedClass">Select Class</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("selectedClass", value)}
                      value={emailForm.selectedClass}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Class 1">Class 1</SelectItem>
                        <SelectItem value="Class 2">Class 2</SelectItem>
                        <SelectItem value="Class 3">Class 3</SelectItem>
                        <SelectItem value="Class 4">Class 4</SelectItem>
                        <SelectItem value="Class 5">Class 5</SelectItem>
                        <SelectItem value="Class 6">Class 6</SelectItem>
                        <SelectItem value="Class 7">Class 7</SelectItem>
                        <SelectItem value="Class 8">Class 8</SelectItem>
                        <SelectItem value="Class 9">Class 9</SelectItem>
                        <SelectItem value="Class 10">Class 10</SelectItem>
                        <SelectItem value="Class 11">Class 11</SelectItem>
                        <SelectItem value="Class 12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {emailForm.recipients === "individual" && (
                  <div className="space-y-2">
                    <Label htmlFor="individualEmail">Email Address</Label>
                    <Input
                      id="individualEmail"
                      name="individualEmail"
                      type="email"
                      value={emailForm.individualEmail}
                      onChange={handleInputChange}
                      placeholder="parent@example.com"
                      required={emailForm.recipients === "individual"}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" value={emailForm.subject} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={emailForm.message}
                    onChange={handleInputChange}
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Include Additional Information</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="includeAttendance"
                      checked={emailForm.includeAttendance}
                      onCheckedChange={(checked) => handleCheckboxChange("includeAttendance", checked as boolean)}
                    />
                    <label
                      htmlFor="includeAttendance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include attendance information
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="includeFeeReminder"
                      checked={emailForm.includeFeeReminder}
                      onCheckedChange={(checked) => handleCheckboxChange("includeFeeReminder", checked as boolean)}
                    />
                    <label
                      htmlFor="includeFeeReminder"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include fee payment reminder
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Use Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    {emailTemplates.map((template) => (
                      <Button
                        key={template.id}
                        type="button"
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="bg-sankalp-600 hover:bg-sankalp-700 text-black" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage and use email templates for common communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Button variant="outline" size="sm" onClick={() => handleTemplateSelect(template.id)}>
                        Use Template
                      </Button>
                    </div>
                    <p className="text-sm font-medium mb-1">Subject: {template.subject}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{template.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>View previously sent emails</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No email history available</h3>
                <p className="text-sm text-muted-foreground mt-1">Your sent emails will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
