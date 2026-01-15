"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { revalidatePath } from "next/cache";

interface Comment {
    userName: string;
    userEmail: string;
    userAvatar?: any;
    comment: string;
    commentDate: string;
    isApproved: boolean;
    replies: Reply[];
    id?: string;
}

interface Reply {
    userName: string;
    replyText: string;
    replyDate: string;
    id?: string;
}

// Submit a new comment
export async function submitComment(postId: string, userName: string, userEmail: string, comment: string) {
    try {
        const payload = await getPayload({ config: configPromise });

        // Get the current blog post
        const post = await payload.findByID({
            collection: "blog-posts" as any,
            id: postId,
        });

        if (!post || !post.enableComments) {
            return { success: false, error: "Comments are disabled for this post" };
        }

        // Create new comment
        const newComment: Comment = {
            userName: userName.trim(),
            userEmail: userEmail.trim().toLowerCase(),
            comment: comment.trim(),
            commentDate: new Date().toISOString(),
            isApproved: false,
            replies: [],
        };

        // Update the post with new comment
        await payload.update({
            collection: "blog-posts" as any,
            id: postId,
            data: {
                comments: [...(post.comments || []), newComment],
            },
        });

        // Revalidate the blog post page
        revalidatePath(`/blogs/${post.slug}`);

        return { success: true, message: "Comment submitted successfully. It will appear after approval." };
    } catch (error) {
        console.error("Error submitting comment:", error);
        return { success: false, error: "Failed to submit comment" };
    }
}

// Update a comment
export async function updateComment(postId: string, commentId: string, newText: string) {
    try {
        const payload = await getPayload({ config: configPromise });

        const post = await payload.findByID({
            collection: "blog-posts" as any,
            id: postId,
        });

        if (!post) {
            return { success: false, error: "Post not found" };
        }

        // Update the specific comment
        const updatedComments = (post.comments || []).map((c: any) => {
            if (c.id === commentId) {
                return { ...c, comment: newText.trim() };
            }
            return c;
        });

        await payload.update({
            collection: "blog-posts" as any,
            id: postId,
            data: {
                comments: updatedComments,
            },
        });

        revalidatePath(`/blogs/${post.slug}`);

        return { success: true, message: "Comment updated successfully" };
    } catch (error) {
        console.error("Error updating comment:", error);
        return { success: false, error: "Failed to update comment" };
    }
}

// Update a reply
export async function updateReply(postId: string, commentId: string, replyId: string, newText: string) {
    try {
        const payload = await getPayload({ config: configPromise });

        const post = await payload.findByID({
            collection: "blog-posts" as any,
            id: postId,
        });

        if (!post) {
            return { success: false, error: "Post not found" };
        }

        // Update the specific reply
        const updatedComments = (post.comments || []).map((c: any) => {
            if (c.id === commentId) {
                const updatedReplies = (c.replies || []).map((r: any) => {
                    if (r.id === replyId) {
                        return { ...r, replyText: newText.trim() };
                    }
                    return r;
                });
                return { ...c, replies: updatedReplies };
            }
            return c;
        });

        await payload.update({
            collection: "blog-posts" as any,
            id: postId,
            data: {
                comments: updatedComments,
            },
        });

        revalidatePath(`/blogs/${post.slug}`);

        return { success: true, message: "Reply updated successfully" };
    } catch (error) {
        console.error("Error updating reply:", error);
        return { success: false, error: "Failed to update reply" };
    }
}

// Submit a reply to a comment
export async function submitReply(postId: string, commentId: string, userName: string, replyText: string) {
    try {
        const payload = await getPayload({ config: configPromise });

        const post = await payload.findByID({
            collection: "blog-posts" as any,
            id: postId,
        });

        if (!post || !post.enableComments) {
            return { success: false, error: "Comments are disabled for this post" };
        }

        const newReply: Reply = {
            userName: userName.trim(),
            replyText: replyText.trim(),
            replyDate: new Date().toISOString(),
        };

        // Add reply to the specific comment
        const updatedComments = (post.comments || []).map((c: any) => {
            if (c.id === commentId) {
                return { ...c, replies: [...(c.replies || []), newReply] };
            }
            return c;
        });

        await payload.update({
            collection: "blog-posts" as any,
            id: postId,
            data: {
                comments: updatedComments,
            },
        });

        revalidatePath(`/blogs/${post.slug}`);

        return { success: true, message: "Reply submitted successfully" };
    } catch (error) {
        console.error("Error submitting reply:", error);
        return { success: false, error: "Failed to submit reply" };
    }
}
