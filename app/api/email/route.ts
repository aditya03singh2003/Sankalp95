import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Configure nodemailer with the provided credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aditya03singh2003@gmail.com",
    pass: "chauhan54321", // In a real app, this would be stored securely in environment variables
  },
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { to, subject, html, text } = data

    // Validate the request
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send the email
    const mailOptions = {
      from: "Sankalp95 Coaching <aditya03singh2003@gmail.com>",
      to,
      subject,
      html,
      text,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
