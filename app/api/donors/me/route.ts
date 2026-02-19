
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { authOptions } from '@lib/auth/auth-options';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await getPayload({ config: configPromise });

        // Find donor by email
        const donors = await payload.find({
            collection: 'donors' as any,
            where: { email: { equals: session.user.email } },
            limit: 1,
        });

        if (donors.docs.length === 0) {
            return NextResponse.json({ found: false });
        }

        // Return the donor data
        return NextResponse.json({
            found: true,
            donor: donors.docs[0],
        });
    } catch (error) {
        console.error('Error fetching donor:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
