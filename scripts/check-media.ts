
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.resolve(dirname, '../.env') });

import { getPayload } from 'payload';
import config from '../payload.config';

const check = async () => {
    try {
        const payload = await getPayload({ config });
        const media = await payload.find({ collection: 'media', limit: 1 });

        let output = `Found ${media.totalDocs} media items.\n`;
        if (media.docs.length > 0) {
            output += `Sample ID: ${media.docs[0].id}\n`;
        } else {
            output += `No media items found.\n`;
        }

        fs.writeFileSync(path.resolve(dirname, '../check_media_result.txt'), output);
        console.log("Written to file.");
        process.exit(0);
    } catch (e) {
        fs.writeFileSync(path.resolve(dirname, '../check_media_result.txt'), `Error: ${e.message}`);
        console.error(e);
        process.exit(1);
    }

};
check();
