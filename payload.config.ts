import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Core Collections
import { Media } from './collections/Media';
import { Users } from './collections/Users';

// Content Collections
import { AyatOfTheMonth } from './collections/AyatOfTheMonth';
import { Banners } from './collections/Banners';
import { Committees } from './collections/Committees';
import { CoreValues } from './collections/CoreValues';
import { DonationAppeals } from './collections/DonationAppeals';
import { Events } from './collections/Events';
import { Imams } from './collections/Imams';
import { Notices } from './collections/Notices';
import { PageSections } from './collections/PageSections';
import { Sermons } from './collections/Sermons';
import { Services } from './collections/Services';

// Globals
import { AboutPage } from './globals/AboutPage';
import { ContactPage } from './globals/ContactPage';
import { EventsPage } from './globals/EventsPage';
import { HomePage } from './globals/HomePage';
import { ServicesPage } from './globals/ServicesPage';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Custom Meta - Branding
    meta: {
      titleSuffix: '- Masjid Al-Falah CMS',
    },
    // Custom Logo
    components: {
      graphics: {
        Logo: './app/(payload)/components/payload/Logo',
        Icon: './app/(payload)/components/payload/Icon',
      },
    },
  },
  collections: [
    // Core Collections
    Users,
    Media,

    // Homepage Content
    Banners,
    Events,
    Notices,
    Services,
    Imams,
    AyatOfTheMonth,
    Sermons,
    DonationAppeals,

    // About Page Content
    CoreValues,
    Committees,
    PageSections,
  ],
  globals: [AboutPage, ContactPage, EventsPage, HomePage, ServicesPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    // url: 'mongodb://127.0.0.1:27017/mosque-al-falah',
    url: 'mongodb+srv://mosque-admin:mosque123@cluster0.oggca09.mongodb.net/mosque-al-falah',
  }),
  sharp,
  plugins: [],
});
