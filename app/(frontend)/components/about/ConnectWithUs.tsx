import Image from "next/image";

export default function ConnectWithUsSection() {
  return (
    <section className="relative w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Background with gradient and pattern - only on right side for desktop */}
      <div
        className="absolute inset-0 lg:left-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(172.787deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
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

      {/* Left side - Image */}
      <div className="relative w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-auto lg:min-h-[600px]">
        <Image
          src="/assets/about-us/connect-with-us.png"
          alt="Connect with Us"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Content */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-start px-6 py-12 sm:px-8 sm:py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 xl:pr-[120px] xl:pl-12">
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-[24px] w-full max-w-full lg:max-w-[556px]">
          {/* Title */}
          <h2 className="text-2xl leading-8 font-bold sm:text-3xl sm:leading-9 md:text-[32px] md:leading-9 lg:text-[36px] lg:leading-[40px] text-white">
            Connect with Us
          </h2>

          {/* Description */}
          <p className="text-base leading-6 font-medium sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-[28px] text-[#f4f4f5]">
            Our community makes us unique. They have an energy that reverberates
            around them. Their mission in life is to ensure the wonder in the
            world is not overlooked.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-[24px]">
            <button className="flex items-center justify-center h-10 sm:h-11 md:h-12 lg:h-[48px] px-4 sm:px-5 md:px-6 lg:px-[24px] bg-[#fafafa] hover:bg-white text-black rounded-lg sm:rounded-xl lg:rounded-[12px] transition-colors cursor-pointer">
              <span className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-[24px]">
                Contact Us
              </span>
            </button>
            <button className="flex items-center justify-center h-10 sm:h-11 md:h-12 lg:h-[48px] px-4 sm:px-5 md:px-6 lg:px-[24px] bg-[#006fee] hover:bg-[#005fdd] text-white rounded-lg sm:rounded-xl lg:rounded-[12px] transition-colors cursor-pointer">
              <span className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-[24px]">
                Join Our Community
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
