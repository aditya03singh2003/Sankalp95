import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import { connectToDatabase } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password")
        }

        try {
          await connectToDatabase()
          console.log("Connected to MongoDB in NextAuth")

          // Try to find user by email first
          let user = await User.findOne({ email: credentials.email })

          // If not found by email, try to find by ID (for student/teacher IDs)
          if (!user) {
            // Check if the identifier might be a student or teacher ID
            user = await User.findOne({
              $or: [{ studentId: credentials.email }, { teacherId: credentials.email }],
            })
          }

          if (!user) {
            console.log("No user found with identifier:", credentials.email)
            throw new Error("No user found with this email or ID")
          }

          console.log("Login attempt for user:", user.email)

          // Use bcrypt.compare directly without any pre-processing
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

          console.log("Password comparison result:", isPasswordCorrect)

          if (!isPasswordCorrect) {
            throw new Error("Invalid password")
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.profileImage || "",
          }
        } catch (error: any) {
          console.error("Authentication error:", error)

          // Check if it's a database connection error
          if (error.name === "MongooseServerSelectionError") {
            throw new Error("Database connection failed. Please try again later.")
          }

          throw new Error(error.message || "Authentication failed")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

export default authOptions
