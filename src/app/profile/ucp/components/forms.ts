import { z } from "zod";

export const createUcpFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(16, { message: "Username maksimal 16 karakter" }),
  password: z
  .string({ message: "Password wajib diisi" })
  .min(8, { message: "Password minimal 8 karakter" })
  .regex(/[a-z]/,{ message: "Password minimal 1 huruf kecil"})
  .regex(/[A-Z]/, { message: "Password minimal 1 huruf besar"})
  .regex(/[0-9]/, { message: "Password minimal 1 angka"}),
});

export type createUcpFormSchemaType = z.infer<typeof createUcpFormSchema>;