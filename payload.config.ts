import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { cloudinaryAdapter } from './lib/cloudinaryAdapter';

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
import { EventBookings } from './collections/EventBookings';
import { Events } from './collections/Events';
import { Imams } from './collections/Imams';
import { MadrasahClasses } from './collections/MadrasahClasses';
import { MadrasahTestimonials } from './collections/MadrasahTestimonials';
import { MediaItems } from './collections/MediaItems';
import { Notices } from './collections/Notices';
import { PageSections } from './collections/PageSections';
import { Popups } from './collections/Popups';
import { Sermons } from './collections/Sermons';
import { Services } from './collections/Services';

// Request Collections
import { EventRequests } from './collections/EventRequests';
import { Questions } from './collections/Questions';
import { ServiceRequests } from './collections/ServiceRequests';

// Communications
import { NewsletterSubscribers } from './collections/NewsletterSubscribers';

// Prayer Times
import { Locations } from './collections/Locations';
import { PrayerTimes } from './collections/PrayerTimes';

// Globals
import { AboutPage } from './globals/AboutPage';
import { BlogsPage } from './globals/BlogsPage';
import { ContactPage } from './globals/ContactPage';
import { DonationAppealsPage } from './globals/DonationAppealsPage';
import { EventsPage } from './globals/EventsPage';
import { HomePage } from './globals/HomePage';
import { MadrasahPage } from './globals/MadrasahPage';
import { MediaPage } from './globals/MediaPage';
import { SermonsPage } from './globals/SermonsPage';
import { ServicesPage } from './globals/ServicesPage';

// Prayer Time Settings
import { Notifications } from './collections/Notifications';
import { PrayerTimeSettings } from './globals/PrayerTimeSettings';
import { PrayerTimesPage } from './globals/PrayerTimesPage';

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
      afterDashboard: ['./app/(payload)/components/Dashboard'],
    },
  },
  collections: [
    // Core Collections
    Users,
    Media,

    // Homepage Content
    Banners,
    Events,
    EventBookings,
    Notices,
    Popups,
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

    // Madrasah
    MadrasahClasses,
    MadrasahTestimonials,

    // Donations
    Donations,
    Donors,

    // Prayer Times
    PrayerTimes,

    // Requests
    EventRequests,
    ServiceRequests,
    Questions,

    // Communications
    NewsletterSubscribers,
    Notifications,
    Locations,
  ],
  globals: [
    AboutPage,
    BlogsPage,
    ContactPage,
    DonationAppealsPage,
    EventsPage,
    HomePage,
    MadrasahPage,
    MediaPage,
    PrayerTimesPage,
    SermonsPage,
    ServicesPage,

    // Prayer Time Settings
    PrayerTimeSettings,
  ],
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET ||
    'mosque-al-falah-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: 'mongodb://admin:M%40sjid786@127.0.0.1:27017/mosque-al-falah?authSource=admin',
    // url: 'mongodb://admin:M%40sjid786@89.167.55.212:27017/mosque-al-falah?authSource=admin',
  }),
  sharp,
  plugins: [
    // Cloudinary Storage - RE-ENABLED with optimizations
    // Optimizations added: f_auto, q_auto:good, dpr_auto for reduced bandwidth
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter({
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
            apiKey: process.env.CLOUDINARY_API_KEY || '',
            apiSecret: process.env.CLOUDINARY_API_SECRET || '',
          }),
        },
      },
    }),
  ],
});
