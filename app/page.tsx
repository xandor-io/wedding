"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Landing() {
  const [countdown, setCountdown] = useState({
    days: "—",
    hours: "—",
    mins: "—",
    secs: "—",
  });

  useEffect(() => {
    const target = new Date("2027-04-25T16:00:00-06:00").getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ days: "0", hours: "00", mins: "00", secs: "00" });
        return;
      }
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const mins = Math.floor((diff % 3_600_000) / 60_000);
      const secs = Math.floor((diff % 60_000) / 1000);
      setCountdown({
        days: String(days),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <main>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero">
        <div className="hero-bg-wash" />

        {/* Large olive branch top-left */}
        <div className="botanical botanical-tl">
          <OliveBranch />
        </div>
        <div className="botanical botanical-br">
          <OliveBranch />
        </div>
        <div className="botanical botanical-tr float">
          <LittleFloral />
        </div>
        <div className="botanical botanical-bl float float-delay">
          <LittleFloral />
        </div>

        {/* Polaroids */}
        <Polaroid index={1} caption="Us" />
        <Polaroid index={2} caption="Our story" />
        <Polaroid index={3} caption="Together" />

        <div className="hero-content">
          <div className="save-script">Save the Date</div>
          <h1 className="names">
            <span className="name-word name-first">
              <span>
                <em>Elexus</em>
              </span>
            </span>
            <span className="ampersand">&amp;</span>
            <span className="name-word name-second">
              <span>
                <em>Xandor</em>
              </span>
            </span>
          </h1>
          <div className="hero-divider">
            <span className="line" />
            <span className="dot" />
            <span className="line" />
          </div>
          <div className="roman-date">XXV · IV · MMXXVII</div>
          <div className="plain-date">
            Twenty-fifth of April · Two Thousand Twenty-Seven
          </div>
          <div className="location-block">
            <div className="venue">Convento de Santa Clara</div>
            <div className="city">Antigua · Guatemala</div>
          </div>
        </div>

        <div className="scroll-hint">
          Scroll
          <span className="arrow" />
        </div>
      </section>

      {/* ═══════════════ COUNTDOWN ═══════════════ */}
      <section className="countdown">
        <div className="countdown-label label reveal">
          Counting down to the celebration
        </div>
        <div className="countdown-grid">
          {[
            { num: countdown.days, lbl: "Days" },
            { num: countdown.hours, lbl: "Hours" },
            { num: countdown.mins, lbl: "Minutes" },
            { num: countdown.secs, lbl: "Seconds" },
          ].map((u, i) => (
            <div
              key={u.lbl}
              className={`countdown-unit reveal reveal-delay-${Math.min(i + 1, 3)}`}
            >
              <div className="countdown-num">{u.num}</div>
              <div className="countdown-lbl">{u.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ INVITATION LETTER ═══════════════ */}
      <section className="invitation">
        <div className="invitation-wash" />
        <div className="letter reveal">
          <div className="letter-corner tl" />
          <div className="letter-corner tr" />
          <div className="letter-corner bl" />
          <div className="letter-corner br" />

          <svg
            className="letter-ornament"
            viewBox="0 0 80 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M 5 15 Q 20 5, 40 15 T 75 15" strokeLinecap="round" />
            <circle cx="40" cy="15" r="2" fill="currentColor" />
            <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="65" cy="15" r="1" fill="currentColor" opacity="0.6" />
          </svg>

          <p className="together">Together with our families</p>
          <h2 className="couple">Elexus &amp; Xandor</h2>
          <p className="invite-text">
            joyfully invite you to share in the celebration of their marriage
          </p>

          <div className="letter-divider">
            <span className="line" />
            <svg viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="2" />
            </svg>
            <span className="line" />
          </div>

          <p className="formal-date">
            on the twenty-fifth of April
            <br />
            two thousand and twenty-seven
          </p>
          <p className="venue-formal">
            Convento de Santa Clara · Antigua, Guatemala
          </p>
        </div>
      </section>

      {/* ═══════════════ DESTINATION ═══════════════ */}
      <section className="destination">
        <div className="destination-inner">
          <div className="destination-text">
            <span className="label reveal">The Destination</span>
            <h2 className="reveal reveal-delay-1">
              A city of cobblestones and candlelight
            </h2>
            <p className="reveal reveal-delay-2">
              Antigua Guatemala is a UNESCO World Heritage city ringed by three
              volcanoes, filled with pastel colonial buildings, candlelit
              courtyards, and the slow rhythm of a place that has been
              beautiful for five hundred years.
            </p>
            <p className="reveal reveal-delay-3">
              We'll be gathering at the ruins of a seventeenth-century convent —
              stone walls, open sky, warm stones, golden evening light. It's the
              most us place we could imagine.
            </p>
            <span className="venue-name reveal reveal-delay-3">
              Convento de Santa Clara
            </span>
            <span className="venue-sub reveal reveal-delay-3">
              Founded 1699 · Antigua Guatemala
            </span>
          </div>

          <div className="destination-visual reveal">
            <img
              className="destination-photo"
              src="/venue.jpg"
              alt="The ceremony setup at Convento de Santa Clara, Antigua Guatemala"
            />
            <div className="photo-overlay" />
            <div className="caption">Where we'll be married</div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RSVP TEASER ═══════════════ */}
      <section className="rsvp-teaser">
        <div className="label reveal">Your Presence is Our Joy</div>
        <h2 className="reveal reveal-delay-1">
          We'd love to send you the details
        </h2>
        <p className="reveal reveal-delay-2">
          Please share a few quick things — your address, email, and phone — so
          we can send the official save-the-date, and keep you up to date with
          travel info, hotel blocks, and everything you'll need for the
          weekend in Antigua.
        </p>
        <Link href="/rsvp" className="btn-primary reveal reveal-delay-3">
          Share your details
          <span className="arrow">→</span>
        </Link>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer>
        <div className="sign-off">See you in Antigua</div>
        <div className="small">More details to come</div>
      </footer>

      <style jsx>{landingStyles}</style>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

function OliveBranch() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="#7C8A6A" strokeWidth="1.4">
      <path d="M 20 180 Q 60 140, 100 120 T 180 40" strokeLinecap="round" />
      {[
        { cx: 50, cy: 155, r: 12, ry: 4, rot: -30, fill: "#A9B59A", op: 0.8 },
        { cx: 70, cy: 140, r: 14, ry: 5, rot: -20, fill: "#7C8A6A", op: 0.85 },
        { cx: 95, cy: 120, r: 13, ry: 4, rot: -15, fill: "#A9B59A", op: 0.8 },
        { cx: 120, cy: 95, r: 15, ry: 5, rot: -25, fill: "#7C8A6A", op: 0.85 },
        { cx: 145, cy: 70, r: 12, ry: 4, rot: -35, fill: "#A9B59A", op: 0.75 },
        { cx: 165, cy: 50, r: 10, ry: 3.5, rot: -40, fill: "#7C8A6A", op: 0.7 },
        { cx: 40, cy: 168, r: 10, ry: 3.5, rot: 30, fill: "#7C8A6A", op: 0.7 },
        { cx: 60, cy: 150, r: 11, ry: 4, rot: 40, fill: "#A9B59A", op: 0.7 },
        { cx: 85, cy: 128, r: 12, ry: 4, rot: 35, fill: "#7C8A6A", op: 0.75 },
        { cx: 108, cy: 108, r: 11, ry: 4, rot: 30, fill: "#A9B59A", op: 0.7 },
        { cx: 130, cy: 82, r: 10, ry: 3.5, rot: 25, fill: "#7C8A6A", op: 0.7 },
      ].map((e, i) => (
        <ellipse
          key={i}
          cx={e.cx}
          cy={e.cy}
          rx={e.r}
          ry={e.ry}
          transform={`rotate(${e.rot} ${e.cx} ${e.cy})`}
          fill={e.fill}
          stroke="none"
          opacity={e.op}
        />
      ))}
    </svg>
  );
}

function LittleFloral() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="#C9918B" strokeWidth="1">
      <path d="M 50 80 Q 50 60, 50 40" strokeLinecap="round" />
      <circle cx="50" cy="30" r="8" fill="#E4C7BC" stroke="#C9918B" opacity="0.7" />
      <circle cx="42" cy="38" r="6" fill="#F0DCD2" stroke="#C9918B" opacity="0.6" />
      <circle cx="58" cy="38" r="6" fill="#F0DCD2" stroke="#C9918B" opacity="0.6" />
      <circle cx="50" cy="22" r="6" fill="#F0DCD2" stroke="#C9918B" opacity="0.6" />
      <circle cx="50" cy="32" r="3" fill="#C9918B" stroke="none" />
    </svg>
  );
}

function Polaroid({ index, caption }: { index: number; caption: string }) {
  return (
    <div className={`polaroid polaroid-${index}`}>
      <div className="polaroid-inner">
        <div className="polaroid-photo">
          <div className="polaroid-placeholder">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 23 19 a 2 2 0 0 1 -2 2 H 3 a 2 2 0 0 1 -2 -2 V 8 a 2 2 0 0 1 2 -2 h 4 l 2 -3 h 6 l 2 3 h 4 a 2 2 0 0 1 2 2 z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <div className="polaroid-placeholder-text">your photo</div>
          </div>
        </div>
        <div className="polaroid-caption">{caption}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Styles (ported from the approved HTML prototype)
// ═══════════════════════════════════════════════════════════════

const landingStyles = `
  .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 4rem 2rem; overflow: hidden; }
  .hero-bg-wash { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 70% 20%, rgba(232,201,192,0.3), transparent 60%), radial-gradient(ellipse 70% 50% at 20% 80%, rgba(169,181,154,0.25), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(250,246,236,0.6), transparent 70%); z-index: 0; }
  .botanical { position: absolute; z-index: 1; opacity: 0; animation: botanical-appear 2.4s cubic-bezier(0.22,1,0.36,1) 0.3s forwards; }
  .botanical :global(svg path), .botanical :global(svg line) { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw 3s cubic-bezier(0.65,0,0.35,1) 0.5s forwards; }
  .botanical-tl { top: -2rem; left: -2rem; width: 280px; transform: rotate(-8deg); }
  .botanical-br { bottom: -2rem; right: -2rem; width: 300px; transform: rotate(175deg); }
  .botanical-tr { top: 8%; right: 6%; width: 140px; opacity: 0.5 !important; }
  .botanical-bl { bottom: 10%; left: 5%; width: 120px; opacity: 0.5 !important; }
  @keyframes botanical-appear { to { opacity: 1; } }
  @keyframes draw { to { stroke-dashoffset: 0; } }

  /* Polaroids */
  .polaroid { position: absolute; z-index: 2; opacity: 0; transform-origin: center center; pointer-events: none; }
  .polaroid-1 { top: 16%; left: 4%; animation: polaroid-in-1 1.4s cubic-bezier(0.22,1,0.36,1) 2.3s forwards; }
  .polaroid-2 { top: 46%; right: 4%; animation: polaroid-in-2 1.4s cubic-bezier(0.22,1,0.36,1) 2.6s forwards; }
  .polaroid-3 { bottom: 14%; left: 8%; animation: polaroid-in-3 1.4s cubic-bezier(0.22,1,0.36,1) 2.9s forwards; }
  @keyframes polaroid-in-1 { from { opacity: 0; transform: rotate(-8deg) translateY(30px) scale(0.88); } to { opacity: 1; transform: rotate(-8deg) translateY(0) scale(1); } }
  @keyframes polaroid-in-2 { from { opacity: 0; transform: rotate(7deg) translateY(30px) scale(0.88); } to { opacity: 1; transform: rotate(7deg) translateY(0) scale(1); } }
  @keyframes polaroid-in-3 { from { opacity: 0; transform: rotate(4deg) translateY(30px) scale(0.88); } to { opacity: 1; transform: rotate(4deg) translateY(0) scale(1); } }
  .polaroid-inner { background: #FAF6EC; padding: 0.75rem 0.75rem 1.9rem 0.75rem; box-shadow: 0 18px 40px -12px rgba(43,42,37,0.35), 0 3px 10px rgba(43,42,37,0.12); animation: polaroid-float 7s ease-in-out infinite; }
  .polaroid-1 .polaroid-inner { animation-delay: -1s; }
  .polaroid-2 .polaroid-inner { animation-delay: -3s; animation-duration: 8.5s; }
  .polaroid-3 .polaroid-inner { animation-delay: -2.2s; animation-duration: 6.5s; }
  @keyframes polaroid-float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(0.8deg); } }
  .polaroid-photo { width: 130px; height: 150px; position: relative; overflow: hidden; }
  .polaroid-1 .polaroid-photo { background: linear-gradient(135deg, #E4C7BC 0%, #C9918B 100%); }
  .polaroid-2 .polaroid-photo { background: linear-gradient(135deg, #A9B59A 0%, #7C8A6A 100%); }
  .polaroid-3 .polaroid-photo { background: linear-gradient(135deg, #F0DCD2 0%, #C9918B 100%); }
  .polaroid-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(250,246,236,0.7); }
  .polaroid-placeholder :global(svg) { width: 28px; height: 28px; opacity: 0.75; margin-bottom: 0.5rem; }
  .polaroid-placeholder-text { font-family: 'Fraunces', serif; font-style: italic; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; opacity: 0.9; }
  .polaroid-caption { font-family: 'Pinyon Script', cursive; text-align: center; color: var(--ink-soft); margin-top: 0.5rem; font-size: 1.35rem; line-height: 1; }

  .hero-content { position: relative; z-index: 2; text-align: center; max-width: 900px; }
  .save-script { font-family: 'Pinyon Script', cursive; font-size: clamp(2rem, 5vw, 3.5rem); color: var(--blush-rose); line-height: 1; margin-bottom: 2rem; opacity: 0; transform: translateY(20px); animation: rise 1.2s cubic-bezier(0.22,1,0.36,1) 0.4s forwards; }
  .save-script::after { content: ""; display: block; width: 100px; height: 1px; background: var(--blush-rose); margin: 0.5rem auto 0; opacity: 0.5; }
  .names { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(3.5rem, 11vw, 8rem); line-height: 0.95; color: var(--ink); margin: 0; letter-spacing: -0.02em; }
  .name-word { display: inline-block; overflow: hidden; vertical-align: baseline; }
  .name-word :global(span) { display: inline-block; transform: translateY(110%); animation: slide-up 1.4s cubic-bezier(0.22,1,0.36,1) forwards; }
  .name-first :global(span) { animation-delay: 0.7s; }
  .name-second :global(span) { animation-delay: 1.1s; }
  .names :global(em) { font-style: italic; font-weight: 300; color: var(--sage-deep); }
  .ampersand { display: block; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: clamp(2.5rem, 7vw, 5rem); color: var(--blush-rose); line-height: 1; margin: 0.2em 0; opacity: 0; transform: scale(0.6) rotate(-8deg); animation: amp-in 1.4s cubic-bezier(0.34,1.56,0.64,1) 0.9s forwards; }
  @keyframes slide-up { to { transform: translateY(0); } }
  @keyframes rise { to { opacity: 1; transform: translateY(0); } }
  @keyframes amp-in { to { opacity: 1; transform: scale(1) rotate(-4deg); } }

  .hero-divider { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin: 3rem 0 2rem; opacity: 0; animation: rise 1.2s cubic-bezier(0.22,1,0.36,1) 1.6s forwards; }
  .hero-divider .line { height: 1px; width: 60px; background: var(--sage); opacity: 0.6; }
  .hero-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blush-rose); }
  .roman-date { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: clamp(1.1rem, 2.5vw, 1.6rem); letter-spacing: 0.3em; color: var(--sage-deep); opacity: 0; transform: translateY(20px); animation: rise 1.2s cubic-bezier(0.22,1,0.36,1) 1.7s forwards; }
  .plain-date { font-family: 'Jost', sans-serif; font-weight: 300; font-size: clamp(0.85rem, 1.5vw, 1rem); letter-spacing: 0.4em; text-transform: uppercase; color: var(--ink-soft); margin-top: 0.75rem; opacity: 0; animation: rise 1.2s cubic-bezier(0.22,1,0.36,1) 1.9s forwards; }
  .location-block { margin-top: 3rem; opacity: 0; animation: rise 1.2s cubic-bezier(0.22,1,0.36,1) 2.2s forwards; }
  .location-block .venue { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: clamp(1.3rem, 2.8vw, 1.9rem); color: var(--ink); }
  .location-block .city { font-family: 'Jost', sans-serif; font-weight: 300; font-size: 0.8rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--sage); margin-top: 0.6rem; }

  .scroll-hint { position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%); font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--sage); opacity: 0; animation: rise 1.2s cubic-bezier(0.22,1,0.36,1) 2.6s forwards; }
  .scroll-hint .arrow { display: block; width: 1px; height: 40px; background: var(--sage); margin: 1rem auto 0; animation: scroll-pulse 2.2s ease-in-out infinite; transform-origin: top; }
  @keyframes scroll-pulse { 0%, 100% { transform: scaleY(0.3); opacity: 0.4; } 50% { transform: scaleY(1); opacity: 1; } }

  :global(section) { padding: 8rem 2rem; position: relative; }
  :global(.reveal) { opacity: 0; transform: translateY(40px); transition: opacity 1.4s cubic-bezier(0.22,1,0.36,1), transform 1.4s cubic-bezier(0.22,1,0.36,1); }
  :global(.reveal.in) { opacity: 1; transform: translateY(0); }
  :global(.reveal-delay-1) { transition-delay: 0.15s; }
  :global(.reveal-delay-2) { transition-delay: 0.3s; }
  :global(.reveal-delay-3) { transition-delay: 0.45s; }

  .countdown { background: var(--ivory-warm); text-align: center; padding: 7rem 2rem; border-top: 1px solid rgba(124,138,106,0.15); border-bottom: 1px solid rgba(124,138,106,0.15); }
  .countdown-label { margin-bottom: 3rem; }
  .countdown-grid { display: flex; justify-content: center; gap: clamp(1.5rem, 5vw, 4rem); flex-wrap: wrap; }
  .countdown-unit { display: flex; flex-direction: column; align-items: center; min-width: 80px; position: relative; }
  .countdown-unit:not(:last-child)::after { content: "·"; position: absolute; right: calc(-1 * clamp(0.8rem, 2.5vw, 2rem)); top: 30%; color: var(--blush-rose); font-size: 2rem; opacity: 0.5; }
  .countdown-num { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(2.8rem, 7vw, 4.5rem); color: var(--sage-deep); line-height: 1; font-variant-numeric: tabular-nums; }
  .countdown-lbl { font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink-soft); margin-top: 0.8rem; }

  .invitation { padding: 10rem 2rem; position: relative; }
  .invitation-wash { position: absolute; inset: 0; background: radial-gradient(ellipse 50% 40% at 80% 10%, rgba(201,145,139,0.1), transparent 70%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(124,138,106,0.08), transparent 70%); pointer-events: none; }
  .letter { max-width: 640px; margin: 0 auto; text-align: center; position: relative; padding: 5rem 3rem; background: var(--ivory-warm); border: 1px solid rgba(124,138,106,0.25); box-shadow: 0 30px 80px -40px rgba(43,42,37,0.3); }
  .letter-corner { position: absolute; width: 50px; height: 50px; border: 1px solid var(--blush-rose); opacity: 0.5; }
  .letter-corner.tl { top: 20px; left: 20px; border-right: none; border-bottom: none; }
  .letter-corner.tr { top: 20px; right: 20px; border-left: none; border-bottom: none; }
  .letter-corner.bl { bottom: 20px; left: 20px; border-right: none; border-top: none; }
  .letter-corner.br { bottom: 20px; right: 20px; border-left: none; border-top: none; }
  .letter-ornament { margin: 0 auto 2rem; width: 80px; display: block; color: var(--blush-rose); }
  .letter .together { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; color: var(--sage-deep); font-size: 1.1rem; margin-bottom: 1.5rem; }
  .letter .couple { font-family: 'Pinyon Script', cursive; font-size: clamp(3rem, 6vw, 4.5rem); color: var(--ink); line-height: 1; margin-bottom: 1.5rem; }
  .letter .invite-text { font-family: 'Fraunces', serif; font-weight: 300; font-size: 1.15rem; line-height: 1.7; color: var(--ink-soft); margin-bottom: 2.5rem; max-width: 440px; margin-left: auto; margin-right: auto; }
  .letter-divider { display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 2rem 0; }
  .letter-divider .line { height: 1px; width: 40px; background: var(--sage); opacity: 0.5; }
  .letter-divider :global(svg) { width: 16px; color: var(--blush-rose); }
  .letter .formal-date { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: 1.1rem; color: var(--sage-deep); margin-bottom: 0.5rem; line-height: 1.5; }
  .letter .venue-formal { font-family: 'Jost', sans-serif; font-size: 0.8rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ink); margin-top: 1.5rem; }

  .destination { background: linear-gradient(180deg, var(--ivory) 0%, var(--cream) 100%); padding: 8rem 2rem; overflow: hidden; }
  .destination-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.3fr; gap: 5rem; align-items: center; }
  @media (max-width: 820px) { .destination-inner { grid-template-columns: 1fr; gap: 3rem; } }
  .destination-text .label { margin-bottom: 1.5rem; display: block; }
  .destination-text h2 { font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.05; color: var(--ink); margin-bottom: 2rem; }
  .destination-text p { font-family: 'Fraunces', serif; font-weight: 300; font-size: 1.1rem; line-height: 1.8; color: var(--ink-soft); margin-bottom: 1.5rem; }
  .destination-text .venue-name { font-family: 'Pinyon Script', cursive; font-size: 2rem; color: var(--blush-rose); margin: 2rem 0 0.5rem; display: block; }
  .destination-text .venue-sub { font-family: 'Jost', sans-serif; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--sage); }

  .destination-visual { aspect-ratio: 4/3; position: relative; border: 1px solid rgba(124,138,106,0.3); overflow: hidden; }
  .destination-visual .destination-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 55%; filter: saturate(0.82) contrast(1.02) brightness(0.98); animation: photo-drift 28s ease-in-out infinite alternate; }
  @keyframes photo-drift { from { transform: scale(1.0); } to { transform: scale(1.05); } }
  .destination-visual .photo-overlay { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(246,241,230,0.05) 0%, rgba(201,145,139,0.18) 100%), radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(43,42,37,0.3) 100%); mix-blend-mode: multiply; }
  .destination-visual .caption { position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem; font-family: 'Fraunces', serif; font-style: italic; font-size: 0.85rem; color: var(--ivory); text-shadow: 0 2px 10px rgba(0,0,0,0.3); letter-spacing: 0.05em; }

  .rsvp-teaser { text-align: center; padding: 10rem 2rem; position: relative; background: var(--ivory-warm); }
  .rsvp-teaser .label { margin-bottom: 2rem; }
  .rsvp-teaser h2 { font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.05; color: var(--ink); max-width: 820px; margin: 0 auto 2rem; }
  .rsvp-teaser p { font-family: 'Fraunces', serif; font-weight: 300; font-size: 1.15rem; line-height: 1.7; color: var(--ink-soft); max-width: 560px; margin: 0 auto 3rem; }
  .btn-primary { display: inline-flex; align-items: center; gap: 1rem; font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--ivory); background: var(--sage-deep); padding: 1.3rem 2.5rem; text-decoration: none; border: none; cursor: pointer; transition: all 0.5s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden; }
  .btn-primary:hover { background: var(--blush-rose); letter-spacing: 0.45em; }
  .btn-primary .arrow { transition: transform 0.4s ease; }
  .btn-primary:hover .arrow { transform: translateX(6px); }

  footer { text-align: center; padding: 6rem 2rem 4rem; background: var(--ivory); border-top: 1px solid rgba(124,138,106,0.15); }
  footer .sign-off { font-family: 'Pinyon Script', cursive; font-size: clamp(2.5rem, 5vw, 3.5rem); color: var(--blush-rose); line-height: 1; margin-bottom: 1.5rem; }
  footer .small { font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--sage); }

  @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
  .float { animation: float 8s ease-in-out infinite; }
  .float-delay { animation-delay: -4s; }

  /* Hide polaroids on desktop narrow, they'll be repositioned on mobile */
  @media (max-width: 900px) {
    .polaroid { display: none; }
  }

  /* Mobile */
  @media (max-width: 700px) {
    :global(section) { padding: 4.5rem 1.25rem; }
    .hero { padding: 3rem 1.25rem 7.5rem; }
    .invitation { padding: 5.5rem 1.25rem; }
    .countdown { padding: 4.5rem 1.25rem; }
    .destination { padding: 5rem 1.25rem; }
    .rsvp-teaser { padding: 5.5rem 1.25rem; }
    footer { padding: 4.5rem 1.25rem 3rem; }

    .botanical-tl { width: 160px; top: -1rem; left: -1.5rem; }
    .botanical-br { width: 180px; bottom: -1rem; right: -1.5rem; }
    .botanical-tr, .botanical-bl { display: none; }

    .letter { padding: 3.5rem 1.5rem; }
    .letter-corner { width: 32px; height: 32px; }
    .letter-corner.tl, .letter-corner.tr { top: 14px; }
    .letter-corner.bl, .letter-corner.br { bottom: 14px; }
    .letter-corner.tl, .letter-corner.bl { left: 14px; }
    .letter-corner.tr, .letter-corner.br { right: 14px; }

    .destination-inner { gap: 2.5rem; }
    .scroll-hint { bottom: 1.5rem; }
    .scroll-hint .arrow { height: 28px; }

    .polaroid { display: block; position: absolute; top: auto; left: 50%; right: auto; bottom: 1.5rem; animation: none; opacity: 1; }
    .polaroid-1 { transform: translateX(calc(-50% - 98px)) rotate(-9deg); animation: polaroid-mobile-1 1.2s cubic-bezier(0.22,1,0.36,1) 2.3s backwards; }
    .polaroid-2 { transform: translateX(-50%) rotate(2deg); z-index: 3; animation: polaroid-mobile-2 1.2s cubic-bezier(0.22,1,0.36,1) 2.55s backwards; }
    .polaroid-3 { transform: translateX(calc(-50% + 98px)) rotate(7deg); animation: polaroid-mobile-3 1.2s cubic-bezier(0.22,1,0.36,1) 2.8s backwards; }
    @keyframes polaroid-mobile-1 { from { opacity: 0; transform: translateX(calc(-50% - 98px)) translateY(20px) rotate(-9deg) scale(0.9); } to { opacity: 1; transform: translateX(calc(-50% - 98px)) translateY(0) rotate(-9deg) scale(1); } }
    @keyframes polaroid-mobile-2 { from { opacity: 0; transform: translateX(-50%) translateY(20px) rotate(2deg) scale(0.9); } to { opacity: 1; transform: translateX(-50%) translateY(0) rotate(2deg) scale(1); } }
    @keyframes polaroid-mobile-3 { from { opacity: 0; transform: translateX(calc(-50% + 98px)) translateY(20px) rotate(7deg) scale(0.9); } to { opacity: 1; transform: translateX(calc(-50% + 98px)) translateY(0) rotate(7deg) scale(1); } }
    .polaroid-inner { padding: 0.55rem 0.55rem 1.4rem 0.55rem; }
    .polaroid-photo { width: 96px; height: 112px; }
    .polaroid-placeholder :global(svg) { width: 22px; height: 22px; margin-bottom: 0.35rem; }
    .polaroid-placeholder-text { font-size: 0.55rem; letter-spacing: 0.2em; }
    .polaroid-caption { font-size: 1.15rem; margin-top: 0.3rem; }
  }

  @media (max-width: 360px) {
    .polaroid-photo { width: 82px; height: 96px; }
    .polaroid-1 { transform: translateX(calc(-50% - 86px)) rotate(-9deg); }
    .polaroid-3 { transform: translateX(calc(-50% + 86px)) rotate(7deg); }
  }
`;
