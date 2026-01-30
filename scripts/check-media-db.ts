import 'dotenv/config';
import { MongoClient } from 'mongodb';

async function checkMediaDocuments() {
  try {
    // Connect directly to MongoDB Atlas (same as payload.config.ts)
    const mongoUri =
      'mongodb+srv://mosque-admin:mosque123@cluster0.oggca09.mongodb.net/mosque-al-falah';
    console.log('Connecting to MongoDB Atlas...');

    if (!mongoUri) {
      console.error('No DATABASE_URI or MONGODB_URI found');
      return;
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();

    // List all media documents
    const media = await db.collection('media').find({}).toArray();
    console.log(`\n📦 Found ${media.length} media documents:\n`);

    media.forEach((doc, i) => {
      console.log(`${i + 1}. ID: ${doc._id}`);
      console.log(`   Filename: ${doc.filename || 'MISSING'}`);
      console.log(`   URL: ${doc.url || 'MISSING'}`);
      console.log(`   Alt: ${doc.alt || 'MISSING'}`);
      console.log('');
    });

    await client.close();
    console.log('✅ Done');
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkMediaDocuments();
