import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "pankajchias@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "", // You'll need to set this in your environment variables
  },
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { studentId, studentName, parentEmail, date, subject, status } = data

    // Validate the request
    if (!studentId || !studentName || !parentEmail || !date || !subject || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create email content
    const subject_line = `Attendance Update for ${studentName} - ${date}`
    const html_content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffeb3b; padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #000;">Sankalp95 Coaching</h1>
          <p style="margin: 5px 0 0; color: #000;">Attendance Notification</p>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear Parent,</p>
          <p>This is to inform you about the attendance status of your child:</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid ${
            status === "present" ? "#4caf50" : "#f44336"
          };">
            <p><strong>Student Name:</strong> ${studentName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Status:</strong> <span style="color: ${
              status === "present" ? "#4caf50" : "#f44336"
            }; font-weight: bold;">${status.toUpperCase()}</span></p>
          </div>
          <p>Regular attendance is crucial for academic success. If you have any concerns, please feel free to contact us.</p>
          <p>Thank you,</p>
          <p><strong>Pankaj Chauhan</strong><br>Sankalp95 Coaching<br>Contact: 8429479704, 9453017576</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>554Kha/493 Visheshwar Nagar, Alambagh, Lucknow - 226005</p>
        </div>
      </div>
    `

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER || "pankajchias@gmail.com",
      to: parentEmail,
      subject: subject_line,
      html: html_content,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Attendance notification sent successfully" })
  } catch (error) {
    console.error("Error sending attendance notification:", error)
    return NextResponse.json({ error: "Failed to send attendance notification" }, { status: 500 })
  }
}
