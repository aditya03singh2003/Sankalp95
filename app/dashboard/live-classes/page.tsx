import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Video } from "lucide-react"

export default function LiveClassesPage() {
  // Sample data for upcoming classes
  const upcomingClasses = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Quadratic Equations",
      date: "Today",
      time: "4:00 PM - 5:30 PM",
      teacher: "Dr. Amit Kumar",
      students: 28,
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Laws of Motion",
      date: "Tomorrow",
      time: "2:00 PM - 3:30 PM",
      teacher: "Mrs. Priya Singh",
      students: 32,
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Periodic Table",
      date: "Wed, 27 Mar",
      time: "5:00 PM - 6:30 PM",
      teacher: "Mr. Rajesh Verma",
      students: 25,
    },
    {
      id: 4,
      subject: "Biology",
      topic: "Cell Structure",
      date: "Thu, 28 Mar",
      time: "3:00 PM - 4:30 PM",
      teacher: "Dr. Meena Sharma",
      students: 30,
    },
    {
      id: 5,
      subject: "English",
      topic: "Grammar and Composition",
      date: "Fri, 29 Mar",
      time: "1:00 PM - 2:30 PM",
      teacher: "Mrs. Anjali Gupta",
      students: 35,
    },
  ]

  // Sample data for past classes
  const pastClasses = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Algebra Basics",
      date: "Mon, 20 Mar",
      time: "4:00 PM - 5:30 PM",
      teacher: "Dr. Amit Kumar",
      recording: true,
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Kinematics",
      date: "Fri, 17 Mar",
      time: "2:00 PM - 3:30 PM",
      teacher: "Mrs. Priya Singh",
      recording: true,
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Chemical Bonding",
      date: "Wed, 15 Mar",
      time: "5:00 PM - 6:30 PM",
      teacher: "Mr. Rajesh Verma",
      recording: true,
    },
    {
      id: 4,
      subject: "Biology",
      topic: "Introduction to Genetics",
      date: "Mon, 13 Mar",
      time: "3:00 PM - 4:30 PM",
      teacher: "Dr. Meena Sharma",
      recording: false,
    },
    {
      id: 5,
      subject: "English",
      topic: "Essay Writing",
      date: "Fri, 10 Mar",
      time: "1:00 PM - 2:30 PM",
      teacher: "Mrs. Anjali Gupta",
      recording: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Classes</h2>
          <p className="text-muted-foreground">Join interactive live classes with your teachers</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="past">Past Classes</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingClasses.map((cls) => (
            <Card key={cls.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium leading-none">
                        {cls.subject}: {cls.topic}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {cls.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {cls.time}
                      </div>
                      <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {cls.students} students enrolled
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <Button variant="outline">Add to Calendar</Button>
                    <Button>Join Class</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {pastClasses.map((cls) => (
            <Card key={cls.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Video className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium leading-none">
                        {cls.subject}: {cls.topic}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {cls.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {cls.time}
                      </div>
                      <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    {cls.recording ? (
                      <Button>Watch Recording</Button>
                    ) : (
                      <Button variant="outline" disabled>
                        No Recording
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
