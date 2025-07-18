"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { User, CheckCircle, Coins, Key, Loader2 } from "lucide-react"
import { Skeleton } from "~/components/ui/skeleton"
import { CreateUcpFormInner } from "~/app/profile/ucp/components/CreateUcpFormInner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUcpFormSchema } from "~/app/profile/ucp/components/forms";
import type { createUcpFormSchemaType } from "~/app/profile/ucp/components/forms";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { Form } from "~/components/ui/form";

export interface UCPProfileData {
  id: number;
  ucp: string | null;
  active: number | null;
  codeverify: number | null;
  coin: number | null;
}


function AvatarProfile({ image }: { image?: string }) {
  return (
    <Avatar className="w-16 h-16 border-2 border-border/30">
      <AvatarImage src={image ?? ""} />
      <AvatarFallback className="text-xl bg-muted/50 dark:bg-muted/20">
        <User />
      </AvatarFallback>
    </Avatar>
  );
}

function StatusBadge({ active }: { active: number }) {
  const isActive = active === 1;
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={
        isActive
          ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
          : "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}

function AccountInfo({ ucpProfile }: { ucpProfile: UCPProfileData }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium flex items-center gap-2 text-foreground">
        <User className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        Account Information
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
          <span className="text-sm text-muted-foreground">UCP Username:</span>
          <span className="text-sm font-medium">{ucpProfile?.ucp ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
          <span className="text-sm text-muted-foreground">Account ID:</span>
          <span className="text-sm">#{ucpProfile?.id ?? '-'}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
          <span className="text-sm text-muted-foreground">Server Access:</span>
          <span className="text-sm">{ucpProfile?.codeverify}</span>
        </div>
      </div>
    </div>
  );
}

function AccountStatus({ ucpProfile }: { ucpProfile: UCPProfileData }) {
  return (
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
            {ucpProfile?.coin?.toLocaleString() ?? '0'}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
          <span className="text-sm text-muted-foreground">Status:</span>
          <StatusBadge active={ucpProfile?.active ?? 0} />
        </div>
        <div className="flex justify-between items-center p-2 rounded-md bg-muted/20 dark:bg-muted/10">
          <span className="text-sm text-muted-foreground">PIN Status:</span>
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { data: session } = useSession();
  const { data: ucpProfile, isLoading, isError, refetch } = api.ucp.playerucp.useQuery();

  const { mutate: createUcp, isPending: isLoadingCreate } = api.ucp.CreateUcp.useMutation({
    onSuccess: async () => {
      toast.success("Berhasil membuat UCP");
      await refetch();
    },
    onError: async () => {
      toast.error("Gagal membuat UCP");
      await refetch();
    }
  });

  const form = useForm<createUcpFormSchemaType>({
    resolver: zodResolver(createUcpFormSchema),
  });

  const handleCreateUcpSubmit = (values: createUcpFormSchemaType) => {
    createUcp({
      username: values.username,
      password: values.password
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Judul dan deskripsi */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" /> {/* Judul */}
          <Skeleton className="h-5 w-64" /> {/* Deskripsi */}
        </div>
        {/* Card Profile */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" /> {/* Avatar */}
              <div>
                <Skeleton className="h-6 w-32 mb-2" /> {/* Nama UCP */}
                <Skeleton className="h-4 w-24 mb-2" /> {/* UCP ID */}
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-20 rounded" /> {/* Status badge */}
                  <Skeleton className="h-6 w-20 rounded" /> {/* PIN badge */}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* AccountInfo */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 mb-2" /> {/* Section title */}
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
              {/* AccountStatus */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 mb-2" /> {/* Section title */}
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) return <div>Gagal memuat data. <Button onClick={() => refetch()}>Coba Lagi</Button></div>

  if (!ucpProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-border/50 bg-card/70 backdrop-blur-md shadow-2xl animate-fade-in-up">
          <CardHeader className="flex flex-col items-center border-b border-border/50">
            <Avatar className="w-16 h-16 border-2 border-blue-400/40 bg-blue-50 dark:bg-blue-900/20 mb-2">
              <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900/30">
                <User className="text-blue-400" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">Belum Ada Akun UCP</CardTitle>
            <CardDescription className="text-center text-base mt-1 text-muted-foreground">
              Kamu belum memiliki akun UCP.<br />Buat akun UCP untuk mulai bermain di server ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 flex flex-col items-center">
            <Form {...form}>
              <div className="w-full">
                <CreateUcpFormInner />
              </div>
              <Button
                disabled={!form.formState.isDirty || isLoadingCreate}
                onClick={form.handleSubmit(handleCreateUcpSubmit)}
                className="w-full mt-4"
              >
                {isLoadingCreate ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Buat Akun Sekarang
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">UCP Profile</h1>
        <p className="text-muted-foreground">Your User Control Panel account information</p>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AvatarProfile image={session?.user.image ?? undefined} />
              <div>
                <CardTitle className="text-xl">{ucpProfile?.ucp}</CardTitle>
                <CardDescription>UCP ID: #{ucpProfile?.id}</CardDescription>
                <div className="flex gap-2 mt-2">
                  <StatusBadge active={ucpProfile?.active ?? 0} />
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
            <AccountInfo ucpProfile={ucpProfile} />
            <AccountStatus ucpProfile={ucpProfile} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
