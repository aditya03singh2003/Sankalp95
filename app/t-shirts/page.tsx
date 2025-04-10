import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function TShirtsPage() {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Sankalp95 T-Shirts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Show your pride as a Sankalp95 student with our high-quality, comfortable t-shirts. Perfect for casual wear
          and special events.
        </p>
      </div>

      <div className="bg-sankalp-50 p-6 rounded-lg border border-sankalp-100 text-center">
        <h2 className="text-xl font-bold mb-4">Order Your T-Shirt Now!</h2>
        <p className="mb-4">
          Fill out our Google Form to place your order. Payment can be made at the coaching center or through online
          transfer.
        </p>
        <a
          href="https://forms.gle/Yd8Vg5QJZfKZJWQZ6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button size="lg" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
            Order T-Shirt
          </Button>
        </a>
      </div>

      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sankalp-100 text-black">
          <TabsTrigger value="standard" className="data-[state=active]:bg-sankalp-500">
            Standard T-Shirt
          </TabsTrigger>
          <TabsTrigger value="premium" className="data-[state=active]:bg-sankalp-500">
            Premium T-Shirt
          </TabsTrigger>
          <TabsTrigger value="hoodie" className="data-[state=active]:bg-sankalp-500">
            Hoodie
          </TabsTrigger>
        </TabsList>
        <TabsContent value="standard" className="border rounded-b-lg p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Standard T-Shirt"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-black cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer border-2 border-white"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Standard T-Shirt</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">100% Cotton</Badge>
                  <Badge variant="outline">Unisex</Badge>
                  <Badge className="bg-green-500">In Stock</Badge>
                </div>
                <p className="text-2xl font-bold mt-2">₹299</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  Our standard t-shirt features the Sankalp95 logo on the front and is made from 100% cotton for maximum
                  comfort. Perfect for everyday wear and coaching center events.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Features</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>100% cotton material</li>
                  <li>Round neck design</li>
                  <li>Sankalp95 logo on front</li>
                  <li>Available in multiple colors</li>
                  <li>Sizes: S, M, L, XL, XXL</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Size Guide</h3>
                <div className="border rounded-lg overflow-hidden mt-2">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Size</th>
                        <th className="p-2 text-left">Chest (inches)</th>
                        <th className="p-2 text-left">Length (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">S</td>
                        <td className="p-2">36-38</td>
                        <td className="p-2">27</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">M</td>
                        <td className="p-2">38-40</td>
                        <td className="p-2">28</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">L</td>
                        <td className="p-2">40-42</td>
                        <td className="p-2">29</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">XL</td>
                        <td className="p-2">42-44</td>
                        <td className="p-2">30</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2">XXL</td>
                        <td className="p-2">44-46</td>
                        <td className="p-2">31</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <a
                href="https://forms.gle/Yd8Vg5QJZfKZJWQZ6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="w-full bg-sankalp-600 hover:bg-sankalp-700 text-black">Order Now</Button>
              </a>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="premium" className="border rounded-b-lg p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Premium T-Shirt"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-gray-800 cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-indigo-500 cursor-pointer border-2 border-white"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Premium T-Shirt</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">Pima Cotton</Badge>
                  <Badge variant="outline">Unisex</Badge>
                  <Badge className="bg-amber-500">Limited Stock</Badge>
                </div>
                <p className="text-2xl font-bold mt-2">₹499</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  Our premium t-shirt is made from high-quality Pima cotton for exceptional softness and durability.
                  Features an embroidered Sankalp95 logo and comes in exclusive colors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Features</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Premium Pima cotton material</li>
                  <li>Embroidered logo</li>
                  <li>Reinforced stitching</li>
                  <li>Exclusive color options</li>
                  <li>Sizes: S, M, L, XL, XXL</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Student Testimonials</h3>
                <div className="space-y-2 mt-2">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm italic">
                      "The premium t-shirt is so comfortable! I wear it all the time. The quality is excellent."
                    </p>
                    <p className="text-sm font-medium mt-1">- Rahul K., Class 10</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm italic">
                      "Love the embroidered logo and the fabric quality. Worth the extra cost!"
                    </p>
                    <p className="text-sm font-medium mt-1">- Priya S., Class 12</p>
                  </div>
                </div>
              </div>
              <a
                href="https://forms.gle/Yd8Vg5QJZfKZJWQZ6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="w-full bg-sankalp-600 hover:bg-sankalp-700 text-black">Order Now</Button>
              </a>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="hoodie" className="border rounded-b-lg p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Sankalp95 Hoodie"
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-blue-700 cursor-pointer border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-red-700 cursor-pointer border-2 border-white"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Sankalp95 Hoodie</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">Cotton Blend</Badge>
                  <Badge variant="outline">Unisex</Badge>
                  <Badge className="bg-red-500">Pre-Order</Badge>
                </div>
                <p className="text-2xl font-bold mt-2">₹799</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  Stay warm and stylish with our Sankalp95 hoodie. Features a comfortable cotton blend fabric, kangaroo
                  pocket, and adjustable hood. Perfect for cooler weather.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Features</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Cotton blend fabric (80% cotton, 20% polyester)</li>
                  <li>Kangaroo pocket</li>
                  <li>Adjustable hood with drawstrings</li>
                  <li>Ribbed cuffs and hem</li>
                  <li>Sankalp95 logo on front and back</li>
                  <li>Sizes: S, M, L, XL, XXL</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Pre-Order Information</h3>
                <p className="text-muted-foreground">
                  Hoodies are available for pre-order only. Expected delivery within 3-4 weeks after order placement.
                  Limited quantities available.
                </p>
              </div>
              <a
                href="https://forms.gle/Yd8Vg5QJZfKZJWQZ6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="w-full bg-sankalp-600 hover:bg-sankalp-700 text-black">Pre-Order Now</Button>
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ordering Process</CardTitle>
            <CardDescription>How to order your Sankalp95 t-shirt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Fill out the Google Form</p>
                <p className="text-sm text-muted-foreground">
                  Complete all required fields including size, color, and quantity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Make Payment</p>
                <p className="text-sm text-muted-foreground">Pay at the coaching center or through online transfer</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Receive Confirmation</p>
                <p className="text-sm text-muted-foreground">You'll receive an order confirmation via email or SMS</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                4
              </div>
              <div>
                <p className="font-medium">Collect Your T-Shirt</p>
                <p className="text-sm text-muted-foreground">
                  Pick up your t-shirt from the coaching center on the specified date
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Ways to pay for your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Cash Payment</h3>
              <p className="text-sm text-muted-foreground">Pay directly at the Sankalp95 coaching center reception</p>
            </div>
            <div>
              <h3 className="font-medium">UPI Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Make a UPI payment to our registered number (details provided after form submission)
              </p>
            </div>
            <div>
              <h3 className="font-medium">Bank Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Transfer the amount to our bank account (details provided after form submission)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Please mention your name and order number in all payment communications
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
            <CardDescription>Common questions about t-shirt orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">How long will delivery take?</h3>
              <p className="text-sm text-muted-foreground">
                Standard t-shirts are usually available for pickup within 7-10 days. Hoodies may take 3-4 weeks.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Can I exchange my t-shirt if it doesn't fit?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can exchange unworn t-shirts within 7 days of pickup, subject to availability.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Are there any discounts for bulk orders?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 10% discount for orders of 5 or more t-shirts. Please mention in the form.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm">
              For more questions, contact us at{" "}
              <Link href="mailto:info@sankalp95.com" className="text-primary hover:underline">
                info@sankalp95.com
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
