export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  securityToken: string
}

export function generateContactEmailTemplate(data: ContactFormData): string {
  const { name, email, subject, message, securityToken } = data
  const timestamp = new Date().toISOString()

  return `
    <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #334155;">
      <!-- Header -->
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-family: 'Orbitron', sans-serif; color: #0ea5e9; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">New Contact Form Submission</h1>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">${new Date().toLocaleDateString()} • Portfolio Contact</p>
      </div>
      
      <!-- Contact Info -->
      <div style="margin-bottom: 24px;">
        <div style="background: #1e293b; padding: 16px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #0ea5e9;">
          <div style="color: #0ea5e9; font-size: 12px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">From</div>
          <div style="color: #e2e8f0; font-size: 16px;">${name}</div>
        </div>
        
        <div style="background: #1e293b; padding: 16px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #0ea5e9;">
          <div style="color: #0ea5e9; font-size: 12px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Email</div>
          <div style="font-size: 16px;">
            <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
          </div>
        </div>
        
        <div style="background: #1e293b; padding: 16px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #0ea5e9;">
          <div style="color: #0ea5e9; font-size: 12px; font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</div>
          <div style="color: #e2e8f0; font-size: 16px;">${subject}</div>
        </div>
      </div>
      
      <!-- Message -->
      <div style="margin-bottom: 24px;">
        <div style="color: #10b981; font-size: 12px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Message</div>
        <div style="background: #1e293b; padding: 20px; border-radius: 6px; border-left: 3px solid #10b981;">
          <div style="color: #e2e8f0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
           style="background: linear-gradient(135deg, #0ea5e9, #38bdf8); color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block; margin: 0 4px;">
          Reply
        </a>
        <a href="mailto:${email}" 
           style="background: #374151; color: #e2e8f0; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block; margin: 0 4px; border: 1px solid #4b5563;">
          Contact
        </a>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid #334155; padding-top: 16px; font-size: 12px; color: #64748b;">
        <div style="margin-bottom: 4px;">Security Token: <span style="font-family: monospace; background: #374151; padding: 2px 6px; border-radius: 3px;">${securityToken}</span></div>
        <div>Timestamp: ${timestamp}</div>
      </div>
    </div>
  `
}

// Clean minimal version
export function generateMinimalContactEmailTemplate(data: ContactFormData): string {
  const { name, email, subject, message, securityToken } = data

  return `
    <div style="font-family: 'JetBrains Mono', monospace; max-width: 500px; margin: 0 auto; padding: 20px; background: #0f172a; color: #e2e8f0; border-radius: 6px;">
      <h2 style="color: #0ea5e9; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Contact Form Message</h2>
      
      <div style="background: #1e293b; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #0ea5e9;">From:</strong> ${name}</p>
        <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #0ea5e9;">Email:</strong> <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></p>
        <p style="margin: 0; font-size: 14px;"><strong style="color: #0ea5e9;">Subject:</strong> ${subject}</p>
      </div>
      
      <div style="background: #1e293b; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
        <div style="color: #10b981; font-size: 12px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase;">Message</div>
        <div style="font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
      </div>
      
      <div style="font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 12px;">
        Token: ${securityToken} • ${new Date().toLocaleDateString()}
      </div>
    </div>
  `
}