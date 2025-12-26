import Image from "next/image"

export default function ConnectWithUsSection() {
  return (
    <main className="xl:min-h-[600px] flex">
      {/* Left side - Image */}
      <div className="w-1/2 relative overflow-hidden">
        <Image src="/assets/about-us/connect-with-us.png" alt="Mosque interior with people" fill className="object-cover" priority />
      </div>

      {/* Right side - Content */}
      <div className="relative w-1/2 flex items-center justify-center px-12 py-12 overflow-hidden">
        {/* Background with gradient and pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30 bg-repeat"
            style={{
              backgroundImage: "url('/assets/services/bg-pattern.png')",
              backgroundSize: "154px 154px",
            }}
          />
        </div>

        <div className="relative max-w-md w-full rounded-[14px] bg-white px-16 py-11 shadow-lg">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Connect with Us</h1>

          {/* Description */}
          <p className="text-gray-700 text-lg mb-6">
            Our community makes us unique. They have an energy that reverberates around them. Their mission in life is
            to ensure the wonder in the world is not overlooked.
          </p>

          {/* Buttons - replaced library buttons with simple HTML button elements */}
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl text-black bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
              Contact Us
            </button>
            <button className="px-6 py-3 rounded-xl font-semibold bg-[#006FEE] hover:bg-[#005FDD] text-white transition-colors duration-200 cursor-pointer">
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
