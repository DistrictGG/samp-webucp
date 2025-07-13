import { z } from "zod";
import axios  from "axios";
import crypto from "crypto";

import { createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";

export const PaymentRouter = createTRPCRouter({
    PaymentCarteGold: protectedProcedure
    .input(z.object({ price: z.number(), value: z.number()}))
    .mutation(async ({ ctx, input }) => {
        // return ctx.db.payment.create({
        //     data: {
        //         userid: ctx.session.user.id,
        //         price: input.price,
        //         value: input.value,
        //         name: `Gold ${input.value}`,
        //         status: "pending",
        //     },
        // });
        
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
                    'product_url': 'http://localhost:3000/profile',
                    'image_url': 'https://xau.ca/wp-content/uploads/2024/10/2-3.png'
                }
            ],
            'return_url': 'http://localhost:3000/profile',
            'signature': signature
        }

        axios.post('https://tripay.co.id/api-sandbox/transaction/create', payload, {
            headers: { 'Authorization': 'Bearer ' + apikey },
        })
        .then((res) => {
            console.log(res)
            return { massage: "Berhasil membuat payment", status: 200, url: res.data.data.checkout_url};
        })
        .catch(() => {
            throw new Error("Gagal membuat payment");
        });
    }),
})  