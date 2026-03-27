import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@vansh-vriksh.unfoldcro.in";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://vansh-vriksh.unfoldcro.in"}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"Vansh Vriksh 🌳" <${FROM}>`,
    to: email,
    subject: "🌳 Vansh Vriksh — Email Verification / ईमेल सत्यापन",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #FFFBF0; border-radius: 12px;">
        <h2 style="color: #C9A84C; margin: 0 0 8px;">🌳 Vansh Vriksh — वंश वृक्ष</h2>
        <p style="color: #1A1207; margin: 8px 0;">Welcome! Please verify your email to complete registration.</p>
        <p style="color: #1A1207; margin: 8px 0;">स्वागत है! रजिस्ट्रेशन पूरा करने के लिए ईमेल सत्यापित करें।</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${verifyUrl}" style="display: inline-block; background: #C9A84C; color: #1A1207; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            ✅ Verify Email / ईमेल सत्यापित करें
          </a>
        </div>
        <p style="color: #666; font-size: 13px;">
          Or copy this link / या यह लिंक कॉपी करें:<br/>
          <a href="${verifyUrl}" style="color: #C9A84C; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          This link expires in 24 hours. / यह लिंक 24 घंटे में समाप्त होगा।<br/>
          If you didn't create an account, ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #E8DCC8; margin: 16px 0;" />
        <p style="color: #999; font-size: 11px; text-align: center;">सेवा परमो धर्मः — Service is the highest duty</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://vansh-vriksh.unfoldcro.in"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"Vansh Vriksh 🌳" <${FROM}>`,
    to: email,
    subject: "🌳 Vansh Vriksh — Password Reset / पासवर्ड रीसेट",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #FFFBF0; border-radius: 12px;">
        <h2 style="color: #C9A84C; margin: 0 0 8px;">🌳 Vansh Vriksh — वंश वृक्ष</h2>
        <p style="color: #1A1207; margin: 8px 0;">You requested a password reset.</p>
        <p style="color: #1A1207; margin: 8px 0;">आपने पासवर्ड रीसेट का अनुरोध किया है।</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${resetUrl}" style="display: inline-block; background: #C9A84C; color: #1A1207; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            🔑 Reset Password / पासवर्ड रीसेट करें
          </a>
        </div>
        <p style="color: #666; font-size: 13px;">
          Or copy this link / या यह लिंक कॉपी करें:<br/>
          <a href="${resetUrl}" style="color: #C9A84C; word-break: break-all;">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          This link expires in 1 hour. / यह लिंक 1 घंटे में समाप्त होगा।<br/>
          If you didn't request this, ignore this email. Your password won't change.
        </p>
        <hr style="border: none; border-top: 1px solid #E8DCC8; margin: 16px 0;" />
        <p style="color: #999; font-size: 11px; text-align: center;">सेवा परमो धर्मः — Service is the highest duty</p>
      </div>
    `,
  });
}
