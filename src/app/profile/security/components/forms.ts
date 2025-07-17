import { z } from "zod";

export const passwordSchema = z
  .string({ message: "Password wajib diisi" })
  .min(8, { message: "Password minimal 8 karakter" })
  .regex(/[a-z]/,{ message: "Password minimal 1 huruf kecil"})
  .regex(/[A-Z]/, { message: "Password minimal 1 huruf besar"})
  .regex(/[0-9]/, { message: "Password minimal 1 angka"});

export const ChangePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password baru dan konfirmasi password harus sama",
  path: ["confirmPassword"],
});

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;

export const PhoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .refine(val => !val.startsWith("62"), {
      message: "Nomor telepon tidak perlu diawali 62",
    })
    .refine(val => val.startsWith("8"), {
      message: "Nomor telepon harus diawali angka 8",
    }),
})

export const OtpSchema = z.object({
  value: z.string().length(6, "OTP harus 6 digit"),
})

export type PhoneSchemaType = z.infer<typeof PhoneSchema>
export type OtpSchemaType = z.infer<typeof OtpSchema>