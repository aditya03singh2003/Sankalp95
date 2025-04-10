import mongoose from "mongoose"

// Connection object
let connection: typeof mongoose | null = null
let isConnecting = false
let connectionRetries = 0
const MAX_RETRIES = 3

// Connect to MongoDB with retry logic
export async function connectToDatabase() {
  try {
    // If already connected, return the existing connection
    if (mongoose.connection.readyState === 1) {
      console.log("Using existing database connection")
      return mongoose.connection.db
    }

    // If connection is in progress, wait for it
    if (isConnecting) {
      console.log("Connection already in progress, waiting...")
      // Wait for connection to complete (simple polling)
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        if (mongoose.connection.readyState === 1) {
          console.log("Connection established while waiting")
          return mongoose.connection.db
        }
      }
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable")
    }

    // Set connection flag
    isConnecting = true

    try {
      console.log("Creating new database connection")

      // Set mongoose options
      mongoose.set("strictQuery", false)

      // Connect with timeout
      connection = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
      })

      console.log("Database connected successfully")
      isConnecting = false
      connectionRetries = 0
      return mongoose.connection.db
    } catch (error) {
      isConnecting = false
      connectionRetries++

      console.error(`Database connection error (attempt ${connectionRetries}/${MAX_RETRIES}):`, error)

      if (connectionRetries < MAX_RETRIES) {
        console.log(`Retrying connection in 2 seconds...`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return connectToDatabase()
      }

      throw error
    }
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

// Export the connection as default for backward compatibility
export default connectToDatabase
