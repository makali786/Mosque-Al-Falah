import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function checkImamsEmail() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🔍 Checking Imams Emails...');

    const imams = await payload.find({
        collection: 'imams',
        limit: 100,
    });

    if (imams.totalDocs === 0) {
        console.log('❌ No Imams found.');
    } else {
        imams.docs.forEach((imam) => {
            // @ts-ignore
            const email = imam.email;
            if (email) {
                console.log(`✅ ${imam.name}: ${email}`);
            } else {
                console.warn(`⚠️ ${imam.name}: No email found`);
            }
        });
    }

    process.exit(0);
}

checkImamsEmail();
