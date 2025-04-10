import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Filter, Play, Search, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RecordedLecturesPage() {
  // Sample data for recorded lectures
  const lectures = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Quadratic Equations",
      date: "20 Mar 2023",
      duration: "1h 30m",
      teacher: "Dr. Amit Kumar",
      thumbnail: "/placeholder.svg",
      category: "Class X",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Laws of Motion",
      date: "18 Mar 2023",
      duration: "1h 45m",
      teacher: "Mrs. Priya Singh",
      thumbnail: "/placeholder.svg",
      category: "Class X",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Periodic Table",
      date: "15 Mar 2023",
      duration: "1h 15m",
      teacher: "Mr. Rajesh Verma",
      thumbnail: "/placeholder.svg",
      category: "Class X",
    },
    {
      id: 4,
      subject: "Biology",
      topic: "Cell Structure",
      date: "12 Mar 2023",
      duration: "1h 30m",
      teacher: "Dr. Meena Sharma",
      thumbnail: "/placeholder.svg",
      category: "Class X",
    },
    {
      id: 5,
      subject: "English",
      topic: "Grammar and Composition",
      date: "10 Mar 2023",
      duration: "1h 20m",
      teacher: "Mrs. Anjali Gupta",
      thumbnail: "/placeholder.svg",
      category: "Class X",
    },
    {
      id: 6,
      subject: "Mathematics",
      topic: "Calculus Basics",
      date: "8 Mar 2023",
      duration: "1h 40m",
      teacher: "Dr. Amit Kumar",
      thumbnail: "/placeholder.svg",
      category: "Class X",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recorded Lectures</h2>
          <p className="text-muted-foreground">Watch recorded lectures at your own pace</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search lectures..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="english">English</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Lectures</TabsTrigger>
          <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="biology">Biology</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lectures.map((lecture) => (
              <Card key={lecture.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={lecture.thumbnail || "/placeholder.svg"}
                    alt={lecture.topic}
                    className="object-cover w-full h-full"
                    width={300}
                    height={170}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                    {lecture.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-1">
                      {lecture.subject}: {lecture.topic}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {lecture.category}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      {lecture.teacher}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {lecture.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="mathematics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lectures
              .filter((lecture) => lecture.subject === "Mathematics")
              .map((lecture) => (
                <Card key={lecture.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={lecture.thumbnail || "/placeholder.svg"}
                      alt={lecture.topic}
                      className="object-cover w-full h-full"
                      width={300}
                      height={170}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                      {lecture.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-1">
                        {lecture.subject}: {lecture.topic}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {lecture.category}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        {lecture.teacher}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {lecture.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        {/* Similar content for other tabs */}
      </Tabs>
    </div>
  )
}
