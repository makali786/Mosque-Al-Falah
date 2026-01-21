import { NextResponse } from 'next/server';
import { getRecentDonationData } from '@lib/donation-helpers';

/**
 * GET /api/donations/recent
 * Fetches recent donations from donors collection and donation statistics
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '4');

  const data = await getRecentDonationData(limit);

  return NextResponse.json(data, { status: data.success ? 200 : 500 });
}
