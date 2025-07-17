"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import {
  type ChangePasswordSchemaType,
  ChangePasswordSchema,
  type OtpSchemaType,
  OtpSchema,
  type PhoneSchemaType,
  PhoneSchema,
} from "~/app/profile/security/components/forms"
import { ChangePasswordFormInner } from "~/app/profile/security/components/ChangePasswordForm"
import { CreateInputNumberFrom } from "~/app/profile/security/components/InputNumberFrom"
import { CreateInputOtpFrom } from "~/app/profile/security/components/OtpNumberFrom"

import { useState } from "react"

import { Form } from "~/components/ui/form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { CheckCircle, XCircle, Mail, Phone } from "lucide-react"

export default function SecurityPage() {
  const { data: session } = useSession()

  const [openInputNumber, setOpenInputNumber] = useState(false)

  const [openInputOtp, setOpenInputOtp] = useState(false)

  const passwordform = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
  })

  const inputphoneform = useForm<PhoneSchemaType>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      phoneNumber: "",
    }
  })

  const inputotpform = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      value: "",
    }
  })

  // Your existing tRPC mutations
  const { mutate: SendOtp, isPending: isSendOtpPending } = api.ucp.SendOtp.useMutation({
    onSuccess: () => {
      toast.success("OTP berhasil dikirim")
      inputotpform.setValue("value", "")
      inputphoneform.setValue("phoneNumber", "")
      setOpenInputOtp(true)
      setOpenInputNumber(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { mutate: VerifyOtp, isPending: isVerifyOtpPending } = api.ucp.VerifyOtp.useMutation({
    onSuccess: () => {
      toast.success("Nomor telepon berhasil diverifikasi!")
      inputphoneform.setValue("phoneNumber", "")
      inputotpform.setValue("value", "")
      setOpenInputNumber(false)
      setOpenInputOtp(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const { mutate: changePassword, isPending: isChangePasswordPending } = api.ucp.ChangePassword.useMutation({
    onSuccess: () => {
      toast.success("Password berhasil diubah")
      passwordform.setValue("currentPassword", "")
      passwordform.setValue("newPassword", "")
      passwordform.setValue("confirmPassword", "")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleChangePassword = (values: ChangePasswordSchemaType) => {
    changePassword(values)
  }

  const handleOpenDialog = (type: number) => {
    if (type === 1) {
      setOpenInputNumber(true)
      return
    }

    if (type === 2) {
      setOpenInputOtp(true)      
      return
    }
  }

  const handlePhoneSubmit = (values: PhoneSchemaType) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    SendOtp({ target: values.phoneNumber, otp: otp })
  }

  const handleOtpSubmit = (values: OtpSchemaType) => {
    VerifyOtp({ otp: values.value.toString() })
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        <div className="w-full space-y-6">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Keamanan</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Kelola pengaturan keamanan akun Anda</p>
          </div>

          <Separator className="w-full" />

          <div className="w-full space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">Status Verifikasi</h2>

            {/* Email Verification Card */}
            <Card className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  Verifikasi Email
                </CardTitle>
                <CardDescription className="text-sm">Status verifikasi email Anda</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <p className="font-medium text-sm sm:text-base break-all">{session?.user.email}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Terverifikasi
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Verification Card */}
            <Card className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  Verifikasi Nomor Telepon
                </CardTitle>
                <CardDescription className="text-sm">Status verifikasi nomor telepon Anda</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <p className="font-medium text-sm sm:text-base">
                      {session?.user.number ? `+${session?.user.number}` : "Nomor telepon belum ditambahkan"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {session?.user.numberVerified ? (
                        <>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Terverifikasi
                            </Badge>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            pada {new Date(session?.user.numberVerified).toLocaleDateString("id-ID")}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                          <Badge variant="destructive" className="text-xs">
                            Belum Terverifikasi
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {!session?.user.numberVerified && (
                    <Button
                      onClick={() => handleOpenDialog(session?.user.number ? 2 : 1)}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto bg-transparent"
                    >
                      {!session?.user.number ? "Verifikasi Nomor" : "Verifikasi OTP"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="w-full" />

          <div className="w-full space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">Ubah Password</h2>
            <Form {...passwordform}>
              <ChangePasswordFormInner onCanghePassword={handleChangePassword} isLoading={isChangePasswordPending} />
            </Form>
          </div>
        </div>
      </div>

      {/* <PhoneVerificationDialog
        open={isOpenNumber}
        onOpenChange={setIsOpenNumber}
        onPhoneSubmit={handlePhoneSubmit}
        onOtpSubmit={handleOtpSubmit}
        isPhoneLoading={isSendOtpPending}
        isOtpLoading={isVerifyOtpPending}
        hasPhoneNumber={!!session?.user.number}
        phoneNumber={session?.user.number ? String(session.user.number) : ""}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      /> */}

      <Dialog open={openInputNumber} onOpenChange={setOpenInputNumber}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Verifikasi Nomor Telepon
            </DialogTitle>
            <DialogDescription>
              Masukkan nomor telepon Anda untuk menerima kode verifikasi
            </DialogDescription>
            <Form {...inputphoneform}>
              <CreateInputNumberFrom onInputPhoneNumber={handlePhoneSubmit} isLoading={isSendOtpPending} />
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openInputOtp} onOpenChange={setOpenInputOtp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Verifikasi OTP
            </DialogTitle>
            <DialogDescription>
              Masukkan kode verifikasi yang telah dikirimkan ke nomor telepon Anda
            </DialogDescription>
            <Form {...inputotpform}>
              <CreateInputOtpFrom onInputOtpNumber={handleOtpSubmit} isLoading={isVerifyOtpPending} />
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
