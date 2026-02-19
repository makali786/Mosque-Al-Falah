'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logo from '../../../../public/assets/header/logo.svg';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isSubItem?: boolean;
}

interface CollapsibleNavProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  isSubItem = false,
}) => {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: isSubItem ? '0.5rem 1.25rem 0.5rem 3rem' : '0.5rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: '400',
        color: '#000000ff',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        transition: 'background-color 0.1s',
        gap: '0.625rem',
        lineHeight: '1.25rem',
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.06)')
      }
      onMouseLeave={e =>
        (e.currentTarget.style.backgroundColor = 'transparent')
      }
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          width: '1rem',
          height: '1rem',
        }}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({
  icon,
  label,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: '400',
          color: '#000000ff',
          backgroundColor: 'transparent',
          border: 'none',
          width: '100%',
          cursor: 'pointer',
          transition: 'background-color 0.1s',
          gap: '0.625rem',
          lineHeight: '1.25rem',
          textAlign: 'left',
        }}
        onMouseEnter={e =>
          (e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.06)')
        }
        onMouseLeave={e =>
          (e.currentTarget.style.backgroundColor = 'transparent')
        }
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            width: '1rem',
            height: '1rem',
          }}
        >
          {icon}
        </span>
        <span style={{ flex: 1 }}>{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.15s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

const CustomNav: React.FC = () => {
  const pathname = usePathname();

  const iconStyle = {
    height: '1rem',
    width: '1rem',
    strokeWidth: '2',
    display: 'block',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        width: '16rem',
        backgroundColor: '#ffffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #c5d0e6',
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem 1rem',
          borderBottom: '1px solid #c5d0e6',
          backgroundColor: '#ffffffff',
        }}
      >
        <Link href="/admin" style={{ opacity: 0.8 }}>
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={32}
            style={{ display: 'block', filter: 'invert(1)' }}
          />
        </Link>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Dashboard */}
          <NavItem
            href="/admin"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                <rect width="7" height="5" x="3" y="16" rx="1"></rect>
              </svg>
            }
            label="Dashboard"
            isActive={pathname?.includes('/admin')}
          />

          {/* Academy */}
          <CollapsibleNav
            defaultOpen={pathname?.includes('/madrasah')}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            }
            label="Academy"
          >
            <NavItem
              href="/admin/collections/madrasah-classes"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              }
              label="Courses"
              isActive={pathname?.includes(
                '/admin/collections/madrasah-classes'
              )}
              isSubItem
            />
            <NavItem
              href="/admin/collections/madrasah-testimonials"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              }
              label="Testimonials"
              isActive={pathname?.includes(
                '/admin/collections/madrasah-testimonials'
              )}
              isSubItem
            />
          </CollapsibleNav>

          {/* Blogs */}
          <CollapsibleNav
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                <path d="M18 14h-8"></path>
                <path d="M15 18h-5"></path>
                <path d="M10 6h8v4h-8V6Z"></path>
              </svg>
            }
            label="Blogs"
          >
            <NavItem
              href="/admin/collections/blog-posts"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              }
              label="Pages"
              isActive={pathname?.includes('/admin/collections/blog-posts')}
              isSubItem
            />
          </CollapsibleNav>

          {/* Pages */}
          <NavItem
            href="/admin/collections/page-sections"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            }
            label="Pages"
            isActive={pathname?.includes('/admin/collections/page-sections')}
          />

          {/* Banners */}
          <NavItem
            href="/admin/collections/banners"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" x2="4" y1="22" y2="15"></line>
              </svg>
            }
            label="Banners"
            isActive={pathname?.includes('/admin/collections/banners')}
          />

          {/* Media Library */}
          <NavItem
            href="/admin/collections/media"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
            }
            label="Media Library"
            isActive={pathname?.includes('/admin/collections/media')}
          />

          {/* Prayer Times */}
          <NavItem
            href="/admin/globals/prayer-time-settings"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            }
            label="Prayer Times"
            isActive={pathname?.includes('/admin/globals/prayer-time-settings')}
          />

          {/* Services */}
          <NavItem
            href="/admin/collections/services"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            }
            label="Services"
            isActive={pathname?.includes('/admin/collections/services')}
          />

          {/* Appeals */}
          <CollapsibleNav
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            }
            label="Appeals"
          >
            <NavItem
              href="/admin/collections/donation-appeals"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              }
              label="All Appeals"
              isActive={pathname?.includes(
                '/admin/collections/donation-appeals'
              )}
              isSubItem
            />
            <NavItem
              href="/admin/collections/donations"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              }
              label="Donations"
              isActive={pathname?.includes('/admin/collections/donations')}
              isSubItem
            />
            <NavItem
              href="/admin/collections/donors"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              label="Donors"
              isActive={pathname?.includes('/admin/collections/donors')}
              isSubItem
            />
          </CollapsibleNav>

          {/* Sermons */}
          <CollapsibleNav
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            }
            label="Sermons"
          >
            <NavItem
              href="/admin/collections/sermons"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              }
              label="All Sermons"
              isActive={pathname?.includes('/admin/collections/sermons')}
              isSubItem
            />
            <NavItem
              href="/admin/collections/imams"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              label="Imams"
              isActive={pathname?.includes('/admin/collections/imams')}
              isSubItem
            />
          </CollapsibleNav>

          {/* Events */}
          <NavItem
            href="/admin/collections/events"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            }
            label="Events"
            isActive={pathname?.includes('/admin/collections/events')}
          />

          {/* Event Bookings */}
          <NavItem
            href="/admin/collections/event-bookings"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
                <path d="M8 14h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 14h.01"></path>
              </svg>
            }
            label="Event Bookings"
            isActive={pathname?.includes('/admin/collections/event-bookings')}
          />

          {/* Announcements */}
          <NavItem
            href="/admin/collections/notices"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            }
            label="Announcements"
            isActive={pathname?.includes('/admin/collections/notices')}
          />

          {/* Popups */}
          <NavItem
            href="/admin/collections/popups"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            }
            label="Popups"
            isActive={pathname?.includes('/admin/collections/popups')}
          />

          {/* Q&A / Fatwa */}
          <NavItem
            href="/admin/collections/questions"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            }
            label="Q&A / Fatwa"
            isActive={pathname?.includes('/admin/collections/questions')}
          />

          {/* Newsletter */}
          <NavItem
            href="/admin/collections/newsletter-subscribers"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            }
            label="Newsletter"
            isActive={pathname?.includes(
              '/admin/collections/newsletter-subscribers'
            )}
          />

          {/* Requests */}
          <CollapsibleNav
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            }
            label="Requests"
          >
            <NavItem
              href="/admin/collections/event-requests"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
              }
              label="Event Requests"
              isActive={pathname?.includes('/admin/collections/event-requests')}
              isSubItem
            />
            <NavItem
              href="/admin/collections/service-requests"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              }
              label="Service Requests"
              isActive={pathname?.includes(
                '/admin/collections/service-requests'
              )}
              isSubItem
            />
          </CollapsibleNav>

          {/* Media Items (Videos/Audio) */}
          <NavItem
            href="/admin/collections/media-items"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect width="15" height="14" x="1" y="5" rx="2" ry="2"></rect>
              </svg>
            }
            label="Media Items"
            isActive={pathname?.includes('/admin/collections/media-items')}
          />

          {/* Ayat of the Month */}
          <NavItem
            href="/admin/collections/ayat-of-the-month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              </svg>
            }
            label="Ayat of the Month"
            isActive={pathname?.includes(
              '/admin/collections/ayat-of-the-month'
            )}
          />

          {/* Appearance */}
          <CollapsibleNav
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
              </svg>
            }
            label="Appearance"
          >
            <NavItem
              href="/admin/globals/home-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              }
              label="Home Page"
              isActive={pathname?.includes('/admin/globals/home-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/about-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="16" y2="12"></line>
                  <line x1="12" x2="12.01" y1="8" y2="8"></line>
                </svg>
              }
              label="About Page"
              isActive={pathname?.includes('/admin/globals/about-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/contact-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              }
              label="Contact Page"
              isActive={pathname?.includes('/admin/globals/contact-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/madrasah-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              }
              label="Madrasah Page"
              isActive={pathname?.includes('/admin/globals/madrasah-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/events-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                </svg>
              }
              label="Events Page"
              isActive={pathname?.includes('/admin/globals/events-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/services-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              }
              label="Services Page"
              isActive={pathname?.includes('/admin/globals/services-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/sermons-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              }
              label="Sermons Page"
              isActive={pathname?.includes('/admin/globals/sermons-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/donation-appeals-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              }
              label="Appeals Page"
              isActive={pathname?.includes(
                '/admin/globals/donation-appeals-page'
              )}
              isSubItem
            />
            <NavItem
              href="/admin/globals/blogs-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                </svg>
              }
              label="Blogs Page"
              isActive={pathname?.includes('/admin/globals/blogs-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/media-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect width="15" height="14" x="1" y="5" rx="2" ry="2"></rect>
                </svg>
              }
              label="Media Page"
              isActive={pathname?.includes('/admin/globals/media-page')}
              isSubItem
            />
            <NavItem
              href="/admin/globals/prayer-times-page"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              }
              label="Prayer Page"
              isActive={pathname?.includes('/admin/globals/prayer-times-page')}
              isSubItem
            />
            <NavItem
              href="/admin/collections/core-values"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              }
              label="Core Values"
              isActive={pathname?.includes('/admin/collections/core-values')}
              isSubItem
            />
            <NavItem
              href="/admin/collections/committees"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              label="Trustees"
              isActive={pathname?.includes('/admin/collections/committees')}
              isSubItem
            />
            <NavItem
              href="/admin/collections/notifications"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={iconStyle}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              }
              label="Notifications"
              isActive={pathname?.includes('/admin/collections/notifications')}
              isSubItem
            />
          </CollapsibleNav>

          {/* Account Settings */}
          <NavItem
            href="/admin/account"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            }
            label="Settings"
            isActive={pathname?.includes('/admin/account')}
          />

          {/* Users */}
          <NavItem
            href="/admin/collections/users"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={iconStyle}
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
            label="Users"
            isActive={pathname?.includes('/admin/collections/users')}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomNav;
