/**
 * NextAuth API Route Handler (App Router)
 * Uses getAuthOptions() factory so Apple JWT is generated per-request.
 */

import { getAuthOptions } from '@lib/auth/auth-options';
import NextAuth from 'next-auth';

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
