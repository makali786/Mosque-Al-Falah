"use client";

import { submitComment } from "@/blogs/[slug]/actions";
import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../common/Toast";

interface CommentFormProps {
    postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [comment, setComment] = useState("");
    const [saveInfo, setSaveInfo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toasts, removeToast, success, error } = useToast();

    // Load saved info from localStorage
    useEffect(() => {
        const savedName = localStorage.getItem("commentUserName");
        const savedEmail = localStorage.getItem("commentUserEmail");
        if (savedName) setUserName(savedName);
        if (savedEmail) setUserEmail(savedEmail);
        if (savedName || savedEmail) setSaveInfo(true);
    }, []);

    // Handle checkbox change
    const handleSaveInfoChange = (checked: boolean) => {
        setSaveInfo(checked);

        // If unchecking, remove from localStorage immediately
        if (!checked) {
            localStorage.removeItem("commentUserName");
            localStorage.removeItem("commentUserEmail");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!userName.trim() || !userEmail.trim() || !comment.trim()) {
            error("Please fill in all required fields.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Call server action to submit comment
            const result = await submitComment(postId, userName, userEmail, comment);

            if (!result.success) {
                throw new Error(result.error || "Failed to submit comment");
            }

            // Save to localStorage if checked
            if (saveInfo) {
                localStorage.setItem("commentUserName", userName);
                localStorage.setItem("commentUserEmail", userEmail);
            } else {
                localStorage.removeItem("commentUserName");
                localStorage.removeItem("commentUserEmail");
            }

            setComment("");
            success(result.message || "Comment submitted successfully! It will appear after approval.");
        } catch (err) {
            console.error("Error submitting comment:", err);
            error("Failed to submit comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white pb-12 md:pb-16 lg:pb-20 pt-6 md:pt-8 lg:pt-10">
            <div className="w-full px-4 md:px-8 lg:px-50">
                <div className="max-w-283.5 mx-auto">
                    <div className="border border-[#e4e4e7] flex flex-col gap-8 md:gap-10 lg:gap-13 items-center p-5 md:p-6 lg:p-8 rounded-[14px]">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#27272a] text-center">
                            Leave a Reply
                        </h2>

                        {/* Toast Notifications */}
                        <ToastContainer toasts={toasts} onRemove={removeToast} />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6 w-full">
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="flex-1 min-w-29">
                                    <div className="bg-[#f4f4f5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                                        <div className="flex-1 flex flex-col items-start justify-center px-1.5 pb-0.5">
                                            <div className="flex items-center pr-2 w-full">
                                                <p className="text-[12px] font-normal leading-4 text-[#52525b]">
                                                    Full Name
                                                </p>
                                                <p className="text-[14px] font-normal leading-5 text-[#f31260] pl-0.5">
                                                    *
                                                </p>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Enter your Full Name"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                className="text-[14px] font-normal leading-5 text-[#11181c] w-full bg-transparent border-none outline-none placeholder:text-[#71717a]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-29">
                                    <div className="bg-[#f4f4f5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                                        <div className="flex-1 flex flex-col items-start justify-center px-1.5 pb-0.5">
                                            <div className="flex items-center pr-2 w-full">
                                                <p className="text-[12px] font-normal leading-4 text-[#52525b]">
                                                    Email
                                                </p>
                                                <p className="text-[14px] font-normal leading-5 text-[#f31260] pl-0.5">
                                                    *
                                                </p>
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="Enter your Email"
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                className="text-[14px] font-normal leading-5 text-[#11181c] w-full bg-transparent border-none outline-none placeholder:text-[#71717a]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col h-30.25 min-w-29 w-full">
                                <div className="bg-[#f4f4f5] flex-1 flex items-start min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                                    <div className="flex-1 flex flex-col h-full items-start px-1.5 pb-0.5">
                                        <div className="flex items-center pr-2 w-full">
                                            <p className="text-[12px] font-normal leading-4 text-[#52525b]">
                                                Comments
                                            </p>
                                        </div>
                                        <textarea
                                            placeholder="Write your comment..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="text-[14px] font-normal leading-5 text-[#11181c] w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-[#71717a]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <label className="flex gap-2 items-start p-2 cursor-pointer">
                                <div className="relative w-6 h-6 shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={saveInfo}
                                        onChange={(e) => handleSaveInfoChange(e.target.checked)}
                                        className="peer absolute opacity-0 w-6 h-6 cursor-pointer"
                                    />
                                    <div className="w-6 h-6 bg-[#d4d4d8] peer-checked:bg-[#006fee] rounded-md flex items-center justify-center pointer-events-none transition-colors"></div>
                                    <svg
                                        className="w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                        viewBox="0 0 8 6"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M0.5 3L2.83333 5.33333L7.5 0.666667"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#11181c]">
                                    Save my name, email, and website in this browser for the next time I comment.
                                </p>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#006fee] h-10.5 flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <p className="text-sm font-normal text-white">
                                    {isSubmitting ? "Submitting..." : "Post comment"}
                                </p>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
