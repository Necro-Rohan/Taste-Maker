import { z } from "zod";

export const updateProfileSchema = z
  .object({
    username: z.string().min(3).optional(),
    profilePicture: z.url("Invalid URL").optional(),
    preferences: z.array(z.string()).optional(),

    myFridge: z.array(z.string()).optional(),
  })
  .strict();

export const updateEmailSchema = z.object({
  email: z.email("Invalid email address").optional(),
});
