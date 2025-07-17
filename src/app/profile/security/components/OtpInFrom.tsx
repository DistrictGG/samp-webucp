"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/components/ui/input-otp"
import { Phone } from "lucide-react"
import { type OtpSchemaType, type PhoneSchemaType, OtpSchema, PhoneSchema } from "~/app/profile/security/components/forms"

interface PhoneVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPhoneSubmit: (phoneNumber: string) => void
  onOtpSubmit: (values: OtpSchemaType) => void
  isPhoneLoading?: boolean
  isOtpLoading?: boolean
  hasPhoneNumber?: boolean
  phoneNumber?: string
  currentStep?: "phone" | "otp"
  setCurrentStep?: (step: "phone" | "otp") => void
}

export function PhoneVerificationDialog({
  open,
  onOpenChange,
  onPhoneSubmit,
  onOtpSubmit,
  isPhoneLoading = false,
  isOtpLoading = false,
  hasPhoneNumber = false,
  phoneNumber = "",
  currentStep,
  setCurrentStep,
}: PhoneVerificationDialogProps) {
  const [internalStep, setInternalStep] = useState<"phone" | "otp">(hasPhoneNumber ? "otp" : "phone")
  const step = currentStep ?? internalStep
  const setStep = setCurrentStep ?? setInternalStep

  const [currentPhone, setCurrentPhone] = useState(phoneNumber)

  const phoneForm = useForm<PhoneSchemaType>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      phoneNumber: "" 
    }
  })

  const otpForm = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      value: "" 
    }
  })

  const handlePhoneSubmit = (values: PhoneSchemaType) => {
    const fullPhoneNumber = `62${values.phoneNumber}`
    setCurrentPhone(fullPhoneNumber)
    onPhoneSubmit(fullPhoneNumber)
    phoneForm.reset()
  }

  const handleOtpSubmit = (values: OtpSchemaType) => {
    onOtpSubmit(values)
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setStep(hasPhoneNumber ? "otp" : "phone")
      phoneForm.reset()
      otpForm.reset()
    }
    onOpenChange(open)
  }

  const displayPhone = currentPhone || phoneNumber
  const formattedPhone = displayPhone ? `+${displayPhone}` : "telepon Anda"

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {step === "phone" ? "Verifikasi Nomor Telepon" : "Masukkan Kode OTP"}
          </DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? "Masukkan nomor telepon Anda untuk menerima kode verifikasi"
              : `Kami telah mengirim kode OTP ke nomor ${formattedPhone}`}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                          +62
                        </div>
                        <Input
                          {...field}
                          type="number"
                          placeholder="812345678"
                          className="rounded-l-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPhoneLoading}>
                {isPhoneLoading ? "Mengirim..." : "Kirim Kode OTP"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode OTP</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} autoFocus />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isOtpLoading}>
                  {isOtpLoading ? "Memverifikasi..." : "Verifikasi"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
