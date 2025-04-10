import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-sankalp-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get in touch with Sankalp95 Coaching for any queries or information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" rows={4} required />
                    </div>
                    <Button type="submit" className="w-full bg-sankalp-600 hover:bg-sankalp-700 text-black">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Reach out to us directly using the information below</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-5 w-5 text-sankalp-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Phone Numbers</h3>
                        <p className="text-muted-foreground">8429479704, 9453017576</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="h-5 w-5 text-sankalp-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-muted-foreground">pankajchias@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-sankalp-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-muted-foreground">554Kha/493 Visheshwar Nagar, Alambagh, Lucknow - 226005</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Clock className="h-5 w-5 text-sankalp-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Coaching Hours</h3>
                        <p className="text-muted-foreground">3:00 PM to 8:30 PM</p>
                        <p className="text-sm text-muted-foreground">Open all days except national holidays</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center p-4">
                        <MapPin className="h-8 w-8 text-sankalp-600 mx-auto mb-2" />
                        <p className="font-medium">Sankalp95 Coaching</p>
                        <p className="text-sm text-muted-foreground">
                          554Kha/493 Visheshwar Nagar, Alambagh, Lucknow - 226005
                        </p>
                        <Button variant="outline" className="mt-4 text-xs">
                          Open in Google Maps
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
