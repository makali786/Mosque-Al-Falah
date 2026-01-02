import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
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
import { BlogPosts } from './collections/BlogPosts';
import { Committees } from './collections/Committees';
import { CoreValues } from './collections/CoreValues';
import { DonationAppeals } from './collections/DonationAppeals';
import { Donations } from './collections/Donations';
import { Donors } from './collections/Donors';
import { Events } from './collections/Events';
import { Imams } from './collections/Imams';
import { MediaItems } from './collections/MediaItems';
import { Notices } from './collections/Notices';
import { PageSections } from './collections/PageSections';
import { Sermons } from './collections/Sermons';
import { Services } from './collections/Services';

// Globals
import { AboutPage } from './globals/AboutPage';
import { BlogsPage } from './globals/BlogsPage';
import { ContactPage } from './globals/ContactPage';
import { DonationAppealsPage } from './globals/DonationAppealsPage';
import { EventsPage } from './globals/EventsPage';
import { HomePage } from './globals/HomePage';
import { MediaPage } from './globals/MediaPage';
import { SermonsPage } from './globals/SermonsPage';
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
    // Custom Logo and Dashboard
    components: {
      graphics: {
        Logo: './app/(payload)/components/payload/Logo',
        Icon: './app/(payload)/components/payload/Icon',
      },
      beforeDashboard: ['./app/(payload)/components/Dashboard'],
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
    MediaItems,
    DonationAppeals,
    BlogPosts,

    // About Page Content
    CoreValues,
    Committees,
    PageSections,

    // Donations
    Donations,
    Donors,
  ],
  globals: [
    AboutPage,
    BlogsPage,
    ContactPage,
    DonationAppealsPage,
    EventsPage,
    HomePage,
    MediaPage,
    SermonsPage,
    ServicesPage,
  ],
  editor: lexicalEditor(),
  secret: 'mosque-al-falah-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    // url: 'mongodb://127.0.0.1:27017/mosque-al-falah',
    url: 'mongodb+srv://mosque-admin:mosque123@cluster0.oggca09.mongodb.net/mosque-al-falah',
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
});
