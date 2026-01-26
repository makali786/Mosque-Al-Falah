"use client";

import { useState } from "react";

interface FormFields {
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  commentLabel?: string;
  submitButtonText?: string;
}

interface RequestServiceFormProps {
  /**
   * Optional custom class name
   */
  className?: string;

  /**
   * Optional callback when form is submitted
   */
  onSubmit?: (data: FormData) => void | Promise<void>;

  sectionTitle?: string;
  description?: string;
  formFields?: FormFields;
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
  sectionTitle = "",
  description = "",
  formFields = {},
}: RequestServiceFormProps) {
  const {
    fullNameLabel = "Full Name",
    fullNamePlaceholder = "Toufik Hasan",
    emailLabel = "Email",
    emailPlaceholder = "Enter your Email",
    phoneLabel = "Phone Number",
    phonePlaceholder = "+880 123 456 789",
    commentLabel = "Comments",
    submitButtonText = "Submit",
  } = formFields;

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    comments: "",
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    setStatus('submitting');
    setErrorMessage("");

    try {
      await onSubmit(formData);
      setStatus('success');
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        comments: "",
      });
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus('error');
      setErrorMessage("Something went wrong. Please try again.");
    }
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
      className={`flex flex-col lg:flex-row items-center w-full bg-white rounded-xl border-t border-x border-[#D4D4D8]  ${className}`}
      style={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
      }}
    >
      {/* Header */}
      <div className="flex flex-row items-center self-stretch">
        <div className="w-full lg:w-112.25 h-full px-6 pt-6 pb-8 lg:pt-17 lg:pb-8 border-b lg:border-b-0 lg:border-r border-[#F4F4F5] flex flex-col gap-6 shrink-0 ">
          <div className="flex flex-col font-semibold justify-center shrink-0 text-[30px] w-full">
            <p className="leading-9 text-black">{sectionTitle}</p>
          </div>
          <div className="flex flex-col font-normal justify-center shrink-0 text-base w-full">
            <p className="leading-6 text-black">{description}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 w-full px-6 py-8 flex flex-col gap-4 ">
        {/* Row 1: Full Name and Email */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch shrink-0 w-full">
          {/* Full Name */}
          <div className="w-full sm:flex-1 flex flex-col items-start">
            <div className="bg-[#F4F4F5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
              <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                <div className="basis-0 flex flex-col grow h-full items-start justify-center min-h-0 min-w-0 pb-0.5 pt-0 px-1.5 shrink-0">
                  <div className="flex items-center pl-0 pr-2 py-0 shrink-0 w-full">
                    <label htmlFor="fullName" className="font-normal leading-4 text-xs text-[#52525B] whitespace-nowrap shrink-0">
                      {fullNameLabel}
                    </label>
                    <div className="flex flex-col h-3.5 items-center justify-center pl-0.5 pr-0 py-0 shrink-0 w-1.75">
                      <span className="font-normal leading-5 text-sm text-[#F31260] w-full shrink-0">*</span>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0 w-full">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={fullNamePlaceholder}
                      required
                      disabled={status === 'submitting'}
                      className="font-normal leading-5 text-sm text-[#11181C] placeholder:text-[#71717A] bg-transparent outline-none w-full shrink-0 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="w-full sm:flex-1 flex flex-col items-start">
            <div className="bg-[#F4F4F5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
              <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                <div className="basis-0 flex flex-col grow h-full items-start justify-center min-h-0 min-w-0 pb-0.5 pt-0 px-1.5 shrink-0">
                  <div className="flex items-center pl-0 pr-2 py-0 shrink-0 w-full">
                    <label htmlFor="email" className="font-normal leading-4 text-xs text-[#52525B] whitespace-nowrap shrink-0">
                      {emailLabel}
                    </label>
                    <div className="flex flex-col h-3.5 items-center justify-center pl-0.5 pr-0 py-0 shrink-0 w-1.75">
                      <span className="font-normal leading-5 text-sm text-[#F31260] w-full shrink-0">*</span>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0 w-full">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={emailPlaceholder}
                      required
                      disabled={status === 'submitting'}
                      className="font-normal leading-5 text-sm text-[#11181C] placeholder:text-[#71717A] bg-transparent outline-none w-full shrink-0 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Phone Number */}
        <div className="flex flex-col items-start shrink-0 w-full">
          <div className="bg-[#F4F4F5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
            <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
              <div className="basis-0 flex flex-col grow h-full items-start justify-center min-h-0 min-w-0 pb-0.5 pt-0 px-1.5 shrink-0">
                <div className="flex items-center pl-0 pr-2 py-0 shrink-0 w-full">
                  <label htmlFor="phoneNumber" className="font-normal leading-4 text-xs text-[#52525B] whitespace-nowrap shrink-0">
                    {phoneLabel}
                  </label>
                </div>
                <div className="flex items-center shrink-0 w-full">
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder={phonePlaceholder}
                    disabled={status === 'submitting'}
                    className="font-normal leading-5 text-sm text-[#11181C] placeholder:text-[#71717A] bg-transparent outline-none w-full shrink-0 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Comments */}
        <div className="flex flex-col h-[76px] items-start shrink-0 w-full">
          <div className="basis-0 bg-[#F4F4F5] flex grow items-start min-h-8 min-w-0 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
            <div className="basis-0 flex flex-col grow h-full items-start min-h-0 min-w-0 pb-0.5 pt-0 px-1.5 shrink-0">
              <div className="flex items-center pl-0 pr-2 py-0 shrink-0 w-full">
                <label htmlFor="comments" className="font-normal leading-4 text-xs text-[#52525B] whitespace-nowrap shrink-0">
                  {commentLabel}
                </label>
              </div>
              <div className="flex items-center shrink-0 w-full">
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Enter your comments"
                  disabled={status === 'submitting'}
                  className="font-normal leading-5 text-sm text-[#11181C] placeholder:text-[#71717A] bg-transparent outline-none resize-none w-full shrink-0 disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {status === 'success' && (
          <div className="text-green-600 text-sm font-medium">
            Request submitted successfully! We will contact you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-[#006FEE] text-white text-sm lg:text-base flex w-fit items-center justify-center px-6 py-3 rounded-xl shrink-0 hover:bg-[#005fd4] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Submitting...' : submitButtonText}
        </button>
      </form>
    </div>
  );
}

export type { RequestServiceFormProps, FormData };
