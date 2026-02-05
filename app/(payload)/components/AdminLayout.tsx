'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CustomNav from './payload/CustomNav';
import CustomHeader from './payload/CustomHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show custom components on login, logout, forgot password pages
    const isAuthPage = pathname?.includes('/admin/login') ||
        pathname?.includes('/admin/logout') ||
        pathname?.includes('/admin/create-first-user') ||
        pathname?.includes('/admin/forgot');

    useEffect(() => {
        // Skip injection on auth pages
        if (isAuthPage) {
            // Clean up any existing custom components
            const customNav = document.getElementById('custom-nav-sidebar');
            if (customNav) customNav.remove();
            const customHeader = document.getElementById('custom-header-bar');
            if (customHeader) customHeader.remove();
            return;
        }

        // Inject custom navigation after page loads
        const injectCustomComponents = () => {
            const body = document.body;

            // Inject Custom Navigation
            const existingCustomNav = document.getElementById('custom-nav-sidebar');
            if (!existingCustomNav) {
                const navContainer = document.createElement('div');
                navContainer.id = 'custom-nav-sidebar';
                body.insertBefore(navContainer, body.firstChild);

                // Render CustomNav into the container
                const { createRoot } = require('react-dom/client');
                const navRoot = createRoot(navContainer);
                navRoot.render(<CustomNav />);
            }

            // Inject Custom Header
            const existingCustomHeader = document.getElementById('custom-header-bar');
            if (!existingCustomHeader) {
                const headerContainer = document.createElement('div');
                headerContainer.id = 'custom-header-bar';
                body.insertBefore(headerContainer, body.firstChild);

                // Render CustomHeader into the container
                const { createRoot } = require('react-dom/client');
                const headerRoot = createRoot(headerContainer);
                headerRoot.render(<CustomHeader />);
            }
        };

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectCustomComponents);
        } else {
            injectCustomComponents();
        }

        return () => {
            const customNav = document.getElementById('custom-nav-sidebar');
            if (customNav) {
                customNav.remove();
            }
            const customHeader = document.getElementById('custom-header-bar');
            if (customHeader) {
                customHeader.remove();
            }
        };
    }, [isAuthPage]);

    return <>{children}</>;
}
