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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"

export default function AdminLecturesPage() {
  const [lectures, setLectures] = useState([
    {
      id: 1,
      subject: "Mathematics",
      topic: "Quadratic Equations",
      class: "Class 10",
      youtubeUrl: "https://www.youtube.com/embed/example1",
      date: "20 Mar 2023",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Laws of Motion",
      class: "Class 10",
      youtubeUrl: "https://www.youtube.com/embed/example2",
      date: "18 Mar 2023",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Periodic Table",
      class: "Class 10",
      youtubeUrl: "https://www.youtube.com/embed/example3",
      date: "15 Mar 2023",
    },
  ])

  const [newLecture, setNewLecture] = useState({
    subject: "",
    topic: "",
    class: "",
    youtubeUrl: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewLecture((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewLecture((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would send this data to your API
    // For now, we'll just add it to our local state
    const newId = lectures.length > 0 ? Math.max(...lectures.map((l) => l.id)) + 1 : 1
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    setLectures([
      ...lectures,
      {
        id: newId,
        subject: newLecture.subject,
        topic: newLecture.topic,
        class: newLecture.class,
        youtubeUrl: newLecture.youtubeUrl,
        date: currentDate,
      },
    ])

    // Reset the form
    setNewLecture({
      subject: "",
      topic: "",
      class: "",
      youtubeUrl: "",
      description: "",
    })
  }

  const handleDeleteLecture = (id: number) => {
    setLectures(lectures.filter((lecture) => lecture.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Lectures</h2>
          <p className="text-muted-foreground">Add, edit, or remove recorded lectures for students</p>
        </div>
      </div>

      <Tabs defaultValue="add" className="space-y-4">
        <TabsList className="bg-sankalp-100 text-black">
          <TabsTrigger value="add" className="data-[state=active]:bg-sankalp-500">
            Add New Lecture
          </TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-sankalp-500">
            Manage Lectures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Lecture</CardTitle>
              <CardDescription>Add a new recorded lecture by providing the YouTube URL and details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLecture} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={(value) => handleSelectChange("subject", value)} value={newLecture.subject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Social Science">Social Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select onValueChange={(value) => handleSelectChange("class", value)} value={newLecture.class}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" name="topic" value={newLecture.topic} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    name="youtubeUrl"
                    value={newLecture.youtubeUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use the embed URL format: https://www.youtube.com/embed/VIDEO_ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newLecture.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                  Add Lecture
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Existing Lectures</CardTitle>
              <CardDescription>View, edit, or delete recorded lectures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium">{lecture.id}</TableCell>
                        <TableCell>{lecture.subject}</TableCell>
                        <TableCell>{lecture.topic}</TableCell>
                        <TableCell>{lecture.class}</TableCell>
                        <TableCell>{lecture.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteLecture(lecture.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {lectures.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No lectures found. Add some lectures to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
