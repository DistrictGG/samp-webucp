import { z } from "zod";
import axios  from "axios";
import crypto from "crypto";

import { createTRPCRouter, protectedProcedure} from "~/server/api/trpc";

interface TripayCreateResponse {
  success: boolean;
  message: string;
  data: {
    reference: string;
    checkout_url: string;
  };
}

export const PaymentRouter = createTRPCRouter({
    PaymentCarteGold: protectedProcedure
    .input(z.object({ price: z.number(), value: z.number()}))
    .mutation(async ({ ctx, input }) => {
        const apikey        = process.env.ApiKey ?? "";
        const privateKey    = process.env.PrivateKey ?? "";
        console.log(apikey, privateKey)
        const merchant_code = "T42890";
        const merchant_ref  = Math.floor(Math.random() * 1000000).toString();
        const amount        = input.price;

        const signature = crypto.createHmac('sha256', privateKey)
            .update(merchant_code + merchant_ref + amount)
            .digest('hex');
        
        const payload = {
            'method': 'QRIS2',
            'merchant_ref': merchant_ref,
            'amount': amount,
            'customer_name': ctx.session.user.name,
            'customer_email': ctx.session.user.email,
            'customer_phone': '08123456789',
            'order_items': [
                {
                    'sku': `Gold`,
                    'name': `Gold-${input.value}`,
                    'price': amount,
                    'quantity': 1,
                    'product_url': 'http://localhost:3000/store',
                    'image_url': 'https://xau.ca/wp-content/uploads/2024/10/2-3.png'
                }
            ],
            'return_url': 'http://localhost:3000/store',
            'signature': signature
        }

        try {
            const res = await axios.post<TripayCreateResponse>(
                'https://tripay.co.id/api-sandbox/transaction/create',
                payload,
                { headers: { 'Authorization': 'Bearer ' + apikey } }
            );
            console.log(res.data.data)
            await ctx.db.payment.create({
                data: {
                    orderid: res.data.data.reference,
                    userid: ctx.session.user.id,
                    price: input.price,
                    value: input.value,
                    name: `Gold ${input.value}`,
                    status: "UNPAID",
                    checkouturl: res.data.data.checkout_url
                },
            });
            return { message: "Berhasil membuat payment", status: 200, url: res.data.data.checkout_url };
        } catch {
            throw new Error("Gagal membuat payment");
        }
    }),
    gatePaymentList: protectedProcedure
      .query(async ({ ctx }) => {
        const payments = await ctx.db.payment.findMany({
          where: { userid: ctx.session.user.id },
          orderBy: { createdAt: "desc" }
        });
        return payments;
      }),
})  