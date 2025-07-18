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
    try {
      const existingUcp = await ctx.db.characterUcp.findUnique({
        where: {
          userid: ctx.session.user.id,
        },
      });

      if (existingUcp) {
        // Logging dan monitoring
        console.error("[CreateUcp] Attempt to create duplicate UCP", { userId: ctx.session.user.id });
        throw new Error("Terjadi kesalahan. Silakan coba lagi nanti.");
      }

      const codeverify = Math.floor(100000 + Math.random() * 900000);

      const newUcp = await ctx.db.characterUcp.create({
        data: {
          userid: ctx.session.user.id,
          ucp: input.username,
          password: await bcrypt.hash(input.password, 12),
          active: 0, //aktif 0 jika belum verifikasi nomor
          codeverify: codeverify,
          coin: 0,
        },
      });

      return newUcp;
    } catch (err) {
      console.error("[CreateUcp] Error:", err);
      throw new Error("Terjadi kesalahan. Silakan coba lagi nanti.");
    }
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
    try {
      const user = await ctx.db.characterUcp.findUnique({where: { userid: ctx.session.user.id }, select: { password: true }});
      if (!user) {
        console.error("[ChangePassword] User not found", { userId: ctx.session.user.id });
        throw new Error("Terjadi kesalahan. Silakan coba lagi nanti.");
      }

      if (!user.password) {
        const hashedPassword = await bcrypt.hash(input.newPassword, 12);
        await ctx.db.characterUcp.update({
          where: { userid: ctx.session.user.id },
          data: { password: hashedPassword },
        });
        return;
      }
      const isMatch = await bcrypt.compare(input.currentPassword, user?.password);
      if (!isMatch) {
        throw new Error("Password saat ini salah.");
      }
      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.characterUcp.update({
        where: { userid: ctx.session.user.id },
        data: { password: hashedPassword },
      });
    } catch (err) {
      console.error("[ChangePassword] Error:", err);
      throw new Error("Terjadi kesalahan. Silakan coba lagi nanti.");
    }
  }),

  SendOtp: protectedProcedure
  .input(z.object({ target: z.string().min(10).max(15)}))
  .mutation(async ({ ctx, input }) => {
    try {
      const existingUser = await ctx.db.user.findFirst({
        where: {
          number: input.target,
          NOT: { id: ctx.session.user.id },
        },
      });
      if (existingUser) {
        console.error("[SendOtp] Phone number already used", { target: input.target });
        throw new Error("Nomor telepon sudah digunakan.");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      const token = process.env.FONNTE_TOKEN ?? 'hodM7F28fyb58gk3n7NH';
      const message = `Kode OTP Anda adalah: ${otp}`;
    
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { number: input.target },
      });

      const existingOtp = await ctx.db.otp.findUnique({
        where: { userid: ctx.session.user.id },
      });
      if (existingOtp) {
        await ctx.db.otp.update({
          where: { userid: ctx.session.user.id },
          data: {
            otpNumber: otp,
            expiry,
            verified: null,
            updatedAt: new Date(),
          },
        });
      } else {
        await ctx.db.otp.create({
          data: {
            userid: ctx.session.user.id,
            otpNumber: otp,
            expiry,
          },
        });
      }
    
      const data = { target: input.target, message };
      await axios.post('https://api.fonnte.com/send', data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
    
      return { expiry };
    } catch (err) {
      console.error("[SendOtp] Error:", err);
      throw new Error("Terjadi kesalahan saat mengirim OTP. Silakan coba lagi nanti.");
    }
  }),

  ResendOtp: protectedProcedure
  .mutation(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { number: true },
      });
      if (!user?.number) {
        throw new Error("Nomor telepon belum terdaftar di akun Anda.");
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      const token = process.env.FONNTE_TOKEN ?? 'hodM7F28fyb58gk3n7NH';
      const message = `Kode OTP Anda adalah: ${otp}`;

      // Cek apakah sudah ada OTP untuk user ini
      const existingOtp = await ctx.db.otp.findUnique({
        where: { userid: ctx.session.user.id },
      });
      if (existingOtp) {
        await ctx.db.otp.update({
          where: { userid: ctx.session.user.id },
          data: {
            otpNumber: otp,
            expiry,
            verified: null,
            updatedAt: new Date(),
          },
        });
      } else {
        await ctx.db.otp.create({
          data: {
            userid: ctx.session.user.id,
            otpNumber: otp,
            expiry,
          },
        });
      }

      const data = { target: user.number, message };
      await axios.post('https://api.fonnte.com/send', data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      return { expiry };
    } catch (err) {
      console.error("[ResendOtp] Error:", err);
      throw new Error("Terjadi kesalahan saat mengirim ulang OTP. Silakan coba lagi nanti.");
    }
  }),

  VerifyOtp: protectedProcedure
  .input(z.object({ otp: z.string().min(4).max(8) }))
  .mutation(async ({ ctx, input }) => {
    try {
      const otp = await ctx.db.otp.findUnique({
        where: { userid: ctx.session.user.id },
        select: { otpNumber: true, expiry: true }
      });
      if (!otp) {
        console.error("[VerifyOtp] OTP not found", { userId: ctx.session.user.id });
        throw new Error("Kode OTP tidak valid atau sudah kadaluarsa.");
      }
      if (otp.otpNumber !== input.otp) {
        throw new Error("Kode OTP tidak valid atau sudah kadaluarsa.");
      }
      if (otp.expiry && otp.expiry < new Date()) {
        throw new Error("Kode OTP tidak valid atau sudah kadaluarsa.");
      }
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

      await ctx.db.characterUcp.update({
        where: { userid: ctx.session.user.id },
        data: { active: 1 }, //aktif 1 jika sudah verifikasi nomor
      })
    } catch (err) {
      console.error("[VerifyOtp] Error:", err);
      throw new Error("Terjadi kesalahan saat verifikasi OTP. Silakan coba lagi nanti.");
    }
  }),
});
