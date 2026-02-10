
import { getRecentDonationData } from '../lib/donation-helpers';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

async function verifyFooterDonations() {
    console.log('🧪 Verifying Footer Donations Logic...\n');

    try {
        const payload = await getPayload({ config: configPromise });

        // 1. Create a dummy donation
        console.log('1. Creating dummy donation for footer test...');
        const donation = await payload.create({
            collection: 'donations',
            data: {
                amount: 25.00,
                currency: 'GBP',
                frequency: 'one-time',
                donationType: 'general',
                donorEmail: 'footer-test@example.com',
                donorFirstName: 'Footer',
                donorLastName: 'Tester',
                status: 'completed', // Must be completed to show up
                totalAmount: 25.00,
                payment: {
                    method: 'card',
                    stripePaymentIntentId: 'pi_footer_test',
                    stripeCustomerId: 'cus_footer_test',
                }
            },
        });
        console.log(`✅ Created dummy donation: ${donation.id}`);

        // 2. Fetch recent donations using the helper
        console.log('2. Fetching recent donations...');
        const result = await getRecentDonationData(4);

        if (result.success) {
            console.log('✅ Fetch successful');
            console.log('   Recent Donors/Donations found:', result.recentDonors.length);

            // Find our dummy donation
            const found = result.recentDonors.find((d: any) => d.name === 'Footer Tester');

            if (found) {
                console.log('✅ Found dummy donation in results:');
                console.log(JSON.stringify(found, null, 2));

                if (found.amount.includes('£25') && found.time === 'just now') {
                    console.log('✅ Data format is correct (Amount: £25, Time: just now)');
                } else {
                    console.error('❌ Data format mismatch:', found);
                }
            } else {
                console.error('❌ Could not find dummy donation in results');
                console.log('Results:', JSON.stringify(result.recentDonors, null, 2));
            }

        } else {
            console.error('❌ Fetch failed:', result.error);
        }

        // 3. Clean up
        console.log('3. Cleaning up...');
        await payload.delete({
            collection: 'donations',
            id: donation.id,
        });
        console.log('✅ Cleanup complete.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

verifyFooterDonations();
