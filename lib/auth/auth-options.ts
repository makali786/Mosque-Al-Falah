/**
 * NextAuth.js Configuration
 *
 * Provides social login for:
 * - Google
 * - Apple
 * - Facebook
 * - Email/Magic Link
 */

import configPromise from '@payload-config';
import { AuthOptions } from 'next-auth';
import AppleProvider from 'next-auth/providers/apple';
import EmailProvider from 'next-auth/providers/email';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import { getPayload } from 'payload';

export const authOptions: AuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Apple OAuth
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),

    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // Magic Link (Email)
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@masjid-al-falah.org',
    }),
  ],

  pages: {
    signIn: '/donate/login',
    error: '/donate/error',
    verifyRequest: '/donate/verify',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const payload = await getPayload({ config: configPromise });

        // Check if donor exists
        const existingDonors = await payload.find({
          collection: 'donors',
          where: { email: { equals: user.email } },
          limit: 1,
        });

        if (existingDonors.docs.length === 0) {
          // Create new donor from social login
          await payload.create({
            collection: 'donors',
            data: {
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              displayName: user.name || 'Anonymous',
              authProvider: account?.provider || 'email',
              authProviderId: account?.providerAccountId || '',
            },
          });
        } else {
          // Update existing donor with auth provider info
          const donor = existingDonors.docs[0];
          if (!donor.authProvider) {
            await payload.update({
              collection: 'donors',
              id: donor.id,
              data: {
                authProvider: account?.provider || 'email',
                authProviderId: account?.providerAccountId || '',
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return true; // Allow sign in even if database update fails
      }
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        // Add donor ID to session
        try {
          const payload = await getPayload({ config: configPromise });
          const donors = await payload.find({
            collection: 'donors',
            where: { email: { equals: session.user.email } },
            limit: 1,
          });

          if (donors.docs.length > 0) {
            (session.user as { donorId?: string }).donorId = donors.docs[0].id;
          }
        } catch (error) {
          console.error('Session callback error:', error);
        }
      }
      return session;
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};
