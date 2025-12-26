import Image from "next/image"

export default function ConnectWithUsSection() {
  return (
    <main className="xl:min-h-[600px] flex">
      {/* Left side - Image */}
      <div className="w-1/2 relative overflow-hidden">
        <Image src="/assets/about-us/connect-with-us.png" alt="Mosque interior with people" fill className="object-cover" priority />
      </div>

      {/* Right side - Content */}
      <div className="w-1/2 flex items-center justify-center px-12 py-12"   
         style={{
          background:
            "linear-gradient(169.508deg, #0C478A 46.629%, #004797 71.1%)",
      }}>
        <div className="max-w-md w-full">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-white mb-6">Connect with Us</h1>

          {/* Description */}
          <p className="text-white text-lg mb-6">
            Our community makes us unique. They have an energy that reverberates around them. Their mission in life is
            to ensure the wonder in the world is not overlooked.
          </p>

          {/* Buttons - replaced library buttons with simple HTML button elements */}
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl text-black bg-white transition-colors duration-200 cursor-pointer">
              Contact Us
            </button>
            <button className="px-6 py-3 rounded-xl font-semibold bg-[#006FEE] text-white transition-colors duration-200 cursor-pointer">
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
