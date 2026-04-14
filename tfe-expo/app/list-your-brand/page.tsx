"use client";

import { useEffect } from "react";

const CSS_CONTENT = `:root {
  --navy:    #0D1B2A;
  --navy2:   #162235;
  --navy3:   #1E3050;
  --blue:    #185FA5;
  --blue-lt: #378ADD;
  --gold:    #C9902A;
  --gold-lt: #E8B86D;
  --gold-bg: #FDF3E0;
  --white:   #FFFFFF;
  --off-w:   #F4F7FB;
  --muted:   #8AAED4;
  --gray:    #5A7090;
  --red:     #C0392B;
  --green:   #1E7E34;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--navy);
  color: var(--white);
  overflow-x: hidden;
}

/* ── NAV ─────────────────────────────── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px;
  height: 64px;
  background: rgba(13,27,42,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.nav-logo { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 15px; letter-spacing: 0.5px; color: var(--white); }
.nav-logo span { color: var(--gold); }
.nav-links { display: flex; gap: 32px; }
.nav-links a { font-size: 13px; color: var(--muted); text-decoration: none; transition: color .2s; }
.nav-links a:hover { color: var(--white); }
.nav-cta {
  background: var(--gold); color: var(--navy);
  font-weight: 500; font-size: 13px; padding: 9px 22px;
  border-radius: 4px; text-decoration: none; transition: background .2s;
}
.nav-cta:hover { background: var(--gold-lt); }

/* ── HERO ────────────────────────────── */
.hero {
  min-height: 100vh;
  display: flex; align-items: center;
  padding: 120px 48px 80px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; top: 0; right: 0;
  width: 55%; height: 100%;
  background: var(--navy2);
  clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%);
}
.hero-grid-lines {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.04;
  background-image:
    linear-gradient(var(--white) 1px, transparent 1px),
    linear-gradient(90deg, var(--white) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
}
.hero-gold-bar {
  position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
  background: var(--gold);
}
.hero-content { position: relative; z-index: 2; max-width: 560px; }
.hero-eyebrow {
  font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase;
  color: var(--gold); margin-bottom: 20px;
  display: flex; align-items: center; gap: 12px;
}
.hero-eyebrow::before {
  content: ''; display: block; width: 32px; height: 1px; background: var(--gold);
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(48px, 6vw, 76px);
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 28px;
}
.hero-title em { color: var(--gold); font-style: normal; }
.hero-subtitle {
  font-size: 17px; font-weight: 300; color: var(--muted);
  line-height: 1.7; margin-bottom: 44px; max-width: 480px;
}
.hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 56px; }
.btn-primary {
  background: var(--gold); color: var(--navy);
  font-weight: 500; font-size: 15px; padding: 16px 36px;
  border-radius: 4px; text-decoration: none;
  transition: background .2s, transform .15s;
  display: inline-block;
}
.btn-primary:hover { background: var(--gold-lt); transform: translateY(-1px); }
.btn-ghost {
  border: 1px solid rgba(255,255,255,0.2); color: var(--white);
  font-weight: 400; font-size: 15px; padding: 16px 36px;
  border-radius: 4px; text-decoration: none;
  transition: border-color .2s, background .2s;
  display: inline-block;
}
.btn-ghost:hover { border-color: var(--gold); background: rgba(201,144,42,0.08); }
.hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
.hero-stat-num { font-size: 32px; font-weight: 500; color: var(--gold); display: block; }
.hero-stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; display: block; }

/* Hero right panel */
.hero-right {
  position: absolute; right: 48px; top: 50%; transform: translateY(-50%);
  z-index: 2; width: clamp(260px, 28vw, 360px);
}
.hero-card {
  background: var(--navy3); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; padding: 28px; margin-bottom: 16px;
}
.hero-card-label { font-size: 10px; color: var(--gold); font-weight: 500; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.hero-card-date { font-size: 20px; font-weight: 500; color: var(--white); margin-bottom: 4px; }
.hero-card-sub { font-size: 13px; color: var(--muted); }
.spots-bar { margin-top: 16px; }
.spots-label { font-size: 12px; color: var(--muted); margin-bottom: 6px; display: flex; justify-content: space-between; }
.spots-track { height: 4px; background: var(--navy); border-radius: 99px; overflow: hidden; }
.spots-fill { height: 100%; width: 71%; background: var(--gold); border-radius: 99px; }
.hero-tier-preview { display: flex; flex-direction: column; gap: 8px; }
.tier-row {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--navy3); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px; padding: 10px 14px;
}
.tier-row.featured { border-color: var(--gold); }
.tier-name { font-size: 13px; color: var(--white); }
.tier-price { font-size: 14px; font-weight: 500; color: var(--gold); }
.tier-badge { font-size: 10px; background: var(--gold); color: var(--navy); padding: 2px 8px; border-radius: 2px; font-weight: 500; }

/* ── SECTION SHARED ──────────────────── */
section { padding: 96px 48px; }
.section-label {
  font-size: 10px; color: var(--gold); font-weight: 500; letter-spacing: 3px;
  text-transform: uppercase; margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::before { content: ''; display: block; width: 24px; height: 1px; background: var(--gold); }
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 4vw, 48px); font-weight: 700; line-height: 1.15;
  margin-bottom: 16px;
}
.section-sub { font-size: 16px; color: var(--muted); max-width: 600px; line-height: 1.7; margin-bottom: 56px; }

/* ── PROBLEM SECTION ─────────────────── */
.problem { background: var(--navy2); }
.problem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2px;
}
.problem-card {
  background: var(--navy); padding: 36px 32px;
  position: relative; overflow: hidden;
  transition: background .2s;
}
.problem-card:hover { background: #111f30; }
.problem-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: var(--red);
}
.problem-num { font-size: 52px; font-weight: 700; color: rgba(192,57,43,0.2); margin-bottom: 16px; line-height: 1; }
.problem-title { font-size: 18px; font-weight: 500; margin-bottom: 12px; }
.problem-body { font-size: 14px; color: var(--muted); line-height: 1.7; }

/* ── DIFFERENTIATORS ─────────────────── */
.diff { background: var(--navy); }
.diff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media(max-width:900px) { .diff-grid { grid-template-columns: 1fr; } }
.diff-card {
  background: var(--navy2); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; padding: 32px;
  transition: border-color .2s, transform .2s;
}
.diff-card:hover { border-color: var(--gold); transform: translateY(-3px); }
.diff-num {
  font-size: 11px; font-weight: 500; color: var(--gold);
  letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;
}
.diff-title { font-size: 20px; font-weight: 500; margin-bottom: 12px; line-height: 1.2; }
.diff-body { font-size: 14px; color: var(--muted); line-height: 1.7; }

/* ── BROKER CONTRAST ─────────────────── */
.contrast { background: var(--navy2); }
.contrast-table { width: 100%; border-collapse: collapse; }
.contrast-table th {
  padding: 14px 20px; font-size: 12px; font-weight: 500;
  text-align: left; border-bottom: 1px solid rgba(255,255,255,0.08);
}
.contrast-table th.frannet-h { color: #EE8888; background: rgba(192,57,43,0.08); }
.contrast-table th.tfe-h { color: var(--gold); background: rgba(201,144,42,0.08); border-left: 2px solid var(--gold); }
.contrast-table td {
  padding: 14px 20px; font-size: 13.5px; color: var(--muted);
  border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;
}
.contrast-table td.label { color: var(--white); font-weight: 500; font-size: 13px; width: 20%; }
.contrast-table td.frannet { background: rgba(192,57,43,0.04); }
.contrast-table td.tfe-cell { background: rgba(201,144,42,0.06); border-left: 2px solid rgba(201,144,42,0.3); color: #88CC88; }
.contrast-table tr:last-child td { border-bottom: none; }
.contrast-verdict {
  margin-top: 28px; background: var(--navy3); border: 1px solid var(--gold);
  border-radius: 6px; padding: 18px 24px;
  font-size: 15px; color: var(--gold-lt); line-height: 1.6; font-style: italic;
}

/* ── TIERS ───────────────────────────── */
.tiers { background: var(--navy); }
.tiers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media(max-width:900px){ .tiers-grid { grid-template-columns: 1fr; } }
.tier-card {
  background: var(--navy2); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; overflow: hidden;
  transition: transform .2s;
}
.tier-card:hover { transform: translateY(-4px); }
.tier-card.popular { border: 2px solid var(--gold); position: relative; }
.popular-badge {
  position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
  background: var(--gold); color: var(--navy); font-size: 10px; font-weight: 500;
  padding: 4px 16px; border-radius: 0 0 6px 6px; letter-spacing: 1px; text-transform: uppercase;
}
.tier-top { padding: 32px 28px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.tier-card-name { font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
.tier-card-price { font-size: 48px; font-weight: 700; color: var(--white); line-height: 1; }
.tier-card-price span { font-size: 16px; color: var(--muted); font-weight: 300; }
.tier-card-per { font-size: 12px; color: var(--muted); margin-top: 4px; }
.tier-features { padding: 24px 28px 32px; }
.tier-feature {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13.5px;
}
.tier-feature:last-child { border-bottom: none; }
.check { color: var(--green); font-size: 13px; margin-top: 1px; flex-shrink: 0; }
.tier-cta {
  display: block; width: calc(100% - 56px); margin: 0 28px 28px;
  text-align: center; padding: 13px; border-radius: 4px;
  font-weight: 500; font-size: 14px; text-decoration: none;
  border: 1px solid rgba(255,255,255,0.15); color: var(--white);
  transition: background .2s, border-color .2s;
}
.tier-cta:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); }
.tier-cta.gold { background: var(--gold); color: var(--navy); border-color: var(--gold); }
.tier-cta.gold:hover { background: var(--gold-lt); }

/* ── CREDENTIALS ─────────────────────── */
.creds { background: var(--navy2); }
.creds-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
@media(max-width:760px){ .creds-grid { grid-template-columns: 1fr; } }
.cred-card {
  background: var(--navy); padding: 32px;
  position: relative; overflow: hidden;
}
.cred-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--gold); }
.cred-name { font-size: 20px; font-weight: 500; margin-bottom: 6px; }
.cred-result { font-size: 28px; font-weight: 700; color: var(--gold); margin-bottom: 4px; }
.cred-desc { font-size: 13px; color: var(--muted); }
.cred-founders {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  padding-top: 48px; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 56px;
}
.founder-card {
  background: var(--navy3); border-radius: 8px; padding: 28px;
  border: 1px solid rgba(255,255,255,0.06);
}
.founder-name { font-size: 20px; font-weight: 500; margin-bottom: 4px; }
.founder-title { font-size: 13px; color: var(--gold); margin-bottom: 12px; }
.founder-bio { font-size: 13.5px; color: var(--muted); line-height: 1.7; }

/* ── QUOTE ───────────────────────────── */
.quote-band { background: var(--gold); padding: 64px 48px; text-align: center; }
.quote-text {
  font-family: 'Playfair Display', serif;
  font-size: clamp(22px, 3.5vw, 36px); font-weight: 700;
  color: var(--navy); max-width: 820px; margin: 0 auto 20px; line-height: 1.3;
}
.quote-source { font-size: 13px; color: rgba(13,27,42,0.6); font-weight: 500; letter-spacing: 1px; }

/* ── DEADLINE CTA ────────────────────── */
.deadline { background: var(--navy); padding: 96px 48px; }
.deadline-inner {
  max-width: 880px; margin: 0 auto;
  background: var(--navy2); border: 1px solid rgba(201,144,42,0.3);
  border-radius: 12px; padding: 60px 56px;
  display: flex; align-items: center; gap: 56px;
}
@media(max-width:760px){ .deadline-inner { flex-direction: column; gap: 32px; } }
.deadline-left { flex: 1; }
.deadline-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.15; margin-bottom: 16px;
}
.deadline-title em { color: var(--gold); font-style: normal; }
.deadline-sub { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 28px; }
.deadline-urgency {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: var(--gold-lt);
}
.deadline-urgency::before { content: ''; display: block; width: 8px; height: 8px; border-radius: 50%; background: var(--gold); flex-shrink: 0; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
.deadline-right { text-align: center; flex-shrink: 0; }
.deadline-date { font-size: 13px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.deadline-highlight { font-size: 48px; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 4px; }
.deadline-year { font-size: 22px; color: var(--muted); font-weight: 300; }
.deadline-note { font-size: 11px; color: var(--muted); margin-top: 8px; }

/* ── FOOTER ──────────────────────────── */
footer {
  background: var(--navy2); padding: 40px 48px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.footer-logo { font-size: 14px; font-weight: 500; color: var(--muted); }
.footer-logo span { color: var(--gold); }
.footer-links { display: flex; gap: 24px; }
.footer-links a { font-size: 13px; color: var(--muted); text-decoration: none; }
.footer-links a:hover { color: var(--white); }
.footer-legal { font-size: 12px; color: rgba(138,174,212,0.4); }

/* ── ANIMATIONS ──────────────────────── */
.fade-up {
  opacity: 0; transform: translateY(24px);
  animation: fadeUp .6s ease forwards;
}
.fade-up:nth-child(1){ animation-delay: .1s; }
.fade-up:nth-child(2){ animation-delay: .2s; }
.fade-up:nth-child(3){ animation-delay: .3s; }
.fade-up:nth-child(4){ animation-delay: .4s; }
.fade-up:nth-child(5){ animation-delay: .5s; }
@keyframes fadeUp { to { opacity:1; transform:translateY(0); } }`;

const BODY_CONTENT = `<!-- NAV -->
<nav>
  <div class="nav-logo">The <span>Franchise</span> Edge</div>
  <div class="nav-links">
    <a href="#problem">The problem</a>
    <a href="#difference">Why TFE</a>
    <a href="#tiers">List your brand</a>
    <a href="#credentials">About us</a>
  </div>
  <a href="#tiers" class="nav-cta">Reserve your booth →</a>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-grid-lines"></div>
  <div class="hero-gold-bar"></div>
  <div class="hero-content">
    <div class="hero-eyebrow fade-up">Spring 2026 Virtual Event</div>
    <h1 class="hero-title fade-up">
      List your brand.<br>
      <em>Own</em> your leads.
    </h1>
    <p class="hero-subtitle fade-up">
      The only virtual franchise expo where every buyer engagement belongs entirely to you —
      never resold, never shared, never handed to a broker first.
    </p>
    <div class="hero-ctas fade-up">
      <a href="#tiers" class="btn-primary">Reserve your booth</a>
      <a href="#difference" class="btn-ghost">See how it works</a>
    </div>
    <div class="hero-stats fade-up">
      <div>
        <span class="hero-stat-num">42</span>
        <span class="hero-stat-label">Brands at launch</span>
      </div>
      <div>
        <span class="hero-stat-num">$0</span>
        <span class="hero-stat-label">Lead resale</span>
      </div>
      <div>
        <span class="hero-stat-num">&lt;$6K</span>
        <span class="hero-stat-label">Proj. cost per sale</span>
      </div>
      <div>
        <span class="hero-stat-num">847+</span>
        <span class="hero-stat-label">Registered buyers</span>
      </div>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-card">
      <div class="hero-card-label">Event date</div>
      <div class="hero-card-date">Spring 2026</div>
      <div class="hero-card-sub">Virtual · National reach · No travel</div>
      <div class="spots-bar">
        <div class="spots-label"><span>Booths claimed</span><span>30 of 42</span></div>
        <div class="spots-track"><div class="spots-fill"></div></div>
      </div>
    </div>
    <div class="hero-tier-preview">
      <div class="tier-row"><span class="tier-name">Exhibitor</span><span class="tier-price">$1,500</span></div>
      <div class="tier-row featured">
        <span class="tier-name">Featured</span>
        <span class="tier-badge">Popular</span>
        <span class="tier-price">$2,500</span>
      </div>
      <div class="tier-row"><span class="tier-name">Title Sponsor</span><span class="tier-price">$5,000</span></div>
    </div>
  </div>
</section>

<!-- PROBLEM -->
<section class="problem" id="problem">
  <div class="section-label">The problem with current channels</div>
  <h2 class="section-title">Franchise lead generation is broken<br>for emerging brands.</h2>
  <p class="section-sub">Three channels dominate the market. None of them were built for you.</p>
  <div class="problem-grid">
    <div class="problem-card">
      <div class="problem-num">5–15×</div>
      <div class="problem-title">Portal leads are resold to everyone</div>
      <div class="problem-body">When a buyer submits a form on Franchise Gator or Franchise Direct, that lead is simultaneously sold to 5–15 competing franchisors and a dozen brokers. You're racing to call a stranger who's already being bombarded. Industry average cost per sale via portals: $13,757.</div>
    </div>
    <div class="problem-card">
      <div class="problem-num">$50K</div>
      <div class="problem-title">Broker networks weren't built for you</div>
      <div class="problem-body">FranNet's CEO calls them "headhunters for top-shelf franchisors." Broker commissions run 40–50% of your franchise fee. At a $30K franchise fee, that's $15K per unit — a model that consumes every dollar you need to support new franchisees. Emerging brands sit in broker inventory without getting looked at.</div>
    </div>
    <div class="problem-card">
      <div class="problem-num">97%</div>
      <div class="problem-title">Virtual expos failed because they copied the wrong model</div>
      <div class="problem-body">In 2020, every expo went virtual. 3D lobbies, logo tile grids, platform crashes, and leads resold to every exhibitor simultaneously. 97.9% of in-person shows were cancelled in Q1 2021 — and the virtual replacements were abandoned the moment restrictions lifted. Nobody built the right product.</div>
    </div>
  </div>
</section>

<!-- DIFFERENTIATORS -->
<section class="diff" id="difference">
  <div class="section-label">The TFE difference</div>
  <h2 class="section-title">Purpose-built for brands that aren't<br>on the broker networks' radar yet.</h2>
  <p class="section-sub">Six structural decisions that make TFE's Virtual Expo fundamentally different from every other channel.</p>
  <div class="diff-grid">
    <div class="diff-card">
      <div class="diff-num">01</div>
      <div class="diff-title">Lead exclusivity — full stop</div>
      <div class="diff-body">Every buyer engagement — brand card view, pitch attendance, Q&A question, speed connect meeting — routes to your brand alone. No resale. No broker sharing. One signal, one franchisor.</div>
    </div>
    <div class="diff-card">
      <div class="diff-num">02</div>
      <div class="diff-title">Education before the sales floor</div>
      <div class="diff-body">TFE-led sessions on FDD reading, SBA financing, and territory rights run before brand discovery opens. Buyers arrive pre-educated and higher-intent. Your pitch sessions don't start from zero.</div>
    </div>
    <div class="diff-card">
      <div class="diff-num">03</div>
      <div class="diff-title">42 curated brands — not 300</div>
      <div class="diff-body">Every exhibitor is reviewed by TFE before listing. Item 19 presence, operator background, and support infrastructure are verified. Buyers trust the curation. That trust transfers to every brand in the hall.</div>
    </div>
    <div class="diff-card">
      <div class="diff-num">04</div>
      <div class="diff-title">Intent scoring, not just leads</div>
      <div class="diff-body">Session attendance, brand card views, Q&A participation, and speed connect meetings feed a readiness score per attendee. You receive intent data — not just a name and email — at event close.</div>
    </div>
    <div class="diff-card">
      <div class="diff-num">05</div>
      <div class="diff-title">Your own brand pitch stage</div>
      <div class="diff-body">Every exhibitor gets a dedicated 30-minute live stage session — brand pitch plus live Q&A, recorded and available on-demand post-event. Your Discovery Day, delivered at national scale.</div>
    </div>
    <div class="diff-card">
      <div class="diff-num">06</div>
      <div class="diff-title">CRM-ready on day one</div>
      <div class="diff-body">All lead data, engagement signals, shared meeting notes, and intent scores export directly to your CRM at event close. No manual sorting. Your development team works the pipeline, not the inbox.</div>
    </div>
  </div>
</section>

<!-- BROKER CONTRAST -->
<section class="contrast">
  <div class="section-label">Know your alternatives</div>
  <h2 class="section-title">Broker networks serve 5% of the market.<br>TFE is built for the other 95%.</h2>
  <p class="section-sub">Same goal — connecting franchisors to qualified buyers. Fundamentally different mechanics, costs, and brand fit.</p>
  <table class="contrast-table">
    <thead>
      <tr>
        <th style="width:22%;color:var(--muted)">What matters</th>
        <th class="frannet-h">Broker Networks</th>
        <th class="tfe-h">TFE Virtual Expo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="label">Who can list</td>
        <td class="frannet">Top 5% of brands — ~200 of 4,000+ active systems. Requires proven financials, existing franchisees for validation, and clean legal history.</td>
        <td class="tfe-cell">Any vetted emerging or regional brand with a real FDD and real operations. TFE reviews readiness — not unit count.</td>
      </tr>
      <tr>
        <td class="label">Cost structure</td>
        <td class="frannet">$20–50K per unit sold + annual portfolio fees. Commission consumed by the broker before you see a dollar of franchise fee revenue.</td>
        <td class="tfe-cell">$1,500–$5,000 flat listing fee. No success fee. No commission. You keep every dollar of your franchise fee.</td>
      </tr>
      <tr>
        <td class="label">Lead exclusivity</td>
        <td class="frannet">Consultant may present 8–15 brands to each buyer. Same buyer is shared across multiple competing franchisors.</td>
        <td class="tfe-cell">Every engagement signal routes to one brand only. Never resold. Never shared. Yours from the first click.</td>
      </tr>
      <tr>
        <td class="label">Entry requirement</td>
        <td class="frannet">Financial stability documentation + existing franchisee validation calls required. Emerging brands structurally cannot pass this gate.</td>
        <td class="tfe-cell">Verified FDD, operator background, and TFE readiness review. Built for brands growing into their potential.</td>
      </tr>
      <tr>
        <td class="label">Franchisor visibility</td>
        <td class="frannet">You hand off to a consultant and wait. No real-time data on buyer activity or intent.</td>
        <td class="tfe-cell">Real-time intent scoring, session attendance tracking, and engagement data — delivered at event close.</td>
      </tr>
    </tbody>
  </table>
  <div class="contrast-verdict">
    "Emerging brands sometimes end up sitting in broker inventory without getting many looks… it's difficult to get noticed even when using broker networks because those channels are crowded."
    <br><span style="font-size:12px;color:var(--muted);font-style:normal;display:block;margin-top:8px;">— Franchise Times, February 2025</span>
  </div>
</section>

<!-- QUOTE BAND -->
<div class="quote-band">
  <div class="quote-text">"Broker networks don't compete with TFE. They compete for different brands. TFE serves the market broker networks structurally cannot reach."</div>
  <div class="quote-source">— Paul Samson &amp; Scott Anderson, Co-Founders · The Franchise Edge · Tampa, FL</div>
</div>

<!-- TIERS -->
<section class="tiers" id="tiers">
  <div class="section-label">Founding exhibitor pricing</div>
  <h2 class="section-title">Choose your listing tier.</h2>
  <p class="section-sub">Rates are founding pricing only — valid through April 15, 2026. 42 total booths. 30 claimed.</p>
  <div class="tiers-grid">
    <div class="tier-card">
      <div class="tier-top">
        <div class="tier-card-name">Exhibitor</div>
        <div class="tier-card-price">$1,500 <span>/ event</span></div>
        <div class="tier-card-per">Flat fee — no success fee</div>
      </div>
      <div class="tier-features">
        <div class="tier-feature"><span class="check">✓</span><span>Brand pavilion card (all filters)</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>30-min brand pitch stage session</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Lead intent reports post-event</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Speed connect 1-on-1 meetings</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Session recording + slide hosting</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>CRM-ready lead export</span></div>
      </div>
      <a href="#contact" class="tier-cta">Reserve Exhibitor booth</a>
    </div>
    <div class="tier-card popular">
      <div class="popular-badge">Most popular</div>
      <div class="tier-top">
        <div class="tier-card-name">Featured</div>
        <div class="tier-card-price">$2,500 <span>/ event</span></div>
        <div class="tier-card-per">Flat fee — no success fee</div>
      </div>
      <div class="tier-features">
        <div class="tier-feature"><span class="check">✓</span><span>Everything in Exhibitor, plus:</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Homepage featured placement</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Priority in AI matchmaking queue</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>2× speed connect session slots</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Co-branded education session</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Email blast to registered attendees</span></div>
      </div>
      <a href="#contact" class="tier-cta gold">Reserve Featured booth</a>
    </div>
    <div class="tier-card">
      <div class="tier-top">
        <div class="tier-card-name">Title Sponsor</div>
        <div class="tier-card-price">$5,000 <span>/ event</span></div>
        <div class="tier-card-per">Flat fee — no success fee</div>
      </div>
      <div class="tier-features">
        <div class="tier-feature"><span class="check">✓</span><span>Everything in Featured, plus:</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Stage naming rights (Brand Stage)</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Logo on all event marketing</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Attendee pre-registration list</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Dedicated TFE webinar series session</span></div>
        <div class="tier-feature"><span class="check">✓</span><span>Annual always-on directory listing</span></div>
      </div>
      <a href="#contact" class="tier-cta">Reserve Title Sponsor booth</a>
    </div>
  </div>
</section>

<!-- CREDENTIALS -->
<section class="creds" id="credentials">
  <div class="section-label">About The Franchise Edge</div>
  <h2 class="section-title">A proven track record.<br>Purpose-built for this.</h2>
  <p class="section-sub">TFE has executed franchise growth at scale across food, beverage, and lifestyle brands — from franchise system design through full unit sales execution.</p>
  <div class="creds-grid">
    <div class="cred-card">
      <div class="cred-name">Keke's Breakfast Cafe</div>
      <div class="cred-result">$82M exit · 52 units sold</div>
      <div class="cred-desc">Full franchise growth execution from emerging concept to acquisition.</div>
    </div>
    <div class="cred-card">
      <div class="cred-name">BurgerFi</div>
      <div class="cred-result">$100M transaction · 100+ units</div>
      <div class="cred-desc">Franchise sales and development at national scale.</div>
    </div>
    <div class="cred-card">
      <div class="cred-name">Little Greek Fast Casual</div>
      <div class="cred-result">50+ units · Full franchise growth</div>
      <div class="cred-desc">Regional to national franchise expansion strategy and execution.</div>
    </div>
    <div class="cred-card">
      <div class="cred-name">The Franchise Edge Platform</div>
      <div class="cred-result">Active development</div>
      <div class="cred-desc">Fine Ink Studios · Jag Cantina · Complete Outdoor Living — all in active franchise development with TFE.</div>
    </div>
  </div>
  <div class="cred-founders">
    <div class="founder-card">
      <div class="founder-name">Paul Samson</div>
      <div class="founder-title">Co-Founder · The Franchise Edge</div>
      <div class="founder-bio">Franchise development executive with a track record spanning Keke's Breakfast Cafe, BurgerFi, and Little Greek Fast Casual. Based in Tampa, Florida.</div>
    </div>
    <div class="founder-card">
      <div class="founder-name">Scott Anderson</div>
      <div class="founder-title">Co-Founder · The Franchise Edge</div>
      <div class="founder-bio">Multi-brand operator and franchise growth strategist. Founder of Fine Ink Studios (20+ FL locations), Jag Cantina, and Complete Outdoor Living. Based in Orlando, Florida.</div>
    </div>
  </div>
</section>

<!-- DEADLINE CTA -->
<section class="deadline" id="contact">
  <div class="deadline-inner">
    <div class="deadline-left">
      <h2 class="deadline-title">Founding exhibitor spots close<br><em>April 15, 2026.</em></h2>
      <p class="deadline-sub">After April 15, rates increase and placement priority shifts to a waitlist. 42 total booths. 30 claimed. 12 remaining.</p>
      <div class="deadline-urgency">Registration open now — no commitment until booth is confirmed</div>
      <div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap;">
        <a href="mailto:scott@thefranchiseedge.com" class="btn-primary">Reserve your booth now</a>
        <a href="mailto:scott@thefranchiseedge.com" class="btn-ghost">Schedule a call</a>
      </div>
    </div>
    <div class="deadline-right">
      <div class="deadline-date">Founding deadline</div>
      <div class="deadline-highlight">Apr 15</div>
      <div class="deadline-year">2026</div>
      <div class="deadline-note">thefranchiseedge.com/virtual-expo</div>
      <div style="margin-top:16px;font-size:12px;color:var(--muted);">scott@thefranchiseedge.com</div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">The <span>Franchise</span> Edge · Virtual Expo 2026</div>
  <div class="footer-links">
    <a href="#problem">The problem</a>
    <a href="#difference">Why TFE</a>
    <a href="#tiers">List your brand</a>
    <a href="#credentials">About us</a>
  </div>
  <div class="footer-legal">© 2026 The Franchise Edge. All rights reserved.</div>
</footer>`;

export default function ListYourBrandPage() {
  useEffect(() => {
    // Scroll to hash on load
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_CONTENT }} />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div dangerouslySetInnerHTML={{ __html: BODY_CONTENT }} />
    </>
  );
}
