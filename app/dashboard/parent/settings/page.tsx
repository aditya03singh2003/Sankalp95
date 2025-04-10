"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"

export default function ParentSettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const [profile, setProfile] = useState({
    name: "Parent Name",
    email: "parent@example.com",
    phone: "9876543210",
    address: "123 Main St, City, State, 123456",
    occupation: "Engineer",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    attendance: true,
    fees: true,
    academics: true,
    events: false,
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Profile updated successfully!")
    }, 1000)
  }

  const handleNotificationUpdate = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Notification preferences updated successfully!")
    }, 1000)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()

    if (security.newPassword !== security.confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      alert("Password changed successfully!")
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>

                <form className="flex-1 space-y-4" onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={profile.occupation}
                        onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Notification Types</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="attendance-notifications">Attendance Updates</Label>
                          <p className="text-sm text-muted-foreground">Notifications about your child's attendance</p>
                        </div>
                        <Switch
                          id="attendance-notifications"
                          checked={notifications.attendance}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, attendance: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="fees-notifications">Fee Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about fee payments and due dates
                          </p>
                        </div>
                        <Switch
                          id="fees-notifications"
                          checked={notifications.fees}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, fees: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="academics-notifications">Academic Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about exams, results, and academic performance
                          </p>
                        </div>
                        <Switch
                          id="academics-notifications"
                          checked={notifications.academics}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, academics: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="events-notifications">Events & Activities</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about upcoming events and activities
                          </p>
                        </div>
                        <Switch
                          id="events-notifications"
                          checked={notifications.events}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, events: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="mt-4" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
