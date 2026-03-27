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

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@unfoldcro.in";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vansh-vriksh.unfoldcro.in";

function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1A1207;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1207;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFBF0;border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1A1207 0%,#2D1F0E 100%);padding:28px 32px;text-align:center;">
            <div style="font-size:36px;line-height:1;">🌳</div>
            <h1 style="margin:8px 0 0;color:#C9A84C;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              Vansh Vriksh — वंश वृक्ष
            </h1>
            <p style="margin:4px 0 0;color:#C9A84C99;font-size:12px;letter-spacing:1px;">
              DIGITIZE YOUR ANCESTRAL LEGACY
            </p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F5F0E8;padding:20px 32px;text-align:center;border-top:1px solid #E8DCC8;">
            <p style="margin:0;color:#1A120766;font-size:11px;font-style:italic;">
              सेवा परमो धर्मः — Service is the highest duty
            </p>
            <p style="margin:8px 0 0;color:#1A120744;font-size:10px;">
              <a href="${APP_URL}" style="color:#C9A84C;text-decoration:none;">vansh-vriksh.unfoldcro.in</a>
              &nbsp;|&nbsp; 100% Free &nbsp;|&nbsp; No Ads &nbsp;|&nbsp; Seva
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  const content = `
    <h2 style="margin:0 0 4px;color:#1A1207;font-size:18px;font-weight:700;">
      Welcome! / स्वागत है!
    </h2>
    <p style="margin:0 0 20px;color:#1A120799;font-size:14px;">
      Please verify your email to complete registration.<br/>
      रजिस्ट्रेशन पूरा करने के लिए ईमेल सत्यापित करें।
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:8px 0 24px;">
        <a href="${verifyUrl}" style="display:inline-block;background:#C9A84C;color:#1A1207;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
          ✅ Verify Email / ईमेल सत्यापित करें
        </a>
      </td></tr>
    </table>

    <div style="background:#F5F0E8;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <p style="margin:0;color:#1A120766;font-size:12px;">
        Or copy this link / या यह लिंक कॉपी करें:
      </p>
      <p style="margin:4px 0 0;word-break:break-all;">
        <a href="${verifyUrl}" style="color:#C9A84C;font-size:11px;text-decoration:none;">${verifyUrl}</a>
      </p>
    </div>

    <p style="margin:0;color:#1A120755;font-size:11px;text-align:center;">
      This link expires in 24 hours. / यह लिंक 24 घंटे में समाप्त होगा।<br/>
      If you didn't create an account, ignore this email.
    </p>`;

  await transporter.sendMail({
    from: `"Vansh Vriksh 🌳" <${FROM}>`,
    to: email,
    subject: "🌳 Vansh Vriksh — Email Verification / ईमेल सत्यापन",
    html: emailWrapper(content),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const content = `
    <h2 style="margin:0 0 4px;color:#1A1207;font-size:18px;font-weight:700;">
      Password Reset / पासवर्ड रीसेट
    </h2>
    <p style="margin:0 0 20px;color:#1A120799;font-size:14px;">
      You requested a password reset.<br/>
      आपने पासवर्ड रीसेट का अनुरोध किया है।
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:8px 0 24px;">
        <a href="${resetUrl}" style="display:inline-block;background:#C9A84C;color:#1A1207;padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
          🔑 Reset Password / पासवर्ड रीसेट करें
        </a>
      </td></tr>
    </table>

    <div style="background:#F5F0E8;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
      <p style="margin:0;color:#1A120766;font-size:12px;">
        Or copy this link / या यह लिंक कॉपी करें:
      </p>
      <p style="margin:4px 0 0;word-break:break-all;">
        <a href="${resetUrl}" style="color:#C9A84C;font-size:11px;text-decoration:none;">${resetUrl}</a>
      </p>
    </div>

    <p style="margin:0;color:#1A120755;font-size:11px;text-align:center;">
      This link expires in 1 hour. / यह लिंक 1 घंटे में समाप्त होगा।<br/>
      If you didn't request this, ignore this email. Your password won't change.
    </p>`;

  await transporter.sendMail({
    from: `"Vansh Vriksh 🌳" <${FROM}>`,
    to: email,
    subject: "🌳 Vansh Vriksh — Password Reset / पासवर्ड रीसेट",
    html: emailWrapper(content),
  });
}
