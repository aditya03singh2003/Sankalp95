import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateStudentId(classNumber: string, rollNumber: number): string {
  // Format: STU + 2-digit class + 3-digit roll number
  const classDigits = classNumber.toString().replace(/\D/g, "").padStart(2, "0")
  const rollDigits = rollNumber.toString().padStart(3, "0")
  return `STU${classDigits}${rollDigits}`
}
