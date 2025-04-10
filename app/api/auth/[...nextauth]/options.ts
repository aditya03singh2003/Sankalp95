import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please provide email/ID and password")
        }

        try {
          await connectToDatabase()
          console.log("Connected to MongoDB in NextAuth")

          // First try to find user by email
          let user = await User.findOne({ email: credentials.identifier }).lean()

          // If not found by email, check if it's a student ID
          if (!user) {
            const student = await Student.findOne({ studentId: credentials.identifier }).lean()
            if (student) {
              user = await User.findOne({ email: student.email }).lean()
            }
          }

          // If still not found, check if it's a teacher ID
          if (!user) {
            const teacher = await Teacher.findOne({ teacherId: credentials.identifier }).lean()
            if (teacher) {
              user = await User.findOne({ email: teacher.email }).lean()
            }
          }

          if (!user) {
            console.log("No user found with identifier:", credentials.identifier)
            throw new Error("No user found with this email or ID")
          }

          console.log("Login - Identifier:", credentials.identifier)

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
            studentId: user.studentId || "",
            teacherId: user.teacherId || "",
          }
        } catch (error) {
          console.error("Authentication error:", error)
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
        token.studentId = user.studentId || ""
        token.teacherId = user.teacherId || ""
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.studentId = token.studentId || ""
        session.user.teacherId = token.teacherId || ""
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
