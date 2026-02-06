import { z } from "zod";

export const registerSchema = z.object({
  username: z.string.min(3, "Username is too Short."),
  password: z.string.min(8, "Password must be at least 8 Character long."),
  email: z.email("Invalid Email")
})


export const loginSchema = z.object({
  username: z.string.min(3, "Please enter valid Username"),
  email: z.email("Invalid Email"),
  password: z.string.min(8, "Password must be at least 8 character long.")
})