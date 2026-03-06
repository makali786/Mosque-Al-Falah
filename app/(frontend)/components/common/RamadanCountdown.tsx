'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Ramadan 2026 target date: 1st Ramadan 1447 is expected Feb 18, 2026.
// Islamic day starts at Maghrib (sunset) on the previous day (Feb 17).
// Sunset in Ilford, UK on Feb 17, 2026 is approx 17:22.
const TARGET = new Date('2026-02-17T17:22:00+00:00').getTime();
const SHABAN_START = new Date('2026-01-19T00:00:00+00:00').getTime();
const TOTAL_SHABAN = TARGET - SHABAN_START;

interface FlipCardState {
  [key: string]: string | null;
}

export default function RamadanCountdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const flipCards = useRef<FlipCardState>({
    'days-tens': null,
    'days-ones': null,
    'hours-tens': null,
    'hours-ones': null,
    'mins-tens': null,
    'mins-ones': null,
    'secs-tens': null,
    'secs-ones': null,
  });

  // Show modal on first visit
  useEffect(() => {
    const dismissed = sessionStorage.getItem('ramadan-countdown-dismissed');
    if (!dismissed) {
      // Small delay to let page render first
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    } else {
      setHasShown(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHasShown(true);
    sessionStorage.setItem('ramadan-countdown-dismissed', 'true');
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Flip card logic
  const flipTo = useCallback((cardId: string, newDigit: string) => {
    if (flipCards.current[cardId] === newDigit) return;
    const el = document.getElementById(`rc-${cardId}`);
    if (!el) return;

    const oldDigit = flipCards.current[cardId];
    flipCards.current[cardId] = newDigit;
    const digitEl = el.querySelector('.rc-digit') as HTMLElement;

    if (oldDigit === null) {
      if (digitEl) digitEl.textContent = newDigit;
      return;
    }

    // Create flip overlay for animation
    const overlay = document.createElement('div');
    overlay.className = 'rc-flip-overlay';
    overlay.innerHTML = `<span class="rc-digit" style="font-size:inherit;font-weight:700;color:#fff;position:relative;z-index:1;">${oldDigit}</span>`;
    el.appendChild(overlay);

    if (digitEl) digitEl.textContent = newDigit;
    setTimeout(() => overlay.remove(), 400);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    // Reset flip card state when modal opens
    Object.keys(flipCards.current).forEach(key => {
      flipCards.current[key] = null;
    });

    const update = () => {
      const now = Date.now();
      let diff = TARGET - now;
      if (diff <= 0) diff = 0;

      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      const d = String(days).padStart(2, '0');
      const h = String(hours).padStart(2, '0');
      const m = String(mins).padStart(2, '0');
      const s = String(secs).padStart(2, '0');

      flipTo('days-tens', d[0]);
      flipTo('days-ones', d[1]);
      flipTo('hours-tens', h[0]);
      flipTo('hours-ones', h[1]);
      flipTo('mins-tens', m[0]);
      flipTo('mins-ones', m[1]);
      flipTo('secs-tens', s[0]);
      flipTo('secs-ones', s[1]);

      // Progress bar
      const elapsed = now - SHABAN_START;
      const progress = Math.min(
        Math.max((elapsed / TOTAL_SHABAN) * 100, 0),
        100
      );
      const progressBar = document.getElementById('rc-progress-bar');
      const progressLabel = document.getElementById('rc-progress-label');
      if (progressBar) {
        progressBar.style.setProperty('--progress', progress.toFixed(1) + '%');
        progressBar.style.width = progress.toFixed(1) + '%';
      }
      if (progressLabel) {
        progressLabel.textContent = Math.round(progress) + '% Complete';
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isOpen, flipTo]);

  // Generate stars
  useEffect(() => {
    if (!isOpen) return;
    const container = document.getElementById('rc-stars-container');
    if (!container || container.children.length > 0) return;

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3 + 0.5;
      const opacity = size > 2 ? 1 : size > 1.5 ? 0.9 : 0.5;
      star.className = 'rc-star';
      star.style.cssText = `
        position:absolute;
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        width:${size}px;
        height:${size}px;
        background:rgba(255,255,255,${opacity});
        animation: rc-twinkle ${(Math.random() * 3 + 2).toFixed(2)}s ease-in-out infinite;
        animation-delay: ${(Math.random() * 5).toFixed(2)}s;
      `;
      if (size > 3) {
        star.style.boxShadow = '0 0 6px 2px rgba(255,255,255,0.6)';
      }
      container.appendChild(star);
    }
  }, [isOpen]);

  // Show "Ramadan Mubarak" for 35 days (the entire month + a few extra buffer days) after start
  const DAYS_TO_SHOW_MUBARAK = 35;
  const RAMADAN_MUBARAK_END =
    TARGET + DAYS_TO_SHOW_MUBARAK * 24 * 60 * 60 * 1000;

  // Check if we are past the 10-day celebration period
  const now = Date.now();
  if (now >= RAMADAN_MUBARAK_END) return null;

  const isRamadanStarted = now >= TARGET;

  return (
    <>
      {/* ═══ Floating Button (crescent moon) ═══ */}
      {hasShown && !isOpen && (
        <button
          onClick={handleOpen}
          className="rc-floating-btn"
          aria-label="Open Ramadan Countdown"
          title="Ramadan Countdown"
        >
          <svg width="28" height="28" viewBox="0 0 100 100">
            <defs>
              <linearGradient
                id="rcMoonGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>
            <path
              d="M50 5C25 5 5 25 5 50C5 75 25 95 50 95C60 95 69 92 77 86C65 92 50 88 40 75C30 62 30 45 40 32C50 19 65 15 77 21C69 12 60 5 50 5Z"
              fill="url(#rcMoonGrad)"
            />
          </svg>
          <span className="rc-floating-badge">Ramadan</span>
        </button>
      )}

      {/* ═══ Fullscreen Modal ═══ */}
      {isOpen && (
        <div
          className="rc-modal-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="rc-modal">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="rc-close-btn"
              aria-label="Close Ramadan Countdown"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Background image */}
            <div className="rc-bg-image" />
            <div className="rc-bg-overlay" />

            {/* Stars and effects */}
            <div className="rc-effects-layer">
              <div className="rc-nebula rc-nebula-1" />
              <div className="rc-nebula rc-nebula-2" />
              <div id="rc-stars-container" />
              <div
                className="rc-shooting-star"
                style={{ top: '15%', left: '60%', animationDelay: '3s' }}
              />
              <div
                className="rc-shooting-star"
                style={{ top: '25%', left: '80%', animationDelay: '8s' }}
              />
            </div>

            {/* Main Content */}
            <div className="rc-content">
              {/* Crescent moon decoration */}
              <div className="rc-moon-decor">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 100 100"
                  className="rc-moon-svg"
                >
                  <defs>
                    <linearGradient
                      id="rcMoonGrad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFE082" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 5C25 5 5 25 5 50C5 75 25 95 50 95C60 95 69 92 77 86C65 92 50 88 40 75C30 62 30 45 40 32C50 19 65 15 77 21C69 12 60 5 50 5Z"
                    fill="url(#rcMoonGrad2)"
                  />
                </svg>
              </div>

              {/* Logo */}
              <div className="rc-logo-wrap">
                <div className="rc-logo-glow" />
                <div className="rc-logo-inner">
                  <img
                    alt="Masjid Al-Falah"
                    width={80}
                    height={80}
                    className="rc-logo-img"
                    src="https://www.masjid-alfalah.org.uk/assets/images/ftrlgo.png"
                  />
                </div>
              </div>

              {/* Arabic Bismillah */}
              <p className="rc-bismillah">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>

              {/* Title */}
              <h2 className="rc-title">
                {isRamadanStarted ? 'Ramadān Mubārak' : 'Ramadān Countdown'}
              </h2>
              <div className="rc-subtitle-wrap">
                <span className="rc-line-accent" />
                <p className="rc-subtitle">2026 | 1447 AH</p>
                <span className="rc-line-accent" />
              </div>
              <p className="rc-description !text-white">
                {isRamadanStarted
                  ? 'May Allah start this month for us with safety, faith, and peace.'
                  : 'Prepare your heart and soul for the blessed month of fasting, prayer, and reflection.'}
              </p>

              {/* Donation Button */}
              <a
                href="/donate"
                className="rc-donate-btn"
                aria-label="Donate to Masjid Al-Falah"
                onClick={handleClose}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Donate to Masjid Al-Falah</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                  </svg>
                </span>
                <div className="rc-donate-glow" />
              </a>

              {/* ═══ Flip Clock OR Greeting ═══ */}
              {!isRamadanStarted ? (
                <div className="rc-clock-container">
                  <div className="rc-clock-glass">
                    <div className="rc-clock-grid">
                      {/* Days */}
                      <div className="rc-flip-unit">
                        <div className="rc-flip-digits">
                          <div className="rc-flip-card" id="rc-days-tens">
                            <span className="rc-digit">0</span>
                          </div>
                          <div className="rc-flip-card" id="rc-days-ones">
                            <span className="rc-digit">0</span>
                          </div>
                        </div>
                        <span className="rc-flip-label">Days</span>
                      </div>
                      <div className="rc-separator">
                        <div className="rc-dot" />
                        <div className="rc-dot" />
                      </div>
                      {/* Hours */}
                      <div className="rc-flip-unit">
                        <div className="rc-flip-digits">
                          <div className="rc-flip-card" id="rc-hours-tens">
                            <span className="rc-digit">0</span>
                          </div>
                          <div className="rc-flip-card" id="rc-hours-ones">
                            <span className="rc-digit">0</span>
                          </div>
                        </div>
                        <span className="rc-flip-label">Hours</span>
                      </div>
                      <div className="rc-separator">
                        <div className="rc-dot" />
                        <div className="rc-dot" />
                      </div>
                      {/* Minutes */}
                      <div className="rc-flip-unit">
                        <div className="rc-flip-digits">
                          <div className="rc-flip-card" id="rc-mins-tens">
                            <span className="rc-digit">0</span>
                          </div>
                          <div className="rc-flip-card" id="rc-mins-ones">
                            <span className="rc-digit">0</span>
                          </div>
                        </div>
                        <span className="rc-flip-label">Minutes</span>
                      </div>
                      <div className="rc-separator">
                        <div className="rc-dot" />
                        <div className="rc-dot" />
                      </div>
                      {/* Seconds */}
                      <div className="rc-flip-unit">
                        <div className="rc-flip-digits">
                          <div className="rc-flip-card" id="rc-secs-tens">
                            <span className="rc-digit">0</span>
                          </div>
                          <div className="rc-flip-card" id="rc-secs-ones">
                            <span className="rc-digit">0</span>
                          </div>
                        </div>
                        <span className="rc-flip-label">Seconds</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="rc-progress-wrap">
                      <div className="rc-progress-labels">
                        <span>Sha&apos;ban 1447</span>
                        <span id="rc-progress-label">0% Complete</span>
                        <span>Ramadan 1447</span>
                      </div>
                      <div className="rc-progress-track">
                        <div
                          className="rc-progress-fill"
                          id="rc-progress-bar"
                          style={{
                            ['--progress' as string]: '0%',
                            width: '0%',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="animate-pulse text-gold-400 text-4xl mb-4">
                    🌙
                  </div>
                  <p className="text-white text-lg max-w-md mx-auto leading-relaxed">
                    We wish you and your family a blessed Ramadān. May this
                    month bring you closer to Allah and fill your life with
                    light and guidance.
                  </p>
                </div>
              )}

              {/* Hadith Card */}
              <div className="rc-hadith-card">
                <div className="rc-ornamental-divider">
                  <div className="rc-orn-line" />
                  <div className="rc-orn-diamond" />
                  <div className="rc-orn-line" />
                </div>
                <p className="rc-hadith-arabic" dir="rtl">
                  مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا
                  تَقَدَّمَ مِنْ ذَنْبِهِ
                </p>
                <p className="rc-hadith-english">
                  &quot;Whoever fasts during Ramadan with faith and seeking
                  reward, all his past sins will be forgiven.&quot;
                </p>
                <p className="rc-hadith-source">
                  — Sahih Al-Bukhari &amp; Muslim
                </p>
                <div className="rc-ornamental-divider">
                  <div className="rc-orn-line" />
                  <div className="rc-orn-diamond" />
                  <div className="rc-orn-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
