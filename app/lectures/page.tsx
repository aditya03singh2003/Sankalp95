import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Filter, Play, Search, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LecturesPage() {
  // Sample data for recorded lectures
  const lectures = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Quadratic Equations",
      class: "Class 10",
      date: "20 Mar 2023",
      duration: "1h 30m",
      teacher: "Mr. Pankaj Chauhan",
      thumbnail: "/placeholder.svg",
      youtubeUrl: "https://www.youtube.com/embed/example1",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Laws of Motion",
      class: "Class 10",
      date: "18 Mar 2023",
      duration: "1h 45m",
      teacher: "Mr. Pankaj Chauhan",
      thumbnail: "/placeholder.svg",
      youtubeUrl: "https://www.youtube.com/embed/example2",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Periodic Table",
      class: "Class 10",
      date: "15 Mar 2023",
      duration: "1h 15m",
      teacher: "Mr. Pankaj Chauhan",
      thumbnail: "/placeholder.svg",
      youtubeUrl: "https://www.youtube.com/embed/example3",
    },
    {
      id: 4,
      subject: "Biology",
      topic: "Cell Structure",
      class: "Class 10",
      date: "12 Mar 2023",
      duration: "1h 30m",
      teacher: "Mr. Pankaj Chauhan",
      thumbnail: "/placeholder.svg",
      youtubeUrl: "https://www.youtube.com/embed/example4",
    },
    {
      id: 5,
      subject: "Mathematics",
      topic: "Algebra Basics",
      class: "Class 9",
      date: "10 Mar 2023",
      duration: "1h 20m",
      teacher: "Mr. Pankaj Chauhan",
      thumbnail: "/placeholder.svg",
      youtubeUrl: "https://www.youtube.com/embed/example5",
    },
    {
      id: 6,
      subject: "Physics",
      topic: "Kinematics",
      class: "Class 11",
      date: "8 Mar 2023",
      duration: "1h 40m",
      teacher: "Mr. Pankaj Chauhan",
      thumbnail: "/placeholder.svg",
      youtubeUrl: "https://www.youtube.com/embed/example6",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-sankalp-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter">Recorded Lectures</h1>
                <p className="text-muted-foreground">Watch recorded lectures at your own pace</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search lectures..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="class6">Class 6</SelectItem>
                    <SelectItem value="class7">Class 7</SelectItem>
                    <SelectItem value="class8">Class 8</SelectItem>
                    <SelectItem value="class9">Class 9</SelectItem>
                    <SelectItem value="class10">Class 10</SelectItem>
                    <SelectItem value="class11">Class 11</SelectItem>
                    <SelectItem value="class12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
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
              <TabsList className="bg-sankalp-100 text-black">
                <TabsTrigger value="all" className="data-[state=active]:bg-sankalp-500">
                  All Lectures
                </TabsTrigger>
                <TabsTrigger value="mathematics" className="data-[state=active]:bg-sankalp-500">
                  Mathematics
                </TabsTrigger>
                <TabsTrigger value="physics" className="data-[state=active]:bg-sankalp-500">
                  Physics
                </TabsTrigger>
                <TabsTrigger value="chemistry" className="data-[state=active]:bg-sankalp-500">
                  Chemistry
                </TabsTrigger>
                <TabsTrigger value="biology" className="data-[state=active]:bg-sankalp-500">
                  Biology
                </TabsTrigger>
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
                            {lecture.class}
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
                        <Button className="w-full mt-4 bg-sankalp-600 hover:bg-sankalp-700 text-black">
                          Watch Lecture
                        </Button>
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
                              {lecture.class}
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
                          <Button className="w-full mt-4 bg-sankalp-600 hover:bg-sankalp-700 text-black">
                            Watch Lecture
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              {/* Similar content for other tabs */}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
