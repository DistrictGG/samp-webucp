import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import axios from "axios";

export const ucpRouter = createTRPCRouter({
  playerucp: protectedProcedure
  .query(async ({ ctx }) => {
    const playerucp = await ctx.db.characterUcp.findUnique({
      where: {
        userid: ctx.session.user.id,
      },
      select: {
        id: true,
        ucp: true,
        active: true,
        codeverify: true,
        coin: true,
      }
    });
    return playerucp ?? null;
  }),

  CreateUcp: protectedProcedure
  .input(z.object({ username: z.string().min(3).max(20), password: z.string().min(6).max(20)}))
  .mutation(async ({ ctx, input }) => {
    const existingUcp = await ctx.db.characterUcp.findUnique({
      where: {
        userid: ctx.session.user.id,
      },
    });

    if (existingUcp) {
      throw new Error("UCP already exists for this user.");
    }

    const codeverify = Math.floor(100000 + Math.random() * 900000);

    const newUcp = await ctx.db.characterUcp.create({
      data: {
        userid: ctx.session.user.id,
        ucp: input.username,
        password: await bcrypt.hash(input.password, 12),
        active: 1,
        codeverify: codeverify,
        coin: 0,
      },
    });

    return newUcp;
  }),

  getCharacter: protectedProcedure
  .query(async ({ ctx }) => {
    const character = await ctx.db.character.findMany({
      where: {
        uuid: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        skin: true,
        level: true,
        levelup: true,
        money: true,
        bankmoney: true,
        vip: true,
      }
    });
    return character ?? null;
  }),

  ChangePassword: protectedProcedure
  .input(z.object({ currentPassword: z.string().min(6).max(20), newPassword: z.string().min(6).max(20)}))
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.characterUcp.findUnique({where: { userid: ctx.session.user.id }, select: { password: true }});
    if (!user) { throw new Error("User not found") }

    if (!user.password) {
      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.characterUcp.update({
        where: { userid: ctx.session.user.id },
        data: { password: hashedPassword },
      });
      return;
    }
    const isMatch = await bcrypt.compare(input.currentPassword, user?.password);
    if (!isMatch) { throw new Error("Current password is incorrect") }
    
    const hashedPassword = await bcrypt.hash(input.newPassword, 12);
    await ctx.db.characterUcp.update({
      where: { userid: ctx.session.user.id },
      data: { password: hashedPassword },
    });
  }),

  SendOtp: protectedProcedure
  .input(z.object({ target: z.string().min(10).max(15), otp: z.string().min(4).max(8) }))
  .mutation(async ({ ctx, input }) => {
    const token = 'hodM7F28fyb58gk3n7NH'; // dari dashboard fonnte
    const message = `Kode OTP Anda adalah: ${input.otp}`;
    
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        number: input.target
      },
    });

    await ctx.db.otp.create({
      data: {
        userid: ctx.session.user.id,
        otpNumber: input.otp,
      },
    });

    const data = {
      target: input.target,
      message: message,
    };
    
    await axios.post('https://api.fonnte.com/send', data, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log('Berhasil:', res.data);
    });
  }),

  VerifyOtp: protectedProcedure
  .input(z.object({ otp: z.string().min(4).max(8) }))
  .mutation(async ({ ctx, input }) => {
    const otp = await ctx.db.otp.findUnique({where: { userid: ctx.session.user.id }, select: { otpNumber: true }});
    if (!otp) { throw new Error("OTP not found") }
    if (otp.otpNumber !== input.otp) { throw new Error("OTP is incorrect") }
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        numberVerified: new Date()
      },
    })
    await ctx.db.otp.update({
      where: { userid: ctx.session.user.id },
      data: { verified: new Date() },
    });
  }),
});
