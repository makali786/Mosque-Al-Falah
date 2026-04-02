'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import CustomNav from './payload/CustomNav';
import CustomHeader from './payload/CustomHeader';
import Breadcrumb from './payload/Breadcrumb';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [navKey, setNavKey] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(0);

    // Don't show custom components on login, logout, forgot password pages
    const isAuthPage = pathname?.includes('/admin/login') ||
        pathname?.includes('/admin/logout') ||
        pathname?.includes('/admin/create-first-user') ||
        pathname?.includes('/admin/forgot');

    // Force re-render of custom nav when route changes
    const handleRouteChange = useCallback(() => {
        setNavKey(prev => prev + 1);
    }, []);

    // Listen for browser back/forward buttons
    useEffect(() => {
        if (isAuthPage) return;

        const handlePopState = () => {
            handleRouteChange();
            setForceUpdate(prev => prev + 1);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isAuthPage, handleRouteChange]);

    // Update when pathname changes
    useEffect(() => {
        handleRouteChange();
    }, [pathname, searchParams, handleRouteChange]);

    useEffect(() => {
        if (isAuthPage) {
            // Clean up custom components on auth pages
            ['custom-nav-sidebar', 'custom-header-bar', 'custom-breadcrumb'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
            return;
        }

        const injectCustomComponents = () => {
            const body = document.body;

            // Inject Custom Navigation (if not exists)
            if (!document.getElementById('custom-nav-sidebar')) {
                const navContainer = document.createElement('div');
                navContainer.id = 'custom-nav-sidebar';
                body.insertBefore(navContainer, body.firstChild);

                const { createRoot } = require('react-dom/client');
                createRoot(navContainer).render(<CustomNav key={`nav-${navKey}`} />);
            } else {
                const el = document.getElementById('custom-nav-sidebar');
                const { createRoot } = require('react-dom/client');
                createRoot(el).render(<CustomNav key={`nav-${navKey}`} />);
            }

            // Inject Custom Header (if not exists)
            if (!document.getElementById('custom-header-bar')) {
                const headerContainer = document.createElement('div');
                headerContainer.id = 'custom-header-bar';
                body.insertBefore(headerContainer, body.firstChild);

                const { createRoot } = require('react-dom/client');
                createRoot(headerContainer).render(<CustomHeader key={`header-${navKey}`} />);
            }

            // Inject Breadcrumb (if not exists)
            if (!document.getElementById('custom-breadcrumb')) {
                const breadcrumbContainer = document.createElement('div');
                breadcrumbContainer.id = 'custom-breadcrumb';
                body.appendChild(breadcrumbContainer);

                const { createRoot } = require('react-dom/client');
                createRoot(breadcrumbContainer).render(<Breadcrumb key={`breadcrumb-${navKey}`} />);
            } else {
                const el = document.getElementById('custom-breadcrumb');
                const { createRoot } = require('react-dom/client');
                createRoot(el).render(<Breadcrumb key={`breadcrumb-${navKey}`} />);
            }
        };

        injectCustomComponents();
    }, [isAuthPage, navKey]);

    return <div key={forceUpdate}>{children}</div>;
}
