import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function verifyWhatsappContent() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🔍 Verifying WhatsApp Content...');

    // 1. Check a Notice
    console.log('--- Checking Notices ---');
    const notices = await payload.find({
        collection: 'notices',
        limit: 10,
        sort: '-createdAt',
    });

    if (notices.totalDocs > 0) {
        console.log(`✅ Notices Found: ${notices.totalDocs}`);
        notices.docs.forEach(n => console.log(`   - ${n.title} (${n.noticeDate})`));
    } else {
        console.error(`❌ No Notices Found`);
    }

    // 2. Check Events
    console.log('--- Checking Events ---');
    const events = await payload.find({
        collection: 'events',
        limit: 10,
        sort: '-createdAt',
    });

    if (events.totalDocs > 0) {
        console.log(`✅ Events Found: ${events.totalDocs}`);
        events.docs.forEach(e => console.log(`   - ${e.title} (${e.slug})`));
    } else {
        console.error(`❌ No Events Found`);
    }

    process.exit(0);
}

verifyWhatsappContent();
