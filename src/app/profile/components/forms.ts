import { z } from "zod";

export const createUcpFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(16, { message: "Username maksimal 16 karakter" }),
});

export type createUcpFormSchemaType = z.infer<typeof createUcpFormSchema>;