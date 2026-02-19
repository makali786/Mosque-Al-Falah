/**
 * NextAuth.js Configuration
 *
 * Provides social login for:
 * - Google
 * - Apple (JWT client secret generated from .p8 key)
 * - Facebook
 * - Email/Magic Link
 */

import configPromise from '@payload-config';
import { AuthOptions } from 'next-auth';
import AppleProvider from 'next-auth/providers/apple';
// import EmailProvider from 'next-auth/providers/email';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import { getPayload } from 'payload';
import { generateAppleClientSecret } from './apple-client-secret';

/**
 * Returns a fresh NextAuth options object.
 * Called per-request so generateAppleClientSecret() runs after env vars are loaded.
 */
export function getAuthOptions(): AuthOptions {
  // Generate Apple JWT client secret at request time (not module load time)
  let appleClientSecret = '';
  try {
    appleClientSecret = "eyJhbGciOiJFUzI1NiIsImtpZCI6Ikw0TVc2NlAyNDYifQ.eyJpc3MiOiI5NFFNMkg1Q1FRIiwiaWF0IjoxNzcxNTI4MjM2LCJleHAiOjE3ODczMDUyMzYsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20ubWFzamlkLmFsZmFsYWcud2ViIn0.qZeAsnW8JZclP9GhuopA6Ak5Znxjqr6AR9eHrrO0-2TGfo58obkMw9odUGkmkvlziRa7B2wGq106kOrTtaYdWg";
  } catch (e) {
    console.error('[NextAuth] Apple client secret generation failed:', e);
  }

  return {
    providers: [
      // Google OAuth
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),

      // Apple OAuth — clientSecret is a JWT signed with the .p8 private key
      // Apple OAuth — clientSecret is a JWT signed with the .p8 private key
      AppleProvider({
        clientId: 'com.masjid.alfalah.web',
        clientSecret: "eyJhbGciOiJFUzI1NiIsImtpZCI6Ikw0TVc2NlAyNDYifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiOTRRTTJINUNRUSIsImlhdCI6MTc3MTUzMTE2OSwiZXhwIjoxNzg3MDgzMTcwLCJzdWIiOiJjb20ubWFzamlkLmFsZmFsYWgud2ViIn0.9coLPUziwhcUvCI_MeF1SL01xr__X9DKm20vQIcH1FDPvfMr2OwyhVBZ1gCJNQXfKxnOOJxsxYB1P0VWPKFeeg",
        checks: ['state'], // Disable PKCE as it causes issues with Apple's POST callback
        profile(profile) {
          console.log('Apple Provider Profile:', JSON.stringify(profile, null, 2));
          // Apple only sends name on first login. Fallback to null/email if missing.
          let name = null;
          if (profile.name) {
            name = `${profile.name.firstName} ${profile.name.lastName}`;
          }

          return {
            id: profile.sub,
            name: name, // Will be null on subsequent logins
            email: profile.email,
            image: null,
          }
        },
      }),

      // Facebook OAuth
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      }),

      // Magic Link (Email)
      /*
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
      */
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

          const existingDonors = await payload.find({
            collection: 'donors' as any,
            where: { email: { equals: user.email } },
            limit: 1,
          });

          if (existingDonors.docs.length === 0) {
            await payload.create({
              collection: 'donors' as any,
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
            const donor = existingDonors.docs[0];
            if (!(donor as any).authProvider) {
              await payload.update({
                collection: 'donors' as any,
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
          try {
            const payload = await getPayload({ config: configPromise });
            const donors = await payload.find({
              collection: 'donors' as any,
              where: { email: { equals: session.user.email } },
              limit: 1,
            });

            if (donors.docs.length > 0) {
              (session.user as { donorId?: string }).donorId =
                donors.docs[0].id;
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

    cookies: {
      pkceCodeVerifier: {
        name: 'next-auth.pkce.code_verifier',
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      callbackUrl: {
        name: `__Secure-next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      csrfToken: {
        name: `__Host-next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      state: {
        name: `__Secure-next-auth.state`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      nonce: {
        name: `__Secure-next-auth.nonce`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === 'development',
  };
}

// Static export for backward compatibility (used by any code that imports authOptions)
export const authOptions: AuthOptions = getAuthOptions();
