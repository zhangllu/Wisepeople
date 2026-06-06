import nodemailer from "nodemailer"

const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_PASS)

const transport = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER || "resend",
        pass: process.env.SMTP_PASS || "",
      },
    })
  : null

const fromAddress = process.env.SMTP_FROM || "noreply@ask-kelly.com"

export async function sendOTPEmail(params: {
  email: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password" | "change-email"
}) {
  const { email, otp, type } = params

  if (!transport) {
    console.log(`[OTP] ${type}: ${email} → ${otp}`)
    return
  }

  const subjectMap = {
    "sign-in": "问凯利 - 登录验证码",
    "email-verification": "问凯利 - 邮箱验证码",
    "forget-password": "问凯利 - 重置密码验证码",
    "change-email": "问凯利 - 修改邮箱验证码",
  }

  const html = `
    <div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif">
      <div style="text-align:center;font-size:28px;margin-bottom:16px">🧑‍🏫</div>
      <h2 style="text-align:center;color:#333">问凯利</h2>
      <p style="color:#666;font-size:14px;line-height:1.6">
        你的验证码为：
      </p>
      <div style="text-align:center;margin:24px 0">
        <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4f46e5">${otp}</span>
      </div>
      <p style="color:#999;font-size:12px">验证码 5 分钟内有效，请勿泄露给他人。</p>
    </div>
  `

  await transport.sendMail({
    from: fromAddress,
    to: email,
    subject: subjectMap[type],
    html,
  })
}
