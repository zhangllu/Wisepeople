import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { emailOTP } from "better-auth/plugins/email-otp"
import { db } from "@/db"
import * as schema from "@/db/schema"
import { sendOTPEmail } from "@/lib/email"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      usedTokens: {
        type: "number",
        defaultValue: 0,
      },
      totalTokens: {
        type: "number",
        defaultValue: 100000,
      },
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`[OTP] ${type}: ${email} → ${otp}`)
          return
        }
        await sendOTPEmail({ email, otp, type })
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      disableSignUp: false,
    }),
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
})
