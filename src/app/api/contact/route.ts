import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { generateContactEmailTemplate, type ContactFormData } from '@/utils/email-template'

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, securityToken } = await request.json()

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Prepare email data
    const emailData: ContactFormData = {
      name,
      email,
      subject,
      message,
      securityToken
    }

    // Email options
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `Portfolio Contact: ${subject}`,
      html: generateContactEmailTemplate(emailData),
      replyTo: email, // Allow direct reply to sender
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}