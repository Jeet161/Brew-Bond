import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    // In dev demo mode, credentials-based instant switch allows testing roles seamlessly
    {
      id: "demo-login",
      name: "Demo Impersonation",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = String(credentials.email).toLowerCase();
        
        let user = await db.user.findUnique({
          where: { email },
          include: { profile: true },
        });

        // Auto-provision if demo login
        if (!user && process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
          user = await db.user.create({
            data: {
              email,
              name: email.split("@")[0],
              role: email.includes("admin") ? "ADMIN" : email.includes("host") ? "HOST" : "PARTICIPANT",
              isAgeEligible: true,
              profile: {
                create: {
                  displayName: email.split("@")[0].toUpperCase(),
                  city: "Guwahati",
                  neighbourhood: "Uzan Bazaar",
                  isOnboarded: true,
                },
              },
            },
            include: { profile: true },
          });
        }

        return user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null;
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

