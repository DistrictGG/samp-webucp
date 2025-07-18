import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function SecurityPageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        <div className="w-full space-y-6">
          {/* Judul dan deskripsi */}
          <div className="w-full">
            <Skeleton className="h-8 w-60 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>

          <Separator className="w-full" />

          {/* Status Verifikasi */}
          <div className="w-full space-y-4">
            <Skeleton className="h-6 w-40 mb-2" />
            {/* Email */}
            <Card className="w-full">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Phone */}
            <Card className="w-full">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="w-full" />

          {/* Ubah Password */}
          <div className="w-full space-y-4">
            <Skeleton className="h-6 w-40 mb-2" />
            <Card className="w-full">
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}