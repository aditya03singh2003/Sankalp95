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
    const { studentId, studentName, parentEmail, dueDate, amount, className } = data

    // Validate the request
    if (!studentId || !studentName || !parentEmail || !dueDate || !amount || !className) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create email content
    const subject_line = `Fee Payment Reminder for ${studentName}`
    const html_content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffeb3b; padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #000;">Sankalp95 Coaching</h1>
          <p style="margin: 5px 0 0; color: #000;">Fee Payment Reminder</p>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear Parent,</p>
          <p>This is a friendly reminder about the upcoming fee payment for your child:</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #ffeb3b;">
            <p><strong>Student Name:</strong> ${studentName}</p>
            <p><strong>Class:</strong> ${className}</p>
            <p><strong>Amount Due:</strong> ₹${amount}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <p>Please ensure timely payment to avoid any inconvenience. You can pay the fees directly at our coaching center during working hours (3:00 PM to 8:30 PM).</p>
          <p>If you have already made the payment, please disregard this reminder.</p>
          <p>Thank you for your cooperation.</p>
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

    return NextResponse.json({ success: true, message: "Payment reminder sent successfully" })
  } catch (error) {
    console.error("Error sending payment reminder:", error)
    return NextResponse.json({ error: "Failed to send payment reminder" }, { status: 500 })
  }
}
