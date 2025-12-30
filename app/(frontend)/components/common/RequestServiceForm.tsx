"use client";

import { useState } from "react";

interface RequestServiceFormProps {
  /**
   * Optional custom class name
   */
  className?: string;

  /**
   * Optional callback when form is submitted
   */
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  comments: string;
}

export default function RequestServiceForm({
  className = "",
  onSubmit,
}: RequestServiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    comments: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    // Reset form after submission
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      comments: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`flex flex-col lg:flex-row items-start lg:items-center w-full bg-white rounded-2xl border border-[#D4D4D8] py-6 md:py-8 ${className}`}
    >
      {/* Header */}
      <div className="w-full lg:w-[48%] px-4 sm:px-6 lg:p-6 mb-6 lg:mb-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#000000] mb-6">
          Request a service
        </h2>
        <p className="text-sm sm:text-base text-[#000000]">
          Connect our Masjid for personalized assistance and discover how we can
          help you.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full lg:w-[48%] px-4 sm:px-6 lg:p-6 space-y-4 sm:space-y-5">
        {/* Row 1: Full Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Full Name */}
          <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
            <label
              htmlFor="fullName"
              className="text-sm font-normal text-[#52525B]"
            >
              Full Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Toufik Hasan"
              required
              className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none"
            />
          </div>

          {/* Email */}
         <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
            <label
              htmlFor="email"
              className="text-sm font-normal text-[#52525B]"
            >
              Email <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              required
              className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none"
            />
          </div>
        </div>

        {/* Row 2: Phone Number */}
        <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-normal text-[#52525B]"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+880 123 456 789"
            className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none"
          />
        </div>

        {/* Row 3: Comments */}
        <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
          <label
            htmlFor="comments"
            className="text-sm font-normal text-[#52525B]"
          >
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={3}
            placeholder="Enter your comments"
            className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-[#006FEE] text-white text-sm sm:text-base font-medium rounded-lg hover:bg-[#0062D1] active:bg-[#0056B8] transition-colors duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export type { RequestServiceFormProps, FormData };
