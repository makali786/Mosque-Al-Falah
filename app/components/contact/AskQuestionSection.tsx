"use client";

import Image from "next/image";
import { useState } from "react";

export function AskQuestionSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image dimensions
  const imageWidth = 766;
  const imageHeight = 610;

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 hn-container bg-white">
      {/* Container with max-width */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <div
            className="w-full lg:shrink-0 lg:w-[45%] lg:max-w-124.5 2xl:max-w-166"
            style={{
              // @ts-expect-error CSS custom properties
              "--img-width": `${imageWidth}px`,
              "--img-width-sm": `${Math.round(imageWidth * 0.75)}px`,
            }}
          >
            <div
              className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden"
              style={{
                aspectRatio: `${imageWidth} / ${imageHeight}`,
              }}
            >
              <Image
                src="/assets/contact-us/contact-img.png"
                alt="Ask a Question - Masjid Al-Falah"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:flex-1 flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-6 xl:gap-[42px]">

            {/* Heading */}
            <div className="flex flex-col gap-5 sm:gap-7">
              <h2 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[44px] md:leading-11 xl:text-5xl lg:leading-12 text-black">
                Ask a Question
              </h2>
              <p className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 xl:text-lg lg:leading-7 text-[#666666]">
                If you have any questions, you can contact us. Please, fill out
                the form below.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 lg:gap-5 xl:gap-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-xs sm:text-xs text-[#52525B]"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-9 sm:h-[42px] px-4 sm:px-5 bg-[#F4F4F5] rounded-lg sm:rounded-xl text-base text-black outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs sm:text-xs text-[#52525B]"
                  >
                    E-Mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-9 sm:h-[42px] px-4 sm:px-5 bg-[#F5F5F5] rounded-lg sm:rounded-xl text-base text-black placeholder:text-[#999999] outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Select Topic */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="topic"
                  className="text-xs sm:text-xs text-[#52525B]"
                >
                  Select Topic
                </label>
                <div className="relative">
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full h-9 sm:h-[42px] px-4 sm:px-5 bg-[#F4F4F5] rounded-lg sm:rounded-xl text-base text-black appearance-none cursor-pointer outline-none"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="prayer">Prayer Times</option>
                    <option value="events">Events</option>
                    <option value="donations">Donations</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Image src="/assets/common/down-arrow.svg" alt="Down Arrow" width={10.56} height={5.05} />
                  </div>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-xs sm:text-xs text-[#52525B]"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-[#F4F4F5] rounded-xl text-base text-black focus:outline-none resize-none"
                  placeholder="Enter your message"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-start">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#006FEE] hover:bg-[#005BC5] text-white text-base sm:text-lg font-semibold rounded-xl"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
        <style jsx>{`
          @media (min-width: 1024px) and (max-width: 1519px) {
          
        `}</style>
      </div>
    </section>
  );
}
