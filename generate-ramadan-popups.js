const fs = require('fs');
const crypto = require('crypto');

// User provided images with OIDs
const images = [
    { "_id": { "$oid": "699e54806f08a54e279a35f4" }, "filename": "A_serene_eyelevel_202602250646 (1).jpeg" },
    { "_id": { "$oid": "699e54826f08a54e279a35f8" }, "filename": "A_serene_eyelevel_202602250646.jpeg" },
    { "_id": { "$oid": "699e54836f08a54e279a35fc" }, "filename": "White_surface_in_202602250646.jpeg" },
    { "_id": { "$oid": "699e54866f08a54e279a3600" }, "filename": "A_majestic_night_202602250646.jpeg" },
    { "_id": { "$oid": "699e54886f08a54e279a3604" }, "filename": "A_majestic_night_202602250645.jpeg" },
    { "_id": { "$oid": "699e548a6f08a54e279a3608" }, "filename": "Generate_a_sweeping_202602250637.jpeg" },
    { "_id": { "$oid": "699e548b6f08a54e279a360c" }, "filename": "Generate_a_photorealistic_202602250601.jpeg" },
    { "_id": { "$oid": "699e548d6f08a54e279a3610" }, "filename": "A_warm_atmospheric_202602250646.jpeg" },
    { "_id": { "$oid": "699e548f6f08a54e279a3614" }, "filename": "A_photorealistic_cinematic_202602250646.jpeg" }
];

const imageOids = images.map(i => i._id.$oid);

// Generate 30 distinct daily messages and tips
const daysData = [
    { msg: "Welcome to the 1st day of Ramadan. Let us dedicate this time to self-discipline and reflection.", tip: "Set a clear intention for the whole month today." },
    { msg: "On this 2nd day, remember that fasting encompasses not just food, but also our words and actions.", tip: "Make a conscious effort to avoid idle talk today." },
    { msg: "3rd day of Ramadan: The first 10 days are the days of Mercy.", tip: "Constantly seek Allah's mercy through the simple dua: 'O My Lord, forgive me and have mercy upon me.'" },
    { msg: "4th day of Ramadan: Charity extinguishes sin as water extinguishes fire.", tip: "Donate a small amount to charity today, even if it's just a smile or helping hand." },
    { msg: "5th day of Ramadan: Consistency is key. It's better to do small good deeds every day than a lot at once.", tip: "Commit to reading just 2 pages of Quran after every prayer." },
    { msg: "6th day of Ramadan: Patience is half of faith.", tip: "When you feel tested today, take a deep breath and say 'Alhamdulillah'." },
    { msg: "7th day of Ramadan: Establish your prayers. Salah is the first thing we will be asked about.", tip: "Try to pray all sunnah prayers along with the fard prayers today." },
    { msg: "8th day of Ramadan: Gratitude increases blessings. Be thankful for the food you break your fast with.", tip: "Make a list of 5 things you are deeply thankful for." },
    { msg: "9th day of Ramadan: Strengthen your ties of kinship.", tip: "Call a family member or relative you haven't spoken to in a while." },
    { msg: "10th day of Ramadan: As we conclude the days of Mercy, we enter the days of Forgiveness.", tip: "Reflect on your past mistakes and sincerely ask for forgiveness." },
    { msg: "11th day of Ramadan: The Prophet (PBUH) was the most generous of people, especially in Ramadan.", tip: "Find an opportunity to be unexpectedly generous to someone today." },
    { msg: "12th day of Ramadan: Your health is a trust (amanah). Eat wholesome food for Suhoor and Iftar.", tip: "Break your fast with dates and water, and avoid overeating." },
    { msg: "13th day of Ramadan: Knowledge is light. Use this month to increase your Islamic knowledge.", tip: "Listen to an Islamic lecture or read a chapter from a beneficial book." },
    { msg: "14th day of Ramadan: A good word is a charity.", tip: "Compliment someone sincerely or encourage a fellow fasting brother/sister." },
    { msg: "15th day of Ramadan: We are halfway through the blessed month. Renew your intentions.", tip: "Evaluate your goals from day 1 and adjust where necessary to finish strong." },
    { msg: "16th day of Ramadan: Dua is the weapon of the believer. The dua of a fasting person is not rejected.", tip: "Make a special dua just before breaking your fast." },
    { msg: "17th day of Ramadan: The Battle of Badr took place on this day. It's a reminder that Allah grants victory to those who strive.", tip: "Reflect on the struggles of the early Muslims and draw strength from them." },
    { msg: "18th day of Ramadan: Be mindful of your time. Don't waste the precious remaining days.", tip: "Limit your social media usage to focus on spiritual connection." },
    { msg: "19th day of Ramadan: Prepare for the last ten nights. The best is yet to come.", tip: "Start adjusting your sleep schedule to ensure you can stay awake during the nights." },
    { msg: "20th day of Ramadan: Entering the last 10 days—the days of seeking refuge from the Fire.", tip: "Increase your recitation of the Quran and your nighttime prayers." },
    { msg: "21st day of Ramadan: Seek Laylatul Qadr (The Night of Decree), better than a thousand months.", tip: "Recite the recommended dua for Laylatul Qadr abundantly." },
    { msg: "22nd day of Ramadan: I'tikaf is a beautiful sunnah of disconnecting from the world.", tip: "Even if you can't stay at the masjid, spend a dedicated hour in a quiet room for pure ibadah." },
    { msg: "23rd day of Ramadan: Another odd night. Stay vigilant in prayer and supplication.", tip: "Donate a small amount tonight; if it is Laylatul Qadr, it's as if you donated for 83 years!" },
    { msg: "24th day of Ramadan: Forgive others, so that Allah may forgive you.", tip: "Let go of any grudges you hold in your heart today." },
    { msg: "25th day of Ramadan: Keep pushing forward. Fatigue is normal, but the reward is eternal.", tip: "Remind yourself of the gates of Rayyan, reserved specifically for those who fast." },
    { msg: "26th day of Ramadan: Every moment is precious now. Less sleep, more prayer.", tip: "Make sincere dua for the global Muslim ummah who are facing hardships." },
    { msg: "27th day of Ramadan: Often considered the most likely night for Laylatul Qadr.", tip: "Exhaust yourself in good deeds and sincere repentance tonight." },
    { msg: "28th day of Ramadan: As the month wraps up, reflect on your spiritual journey.", tip: "Write down the positive habits you've built and plan how to maintain them." },
    { msg: "29th day of Ramadan: Zakat al-Fitr purifies our fasting. Ensure it is paid before the Eid prayer.", tip: "Pay your Zakat al-Fitr today if you haven't already." },
    { msg: "30th day of Ramadan: We bid farewell to this blessed guest. May Allah accept from us all.", tip: "Look out for the Eid moon and prepare your heart for the joy of Eid." }
];

const generateObjectId = () => crypto.randomBytes(12).toString("hex");

// Base date roughly indicating start of Ramadan 2026. 
// Starting Feb 17 at midnight UTC means ends Feb 17 at 11:59PM.
const baseDate = new Date("2026-02-17T00:00:00.000Z");

const popups = daysData.map((dayObj, index) => {
    const startDate = new Date(baseDate.getTime() + (index * 24 * 60 * 60 * 1000));
    startDate.setUTCHours(0, 0, 0, 0); // start at midnight

    const endDate = new Date(startDate);
    endDate.setUTCHours(23, 59, 59, 999); // end before midnight

    const imageOid = imageOids[index % imageOids.length];

    return {
        "_id": { "$oid": generateObjectId() },
        "createdAt": { "$date": new Date().toISOString() },
        "updatedAt": { "$date": new Date().toISOString() },
        "title": `Ramadan Day ${index + 1}`,
        "isActive": true,
        "priority": 10,
        "type": "ramadan", // As per schema Options
        "frequency": "once_per_day",
        "scheduling": {
            "startDate": { "$date": startDate.toISOString() },
            "endDate": { "$date": endDate.toISOString() }
        },
        "content": {
            "message": {
                "root": {
                    "children": [
                        {
                            "children": [
                                {
                                    "detail": 0,
                                    "format": 0,
                                    "mode": "normal",
                                    "style": "",
                                    "text": dayObj.msg,
                                    "type": "text",
                                    "version": 1
                                }
                            ],
                            "direction": null,
                            "format": "",
                            "indent": 0,
                            "type": "paragraph",
                            "version": 1,
                            "textFormat": 0,
                            "textStyle": ""
                        },
                        {
                            "children": [
                                {
                                    "detail": 0,
                                    "format": 1,
                                    "mode": "normal",
                                    "style": "",
                                    "text": "Tip for the Day:",
                                    "type": "text",
                                    "version": 1
                                },
                                {
                                    "detail": 0,
                                    "format": 0,
                                    "mode": "normal",
                                    "style": "",
                                    "text": " " + dayObj.tip,
                                    "type": "text",
                                    "version": 1
                                }
                            ],
                            "direction": null,
                            "format": "",
                            "indent": 0,
                            "type": "paragraph",
                            "version": 1,
                            "textFormat": 0,
                            "textStyle": ""
                        },
                        {
                            "children": [
                                {
                                    "detail": 0,
                                    "format": 2, // italic
                                    "mode": "normal",
                                    "style": "",
                                    "text": "Ramadan Mubarak to our community!",
                                    "type": "text",
                                    "version": 1
                                }
                            ],
                            "direction": null,
                            "format": "",
                            "indent": 0,
                            "type": "paragraph",
                            "version": 1,
                            "textFormat": 0,
                            "textStyle": ""
                        }
                    ],
                    "direction": null,
                    "format": "",
                    "indent": 0,
                    "type": "root",
                    "version": 1
                }
            },
            "backgroundImage": {
                "$oid": imageOid
            }
        },
        "actions": [
            {
                "label": "Donate",
                "link": "/donate",
                "style": "primary",
                "id": generateObjectId()
            }
        ],
        "__v": 0
    };
});

fs.writeFileSync('ramadan_popups.json', JSON.stringify(popups, null, 2));
console.log('Successfully generated ramadan_popups.json with 30 items.');
