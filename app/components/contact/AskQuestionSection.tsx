"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AskQuestionProps {
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  formSettings: {
    nameLabel: string;
    emailLabel: string;
    topicLabel: string;
    messageLabel: string;
    submitButtonText: string;
  };
  topicOptions?: string[] | { label: string; value: string; }[];
  successMessage?: string;
  recipientEmail?: string;
  onSubmit?: (data: any) => Promise<void>;
}

export function AskQuestionSection({
  title,
  description,
  image,
  formSettings,
  topicOptions = [],
  successMessage: defaultSuccessMessage,
  recipientEmail,
  onSubmit,
}: AskQuestionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      await onSubmit(formData);
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        topic: "",
        message: "",
      });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Failed to submit. Please try again.");
    }
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

  // Default topics if none provided
  const defaultTopics = [
    { value: "general", label: "General Inquiry" },
    { value: "prayer", label: "Prayer Times" },
    { value: "events", label: "Events" },
    { value: "donations", label: "Donations" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ];

  const normalizeTopics = (topics: string[] | { label: string; value: string; }[]) => {
    if (!topics || topics.length === 0) return defaultTopics;
    return topics.map((t) => (typeof t === "string" ? { value: t, label: t } : t));
  };

  const topicsToRender = normalizeTopics(topicOptions);

  // Image dimensions
  const imageWidth = 766;
  const imageHeight = 610;

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 hn-container bg-white">
      {/* Container with max-width */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-12 xl:justify-between items-start">
          {/* Left Side - Image */}
          <div
            className="hidden lg:block w-full lg:shrink-0 lg:max-w-124.5 xl:max-w-[766px]"
            style={{
              // @ts-expect-error CSS custom properties
              "--img-width": `${imageWidth}px`,
              "--img-width-sm": `${Math.round(imageWidth * 0.75)}px`,
            }}
          >
            <div
              className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden lg:max-w-124.5 xl:max-w-[766px]"
              style={{
                aspectRatio: `${imageWidth} / ${imageHeight}`,
              }}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:flex-1 flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-6 xl:gap-[42px] xl:max-w-[494px]">
            {/* Heading */}
            <div className="flex flex-col gap-5 sm:gap-7">
              <h2 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[44px] md:leading-11 xl:text-5xl lg:leading-12 text-black">
                {title}
              </h2>
              <p className="text-base sm:text-base md:text-lg xl:text-lg">
                {description}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 sm:gap-6 lg:gap-5 xl:gap-6"
            >


              {status === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                  {defaultSuccessMessage || "Message sent successfully!"}
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Name and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-xs sm:text-xs text-[#52525B]"
                  >
                    {formSettings.nameLabel}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'submitting'}
                    className={`w-full h-9 sm:h-[42px] px-4 sm:px-5 bg-[#F4F4F5] rounded-lg sm:rounded-xl text-base text-black outline-none disabled:opacity-50`}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs sm:text-xs text-[#52525B]"
                  >
                    {formSettings.emailLabel}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'submitting'}
                    className={`w-full h-9 sm:h-[42px] px-4 sm:px-5 bg-[#F5F5F5] rounded-lg sm:rounded-xl text-base text-black placeholder:text-[#999999] outline-none disabled:opacity-50`}
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
                  {formSettings.topicLabel}
                </label>
                <div className="relative">
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    className="w-full h-9 sm:h-[42px] px-4 sm:px-5 bg-[#F4F4F5] rounded-lg sm:rounded-xl text-base text-black appearance-none cursor-pointer outline-none disabled:opacity-50"
                  >
                    <option value="">Select a topic</option>
                    {topicsToRender.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Image
                      src="/assets/common/down-arrow.svg"
                      alt="Down Arrow"
                      width={10.56}
                      height={5.05}
                    />
                  </div>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-xs sm:text-xs text-[#52525B]"
                >
                  {formSettings.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  disabled={status === 'submitting'}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 bg-[#F4F4F5] rounded-xl text-base text-black focus:outline-none resize-none disabled:opacity-50`}
                  placeholder="Enter your message"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-start">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#006FEE] hover:bg-[#005BC5] text-white text-sm sm:text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === 'submitting' ? "Sending..." : formSettings.submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
