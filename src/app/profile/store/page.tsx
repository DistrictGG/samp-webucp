"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Coins, ShoppingCart, TrendingUp } from "lucide-react"
import { api } from "~/trpc/react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export interface GoldList {
  id: number
  value: number
  price: number
  diskon: number
}

// Demo data
const demoGoldList: GoldList[] = [
  {
    id: 1,
    value: 90000,
    price: 100000,
    diskon: 0,
  },
]

export default function StoreSection() {
  const cratePayment = api.payment.PaymentCarteGold.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        router.push(data.url);
      }
    },
    onError: async () => {
      toast.error("Gagal membuat Payment");
    }
  });

  const router = useRouter();

  const handleBuyGold = (value: number, price: number) => {
    cratePayment.mutate({ price, value });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Gold Store</h1>
          <p className="text-muted-foreground">Buy gold items and get discounts</p>
      </div>
      {/* Gold Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoGoldList.map((item) => {
          const hasDiscount = item.diskon > 0
          const originalPrice = hasDiscount ? item.price / (1 - item.diskon / 100) : item.price
          
          return (
            <Card
              key={item.id}
              className={"relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"}
            >

              {hasDiscount && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                    -{item.diskon}%
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-secondary rounded-full w-fit shadow-sm">
                  <Coins className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold">{item.value.toLocaleString()} Gold</CardTitle>
                <CardDescription className="text-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground font-medium">
                    Premium Package
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold">Rp {item.price.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="text-lg text-muted-foreground line-through">Rp {originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full transition-all duration-200 group-hover:shadow-md"
                  onClick={() => handleBuyGold(item.value, item.price)}
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase Now
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
