"use client";

import { useState } from "react";
import Image from "next/image";

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
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        setMessage(null);

        try {
            const updatedComments = comments.map((c) => {
                if (c.id === commentId) {
                    return { ...c, comment: editText.trim() };
                }
                return c;
            });

            const response = await fetch(`/api/blog-posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comments: updatedComments }),
            });

            if (!response.ok) throw new Error("Failed to update comment");

            setComments(updatedComments);
            setEditingCommentId(null);
            setEditingReplyId(null);
            setEditText("");
            setMessage({ type: "success", text: "Comment updated successfully!" });
        } catch (error) {
            console.error("Error updating comment:", error);
            setMessage({ type: "error", text: "Failed to update comment." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Save edited reply
    const handleSaveReply = async (commentId: string, replyId: string) => {
        if (!editText.trim()) return;
        setIsSubmitting(true);
        setMessage(null);

        try {
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

            const response = await fetch(`/api/blog-posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comments: updatedComments }),
            });

            if (!response.ok) throw new Error("Failed to update reply");

            setComments(updatedComments);
            setEditingCommentId(null);
            setEditingReplyId(null);
            setEditText("");
            setMessage({ type: "success", text: "Reply updated successfully!" });
        } catch (error) {
            console.error("Error updating reply:", error);
            setMessage({ type: "error", text: "Failed to update reply." });
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
            setMessage({ type: "error", text: "Please enter your name and reply." });
            return;
        }
        setIsSubmitting(true);
        setMessage(null);

        try {
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

            const response = await fetch(`/api/blog-posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comments: updatedComments }),
            });

            if (!response.ok) throw new Error("Failed to submit reply");

            setComments(updatedComments);
            setReplyingToId(null);
            setReplyText("");
            setReplyUserName("");
            setMessage({ type: "success", text: "Reply submitted successfully!" });
        } catch (error) {
            console.error("Error submitting reply:", error);
            setMessage({ type: "error", text: "Failed to submit reply." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!comments || comments.length === 0) {
        return (
            <div className="bg-white pt-8 md:pt-10 lg:pt-12 pb-0 mb-6">
                <div className="w-full px-4 md:px-8 lg:px-50">
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
            <div className="w-full px-4 md:px-8 lg:px-50">
                <div className="max-w-283.5 mx-auto">
                    <div className="flex flex-col gap-8 md:gap-10 lg:gap-13 items-center">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#27272a] text-center">
                            Comments
                        </h2>

                        {/* Status Message */}
                        {message && (
                            <div
                                className={`w-full p-4 rounded-lg ${
                                    message.type === "success"
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                            >
                                <p className="text-sm md:text-base">{message.text}</p>
                            </div>
                        )}

                        {/* Comment List */}
                        <div className="flex flex-col gap-8 md:gap-10 lg:gap-13 items-start w-full">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-6 md:gap-7 lg:gap-9 items-end w-full">
                                    {/* Main Comment */}
                                    <div className="border border-[#c5c5c5] flex flex-col gap-4 md:gap-5 items-start justify-center px-5 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12.5 rounded-[20px] md:rounded-[25px] lg:rounded-[30px] w-full">
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

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <>
                                            {comment.replies.map((reply) => (
                                                <div
                                                    key={reply.id}
                                                    className="border border-[#c5c5c5] flex flex-col gap-4 md:gap-5 items-start justify-center px-5 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12.5 rounded-[20px] md:rounded-[25px] lg:rounded-[30px] w-full md:w-[calc(100%-80px)] lg:w-[calc(100%-123px)]"
                                                >
                                                    <div className="flex items-start justify-between w-full">
                                                        <div className="flex gap-2 items-center">
                                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa] shrink-0">
                                                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                                                    {reply.userName.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-sm font-normal text-[#11181c]">
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
                                                                    className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-gray-50 transition-colors"
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
                                                                className="flex items-center justify-center h-10 px-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
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
                                                            className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#3f3f46] w-full bg-[#f4f4f5] rounded-xl p-4 border-none outline-none resize-none min-h-[100px]"
                                                        />
                                                    ) : (
                                                        <p className="text-sm md:text-base lg:text-lg font-normal leading-relaxed text-[#3f3f46] w-full">
                                                            {reply.replyText}
                                                        </p>
                                                    )}

                                                    {/* Reply to Reply Button */}
                                                    {!(editingCommentId === comment.id && editingReplyId === reply.id) && (
                                                        <button
                                                            onClick={() => handleReplyClick(comment.id!)}
                                                            className="bg-[#006fee] h-10.5 flex items-center justify-center px-4 rounded-lg hover:bg-[#005bc4] transition-colors cursor-pointer"
                                                        >
                                                            <p className="text-sm font-normal text-white">Reply</p>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {/* Reply Form */}
                                    {replyingToId === comment.id && (
                                        <div className="border border-[#e4e4e7] flex flex-col gap-4 p-5 rounded-[14px] w-full md:w-[calc(100%-80px)] lg:w-[calc(100%-123px)]">
                                            <h3 className="text-lg font-semibold text-[#27272a]">Reply to {comment.userName}</h3>
                                            <div className="bg-[#f4f4f5] flex items-center min-h-8 px-1.5 py-1 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
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
                                                className="text-sm font-normal text-[#11181c] w-full bg-[#f4f4f5] rounded-xl p-4 border-none outline-none resize-none min-h-[100px] placeholder:text-[#71717a]"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleCancelReply}
                                                    className="h-10.5 flex items-center justify-center px-4 rounded-lg border border-[#e4e4e7] hover:bg-gray-50 transition-colors cursor-pointer"
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
