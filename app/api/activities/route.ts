/**
 * Activities API
 * GET /api/activities
 * 
 * Aggregates activities from multiple CMS collections
 */

import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function GET(req: NextRequest) {
    try {
        const payload = await getPayload({ config: configPromise });
        const searchParams = req.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type') || 'all';
        const search = searchParams.get('search') || '';

        const activities: any[] = [];

        // Fetch from different collections based on type filter
        const shouldFetch = (activityType: string) => type === 'all' || type === activityType;

        // Blog Posts
        if (shouldFetch('blog')) {
            const blogs = await payload.find({
                collection: 'blog-posts' as any,
                limit: 50,
                sort: '-createdAt',
            });
            blogs.docs.forEach((blog: any) => {
                activities.push({
                    id: `blog-${blog.id}`,
                    type: 'blog',
                    title: `New blog post added: "${blog.title || 'Untitled'}"`,
                    description: `Added by ${blog.author?.name || 'Admin'}`,
                    timestamp: blog.createdAt,
                    user: blog.author?.name || 'Admin',
                    metadata: { slug: blog.slug },
                });
            });
        }

        // Donations
        if (shouldFetch('donation')) {
            const donations = await payload.find({
                collection: 'donations' as any,
                limit: 50,
                sort: '-createdAt',
            });
            donations.docs.forEach((donation: any) => {
                const appealName = typeof donation.appeal === 'object' ? donation.appeal?.title : '';
                activities.push({
                    id: `donation-${donation.id}`,
                    type: 'donation',
                    title: `New donation received${appealName ? ` for ${appealName}` : ''}`,
                    description: `£${donation.amount || 0} donated`,
                    timestamp: donation.createdAt,
                    user: donation.donorEmail || 'Anonymous',
                    metadata: { amount: donation.amount, currency: donation.currency },
                });
            });
        }

        // Events
        if (shouldFetch('event')) {
            const events = await payload.find({
                collection: 'events',
                limit: 50,
                sort: '-createdAt',
            });
            events.docs.forEach((event: any) => {
                activities.push({
                    id: `event-${event.id}`,
                    type: 'event',
                    title: `New event created: "${event.title || 'Untitled'}"`,
                    description: event.date ? `Scheduled for ${new Date(event.date).toLocaleDateString()}` : 'Date TBD',
                    timestamp: event.createdAt,
                    user: 'Admin',
                    metadata: { date: event.date, slug: event.slug },
                });
            });
        }

        // Announcements/Notices
        if (shouldFetch('announcement')) {
            const notices = await payload.find({
                collection: 'notices',
                limit: 50,
                sort: '-createdAt',
            });
            notices.docs.forEach((notice: any) => {
                activities.push({
                    id: `announcement-${notice.id}`,
                    type: 'announcement',
                    title: `New announcement: "${notice.title || 'Untitled'}"`,
                    description: notice.isPublished ? 'Published' : 'Draft',
                    timestamp: notice.createdAt,
                    user: 'Admin',
                });
            });
        }

        // Academy/Madrasah
        if (shouldFetch('academy')) {
            const classes = await payload.find({
                collection: 'madrasah-classes' as any,
                limit: 50,
                sort: '-createdAt',
            });
            classes.docs.forEach((cls: any) => {
                activities.push({
                    id: `academy-${cls.id}`,
                    type: 'academy',
                    title: `New academy class: "${cls.name || 'Untitled'}"`,
                    description: cls.description || 'No description',
                    timestamp: cls.createdAt,
                    user: 'Admin',
                });
            });
        }

        // Appeals
        if (shouldFetch('appeal')) {
            const appeals = await payload.find({
                collection: 'donation-appeals' as any,
                limit: 50,
                sort: '-createdAt',
            });
            appeals.docs.forEach((appeal: any) => {
                activities.push({
                    id: `appeal-${appeal.id}`,
                    type: 'appeal',
                    title: `New appeal created: "${appeal.title || 'Untitled'}"`,
                    description: `Target: £${appeal.funding?.targetAmount || 0}`,
                    timestamp: appeal.createdAt,
                    user: 'Admin',
                    metadata: { target: appeal.funding?.targetAmount },
                });
            });
        }

        // Users
        if (shouldFetch('user')) {
            const users = await payload.find({
                collection: 'users',
                limit: 50,
                sort: '-createdAt',
            });
            users.docs.forEach((user: any) => {
                activities.push({
                    id: `user-${user.id}`,
                    type: 'user',
                    title: `New user registered: ${user.name || user.email}`,
                    description: `Role: ${user.role || 'user'}`,
                    timestamp: user.createdAt,
                    user: user.name || user.email,
                    metadata: { role: user.role },
                });
            });
        }

        // Testimonials
        if (shouldFetch('testimonial')) {
            const testimonials = await payload.find({
                collection: 'madrasah-testimonials' as any,
                limit: 50,
                sort: '-createdAt',
            });
            testimonials.docs.forEach((testimonial: any) => {
                activities.push({
                    id: `testimonial-${testimonial.id}`,
                    type: 'testimonial',
                    title: `New testimonial added${testimonial.courseName ? ` for ${testimonial.courseName}` : ''}`,
                    description: testimonial.rating ? `${testimonial.rating}-star rating` : 'New review',
                    timestamp: testimonial.createdAt,
                    user: testimonial.parentName || 'Anonymous',
                });
            });
        }

        // Sort all activities by timestamp
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Apply search filter
        let filteredActivities = activities;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredActivities = activities.filter(activity =>
                activity.title.toLowerCase().includes(searchLower) ||
                activity.description.toLowerCase().includes(searchLower) ||
                activity.user.toLowerCase().includes(searchLower)
            );
        }

        // Paginate
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

        return NextResponse.json({
            docs: paginatedActivities,
            totalDocs: filteredActivities.length,
            page,
            limit,
            totalPages: Math.ceil(filteredActivities.length / limit),
            hasNextPage: endIndex < filteredActivities.length,
            hasPrevPage: page > 1,
        });

    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}
