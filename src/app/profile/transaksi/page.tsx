"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react";

export interface TrsList {
  id: number;
  orderid: string;
  name: string;
  price: number;
  value: number;
  status: string;
  checkouturl: string;
  createdAt: Date;
  updatedAt: Date;
  userid: string;
}

export default function TransaksiSection() {
  const router = useRouter()
  const { data: transaksiList = [], isLoading } = api.payment.gatePaymentList.useQuery();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleOpenQRIS = (transaksi: TrsList) => {
    router.push(transaksi.checkouturl)
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Transaction History */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Riwayat Transaksi</CardTitle>
          <CardDescription className="text-sm">Daftar semua transaksi pembelian gold Anda</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Memuat data transaksi...</div>
            ) : (
              transaksiList.map((transaksi: TrsList) => (
                <div key={transaksi.orderid}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="font-medium text-sm truncate">{transaksi.orderid}</div>
                        <div className="self-start sm:self-auto">
                        <Badge variant="outline" className="text-xs sm:text-sm">
                          {transaksi.status}
                        </Badge>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        Produk: {transaksi.name}
                      </div>

                      <div className="text-lg font-semibold">{formatCurrency(transaksi.price)}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-4">
                      {transaksi.status === "UNPAID" && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm"
                          onClick={() => handleOpenQRIS(transaksi)}
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Bayar Langsung
                        </Button>
                      )}
                    </div>
                  </div>  
                </div>
              ))
            )}
          </div>

          {!isLoading && transaksiList.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">Belum ada transaksi</p>
              <p className="text-xs sm:text-sm">Transaksi Anda akan muncul di sini</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
