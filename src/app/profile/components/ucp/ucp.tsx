"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { User, CheckCircle, Coins, Key, Loader2 } from "lucide-react"
import { api } from "~/trpc/react";
import type { Session } from "next-auth"
import { toast } from "sonner"
import { createUcpFormSchema } from "~/app/profile/forms";
import type { createUcpFormSchemaType } from "~/app/profile/forms";
import { Form } from "~/components/ui/form";
import { CreateUcpFormInner } from "./CreateUcpFormInner";
interface UCPProfileData {
  id: number
  ucp: string | null
  active: number
  codeverify: number
  coin: number
}

export function UcpSection({ session }: { session: Session }) {
    const { data: ucpProfile, isLoading } = api.ucp.playerucp.useQuery() as { data: UCPProfileData, isLoading: boolean } 
    const createUcp = api.ucp.CreateUcp.useMutation({
        onSuccess: async () => {
          toast.success("Berhasil membuat UCP");
          window.location.reload();
        },
        onError: async () => {
          toast.error("Gagal membuat UCP");
        }
      });
    
    const form = useForm<createUcpFormSchemaType>({
        resolver: zodResolver(createUcpFormSchema),
    });

    const handleCreateUcpSubmit = (values: createUcpFormSchemaType) => {
        createUcp.mutate({
            username: values.username,
        });
    }

    if(isLoading) return (
        <div className="space-y-6 flex flex-col items-center justify-center h-full">
            <Loader2 className="h-10 w-10 animate-spin"/>
        </div>
    )
    
    if(!ucpProfile) return (
        <div className="space-y-6 flex flex-col items-center justify-center h-full">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b border-border/50">
            <CardTitle>Ucp Profile</CardTitle>
            <CardDescription>Kamu Tidak Memiliki Silahkan Buat UCP Terlebih Dahulu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center justify-center">
                <Form {...form}>
                    <CreateUcpFormInner/>
                </Form>

                <Button disabled={!form.formState.isDirty} onClick={form.handleSubmit(handleCreateUcpSubmit)} className="mt-4 w-full">Simpan</Button>
            </div>
            </CardContent>
        </Card>
        </div>
    )

    return (
        <div className="space-y-6">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">UCP Profile</h1>
            <p className="text-muted-foreground">Your User Control Panel account information</p>
        </div>

        {/* Profile Card - Full Width */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 border-2 border-border/30">
                    <AvatarImage src={session.user.image ?? ""} />
                    <AvatarFallback className="text-xl bg-muted/50 dark:bg-muted/20">
                    <User />  
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-xl">{ucpProfile?.ucp}</CardTitle>
                    <CardDescription>UCP ID: #{ucpProfile?.id}</CardDescription>
                    <div className="flex gap-2 mt-2">
                    <Badge
                        variant={ucpProfile?.active === 1 ? "default" : "secondary"}
                        className={
                        ucpProfile?.active === 1
                            ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                            : "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20"
                        }
                    >
                        {ucpProfile?.active === 1 ? "Active" : "Inactive"}
                    </Badge>
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                        <Key className="h-3 w-3 mr-1" />
                        PIN Active
                    </Badge>
                    </div>
                </div>
                </div>
            </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    Account Information
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                    <span className="text-sm text-muted-foreground">UCP Username:</span>
                    <span className="text-sm font-medium">{ucpProfile?.ucp}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                    <span className="text-sm text-muted-foreground">Account ID:</span>
                    <span className="text-sm">#{ucpProfile?.id}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                    <span className="text-sm text-muted-foreground">Server Access:</span>
                    <span className="text-sm">{ucpProfile?.codeverify}</span>
                    </div>
                </div>
                </div>

                <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2 text-foreground">
                    <Coins className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                    Account Status
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                    <span className="text-sm text-muted-foreground">Coins:</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                        <Coins className="h-3 w-3 text-yellow-500 dark:text-yellow-400" />
                        {ucpProfile?.coin.toLocaleString()}
                    </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge
                        variant={ucpProfile?.active === 1 ? "default" : "secondary"}
                        className={
                        ucpProfile?.active === 1
                            ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-xs"
                            : "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20 text-xs"
                        }
                    >
                        {ucpProfile?.active === 1 ? "Active" : "Inactive"}
                    </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
                    <span className="text-sm text-muted-foreground">PIN Status:</span>
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}
