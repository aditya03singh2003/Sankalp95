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
import { Badge } from "@/components/ui/badge"
import { Edit, Trash, Video, LinkIcon, ExternalLink, Play, Plus } from "lucide-react"

// Sample YouTube videos from Sankalp95 channel
const sampleVideos = [
  {
    id: 1,
    title: "Class 10 Mathematics: Quadratic Equations",
    youtubeId: "example1",
    class: "Class 10",
    subject: "Mathematics",
    uploadDate: "15 Mar 2023",
    duration: "45:20",
    views: 256,
    description: "Complete explanation of quadratic equations for Class 10 students.",
  },
  {
    id: 2,
    title: "Class 10 Physics: Laws of Motion",
    youtubeId: "example2",
    class: "Class 10",
    subject: "Physics",
    uploadDate: "12 Mar 2023",
    duration: "52:15",
    views: 189,
    description: "Detailed explanation of Newton's laws of motion for Class 10 students.",
  },
  {
    id: 3,
    title: "Class 11 Chemistry: Periodic Table",
    youtubeId: "example3",
    class: "Class 11",
    subject: "Chemistry",
    uploadDate: "10 Mar 2023",
    duration: "48:30",
    views: 210,
    description: "Comprehensive guide to the periodic table for Class 11 students.",
  },
  {
    id: 4,
    title: "Class 9 Mathematics: Algebra Basics",
    youtubeId: "example4",
    class: "Class 9",
    subject: "Mathematics",
    uploadDate: "8 Mar 2023",
    duration: "40:15",
    views: 175,
    description: "Introduction to algebraic concepts for Class 9 students.",
  },
  {
    id: 5,
    title: "Class 12 Physics: Electrostatics",
    youtubeId: "example5",
    class: "Class 12",
    subject: "Physics",
    uploadDate: "5 Mar 2023",
    duration: "55:10",
    views: 230,
    description: "Detailed explanation of electrostatics concepts for Class 12 students.",
  },
  {
    id: 6,
    title: "Class 8 Science: Cell Structure",
    youtubeId: "example6",
    class: "Class 8",
    subject: "Science",
    uploadDate: "3 Mar 2023",
    duration: "38:45",
    views: 145,
    description: "Comprehensive explanation of cell structure for Class 8 students.",
  },
]

export default function AdminYouTubePage() {
  const [videos, setVideos] = useState(sampleVideos)
  const [newVideo, setNewVideo] = useState({
    title: "",
    youtubeId: "",
    class: "",
    subject: "",
    description: "",
  })
  const [activeTab, setActiveTab] = useState("manage")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewVideo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewVideo((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would send this data to your API
    const newId = videos.length > 0 ? Math.max(...videos.map((v) => v.id)) + 1 : 1
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    setVideos([
      ...videos,
      {
        id: newId,
        title: newVideo.title,
        youtubeId: newVideo.youtubeId,
        class: newVideo.class,
        subject: newVideo.subject,
        uploadDate: currentDate,
        duration: "00:00", // This would be fetched from YouTube API in a real app
        views: 0,
        description: newVideo.description,
      },
    ])

    // Reset the form
    setNewVideo({
      title: "",
      youtubeId: "",
      class: "",
      subject: "",
      description: "",
    })

    // Switch to manage tab
    setActiveTab("manage")
  }

  const handleDeleteVideo = (id: number) => {
    setVideos(videos.filter((video) => video.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">YouTube Management</h2>
          <p className="text-muted-foreground">Manage recorded lectures from the Sankalp95 YouTube channel</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://www.youtube.com/@Sankalp9510th", "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Channel
          </Button>
          <Button size="sm" onClick={() => setActiveTab("add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-sankalp-100 text-black">
          <TabsTrigger value="manage" className="data-[state=active]:bg-sankalp-500">
            Manage Videos
          </TabsTrigger>
          <TabsTrigger value="add" className="data-[state=active]:bg-sankalp-500">
            Add New Video
          </TabsTrigger>
          <TabsTrigger value="playlists" className="data-[state=active]:bg-sankalp-500">
            Manage Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recorded Lectures</CardTitle>
              <CardDescription>Manage videos from the Sankalp95 YouTube channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{video.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {video.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{video.class}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{video.subject}</Badge>
                        </TableCell>
                        <TableCell>{video.uploadDate}</TableCell>
                        <TableCell>{video.duration}</TableCell>
                        <TableCell>{video.views}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank")
                              }
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Video</CardTitle>
              <CardDescription>Add a new recorded lecture from YouTube</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input id="title" name="title" value={newVideo.title} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeId">YouTube Video ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="youtubeId"
                      name="youtubeId"
                      value={newVideo.youtubeId}
                      onChange={handleInputChange}
                      placeholder="e.g. dQw4w9WgXcQ"
                      required
                    />
                    <Button type="button" variant="outline" className="shrink-0">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Extract ID
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The YouTube video ID is the part after "v=" in the URL. For example, in
                    https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select value={newVideo.class} onValueChange={(value) => handleSelectChange("class", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={`Class ${i + 1}`}>
                            Class {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={newVideo.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
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
                        <SelectItem value="Social Studies">Social Studies</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newVideo.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                    <Video className="mr-2 h-4 w-4" />
                    Add Video
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("manage")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Playlists</CardTitle>
              <CardDescription>Organize videos into playlists by class and subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Class 10 - Mathematics</h3>
                    <Badge>3 videos</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete mathematics lectures for Class 10 students
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Playlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Class 10 - Science</h3>
                    <Badge>5 videos</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Physics, Chemistry and Biology lectures for Class 10
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Playlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Class 11 - PCM</h3>
                    <Badge>7 videos</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Physics, Chemistry and Mathematics for Class 11</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Playlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Class 12 - PCM</h3>
                    <Badge>6 videos</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Physics, Chemistry and Mathematics for Class 12</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Playlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Class 9 - All Subjects</h3>
                    <Badge>4 videos</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Complete lectures for all subjects of Class 9</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Playlist
                  </Button>
                </div>

                <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center p-6">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-semibold">Create New Playlist</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Organize videos by class and subject</p>
                  <Button variant="outline" size="sm">
                    Create Playlist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
