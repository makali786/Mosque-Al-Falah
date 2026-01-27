"use client";

import { useState } from "react";

interface EventBookingFormProps {
    eventId: string;
    maxGuests?: number;
    onBookingSubmit: (data: any) => Promise<void>;
}

export default function EventBookingForm({ eventId, maxGuests = 0, onBookingSubmit }: EventBookingFormProps) {
    const [guestCount, setGuestCount] = useState<number>(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: ""
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage("");

        try {
            await onBookingSubmit({
                eventId,
                ...formData,
                numberOfGuests: guestCount
            });
            setStatus('success');
            setFormData({ fullName: "", email: "", phoneNumber: "" });
            setGuestCount(1);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    if (status === 'success') {
        return (
            <div className="lg:max-w-183.75 p-6 border border-green-200 bg-green-50 rounded-xl">
                <h4 className="text-green-800 font-semibold text-lg mb-2">Booking Requested!</h4>
                <p className="text-green-700">Your booking has been successfully requested! We will be in touch shortly.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-[24px] font-semibold mb-8">Book a place</h3>

            <form onSubmit={handleSubmit} className="lg:max-w-183.75 space-y-4 border border-[#E6F1FE] rounded-xl px-3 py-6 sm:px-6 sm:py-8 bg-white">
                {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
                        <label className="text-xs font-normal text-[#52525B]">
                            Full Name <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            disabled={status === 'submitting'}
                            className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none bg-transparent disabled:opacity-50"
                        />
                    </div>

                    <div className="w-full sm:w-45 bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit flex items-center justify-between cursor-pointer relative">
                        <select
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            disabled={status === 'submitting'}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10 disabled:cursor-not-allowed"
                        >
                            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none">
                            <span className="text-xs font-normal text-[#52525B] block">Guests</span>
                            <span className="text-sm text-[#11181C]">
                                {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                            </span>
                        </div>
                        <svg className="w-4 h-4 text-[#71717A] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
                    <label className="text-xs font-normal text-[#52525B]">
                        Email <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your Email"
                        required
                        disabled={status === 'submitting'}
                        className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none bg-transparent disabled:opacity-50"
                    />
                </div>

                <div className="bg-[#F4F4F5] border border-[#F4F4F5] rounded-lg px-1.5 py-1 h-fit">
                    <label className="text-xs font-normal text-[#52525B]">Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        disabled={status === 'submitting'}
                        className="w-full text-sm text-[#11181C] placeholder:text-[#71717A] outline-none bg-transparent disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-6 py-3 bg-[#006FEE] text-white text-sm rounded-xl cursor-pointer hover:bg-[#005bc4] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Booking...' : 'Book Now'}
                </button>
            </form>
        </div>
    );
}
