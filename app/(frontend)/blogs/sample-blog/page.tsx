import Image from "next/image";
import Link from "next/link";
import PageHero from "../../components/common/PageHero";
import { QuoteSection } from "@/components/common/QuoteSection";
import BlogCard from "../../components/blogs/BlogCard";

// Static blog data
const blogPost = {
  title: "How To Pray Taraweeh during Ramadan",
  publishedDate: "15 March 2024",
  category: "Hadith",
  featuredImage: "/assets/blogs/hero-banner.png",
  author: {
    name: "Sheikh Muhammad Ali",
    avatar: "/assets/blogs/author-avatar.jpg",
  },
  content: `
    <p>Taraweeh prayers are special prayers performed during the month of Ramadan. These prayers are performed after the Isha prayer and are highly recommended for all Muslims.</p>

    <h2>What is Taraweeh?</h2>
    <p>Taraweeh is a special Islamic prayer performed by Muslims at night during the month of Ramadan. It involves reciting long portions of the Quran and is performed in congregation at the mosque.</p>

    <h2>How to Perform Taraweeh</h2>
    <p>The Taraweeh prayer consists of 8 to 20 rakats, performed in pairs. Here are the basic steps:</p>

    <ol>
      <li>Make intention (niyyah) for Taraweeh prayer</li>
      <li>Begin with Takbir (Allahu Akbar)</li>
      <li>Recite Surah Al-Fatiha followed by a long portion of the Quran</li>
      <li>Complete the rakat with ruku and sujood</li>
      <li>Take short breaks between every 4 rakats</li>
    </ol>

    <h2>Benefits of Taraweeh Prayer</h2>
    <p>Praying Taraweeh during Ramadan brings numerous spiritual benefits and rewards. The Prophet Muhammad (peace be upon him) said: "Whoever prays during Ramadan out of sincere faith and hoping for a reward from Allah, then all his previous sins will be forgiven."</p>

    <blockquote>
      "The best of people are those who bring most benefit to the rest of mankind." - Prophet Muhammad (PBUH)
    </blockquote>

    <p>May Allah accept our prayers and make us among those who benefit from the blessings of Ramadan.</p>
  `,
  tags: ["Ramadan", "Prayer", "Taraweeh", "Worship"],
};

// Static related posts
const relatedPosts = [
  {
    id: "1",
    slug: "sample-blog",
    title: "Understanding the Five Pillars of Islam",
    description: "A comprehensive guide to the fundamental practices of Islamic faith.",
    date: "10 March 2024",
    category: "Islamic Studies",
    imageUrl: "/assets/blogs/related-1.jpg",
  },
  {
    id: "2",
    slug: "sample-blog",
    title: "The Importance of Charity in Islam",
    description: "Discover the spiritual and social significance of giving in Islam.",
    date: "8 March 2024",
    category: "Hadith",
    imageUrl: "/assets/blogs/related-2.jpg",
  },
  {
    id: "3",
    slug: "sample-blog",
    title: "Fasting During Ramadan: A Complete Guide",
    description: "Everything you need to know about fasting during the holy month.",
    date: "5 March 2024",
    category: "Ramadan",
    imageUrl: "/assets/blogs/related-3.jpg",
  },
];

export default function BlogDetailPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section with Featured Image */}
      <PageHero
        title={blogPost.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blogs" },
          { label: "Blog title", href: "#" },
        ]}
        backgroundImage={blogPost.featuredImage}
        backgroundPosition="center"
        pageheroTitleStyle="max-w-[710px]"
      />

      {/* Content Wrapper */}
      <div className="max-w-250 mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="flex flex-col gap-15 w-full">
          {/* Hadith Quote */}
          <div className="text-xl leading-7 text-black">
            <p className="mb-0">
              Abu Hurairah reported that the Messenger of Allah (peace be upon him) stated: &quot;Whoever performs the voluntary night prayer during Ramadan with faith and in anticipation of reward will have their past sins forgiven.&quot;
            </p>
            <p className="mb-0">&nbsp;</p>
            <a
              href="https://sunnah.com/nasai:5027"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006fee] underline hover:text-[#005bc4]"
            >
              [Sunan an-Nasa&apos;i 5027]
            </a>
          </div>

          {/* First Paragraph */}
          <p className="text-lg leading-7 text-[#27272a]">
            Taraweeh is one of the special prayers of Ramadan. It is a nightly prayer performed after the obligatory Isha prayer and before the Witr prayer. The Taraweeh prayer consists of twenty rakat, each performed as a unit of two rakahs. Muslims from all over the world line up and listen to the recitation of the Quran done during Taraweeh in mosques. This prayer helps establish a deeper connection with the Lord and truly enjoy Ramadan&apos;s essence.
          </p>

          {/* First Section Heading */}
          <h2 className="text-5xl font-bold leading-12 text-black">Taraweeh & Its Origins</h2>

          {/* Paragraph */}
          <p className="text-lg leading-7 text-[#27272a]">
            Taraweeh is an Arabic word that means &apos;rest and relaxation.&apos; Taraweeh is sometimes called &apos;Qiyam,&apos; which translates to &apos;standing.&apos; It is a nightly prayer performed after the Isha prayer and is proven by the Prophet PBUH himself. Several hadiths are evidence of the Taraweeh prayer being established from the time of the Prophet PBUH.
          </p>

          {/* Full Width Image */}
          <div className="relative w-full h-141.25 rounded-[14px] overflow-hidden">
            <Image
              src="/assets/blogs/taraweeh-origins.png"
              alt="Taraweeh & Its Origins"
              fill
              className="object-cover"
            />
          </div>

          {/* First Hadith Quote Box */}
          <div className="bg-white border border-[#e4e4e7] rounded-[40px] p-15 w-full">
            <div className="flex flex-col gap-7.5">
              <p className="text-2xl font-medium leading-8 text-black">
                &quot;Aisha narrated that the Messenger of Allah (PBUH) led prayer in the mosque one night, and people joined him. On the following night, more people gathered to pray with him. However, by the third or fourth night, when even larger crowds assembled, the Messenger of Allah (PBUH) chose not to come out to lead the Taraweeh prayer. In the morning, he explained: &apos;I observed what you were doing, but I refrained from joining you, as I feared this prayer might become mandatory for you.&apos;&quot;
              </p>
              <p className="text-base font-semibold leading-6 text-[#006fee]">
                Sahih Muslim 761A
              </p>
            </div>
          </div>

          {/* Paragraph */}
          <p className="text-lg leading-7 text-[#27272a]">
            After the Prophet PBUH passed away, the chance of Taraweeh prayer becoming obligatory no longer remained because Allah SWT completed the religion. After this, Umar RA gathered the people and started to pray Taraweeh in the congregation.
          </p>

          {/* Second Hadith Quote Box */}
          <div className="bg-white border border-[#e4e4e7] rounded-[40px] p-15 w-full">
            <div className="flex flex-col gap-7.5">
              <p className="text-2xl font-medium leading-8 text-black">
                Abd ar-Rahman ibn Abd al-Qari narrated, &quot;I accompanied Umar ibn al-Khattab to the mosque during Ramadan, where the people were scattered in groups. Some were praying alone, while others prayed in small clusters. Umar remarked, &apos;By Allah! It would be better if these individuals united behind a single reciter.&apos; He then organized them to pray behind Ubayy ibn Kab. On another night, I joined him again, and the people were indeed praying behind the appointed reciter. Umar commented, &apos;This new practice is excellent, but what you miss while you sleep is far better than what you observe in prayer.&apos;&quot;
              </p>
              <p className="text-base font-semibold leading-6 text-[#006fee]">
                [Sahih al-Bukhari 2010]
              </p>
            </div>
          </div>

          {/* Second Section Heading */}
          <h2 className="text-5xl font-bold leading-12 text-black">How To Pray Taraweeh?</h2>

          {/* Two Column Layout */}
          <div className="flex gap-10 w-full">
            {/* Left Column - Main Content */}
            <div className="flex-1 flex flex-col gap-2.5 items-center">
              <p className="text-lg leading-7 text-[#27272a] w-full">
                Taraweeh is prayed like any other two-rakah prayer, with a short break after every 4 rakats. Below is a step-by-step breakdown of performing Taraweeh.
              </p>

              {/* Steps List */}
              <div className="flex flex-col gap-6 p-2.5 w-full">
                <div className="flex gap-3.75 items-start w-full">
                  <div className="flex items-start p-0.5 shrink-0">
                    <Image
                      src="/assets/blogs/checkmark.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="flex-1 text-lg leading-7 text-[#27272a]">
                    Pray the Isha prayer, stopping before praying Witr.
                  </p>
                </div>

                <div className="flex gap-3.75 items-start w-full">
                  <div className="flex items-start p-0.5 shrink-0">
                    <Image
                      src="/assets/blogs/checkmark.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="flex-1 text-lg leading-7 text-[#27272a]">
                    Make an intention to pray, Taraweeh.
                  </p>
                </div>

                <div className="flex gap-3.75 items-start w-full">
                  <div className="flex items-start p-0.5 shrink-0">
                    <Image
                      src="/assets/blogs/checkmark.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="flex-1 text-lg leading-7 text-[#27272a]">
                    Pray the first 2 rakats.
                  </p>
                </div>

                <div className="flex gap-3.75 items-start w-full">
                  <div className="flex items-start p-0.5 shrink-0">
                    <Image
                      src="/assets/blogs/checkmark.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="flex-1 text-lg leading-7 text-[#27272a]">
                    Again, pray 2 rakats.
                  </p>
                </div>

                <div className="flex gap-3.75 items-start w-full">
                  <div className="flex items-start p-0.5 shrink-0">
                    <Image
                      src="/assets/blogs/checkmark.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="flex-1 text-lg leading-7 text-[#27272a]">
                    Take a short break and recite the dua for this break.
                  </p>
                </div>

                <div className="flex gap-3.75 items-start w-full">
                  <div className="flex items-start p-0.5 shrink-0">
                    <Image
                      src="/assets/blogs/checkmark.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="flex-1 text-lg leading-7 text-[#27272a]">
                    <p className="mb-0">Repeat this until all 20 rakats of the Taraweeh prayer are completed.</p>
                    <p>Pray the Witr prayer.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="flex gap-6.25 items-start shrink-0">
              {/* Divider */}
              <div className="h-97.75 w-px bg-[#e4e4e7]"></div>

              {/* See Also Section */}
              <div className="flex flex-col gap-3.75 py-1.25">
                <p className="text-sm leading-5.5 text-[#a1a1aa]">See also:</p>
                <div className="flex flex-col gap-5">
                  <div className="relative w-100 h-65 rounded-[14px] overflow-hidden">
                    <Image
                      src="/assets/blogs/simple-duas.png"
                      alt="Simple Duas To Memorize For Ramadan"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-2xl font-semibold leading-8 text-black w-100">
                    Simple Duas To Memorize For Ramadan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Section Heading */}
          <h2 className="text-5xl font-bold leading-12 text-black">How Many Rakats Are In Taraweeh?</h2>

          {/* Paragraph */}
          <p className="text-lg leading-7 text-[#27272a]">
            Before looking at the rakats of Taraweeh prayer, it is essential to remember that there are no specified number of rakats of Taraweeh in the hadith.
          </p>

          {/* Third Hadith Quote Box */}
          <div className="bg-white border border-[#e4e4e7] rounded-[40px] p-15 w-full">
            <div className="flex flex-col gap-7.5">
              <p className="text-2xl font-medium leading-8 text-black">
                Ibn &apos;Umar reported that the Prophet (PBUH) was asked about the night prayer. He replied, &quot;Pray in sets of two. If you are concerned that dawn is approaching, then conclude your prayer with one Rak&apos;ah of Witr.&quot;
              </p>
              <p className="text-base font-semibold leading-6 text-[#006fee]">
                [Sunan Ibn Majah 1320]
              </p>
            </div>
          </div>

          {/* Schools of Thought List */}
          <div className="flex flex-col gap-6 p-2.5 w-full">
            <div className="flex gap-3.75 items-start w-full">
              <div className="flex items-start p-0.5 shrink-0">
                <Image
                  src="/assets/blogs/checkmark.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
              <p className="flex-1 text-lg leading-7 text-[#27272a]">
                <span className="font-bold">Hanafi:</span> According to the Hanafi school of thought, the Taraweeh prayer consists of twenty rakahs, apart from Witr.
              </p>
            </div>

            <div className="flex gap-3.75 items-start w-full">
              <div className="flex items-start p-0.5 shrink-0">
                <Image
                  src="/assets/blogs/checkmark.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
              <p className="flex-1 text-lg leading-7 text-[#27272a]">
                <span className="font-bold">Hanbali:</span> The Hanbali school of thought states that the Taraweeh prayer comprises twenty rakats.
              </p>
            </div>

            <div className="flex gap-3.75 items-start w-full">
              <div className="flex items-start p-0.5 shrink-0">
                <Image
                  src="/assets/blogs/checkmark.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
              <p className="flex-1 text-lg leading-7 text-[#27272a]">
                <span className="font-bold">Shafi:</span> The Shafi school states that taraweeh is of twenty rakahs.
              </p>
            </div>

            <div className="flex gap-3.75 items-start w-full">
              <div className="flex items-start p-0.5 shrink-0">
                <Image
                  src="/assets/blogs/checkmark.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
              <div className="flex-1 text-lg leading-7 text-[#27272a]">
                <p className="mb-0">
                  <span className="font-bold">Maliki:</span> According to the Maliki school of thought, the Taraweeh prayer consists of thirty-six rakahs.
                </p>
                <p>All of these opinions are correct and are permissible by the shariah. The difference in them arises from the difference in knowledge that reached each school. When Al Nawawi (may Allah have mercy on him) was asked about this, he replied,</p>
              </div>
            </div>
          </div>

          {/* Final Paragraph */}
          <div className="text-lg leading-7 text-[#27272a]">
            <p className="mb-0">
              &quot;The time for the Taraweeh prayer begins after the &apos;Isha prayer has concluded, as noted by al-Baghawi and others, and continues until dawn. However, if a person is leading the prayer in the mosque, performing Taraweeh right after the &apos;Isha prayer is preferable instead of postponing it to the middle or end of the night. This approach helps avoid causing difficulties for the worshippers, as some may fall asleep and miss the prayer. This practice is common among Muslims, who pray Taraweeh immediately after &apos;Isha and do not delay it.&quot;
            </p>
            <p className="mb-0">&nbsp;</p>
            <p>
              <span className="font-bold">Note:</span> The person who is praying Taraweeh at home can pray it either at the beginning of the night or at the end of it.
            </p>
          </div>

          {/* Tags Section */}
          <div className="flex gap-3.75 items-center">
            <p className="text-base font-semibold leading-6 text-black uppercase">TAGS:</p>
            <div className="flex gap-2.5">
              <div className="bg-[#002e62] px-4 py-1 rounded-full">
                <p className="text-sm font-semibold leading-5 text-white uppercase">HADITH</p>
              </div>
              <div className="bg-[#002e62] px-4 py-1 rounded-full">
                <p className="text-sm font-semibold leading-5 text-white uppercase">SALAH</p>
              </div>
              <div className="bg-[#002e62] px-4 py-1 rounded-full">
                <p className="text-sm font-semibold leading-5 text-white uppercase">QURAN</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#18181B]">Related Posts</h3>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <span className="text-gray-400 text-xl">‹</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0000FF10] text-[#006FEE] bg-[#0000FF10]">
                <span className="text-xl">›</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <BlogCard
                key={post.id}
                {...post}
                appearance={{
                  showFeaturedImage: true,
                  showCategoryBadge: true,
                  showDate: true,
                  showExcerpt: true,
                  showReadMoreButton: true,
                  readMoreButtonText: "Read More",
                  cardStyle: "shadow",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-225 mx-auto px-4 md:px-8">
          <h3 className="text-2xl font-bold text-[#18181B] mb-12 text-center">Comments</h3>

          {/* No comments message */}
          <p className="text-center text-gray-500 mb-12">
            No comments yet. Be the first to share your thoughts!
          </p>

          {/* Leave a Reply Form */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#18181B] mb-8 text-center">
              Leave a Reply
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F4F5] border-none text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:ring-1 focus:ring-[#006FEE] outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">Type full name</p>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email *"
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F4F5] border-none text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:ring-1 focus:ring-[#006FEE] outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">Enter your Email</p>
                </div>
              </div>
              <div>
                <textarea
                  rows={5}
                  placeholder="Message me"
                  className="w-full px-4 py-3 rounded-xl bg-[#F4F4F5] border-none text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:ring-1 focus:ring-[#006FEE] outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="save-info"
                  className="mt-1 w-4 h-4 text-[#006FEE] rounded border-gray-300 focus:ring-[#006FEE]"
                />
                <label htmlFor="save-info" className="text-sm text-[#71717A]">
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#006FEE] text-white font-medium rounded-xl text-sm hover:bg-[#005bc4] transition-colors"
                >
                  Post comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quote Section Footer */}
      <QuoteSection
        quote="Verily, with hardship comes ease. Verily, with hardship comes ease."
        attribution="Quran 94:5-6"
        donateButtonUrl="/donate"
        backgroundColor="#F4F4F5"
        shareButtonText="Share"
        donateButtonText="Donate"
      />
    </main>
  );
}
