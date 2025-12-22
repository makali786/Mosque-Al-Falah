export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-20 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Welcome to Masjid Al-Falah
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              A place of worship, community, and spiritual growth. Join us in
              building a stronger Muslim community through prayer, education,
              and service.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/prayer-times"
                className="rounded-lg bg-emerald-600 px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Prayer Times
              </a>
              <a
                href="/donate"
                className="rounded-lg border-2 border-emerald-600 px-8 py-3 text-center font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-gray-900"
              >
                Support Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Our Services
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Service Card 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-emerald-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Quran Classes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn to read and understand the Quran with qualified teachers
                for all ages.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-emerald-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Youth Programs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Engaging activities and mentorship for the next generation of
                Muslim leaders.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-emerald-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Community Outreach
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Serving the community through charity, food drives, and social
                services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-600 py-16">
        <div className="container mx-auto px-4 text-center md:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Join Our Community
          </h2>
          <p className="mb-8 text-lg text-emerald-50">
            Be part of a vibrant community dedicated to faith, knowledge, and
            service.
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-emerald-600 transition-colors hover:bg-gray-100"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
