import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 8px;">
          <h2 style="color: #06b6d4; margin-bottom: 20px;">🚀 New Contact Form Submission</h2>
          
          <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <strong style="color: #22d3ee;">Name:</strong> ${name}
          </div>
          
          <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <strong style="color: #22d3ee;">Email:</strong> ${email}
          </div>
          
          <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <strong style="color: #22d3ee;">Subject:</strong> ${subject}
          </div>
          
          <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <strong style="color: #22d3ee;">Message:</strong><br>
            <div style="margin-top: 10px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; background: #065f46; border-radius: 6px; font-size: 12px;">
            <strong style="color: #10b981;">Security Token:</strong> ${securityToken}<br>
            <strong style="color: #10b981;">Timestamp:</strong> ${new Date().toISOString()}
          </div>
        </div>
      `,
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