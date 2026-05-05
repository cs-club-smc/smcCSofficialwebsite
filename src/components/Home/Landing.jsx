import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { HiOutlineLocationMarker, HiOutlineCode, HiOutlineMicrophone } from 'react-icons/hi';
import DownArrow from '../DownArrow';
import benefitIcon1 from '../../assets/icons/benefit-icon-1.svg';
import benefitIcon2 from '../../assets/icons/benefit-icon-2.svg';
import benefitIcon3 from '../../assets/icons/benefit-icon-3.svg';

/**
 * Landing Component
 * Hero section with text scramble effect, event slideshow, and refined aesthetics
 */

// Text scramble hook - decodes text character by character
function useTextScramble(text, delay = 0, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

  useEffect(() => {
    let timeout;
    let currentIndex = 0;
    let scrambleCount = 0;

    const scramble = () => {
      if (currentIndex <= text.length) {
        const revealed = text.slice(0, currentIndex);
        const scrambled = text.slice(currentIndex, currentIndex + 3)
          .split('')
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join('');
        setDisplayed(revealed + scrambled);

        scrambleCount++;
        if (scrambleCount >= 2) {
          scrambleCount = 0;
          currentIndex++;
        }
        timeout = setTimeout(scramble, speed);
      } else {
        setDisplayed(text);
      }
    };

    const startTimeout = setTimeout(scramble, delay);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay, speed]);

  return displayed;
}

// Events data
const EVENTS = [
  {
    id: 'lmu-shpe',
    type: 'tour',
    name: 'LMU SHPE Tour',
    date: 'March 26',
    time: '5:30 PM',
    tagline: 'Loyola Marymount University',
    cta: { label: 'Sign Up', url: 'https://docs.google.com/forms/d/e/1FAIpQLSctbG_1HJe-MMK_-lRh3NzwBc1ioZDaFW6KDx8Wdikbd2Vlrw/viewform' },
  },
  {
    id: 'planetarium',
    type: 'tour',
    name: 'SMC Planetarium Tour',
    date: 'April 27',
    time: 'Time TBA',
    tagline: 'Santa Monica College',
    cta: { label: 'Coming Soon', url: null },
  },
  {
    id: 'snapchat',
    type: 'tour',
    name: 'Snapchat Office Tour',
    date: 'May 7',
    time: '3:00 – 5:00 PM',
    tagline: 'Santa Monica HQ',
    cta: { label: 'Sign Up', url: 'https://docs.google.com/forms/d/e/1FAIpQLSer2trn0kGwUns4wAyAqpw4nnDetOVgrqtYFbAAtmOLUXIDKw/viewform' },
  },
  {
    id: 'anita',
    type: 'speaker',
    name: 'Anita Jalili',
    date: 'May 19',
    time: null,
    tagline: 'NAVWAR Cybersecurity Intern',
    bio: 'SMC → Cal State Northridge · Published Author · Hackathon Winner',
    cta: { label: 'Coming Soon', url: null },
  },
  {
    id: 'haley',
    type: 'speaker',
    name: 'Hailey Lepe',
    date: 'May 2026',
    time: 'Date TBA',
    tagline: 'Stanford CS Student',
    bio: 'Breakthrough Tech Alum · Research at UC Berkeley & UPenn',
    cta: { label: 'Coming Soon', url: null },
  },
];

const TYPE_COLORS = {
  tour: '#0FB588',
  hackathon: '#FFD700',
  speaker: '#818CF8',
};

const TYPE_COLORS_RGB = {
  tour: '15, 181, 136',
  hackathon: '255, 215, 0',
  speaker: '129, 140, 248',
};

const TYPE_ICONS = {
  tour: <HiOutlineLocationMarker />,
  hackathon: <HiOutlineCode />,
  speaker: <HiOutlineMicrophone />,
};

// Check if an event's date has already passed
function isEventPassed(dateStr) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Date range like "May 9–10" or "May 9-10" — use the end date
  const rangeMatch = dateStr.match(/^(\w+)\s+\d+[\u2013-](\d+)$/);
  if (rangeMatch) {
    const endDate = new Date(`${rangeMatch[1]} ${rangeMatch[2]}, ${currentYear}`);
    endDate.setHours(23, 59, 59, 999);
    return !isNaN(endDate.getTime()) && now > endDate;
  }

  // Specific date like "March 26" — assumes current year
  const specificMatch = dateStr.match(/^(\w+)\s+(\d{1,2})$/);
  if (specificMatch) {
    const eventDate = new Date(`${specificMatch[1]} ${specificMatch[2]}, ${currentYear}`);
    eventDate.setHours(23, 59, 59, 999);
    return !isNaN(eventDate.getTime()) && now > eventDate;
  }

  // Month + year only like "May 2026" — no specific date, only mark as
  // passed after the entire month has ended
  const monthYearMatch = dateStr.match(/^(\w+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const monthDate = new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`);
    if (isNaN(monthDate.getTime())) return false;
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return now > lastDay;
  }

  // Unrecognizable format — don't mark as passed
  return false;
}

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Landing() {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Scramble effect for title
  const smcText = useTextScramble('SMC', 450, 60);
  const csText = useTextScramble('CS CLUB', 900, 55);

  // Mouse tracking for subtle tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), springConfig);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const advanceSlide = useCallback(() => {
    if (isPaused) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
  }, [isPaused]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const handleDragEnd = useCallback((e, info) => {
    if (info.offset.x < -50) {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
    } else if (info.offset.x > 50) {
      setDirection(-1);
      setCurrentSlide((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
    }
  }, []);

  const benefits = [
    { icon: benefitIcon1, label: 'Knowledge' },
    { icon: benefitIcon2, label: 'Experience' },
    { icon: benefitIcon3, label: 'Networking' }
  ];

  const event = EVENTS[currentSlide];
  const isPast = isEventPassed(event.date);
  const accentColor = TYPE_COLORS[event.type];
  const accentRgb = TYPE_COLORS_RGB[event.type];

  return (
    <div className="landing-container" ref={containerRef}>
      {/* Grain overlay */}
      <div className="grain" />

      {/* Main Content */}
      <motion.div
        className="content-wrapper"
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
      >
        {/* Hero Title with scramble decode */}
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="title-line" data-text="SMC">
            <span className="title-placeholder" aria-hidden="true">SMC</span>
            <span className="title-text">{smcText}</span>
            <span className="title-outline" aria-hidden="true">SMC</span>
          </span>
          <span className="title-line" data-text="CS CLUB">
            <span className="title-placeholder" aria-hidden="true">CS CLUB</span>
            <span className="title-text">{csText}</span>
            <span className="title-outline" aria-hidden="true">CS CLUB</span>
          </span>
        </motion.h1>

        {/* Event Slideshow */}
        <motion.div
          className="event-slideshow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {event.cta.url ? (
              <motion.a
                key={event.id}
                href={event.cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="event-slide"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                style={{
                  '--event-accent': accentColor,
                  '--event-accent-rgb': accentRgb,
                }}
              >
                <SlideContent event={event} isPast={isPast} />
              </motion.a>
            ) : (
              <motion.div
                key={event.id}
                className="event-slide"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                style={{
                  '--event-accent': accentColor,
                  '--event-accent-rgb': accentRgb,
                }}
              >
                <SlideContent event={event} isPast={isPast} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar + dots */}
          <div className="slideshow-controls">
            <div className="progress-track">
              <motion.div
                key={`progress-${currentSlide}-${isPaused}`}
                className="progress-fill"
                initial={{ width: isPaused ? undefined : '0%' }}
                animate={{ width: isPaused ? undefined : '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
                onAnimationComplete={advanceSlide}
                style={{
                  background: accentColor,
                }}
              />
            </div>
            <div className="slide-dots">
              {EVENTS.map((evt, i) => (
                <button
                  key={evt.id}
                  className={`slide-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to ${evt.name}`}
                  style={i === currentSlide ? {
                    background: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  } : undefined}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Meeting Info Strip */}
        <motion.div
          className="meeting-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="meeting-item">
            <svg className="meeting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="meeting-text">Thursdays, 11:00 AM – 12:30 PM</span>
          </div>
          <span className="meeting-divider">|</span>
          <div className="meeting-item">
            <svg className="meeting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="meeting-text">MSB 205 · 1900 Pico Blvd, Santa Monica</span>
          </div>
        </motion.div>

        {/* Benefits - simple inline */}
        <motion.div
          className="benefits-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {benefits.map((benefit, i) => (
            <div key={benefit.label} className="benefit-item">
              <div className="benefit-icon-wrapper">
                <img src={benefit.icon} alt="" className="benefit-icon" />
              </div>
              <span className="benefit-label">{benefit.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Down Arrow */}
        <motion.div
          className="arrow-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.95 }}
        >
          <DownArrow targetId="instagram" />
        </motion.div>
      </motion.div>

      <style>{`
        .landing-container {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          min-height: 600px;
          overflow: hidden;
        }

        /* Film grain texture */
        .grain {
          position: absolute;
          inset: -50%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          animation: grainShift 0.5s steps(1) infinite;
        }

        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2%, -2%); }
          50% { transform: translate(2%, 2%); }
          75% { transform: translate(-2%, 2%); }
        }

        /* Content */
        .content-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: clamp(5rem, 8vh, 6rem) clamp(1rem, 5vw, 3rem) clamp(2rem, 5vh, 4rem);
          box-sizing: border-box;
        }

        /* Hero Title - stacked outline effect */
        .hero-title {
          position: relative;
          font-family: 'Russo One', sans-serif;
          font-size: clamp(56px, 11vw, 180px);
          font-weight: 400;
          line-height: 0.9;
          text-align: center;
          margin: 0;
          margin-top: auto;
          margin-bottom: clamp(2rem, 4vh, 3.5rem);
          display: flex;
          flex-direction: column;
        }

        .title-line {
          position: relative;
          display: block;
        }

        .title-placeholder {
          visibility: hidden;
          display: block;
        }

        .title-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          color: #F1F5F9;
          text-align: center;
        }

        /* Chromatic aberration layers */
        .title-line::before,
        .title-line::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
        }

        .title-line::before {
          color: #ff0040;
          z-index: 3;
        }

        .title-line::after {
          color: #00ffff;
          z-index: 3;
        }

        .title-outline {
          position: absolute;
          inset: 0;
          z-index: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(15, 181, 136, 0.3);
          transform: translate(4px, 4px);
          pointer-events: none;
          user-select: none;
        }

        /* Glitch effect on hover */
        .title-line:hover .title-text {
          animation: glitchText 0.7s steps(2) forwards;
        }

        .title-line:hover::before {
          animation: glitchRed 0.7s steps(2) forwards;
        }

        .title-line:hover::after {
          animation: glitchCyan 0.7s steps(2) forwards;
        }

        @keyframes glitchText {
          0% { opacity: 1; }
          5% { opacity: 0; }
          5.5% { opacity: 1; }
          10% { opacity: 1; transform: translate(0); }
          15% { opacity: 0; }
          16% { opacity: 1; }
          20% { transform: translate(-3px, 0); }
          25% { transform: translate(0); opacity: 0; }
          26% { opacity: 1; }
          30% { transform: translate(2px, 1px); }
          35% { transform: translate(0); }
          40% { opacity: 0; }
          41% { opacity: 1; }
          50% { transform: translate(-2px, -1px); }
          55% { transform: translate(0); opacity: 0; }
          56% { opacity: 1; }
          65% { transform: translate(3px, 0); }
          70% { transform: translate(0); }
          80% { opacity: 0; }
          81% { opacity: 1; }
          90% { transform: translate(-1px, 1px); }
          100% { transform: translate(0); opacity: 1; }
        }

        @keyframes glitchRed {
          0%, 100% { opacity: 0; }
          5% { opacity: 0.8; transform: translate(-4px, -1px); clip-path: inset(20% 0 40% 0); }
          10% { opacity: 0; }
          20% { opacity: 0.6; transform: translate(-3px, 2px); clip-path: inset(60% 0 10% 0); }
          25% { opacity: 0; }
          40% { opacity: 0.7; transform: translate(-5px, 0); clip-path: inset(10% 0 70% 0); }
          45% { opacity: 0; }
          55% { opacity: 0.8; transform: translate(-3px, -2px); clip-path: inset(50% 0 20% 0); }
          60% { opacity: 0; }
          75% { opacity: 0.5; transform: translate(-4px, 1px); clip-path: inset(30% 0 50% 0); }
          80% { opacity: 0; }
        }

        @keyframes glitchCyan {
          0%, 100% { opacity: 0; }
          8% { opacity: 0.8; transform: translate(4px, 1px); clip-path: inset(40% 0 30% 0); }
          13% { opacity: 0; }
          25% { opacity: 0.6; transform: translate(3px, -1px); clip-path: inset(10% 0 60% 0); }
          30% { opacity: 0; }
          45% { opacity: 0.7; transform: translate(5px, 2px); clip-path: inset(70% 0 5% 0); }
          50% { opacity: 0; }
          60% { opacity: 0.8; transform: translate(3px, 0); clip-path: inset(25% 0 55% 0); }
          65% { opacity: 0; }
          80% { opacity: 0.5; transform: translate(4px, -2px); clip-path: inset(45% 0 35% 0); }
          85% { opacity: 0; }
        }

        /* Event Slideshow */
        .event-slideshow {
          position: relative;
          width: 100%;
          max-width: 560px;
          margin-bottom: clamp(2rem, 4vh, 3.5rem);
        }

        .event-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: clamp(16px, 2.5vh, 24px) clamp(20px, 4vw, 40px);
          height: clamp(220px, 28vh, 280px);
          overflow: hidden;
          border: 1px solid rgba(var(--event-accent-rgb), 0.25);
          border-top: 3px solid var(--event-accent);
          border-radius: 16px;
          background: rgba(var(--event-accent-rgb), 0.04);
          box-shadow: 0 0 40px rgba(var(--event-accent-rgb), 0.08);
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
          justify-content: center;
          gap: 8px;
        }

        a.event-slide {
          cursor: pointer;
        }

        a.event-slide:hover {
          background: rgba(var(--event-accent-rgb), 0.08);
          border-color: rgba(var(--event-accent-rgb), 0.45);
          box-shadow: 0 0 50px rgba(var(--event-accent-rgb), 0.15);
        }

        .slide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 4px;
        }

        .event-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-family: 'Roboto Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          background: rgba(var(--event-accent-rgb), 0.15);
          color: var(--event-accent);
        }

        .event-date {
          font-family: 'Roboto Mono', monospace;
          font-size: clamp(11px, 1vw, 13px);
          color: rgba(241, 245, 249, 0.6);
        }

        .event-logo-wrapper {
          position: relative;
          flex-shrink: 0;
          margin-bottom: 4px;
        }

        .event-logo {
          position: relative;
          z-index: 1;
          width: clamp(44px, 5vw, 64px);
          height: auto;
          filter: brightness(0) invert(1) drop-shadow(0 0 16px rgba(255, 255, 255, 0.15));
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          bottom: -6px;
          opacity: 0;
          pointer-events: none;
          animation: floatUp 3s ease-in infinite;
        }

        .particle-0 { left: 10%;  animation-delay: 0s;    animation-duration: 2.8s; }
        .particle-1 { left: 25%;  animation-delay: 0.5s;  animation-duration: 3.2s; }
        .particle-2 { left: 40%;  animation-delay: 1.1s;  animation-duration: 2.6s; }
        .particle-3 { left: 55%;  animation-delay: 0.3s;  animation-duration: 3.5s; }
        .particle-4 { left: 70%;  animation-delay: 0.8s;  animation-duration: 2.9s; }
        .particle-5 { left: 85%;  animation-delay: 1.4s;  animation-duration: 3.1s; }

        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          15% { opacity: 0.7; }
          70% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-80px) scale(0.3); }
        }

        .event-name {
          font-family: 'Russo One', sans-serif;
          font-size: clamp(20px, 2.5vw, 32px);
          font-weight: 400;
          color: #F1F5F9;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .event-tagline {
          font-family: 'Roboto Mono', monospace;
          font-size: clamp(12px, 1.1vw, 15px);
          font-weight: 300;
          color: var(--event-accent);
          margin: 0;
        }

        .event-bio {
          font-family: 'Roboto Mono', monospace;
          font-size: clamp(11px, 0.9vw, 13px);
          font-weight: 300;
          color: rgba(241, 245, 249, 0.5);
          margin: 0;
        }

        .event-cta-btn {
          font-family: 'Russo One', sans-serif;
          font-size: clamp(12px, 1.1vw, 15px);
          color: var(--event-accent);
          opacity: 0.7;
          transition: opacity 0.3s ease;
          margin-top: 4px;
        }

        a.event-slide:hover .event-cta-btn {
          opacity: 1;
        }

        .event-ended-badge {
          display: inline-flex;
          align-items: center;
          margin-left: 8px;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(241, 245, 249, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.12);
          vertical-align: middle;
        }

        /* Slideshow Controls */
        .slideshow-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
        }

        .progress-track {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
        }

        .slide-dots {
          display: flex;
          gap: 8px;
        }

        .slide-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slide-dot:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        /* Meeting Info Strip */
        .meeting-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.75rem, 2vw, 1.5rem);
          margin-bottom: clamp(2.5rem, 5vh, 4rem);
          padding: clamp(8px, 1vh, 12px) clamp(16px, 3vw, 28px);
          border-radius: 999px;
          background: rgba(15, 181, 136, 0.03);
          border: 1px solid rgba(15, 181, 136, 0.12);
        }

        .meeting-item {
          display: flex;
          align-items: center;
          gap: clamp(6px, 0.6vw, 10px);
        }

        .meeting-icon {
          width: clamp(14px, 1.2vw, 18px);
          height: clamp(14px, 1.2vw, 18px);
          color: #0FB588;
          flex-shrink: 0;
        }

        .meeting-text {
          font-family: 'Roboto Mono', monospace;
          font-size: clamp(11px, 1vw, 14px);
          font-weight: 300;
          color: rgba(241, 245, 249, 0.7);
          white-space: nowrap;
        }

        .meeting-divider {
          color: rgba(15, 181, 136, 0.2);
          font-size: clamp(11px, 1vw, 14px);
        }

        /* Benefits - clean inline */
        .benefits-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(2rem, 6vw, 5rem);
          flex-wrap: wrap;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: clamp(10px, 1vw, 16px);
          transition: transform 0.3s ease;
        }

        .benefit-item:hover {
          transform: translateY(-2px);
        }

        .benefit-item:hover .benefit-icon-wrapper {
          box-shadow: 0 0 20px rgba(15, 181, 136, 0.4);
        }

        .benefit-icon-wrapper {
          width: clamp(40px, 3.5vw, 54px);
          height: clamp(40px, 3.5vw, 54px);
          background: linear-gradient(135deg, #0FB588 0%, #0088FE 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: box-shadow 0.3s ease;
        }

        .benefit-icon {
          width: clamp(22px, 2vw, 30px);
          height: clamp(22px, 2vw, 30px);
          filter: brightness(0) invert(1);
        }

        .benefit-label {
          font-family: 'Russo One', sans-serif;
          font-size: clamp(1rem, 1.3vw, 1.5rem);
          font-weight: 400;
          color: #F1F5F9;
          white-space: nowrap;
        }

        /* Arrow */
        .arrow-wrapper {
          margin-top: auto;
          padding-bottom: clamp(10px, 2vh, 20px);
        }

        /* Responsive */
        @media (max-width: 600px) {
          .landing-container {
            height: auto;
            min-height: 100vh;
            min-height: 100dvh;
            overflow: visible;
          }

          .grain {
            inset: 0;
          }

          .content-wrapper {
            height: auto;
            min-height: 100vh;
            min-height: 100dvh;
          }

          .slide-header {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .event-slide {
            padding: 16px 20px;
            height: 220px;
            overflow: hidden;
          }

          .slide-dot {
            width: 12px;
            height: 12px;
          }

          .slide-dots {
            gap: 12px;
          }

          .meeting-strip {
            flex-direction: column;
            gap: 0.5rem;
            border-radius: 12px;
            padding: 12px 20px;
          }

          .meeting-divider {
            display: none;
          }

          .meeting-text {
            white-space: normal;
            text-align: center;
          }

          .benefits-container {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

function SlideContent({ event, isPast }) {
  return (
    <>
      <div className="slide-header">
        <span className="event-type-badge">
          {TYPE_ICONS[event.type]}
          {event.type.toUpperCase()}
        </span>
        <span className="event-date">
          {event.date}
          {event.time && ` · ${event.time}`}
          {isPast && <span className="event-ended-badge">ENDED</span>}
        </span>
      </div>

      {event.logo && (
        <div className="event-logo-wrapper">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={`particle particle-${i}`} />
          ))}
          <img src={event.logo} alt="" className="event-logo" />
        </div>
      )}

      <h2 className="event-name">{event.name}</h2>
      <p className="event-tagline">{event.tagline}</p>
      {event.bio && <p className="event-bio">{event.bio}</p>}
      <span className="event-cta-btn">{event.cta.label} →</span>
    </>
  );
}

export default Landing;
