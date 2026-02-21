const fs = require('fs');
const path = require('path');

const collectionsToUpdate = [
    'AyatOfTheMonth.ts',
    'Banners.ts',
    'BlogPosts.ts',
    'Committees.ts',
    'CoreValues.ts',
    'DonationAppeals.ts',
    'Donations.ts',
    'Donors.ts',
    'EventBookings.ts',
    'EventRequests.ts',
    'Events.ts',
    'Imams.ts',
    'Locations.ts',
    'MadrasahClasses.ts',
    'MadrasahTestimonials.ts',
    'MediaItems.ts',
    'NewsletterSubscribers.ts',
    'Notices.ts',
    'Notifications.ts',
    'PageSections.ts',
    'PageViews.ts',
    'Popups.ts',
    'PrayerTimes.ts',
    'Questions.ts',
    'Sermons.ts',
    'ServiceRequests.ts',
    'Services.ts'
];

const dir = path.join(__dirname, '..', 'collections');

let updatedCount = 0;

collectionsToUpdate.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('orderable: true')) {
        // Look for the slug line
        const regex = /(slug:\s*['"][a-zA-Z0-9_-]+['"],)/;
        if (regex.test(content)) {
            content = content.replace(regex, '$1\n  orderable: true,');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
            updatedCount++;
        } else {
            console.warn(`Could not find slug in ${file}`);
        }
    } else {
        console.log(`Already orderable: ${file}`);
    }
});

console.log(`Successfully updated ${updatedCount} collections.`);
