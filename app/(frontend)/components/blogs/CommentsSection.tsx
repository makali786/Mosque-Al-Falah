"use client";

import { useState } from "react";
import Image from "next/image";
import { updateComment, updateReply, submitReply } from "../../blogs/[slug]/actions";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../common/Toast";

interface Reply {
    userName: string;
    replyText: string;
    replyDate: string;
    id?: string;
}

interface Comment {
    userName: string;
    userEmail: string;
    userAvatarUrl?: string | null;
    comment: string;
    commentDate: string;
    isApproved: boolean;
    replies: Reply[];
    id?: string;
}

interface CommentsSectionProps {
    postId: string;
    comments: Comment[];
}

export default function CommentsSection({ postId, comments: initialComments }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replyUserName, setReplyUserName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toasts, removeToast, success, error } = useToast();

    // Start editing a comment
    const handleEditComment = (comment: Comment) => {
        setEditingCommentId(comment.id || null);
        setEditText(comment.comment);
        setEditingReplyId(null);
        setReplyingToId(null);
    };

    // Start editing a reply
    const handleEditReply = (commentId: string, reply: Reply) => {
        setEditingReplyId(reply.id || null);
        setEditText(reply.replyText);
        setEditingCommentId(commentId);
        setReplyingToId(null);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingReplyId(null);
        setEditText("");
    };

    // Save edited comment
    const handleSaveComment = async (commentId: string) => {
        if (!editText.trim()) return;
        setIsSubmitting(true);

        try {
            const result = await updateComment(postId, commentId, editText);

            if (!result.success) {
                throw new Error(result.error || "Failed to update comment");
            }

            // Update local state
            const updatedComments = comments.map((c) => {
                if (c.id === commentId) {
                    return { ...c, comment: editText.trim() };
                }
                return c;
            });

            setComments(updatedComments);
            setEditingCommentId(null);
            setEditingReplyId(null);
            setEditText("");
            success(result.message || "Comment updated successfully!");
        } catch (err) {
            console.error("Error updating comment:", err);
            error("Failed to update comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Save edited reply
    const handleSaveReply = async (commentId: string, replyId: string) => {
        if (!editText.trim()) return;
        setIsSubmitting(true);

        try {
            const result = await updateReply(postId, commentId, replyId, editText);

            if (!result.success) {
                throw new Error(result.error || "Failed to update reply");
            }

            // Update local state
            const updatedComments = comments.map((c) => {
                if (c.id === commentId) {
                    const updatedReplies = c.replies.map((r) => {
                        if (r.id === replyId) {
                            return { ...r, replyText: editText.trim() };
                        }
                        return r;
                    });
                    return { ...c, replies: updatedReplies };
                }
                return c;
            });

            setComments(updatedComments);
            setEditingCommentId(null);
            setEditingReplyId(null);
            setEditText("");
            success(result.message || "Reply updated successfully!");
        } catch (err) {
            console.error("Error updating reply:", err);
            error("Failed to update reply.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Start replying to a comment
    const handleReplyClick = (commentId: string) => {
        setReplyingToId(commentId);
        setReplyText("");
        setReplyUserName("");
        setEditingCommentId(null);
        setEditingReplyId(null);
    };

    // Cancel reply
    const handleCancelReply = () => {
        setReplyingToId(null);
        setReplyText("");
        setReplyUserName("");
    };

    // Submit reply
    const handleSubmitReply = async (commentId: string) => {
        if (!replyText.trim() || !replyUserName.trim()) {
            error("Please enter your name and reply.");
            return;
        }
        setIsSubmitting(true);

        try {
            const result = await submitReply(postId, commentId, replyUserName, replyText);

            if (!result.success) {
                throw new Error(result.error || "Failed to submit reply");
            }

            // Update local state
            const newReply: Reply = {
                userName: replyUserName.trim(),
                replyText: replyText.trim(),
                replyDate: new Date().toISOString(),
            };

            const updatedComments = comments.map((c) => {
                if (c.id === commentId) {
                    return { ...c, replies: [...c.replies, newReply] };
                }
                return c;
            });

            setComments(updatedComments);
            setReplyingToId(null);
            setReplyText("");
            setReplyUserName("");
            success(result.message || "Reply submitted successfully!");
        } catch (err) {
            console.error("Error submitting reply:", err);
            error("Failed to submit reply.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!comments || comments.length === 0) {
        return (
            <div className="bg-white pt-8 md:pt-10 lg:pt-12 pb-0 mb-6">
                <div className="w-full section-padding">
                    <div className="max-w-283.5 mx-auto">
                        <div className="flex flex-col gap-8 md:gap-10 lg:gap-13 items-center">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#27272a] text-center">
                                Comments
                            </h2>
                            <p className="text-center text-[#3f3f46] text-lg">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white pt-8 md:pt-10 lg:pt-12 pb-0 mb-6">
            <div className="w-full section-padding">
                <div className="max-w-283.5 mx-auto">
                    <div className="flex flex-col gap-8 md:gap-10 lg:gap-13 items-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#27272a] text-center">
                            Comments
                        </h2>

                        {/* Toast Notifications */}
                        <ToastContainer toasts={toasts} onRemove={removeToast} />

                        {/* Comment List */}
                        <div className="flex flex-col gap-8 md:gap-10 lg:gap-13 items-start w-full">
                            {comments.map((comment) => (
                                <div key={comment.id} className="w-full">
                                    {/* Main Comment */}
                                    <div className="border border-[#e4e4e7] bg-white flex flex-col gap-4 md:gap-5 items-start justify-center px-5 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12.5 rounded-[20px] md:rounded-[25px] lg:rounded-[30px] w-full shadow-sm">
                                        {/* Header: User Info + Edit Button */}
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex gap-2 items-center">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa] shrink-0">
                                                    {comment.userAvatarUrl ? (
                                                        <Image
                                                            src={comment.userAvatarUrl}
                                                            alt={comment.userName}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                                            {comment.userName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-normal text-[#11181c]">
                                                        {comment.userName}
                                                    </p>
                                                    <p className="text-xs font-normal text-[#a1a1aa]">
                                                        {new Date(comment.commentDate).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Edit Button */}
                                            {editingCommentId === comment.id && !editingReplyId ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                                                    >
                                                        <p className="text-sm font-normal text-[#71717a]">Cancel</p>
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveComment(comment.id!)}
                                                        disabled={isSubmitting}
                                                        className="flex items-center justify-center h-10 px-4 rounded-xl bg-[#006fee] hover:bg-[#005bc4] transition-colors disabled:opacity-50"
                                                    >
                                                        <p className="text-sm font-normal text-white">
                                                            {isSubmitting ? "Saving..." : "Save"}
                                                        </p>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditComment(comment)}
                                                    className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <p className="text-sm font-normal text-[#006fee]">Edit</p>
                                                </button>
                                            )}
                                        </div>

                                        {/* Comment Text or Edit Input */}
                                        {editingCommentId === comment.id && !editingReplyId ? (
                                            <textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#3f3f46] w-full bg-[#f4f4f5] rounded-xl p-4 border-none outline-none resize-none min-h-[100px]"
                                            />
                                        ) : (
                                            <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#3f3f46] w-full">
                                                {comment.comment}
                                            </p>
                                        )}

                                        {/* Reply Button */}
                                        {editingCommentId !== comment.id && (
                                            <button
                                                onClick={() => handleReplyClick(comment.id!)}
                                                className="bg-[#006fee] h-10.5 flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors cursor-pointer"
                                            >
                                                <p className="text-sm font-normal text-white">Reply</p>
                                            </button>
                                        )}
                                    </div>

                                    {/* Replies Thread Container */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-4 md:mt-5 lg:mt-6 pl-4 md:pl-6 lg:pl-8 border-l-4 border-[#006fee]/20 ml-0 w-full">
                                            <div className="flex flex-col gap-4 md:gap-5">
                                                {/* Reply Count Badge */}
                                                <div className="flex items-center gap-2">
                                                    <div className="h-px flex-1 bg-[#e4e4e7]"></div>
                                                    <div className="bg-[#006fee]/10 px-3 py-1 rounded-full">
                                                        <p className="text-xs font-medium text-[#006fee]">
                                                            {comment.replies.length} {comment.replies.length === 1 ? "Reply" : "Replies"}
                                                        </p>
                                                    </div>
                                                    <div className="h-px flex-1 bg-[#e4e4e7]"></div>
                                                </div>

                                                {comment.replies.map((reply, replyIndex) => (
                                                    <div
                                                        key={reply.id || `reply-${comment.id}-${replyIndex}`}
                                                        className="relative"
                                                    >
                                                        {/* Reply Container */}
                                                        <div className="border border-[#e4e4e7] bg-[#fafafa] flex flex-col gap-3 md:gap-4 items-start justify-center px-4 md:px-6 lg:px-8 py-6 md:py-7 lg:py-8 rounded-[16px] md:rounded-[20px] lg:rounded-[24px] w-full relative"
                                                        >
                                                            {/* "In Reply To" Badge */}
                                                            <div className="flex items-center gap-2 pb-2 border-b border-[#e4e4e7]/50 w-full">
                                                                <svg
                                                                    className="w-4 h-4 text-[#006fee]"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                                    />
                                                                </svg>
                                                                <p className="text-xs font-medium text-[#006fee]">
                                                                    In reply to {comment.userName}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-start justify-between w-full">
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa] shrink-0">
                                                                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                                                            {reply.userName.charAt(0)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <p className="text-sm font-medium text-[#11181c]">
                                                                            {reply.userName}
                                                                        </p>
                                                                        <p className="text-xs font-normal text-[#a1a1aa]">
                                                                            {new Date(reply.replyDate || comment.commentDate).toLocaleDateString(
                                                                                "en-US",
                                                                                { day: "numeric", month: "short", year: "numeric" }
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Edit Reply Button */}
                                                                {editingCommentId === comment.id && editingReplyId === reply.id ? (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={handleCancelEdit}
                                                                            className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-white transition-colors"
                                                                        >
                                                                            <p className="text-sm font-normal text-[#71717a]">Cancel</p>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSaveReply(comment.id!, reply.id!)}
                                                                            disabled={isSubmitting}
                                                                            className="flex items-center justify-center h-10 px-4 rounded-xl bg-[#006fee] hover:bg-[#005bc4] transition-colors disabled:opacity-50"
                                                                        >
                                                                            <p className="text-sm font-normal text-white">
                                                                                {isSubmitting ? "Saving..." : "Save"}
                                                                            </p>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleEditReply(comment.id!, reply)}
                                                                        className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-white transition-colors cursor-pointer"
                                                                    >
                                                                        <p className="text-sm font-normal text-[#006fee]">Edit</p>
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Reply Text or Edit Input */}
                                                            {editingCommentId === comment.id && editingReplyId === reply.id ? (
                                                                <textarea
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    className="text-sm md:text-base font-normal leading-relaxed text-[#3f3f46] w-full bg-white rounded-xl p-4 border border-[#e4e4e7] outline-none resize-none min-h-[100px] focus:border-[#006fee] transition-colors"
                                                                />
                                                            ) : (
                                                                <p className="text-sm md:text-base font-normal leading-relaxed text-[#3f3f46] w-full">
                                                                    {reply.replyText}
                                                                </p>
                                                            )}

                                                            {/* Reply to Reply Button */}
                                                            {!(editingCommentId === comment.id && editingReplyId === reply.id) && (
                                                                <button
                                                                    onClick={() => handleReplyClick(comment.id!)}
                                                                    className="bg-[#006fee] h-9 flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors cursor-pointer text-sm"
                                                                >
                                                                    <p className="text-sm font-normal text-white">Reply</p>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {replyingToId === comment.id && (
                                        <div className="mt-4 md:mt-5 lg:mt-6 pl-4 md:pl-6 lg:pl-8 border-l-4 border-[#006fee] ml-0 w-full">
                                            <div className="border border-[#006fee]/30 bg-[#006fee]/5 flex flex-col gap-4 p-5 md:p-6 rounded-[14px] w-full">
                                                <div className="flex items-center gap-2 pb-3 border-b border-[#006fee]/20">
                                                    <svg
                                                        className="w-5 h-5 text-[#006fee]"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                        />
                                                    </svg>
                                                    <h3 className="text-base md:text-lg font-semibold text-[#006fee]">
                                                        Replying to {comment.userName}
                                                    </h3>
                                                </div>
                                                <div className="bg-white flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full border border-[#e4e4e7]">
                                                    <div className="flex-1 flex flex-col items-start justify-center px-1.5 pb-0.5">
                                                        <div className="flex items-center pr-2 w-full">
                                                            <p className="text-[12px] font-normal leading-4 text-[#52525b]">Your Name</p>
                                                            <p className="text-[14px] font-normal leading-5 text-[#f31260] pl-0.5">*</p>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your name"
                                                            value={replyUserName}
                                                            onChange={(e) => setReplyUserName(e.target.value)}
                                                            className="text-[14px] font-normal leading-5 text-[#11181c] w-full bg-transparent border-none outline-none placeholder:text-[#71717a]"
                                                        />
                                                    </div>
                                                </div>
                                                <textarea
                                                    placeholder="Write your reply..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="text-sm font-normal text-[#11181c] w-full bg-white rounded-xl p-4 border border-[#e4e4e7] outline-none resize-none min-h-[100px] placeholder:text-[#71717a] focus:border-[#006fee] transition-colors"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleCancelReply}
                                                        className="h-10.5 flex items-center justify-center px-4 rounded-lg border border-[#e4e4e7] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                                    >
                                                        <p className="text-sm font-normal text-[#71717a]">Cancel</p>
                                                    </button>
                                                    <button
                                                        onClick={() => handleSubmitReply(comment.id!)}
                                                        disabled={isSubmitting}
                                                        className="bg-[#006fee] h-10.5 flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <p className="text-sm font-normal text-white">
                                                            {isSubmitting ? "Submitting..." : "Submit Reply"}
                                                        </p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
