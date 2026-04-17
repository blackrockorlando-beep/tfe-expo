"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CSS_CONTENT = `:root {
  --cream:    #F8F5F0;
  --cream2:   #F0EBE3;
  --cream3:   #E8E0D5;
  --ink:      #1A1A1A;
  --ink2:     #2C2C2C;
  --ink3:     #444444;
  --muted:    #6B6B6B;
  --warm:     #8A7A6A;
  --gold:     #C9902A;
  --gold-lt:  #E8B86D;
  --gold-bg:  #FDF5E6;
  --navy:     #0D1B2A;
  --navy2:    #162235;
  --blue:     #185FA5;
  --red:      #B03020;
  --green:    #2A6B3A;
  --divider:  rgba(26,26,26,0.1);
  --shadow:   0 2px 24px rgba(26,26,26,0.08);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ── NAV ────────────────────────────────────────────── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 60px;
  background: rgba(248,245,240,0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--divider);
}
.nav-logo { font-family: 'Cormorant Garant', serif; font-size: 16px; font-weight: 600; color: var(--ink); letter-spacing: 0.3px; }
.nav-logo span { color: var(--gold); }
.nav-links { display: flex; gap: 28px; }
.nav-links a { font-size: 13px; color: var(--muted); text-decoration: none; transition: color .2s; font-weight: 400; }
.nav-links a:hover { color: var(--ink); }
.nav-cta {
  background: var(--ink); color: var(--cream);
  font-size: 13px; font-weight: 500; padding: 9px 22px;
  border-radius: 2px; text-decoration: none; transition: background .2s;
  letter-spacing: 0.3px;
}
.nav-cta:hover { background: var(--gold); }

/* ── HERO ───────────────────────────────────────────── */
.hero {
  min-height: 100vh;
  display: grid; grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 100px 48px 60px;
  gap: 60px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; top: 0; right: 0;
  width: 50%; height: 100%;
  background: var(--cream2);
  z-index: 0;
}
.hero-left { position: relative; z-index: 1; }
.hero-right { position: relative; z-index: 1; }

.hero-eyebrow {
  font-size: 11px; font-weight: 500; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
}
.hero-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); }

.hero-title {
  font-family: 'Cormorant Garant', serif;
  font-size: clamp(52px, 6vw, 78px);
  font-weight: 700; line-height: 1.0;
  color: var(--ink); margin-bottom: 28px;
  letter-spacing: -0.5px;
}
.hero-title em { color: var(--gold); font-style: italic; }

.hero-sub {
  font-size: 17px; font-weight: 300; color: var(--ink3);
  line-height: 1.75; margin-bottom: 40px; max-width: 480px;
}
.hero-sub strong { font-weight: 500; color: var(--ink); }

.hero-form {
  display: flex; gap: 0; max-width: 440px;
  border: 1.5px solid var(--ink); border-radius: 2px; overflow: hidden;
  background: var(--cream);
}
.hero-form input {
  flex: 1; padding: 14px 18px; font-size: 14px; font-family: 'DM Sans', sans-serif;
  border: none; outline: none; background: transparent; color: var(--ink);
}
.hero-form input::placeholder { color: var(--warm); }
.hero-form button {
  background: var(--ink); color: var(--cream);
  border: none; padding: 14px 24px; font-size: 13px; font-weight: 500;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: background .2s; letter-spacing: 0.3px; white-space: nowrap;
}
.hero-form button:hover { background: var(--gold); }
.hero-form-note { font-size: 12px; color: var(--warm); margin-top: 10px; }

/* Right side card */
.hero-card {
  background: var(--cream); border: 1px solid var(--divider);
  border-radius: 4px; overflow: hidden;
  box-shadow: var(--shadow);
}
.hero-card-header {
  background: var(--navy); padding: 20px 24px;
  display: flex; justify-content: space-between; align-items: center;
}
.hero-card-title { font-size: 12px; color: rgba(255,255,255,0.5); letter-spacing: 1.5px; text-transform: uppercase; }
.hero-card-date { font-size: 12px; color: var(--gold); font-weight: 500; }
.hero-card-body { padding: 24px; }
.hero-card-stat { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--divider); }
.hero-card-stat:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.hcs-num { font-family: 'Cormorant Garant', serif; font-size: 38px; font-weight: 600; color: var(--ink); line-height: 1; }
.hcs-label { font-size: 12px; color: var(--muted); margin-top: 2px; }
.hero-card-footer { background: var(--gold-bg); padding: 14px 24px; border-top: 1px solid rgba(201,144,42,0.2); }
.hero-card-footer-text { font-size: 12.5px; color: var(--gold); font-weight: 500; }

/* ── FEAR SECTION ───────────────────────────────────── */
.fear {
  background: var(--ink); padding: 96px 48px;
  color: var(--cream);
}
.fear-eyebrow { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.fear-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: rgba(255,255,255,0.25); }
.fear-title {
  font-family: 'Cormorant Garant', serif;
  font-size: clamp(32px, 4vw, 50px); font-weight: 600;
  line-height: 1.15; max-width: 720px; margin-bottom: 20px;
}
.fear-title em { color: var(--gold); font-style: italic; }
.fear-sub { font-size: 15px; color: rgba(255,255,255,0.5); max-width: 640px; line-height: 1.75; margin-bottom: 56px; }
.fear-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
.fear-card {
  background: var(--navy2); padding: 36px 32px;
  position: relative;
  transition: background .2s;
}
.fear-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--red); }
.fear-stat { font-family: 'Cormorant Garant', serif; font-size: 56px; font-weight: 600; color: rgba(176,48,32,0.35); line-height: 1; margin-bottom: 16px; }
.fear-card-title { font-size: 17px; font-weight: 500; color: var(--cream); margin-bottom: 12px; line-height: 1.25; }
.fear-card-body { font-size: 13.5px; color: rgba(255,255,255,0.45); line-height: 1.75; }

/* ── DIFFERENCE SECTION ─────────────────────────────── */
.diff { background: var(--cream); padding: 96px 48px; }
.section-eyebrow { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.section-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: var(--gold); }
.section-title { font-family: 'Cormorant Garant', serif; font-size: clamp(32px,4vw,52px); font-weight: 700; line-height: 1.1; margin-bottom: 16px; }
.section-title em { color: var(--gold); font-style: italic; }
.section-sub { font-size: 16px; color: var(--muted); max-width: 600px; line-height: 1.75; margin-bottom: 56px; }

.diff-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.diff-left { }
.diff-item { padding: 28px 0; border-bottom: 1px solid var(--divider); display: flex; gap: 20px; }
.diff-item:first-child { padding-top: 0; }
.diff-item:last-child { border-bottom: none; }
.diff-num { font-family: 'Cormorant Garant', serif; font-size: 28px; font-weight: 600; color: var(--cream3); line-height: 1; flex-shrink: 0; width: 32px; }
.diff-text { }
.diff-title { font-size: 17px; font-weight: 500; margin-bottom: 8px; }
.diff-body { font-size: 14px; color: var(--muted); line-height: 1.75; }

/* Right: comparison table */
.diff-table { border: 1px solid var(--divider); border-radius: 4px; overflow: hidden; }
.diff-table-header { display: grid; grid-template-columns: 1fr 1fr 1fr; background: var(--ink); }
.dth { padding: 12px 14px; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; }
.dth.label-h { color: rgba(255,255,255,0.35); }
.dth.old { color: rgba(255,255,255,0.35); text-align: center; }
.dth.tfe { color: var(--gold); text-align: center; }
.diff-table-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--divider); }
.diff-table-row:last-child { border-bottom: none; }
.diff-table-row:nth-child(odd) { background: var(--cream2); }
.diff-table-row:nth-child(even) { background: var(--cream); }
.dtc { padding: 12px 14px; font-size: 13px; }
.dtc.row-label { color: var(--ink3); font-weight: 500; }
.dtc.old-val { color: var(--red); text-align: center; font-size: 12px; }
.dtc.tfe-val { color: var(--green); text-align: center; font-size: 12px; font-weight: 500; }

/* ── JOURNEY SECTION ────────────────────────────────── */
.journey { background: var(--cream2); padding: 96px 48px; }
.journey-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; margin-top: 56px; }
.journey-step { background: var(--cream); padding: 36px 28px; position: relative; }
.journey-step::after { content: '→'; position: absolute; right: -12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--cream3); z-index: 1; }
.journey-step:last-child::after { display: none; }
.js-num { font-family: 'Cormorant Garant', serif; font-size: 48px; font-weight: 600; color: var(--cream3); line-height: 1; margin-bottom: 12px; }
.js-title { font-size: 16px; font-weight: 500; margin-bottom: 10px; color: var(--ink); }
.js-body { font-size: 13.5px; color: var(--muted); line-height: 1.7; }
.js-tag { display: inline-block; margin-top: 12px; font-size: 11px; padding: 3px 10px; border-radius: 2px; font-weight: 500; letter-spacing: 0.5px; }
.js-tag.info { background: var(--gold-bg); color: var(--gold); }
.js-tag.you { background: #EAF3DE; color: #3B6D11; }

/* ── BUYER TYPES ────────────────────────────────────── */
.types { background: var(--cream); padding: 96px 48px; }
.types-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 56px; }
.type-card {
  background: var(--cream2); border: 1px solid var(--divider);
  border-radius: 4px; padding: 28px; transition: box-shadow .2s, transform .2s;
}
.type-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
.type-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--cream3); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 16px; }
.type-title { font-size: 16px; font-weight: 500; margin-bottom: 8px; }
.type-body { font-size: 13.5px; color: var(--muted); line-height: 1.7; margin-bottom: 14px; }
.type-range { font-size: 12px; font-weight: 500; color: var(--gold); }

/* ── GUARANTEES ─────────────────────────────────────── */
.guarantees { background: var(--ink); padding: 96px 48px; }
.guarantees .section-eyebrow { color: rgba(255,255,255,0.35); }
.guarantees .section-eyebrow::before { background: rgba(255,255,255,0.2); }
.guarantees .section-title { color: var(--cream); }
.guarantees .section-sub { color: rgba(255,255,255,0.45); }
.guarantee-cards-buyer { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 40px; }
.gb-card { background: var(--navy2); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); transition: border-color .2s; }
.gb-card:hover { border-color: var(--gold); }
.gb-top { padding: 24px 24px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.gb-name { font-size: 16px; font-weight: 500; color: var(--cream); margin-bottom: 10px; }
.gb-condition { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }
.gb-remedy { padding: 18px 24px; background: rgba(201,144,42,0.06); }
.gb-remedy-label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
.gb-remedy-text { font-size: 13px; color: var(--gold-lt); line-height: 1.65; }

/* Master promise */
.guarantee-master-buyer {
  border: 1px solid rgba(201,144,42,0.3); border-radius: 4px; padding: 48px;
  display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: center;
  background: var(--navy2);
}
@media(max-width:760px){ .guarantee-master-buyer { grid-template-columns: 1fr; } }
.gmb-title { font-family: 'Cormorant Garant', serif; font-size: clamp(22px,3vw,34px); font-weight: 600; color: var(--cream); line-height: 1.2; margin-bottom: 14px; font-style: italic; }
.gmb-body { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.75; }
.gmb-contact { text-align: center; flex-shrink: 0; padding: 24px 32px; background: rgba(201,144,42,0.08); border-radius: 4px; border: 1px solid rgba(201,144,42,0.2); }
.gmb-contact-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
.gmb-contact-email { font-size: 16px; font-weight: 500; color: var(--gold); margin-bottom: 4px; }
.gmb-contact-note { font-size: 11.5px; color: rgba(255,255,255,0.35); line-height: 1.5; }

/* ── FAQ ────────────────────────────────────────────── */
.faq { background: var(--cream2); padding: 96px 48px; }
.faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 56px; margin-top: 48px; }
.faq-item { padding: 24px 0; border-bottom: 1px solid var(--divider); }
.faq-q { font-size: 15px; font-weight: 500; color: var(--ink); margin-bottom: 10px; }
.faq-a { font-size: 13.5px; color: var(--muted); line-height: 1.75; }

/* ── REGISTER CTA ───────────────────────────────────── */
.register {
  background: var(--cream); padding: 112px 48px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.register-eyebrow { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--warm); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
.register-eyebrow::before, .register-eyebrow::after { content: ''; display: block; width: 32px; height: 1px; background: var(--cream3); }
.register-title { font-family: 'Cormorant Garant', serif; font-size: clamp(40px,6vw,72px); font-weight: 700; color: var(--ink); line-height: 1.05; margin-bottom: 20px; max-width: 760px; }
.register-title em { color: var(--gold); font-style: italic; }
.register-sub { font-size: 16px; color: var(--muted); max-width: 520px; line-height: 1.75; margin-bottom: 44px; }
.register-form {
  display: flex; gap: 0; max-width: 480px; width: 100%;
  border: 1.5px solid var(--ink); border-radius: 2px; overflow: hidden;
  background: var(--cream);
}
.register-form input {
  flex: 1; padding: 16px 20px; font-size: 14px; font-family: 'DM Sans', sans-serif;
  border: none; outline: none; background: transparent; color: var(--ink);
}
.register-form input::placeholder { color: var(--warm); }
.register-form button {
  background: var(--ink); color: var(--cream);
  border: none; padding: 16px 28px; font-size: 13px; font-weight: 500;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: background .2s; letter-spacing: 0.5px; white-space: nowrap;
}
.register-form button:hover { background: var(--gold); }
.register-notes { display: flex; gap: 28px; margin-top: 20px; flex-wrap: wrap; justify-content: center; }
.register-note { font-size: 12px; color: var(--warm); display: flex; align-items: center; gap: 6px; }
.register-note::before { content: '✓'; color: var(--green); font-weight: 500; }
.register-deadline { margin-top: 36px; padding: 14px 28px; background: var(--gold-bg); border: 1px solid rgba(201,144,42,0.3); border-radius: 2px; }
.register-deadline-text { font-size: 13px; color: var(--gold); font-weight: 500; }

/* ── FOOTER ─────────────────────────────────────────── */
footer {
  background: var(--ink); padding: 36px 48px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.footer-logo { font-family: 'Cormorant Garant', serif; font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.5); }
.footer-logo span { color: var(--gold); }
.footer-links { display: flex; gap: 24px; }
.footer-links a { font-size: 12px; color: rgba(255,255,255,0.35); text-decoration: none; }
.footer-links a:hover { color: rgba(255,255,255,0.7); }
.footer-legal { font-size: 11px; color: rgba(255,255,255,0.2); }

/* ── UTILITY ────────────────────────────────────────── */
.check-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; font-size: 13.5px; color: var(--muted); }
.check-row .ck { color: var(--green); font-weight: 500; flex-shrink: 0; }
.cross-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; font-size: 13.5px; color: var(--muted); }
.cross-row .x { color: var(--red); font-weight: 500; flex-shrink: 0; }

/* ── ANIMATIONS ─────────────────────────────────────── */
.reveal {
  opacity: 0; transform: translateY(20px);
  animation: reveal .7s ease forwards;
}
.reveal:nth-child(1){ animation-delay:.05s }
.reveal:nth-child(2){ animation-delay:.15s }
.reveal:nth-child(3){ animation-delay:.25s }
.reveal:nth-child(4){ animation-delay:.35s }
.reveal:nth-child(5){ animation-delay:.45s }
@keyframes reveal { to { opacity:1; transform:translateY(0); } }

@media(max-width: 900px){
  .hero { grid-template-columns: 1fr; }
  .hero::before { display: none; }
  .diff-layout { grid-template-columns: 1fr; }
  .journey-steps { grid-template-columns: 1fr; }
  .types-grid { grid-template-columns: 1fr 1fr; }
  .guarantee-cards-buyer { grid-template-columns: 1fr; }
  .faq-grid { grid-template-columns: 1fr; }
  .fear-grid { grid-template-columns: 1fr; }
}

@media(max-width: 640px){
  /* NAV */
  nav { padding: 0 16px; height: 54px; }
  .nav-links { display: none; }
  .nav-cta { font-size: 12px; padding: 8px 16px; }

  /* HERO */
  .hero { padding: 70px 20px 40px; gap: 32px; min-height: auto; }
  .hero-title { font-size: 38px !important; }
  .hero-sub { font-size: 15px; margin-bottom: 28px; }
  .hero-form { flex-direction: column; border: none; gap: 10px; }
  .hero-form input { border: 1.5px solid var(--ink); border-radius: 2px; padding: 14px 16px; }
  .hero-form button { border-radius: 2px; padding: 14px; text-align: center; }
  .hero-card { margin-top: 8px; }
  .hero-card-header { padding: 14px 16px; flex-direction: column; gap: 4px; }
  .hero-card-body { padding: 16px; }
  .hcs-num { font-size: 28px; }
  .hero-card-stat { margin-bottom: 14px; padding-bottom: 14px; }
  .hero-card-footer { padding: 12px 16px; }

  /* FEAR */
  .fear { padding: 56px 20px; }
  .fear-title { font-size: 28px !important; }
  .fear-sub { font-size: 14px; margin-bottom: 32px; }
  .fear-grid { grid-template-columns: 1fr; gap: 0; }
  .fear-card { padding: 24px 20px; }
  .fear-stat { font-size: 36px; margin-bottom: 10px; }
  .fear-card-title { font-size: 15px; }
  .fear-card-body { font-size: 13px; }

  /* DIFFERENCE */
  .diff { padding: 56px 20px; }
  .section-title { font-size: 28px !important; }
  .section-sub { font-size: 14px; margin-bottom: 32px; }
  .diff-layout { gap: 32px; }
  .diff-item { padding: 20px 0; gap: 14px; }
  .diff-num { font-size: 22px; width: 28px; }
  .diff-title { font-size: 15px; }
  .diff-body { font-size: 13px; }
  .diff-table-header { font-size: 9px; }
  .dth { padding: 10px 8px; font-size: 9px; }
  .dtc { padding: 10px 8px; font-size: 11px; }

  /* JOURNEY */
  .journey { padding: 56px 20px; }
  .journey-steps { margin-top: 32px; gap: 0; }
  .journey-step { padding: 24px 20px; }
  .journey-step::after { display: none; }
  .js-num { font-size: 36px; margin-bottom: 8px; }
  .js-title { font-size: 15px; }
  .js-body { font-size: 13px; }

  /* TYPES */
  .types { padding: 56px 20px; }
  .types-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 32px; }
  .type-card { padding: 20px; }
  .type-title { font-size: 15px; }
  .type-body { font-size: 13px; }

  /* GUARANTEES */
  .guarantees { padding: 56px 20px; }
  .guarantee-cards-buyer { gap: 12px; margin-bottom: 24px; }
  .gb-top { padding: 20px 18px 16px; }
  .gb-name { font-size: 15px; }
  .gb-condition { font-size: 12.5px; }
  .gb-remedy { padding: 14px 18px; }
  .gb-remedy-text { font-size: 12.5px; }
  .guarantee-master-buyer { padding: 24px 20px; gap: 24px; grid-template-columns: 1fr; }
  .gmb-title { font-size: 22px !important; }
  .gmb-body { font-size: 13px; }
  .gmb-contact { padding: 18px 20px; }

  /* FAQ */
  .faq { padding: 56px 20px; }
  .faq-grid { gap: 0; }
  .faq-item { padding: 18px 0; }
  .faq-q { font-size: 14px; margin-bottom: 8px; }
  .faq-a { font-size: 13px; }

  /* REGISTER CTA */
  .register { padding: 64px 20px; }
  .register-title { font-size: 32px !important; }
  .register-sub { font-size: 14px; margin-bottom: 28px; }
  .register-form { flex-direction: column; border: none; gap: 10px; }
  .register-form input { border: 1.5px solid var(--ink); border-radius: 2px; padding: 14px 16px; }
  .register-form button { border-radius: 2px; padding: 14px; text-align: center; }
  .register-notes { gap: 12px; margin-top: 16px; }
  .register-deadline { padding: 12px 16px; margin-top: 24px; }

  /* FOOTER */
  footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
  .footer-links { flex-wrap: wrap; gap: 12px; }
}`;

const BODY_CONTENT = `<!-- NAV -->
<nav>
  <div class="nav-logo">The <span>Franchise</span> Edge</div>
  <div class="nav-links">
<div class="nav-links">
    <a href="#how-it-works">How it works</a>
    <a href="#who-attends">Is this for me?</a>
    <a href="#guarantees">Our guarantees</a>
    <a href="#faq">FAQ</a>
    <a href="/list-your-brand">List your brand</a>
    <a href="/login">Buyer login</a>
    <a href="/franchisor/login">Franchisor login</a>
  </div>
  <a href="/register" class="nav-cta">Register free →</a> 
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <div class="hero-eyebrow reveal">Spring 2026 · Virtual · Free to attend</div>
    <h1 class="hero-title reveal">Find your<br>franchise.<br><em>On your terms.</em></h1>
    <p class="hero-sub reveal">
      You've been thinking about it for a while. The problem isn't finding franchise opportunities —
      it's finding them without getting <strong>sold to, pressured, or handed off to a broker</strong>
      who's working for someone else.
      <br><br>
      TFE Virtual Expo is the first franchise event designed for the buyer. Education first. Brands second. Guaranteed no pressure after.
    </p>
    <div class="hero-form reveal">
      <input type="email" placeholder="Your email address">
      <button type="button">Register free</button>
    </div>
    <p class="hero-form-note reveal">Free registration. No commitment. No broker. Takes 60 seconds.</p>
  </div>
  <div class="hero-right">
    <div class="hero-card">
      <div class="hero-card-header">
        <div class="hero-card-title">TFE Virtual Expo · Spring 2026</div>
        <div class="hero-card-date">100% Free to attend</div>
      </div>
      <div class="hero-card-body">
        <div class="hero-card-stat">
          <div class="hcs-num" id="brand-count">10+</div>
          <div class="hcs-label">Curated, vetted franchise brands — not 300 unreviewed listings</div>
        </div>
        <div class="hero-card-stat">
          <div class="hcs-num">$0</div>
          <div class="hcs-label">Cost to you. Free education, free discovery, free speed connect meetings.</div>
        </div>
        <div class="hero-card-stat">
          <div class="hcs-num">0</div>
          <div class="hcs-label">Brokers in the room. You own every conversation you have.</div>
        </div>
        <div class="hero-card-stat">
          <div class="hcs-num">$100</div>
          <div class="hcs-label">We send you $100 if any exhibitor pressures you after the event. Guaranteed.</div>
        </div>
      </div>
      <div class="hero-card-footer">
        <div class="hero-card-footer-text">Founding deadline: April 15, 2026 · Register now to guarantee your place</div>
      </div>
    </div>
  </div>
</section>

<!-- FEAR SECTION -->
<section class="fear" id="problem">
  <div class="fear-eyebrow">Why most franchise searches fail</div>
  <h2 class="fear-title">The system is designed for the<br>franchisor. <em>Not for you.</em></h2>
  <p class="fear-sub">Before you spend six months on portals and broker calls, here's what nobody in the franchise industry will tell you.</p>
  <div class="fear-grid">
    <div class="fear-card">
      <div class="fear-stat">5–15×</div>
      <div class="fear-card-title">Your portal lead was sold to a dozen other brands before you submitted it</div>
      <div class="fear-card-body">The moment you submit a form on Franchise Gator, Franchise Direct, or any major portal, that information is packaged and sold to 5–15 competing franchisors — plus brokers. You'll receive a flood of calls within hours. Most buyers shut down entirely. The industry average cost per sale via portals is $13,757 — someone is paying that cost, and it's baked into the fee you'll pay.</div>
    </div>
    <div class="fear-card">
      <div class="fear-stat">40–50%</div>
      <div class="fear-card-title">Brokers are paid by the franchisor — not by you — and that changes everything</div>
      <div class="fear-card-body">Franchise brokers earn 40–50% of the franchise fee when you sign. On a $45,000 franchise fee, that's $20–22,500. They call themselves consultants. They may genuinely try to help you. But they only get paid when you buy something in their portfolio, which contains maybe 200 of 4,000+ active franchise brands. The ones they recommend hardest are usually the ones paying the highest commission.</div>
    </div>
    <div class="fear-card">
      <div class="fear-stat">6–18 mo</div>
      <div class="fear-card-title">The average serious buyer spends 6–18 months in confusion before making a decision</div>
      <div class="fear-card-body">Not because franchising is complicated — it isn't, once you know how to read an FDD and evaluate an Item 19. The delay is caused by the information environment: too many options, too many salespeople, not enough neutral education. Most buyers who eventually purchase a franchise say they wish they'd had access to better information earlier. TFE's education sessions exist specifically to close that gap.</div>
    </div>
  </div>
</section>

<!-- HOW TFE IS DIFFERENT -->
<section class="diff" id="how-it-works">
  <div class="section-eyebrow">How TFE is different</div>
  <h2 class="section-title">Education first.<br>Brands second.<br><em>Pressure never.</em></h2>
  <p class="section-sub">Six structural decisions that make TFE Virtual Expo work differently — for the buyer, not just the franchisor.</p>

  <div class="diff-layout">
    <div class="diff-left">
      <div class="diff-item">
        <div class="diff-num">01</div>
        <div class="diff-text">
          <div class="diff-title">You learn before you shop</div>
          <div class="diff-body">TFE-hosted sessions on reading FDDs, understanding SBA financing, evaluating Item 19 earnings claims, and thinking about territory rights run before brand discovery opens. You arrive to the brand floor already knowing what questions to ask.</div>
        </div>
      </div>
      <div class="diff-item">
        <div class="diff-num">02</div>
        <div class="diff-text">
          <div class="diff-title">You set your filters. We match accordingly.</div>
          <div class="diff-body">Before the event, you complete a brief readiness profile — investment range, geography, business background, lifestyle goals. Our matching algorithm surfaces brands that fit your criteria. You don't browse 42 brands. You see the 8–12 that actually match you.</div>
        </div>
      </div>
      <div class="diff-item">
        <div class="diff-num">03</div>
        <div class="diff-text">
          <div class="diff-title">Every brand in the room was reviewed by us</div>
          <div class="diff-body">TFE reviews every exhibitor before they list. Item 19 presence, financial stability, support infrastructure, and franchisee satisfaction are all evaluated. You're not browsing a directory of whoever paid for a listing. You're choosing from a curated shortlist of brands we'd recommend ourselves.</div>
        </div>
      </div>
      <div class="diff-item">
        <div class="diff-num">04</div>
        <div class="diff-text">
          <div class="diff-title">Real conversations, not sales calls</div>
          <div class="diff-body">Speed connect meetings are 10-minute, AI-matched 1-on-1 video sessions with franchise development reps. Your notes auto-save. You control the follow-up. No rep can contact you more than twice after the event without your explicit invitation — and if they do, we remove them and send you $100.</div>
        </div>
      </div>
    </div>

    <div class="diff-right">
      <div class="diff-table">
        <div class="diff-table-header">
          <div class="dth label-h">What you want</div>
          <div class="dth old">Portals / Brokers</div>
          <div class="dth tfe">TFE Expo</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">My info stays private</div>
          <div class="dtc old-val">✗ Sold to 5–15 brands</div>
          <div class="dtc tfe-val">✓ You control it</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">Education before selling</div>
          <div class="dtc old-val">✗ None</div>
          <div class="dtc tfe-val">✓ Sessions first</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">Brands fit my criteria</div>
          <div class="dtc old-val">✗ Generic list</div>
          <div class="dtc tfe-val">✓ AI-matched</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">No post-event pressure</div>
          <div class="dtc old-val">✗ Guaranteed pressure</div>
          <div class="dtc tfe-val">✓ Guaranteed or $100</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">Curated, vetted brands</div>
          <div class="dtc old-val">✗ Paid listings</div>
          <div class="dtc tfe-val">✓ TFE-reviewed</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">Free to attend</div>
          <div class="dtc old-val">✓ Free (you're the product)</div>
          <div class="dtc tfe-val">✓ Free (you're the guest)</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">Advisor is on your side</div>
          <div class="dtc old-val">✗ Paid on commission</div>
          <div class="dtc tfe-val">✓ TFE serves both sides</div>
        </div>
        <div class="diff-table-row">
          <div class="dtc row-label">Real earnings data</div>
          <div class="dtc old-val">~ Sometimes</div>
          <div class="dtc tfe-val">✓ Item 19 required</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- JOURNEY -->
<section class="journey" id="journey">
  <div class="section-eyebrow">What your day looks like</div>
  <h2 class="section-title">From curious to<br><em>conversation-ready</em><br>in one event.</h2>
  <p class="section-sub">Here's exactly what happens when you register and attend TFE Virtual Expo — from the day you sign up through the day after the event closes.</p>
  <div class="journey-steps">
    <div class="journey-step">
      <div class="js-num">1</div>
      <div class="js-title">Register in 60 seconds</div>
      <div class="js-body">Free. Just your email, your rough investment range, and your geographic preference. No credit card, no commitment, no broker callback.</div>
      <span class="js-tag you">Takes 60 seconds</span>
    </div>
    <div class="journey-step">
      <div class="js-num">2</div>
      <div class="js-title">Complete your readiness profile</div>
      <div class="js-body">A 5-minute survey that helps us match you to the right brands — capital available, business background, lifestyle goals, timeline. The more you share, the better your matches. This is what unlocks the AI matchmaking.</div>
      <span class="js-tag you">5 minutes · unlocks matching</span>
    </div>
    <div class="journey-step">
      <div class="js-num">3</div>
      <div class="js-title">Attend education sessions</div>
      <div class="js-body">TFE-hosted sessions on FDD reading, Item 19 evaluation, SBA financing, and territory rights. These run before the brand floor opens. Free. Recorded if you can't attend live.</div>
      <span class="js-tag info">30–45 min each · on-demand available</span>
    </div>
    <div class="journey-step">
      <div class="js-num">4</div>
      <div class="js-title">Discover your matched brands</div>
      <div class="js-body">Your brand pavilion shows only the brands that fit your profile. Investment range, AUV, territory availability, and Item 19 are visible upfront. No clicking blind.</div>
      <span class="js-tag you">Your matches only</span>
    </div>
    <div class="journey-step">
      <div class="js-num">5</div>
      <div class="js-title">Attend brand pitch sessions</div>
      <div class="js-body">Each brand runs a 30-minute live stage: 20 minutes of pitch, 10 minutes of Q&A. Questions are upvoted by attendees — the most-asked ones get answered first. Recordings available post-event.</div>
      <span class="js-tag info">30 min per brand · Q&A included</span>
    </div>
    <div class="journey-step">
      <div class="js-num">6</div>
      <div class="js-title">Book speed connect meetings</div>
      <div class="js-body">10-minute 1-on-1 video sessions with franchise development reps from matched brands. Your notes auto-save. You control what happens next. No brand can follow up more than twice without your invitation.</div>
      <span class="js-tag you">You control all follow-up</span>
    </div>
  </div>
</section>

<!-- WHO IS THIS FOR -->
<section class="types" id="who-attends">
  <div class="section-eyebrow">Is this for you?</div>
  <h2 class="section-title">Five profiles that<br>get the most from<br><em>TFE Virtual Expo.</em></h2>
  <p class="section-sub">TFE is not for everyone. Here are the five buyer profiles that consistently get the most value from the event — and why.</p>
  <div class="types-grid">
    <div class="type-card">
      <div class="type-icon">💼</div>
      <div class="type-title">The corporate exit</div>
      <div class="type-body">A 38–55 year old mid-to-senior corporate professional — director, VP, operations manager — who has been thinking about owning something for 2–3 years. Often triggered by a layoff, a passed-over promotion, or a company merger. Methodical, research-heavy, serious.</div>
      <div class="type-range">Typical investment: $150K–$400K liquid</div>
    </div>
    <div class="type-card">
      <div class="type-icon">💰</div>
      <div class="type-title">The equity event recipient</div>
      <div class="type-body">Someone who recently sold a home, received a severance package, got a stock vesting payout, or received an inheritance. Has capital that isn't working yet and a finite window before lifestyle absorbs it. Search intent spikes in the 6–18 months after the event.</div>
      <div class="type-range">Typical investment: $100K–$350K available</div>
    </div>
    <div class="type-card">
      <div class="type-icon">🎖️</div>
      <div class="type-title">The military veteran in transition</div>
      <div class="type-body">Veterans buy franchises at 2× the rate of the general population. Disciplined, systems-oriented, and used to operating within proven structures. Eligible for SBA loans with reduced fees. Actively transitioning from structured service into civilian ownership.</div>
      <div class="type-range">Typical investment: $80K–$250K · SBA eligible</div>
    </div>
    <div class="type-card">
      <div class="type-icon">🏪</div>
      <div class="type-title">The existing business owner</div>
      <div class="type-body">Already running a business — an independent service company, a restaurant, a retail store — who's hit a ceiling and wants to add a proven system alongside or instead of what they have. Understands operations. Skeptical of franchising but curious enough to look seriously.</div>
      <div class="type-range">Typical investment: $150K–$500K</div>
    </div>
    <div class="type-card">
      <div class="type-icon">🏠</div>
      <div class="type-title">The second income builder</div>
      <div class="type-body">A partner in a dual-income household who wants to build something outside of a W-2 job. Often researching semi-absentee or owner-operated service brands. Frequently the one doing the research on behalf of both partners before a joint decision.</div>
      <div class="type-range">Typical investment: $100K–$250K</div>
    </div>
    <div class="type-card" style="background: var(--gold-bg); border-color: rgba(201,144,42,0.2);">
      <div class="type-icon" style="background: rgba(201,144,42,0.15);">✗</div>
      <div class="type-title">Who this is NOT for</div>
      <div class="type-body">Casual browsers with no clear investment capital. Anyone looking for a side hustle under $30K. People who haven't yet decided whether business ownership is right for them at all. (TFE's education sessions are free — start there if you're still in the exploration phase.)</div>
      <div class="type-range" style="color: var(--red);">Minimum investment range: $80K liquid</div>
    </div>
  </div>
</section>

<!-- GUARANTEES -->
<section class="guarantees" id="guarantees">
  <div class="section-eyebrow">Our guarantees to you</div>
  <h2 class="section-title">We guarantee your<br>time, your safety,<br>and your <em>preparation.</em></h2>
  <p class="section-sub">No other franchise expo or portal makes these commitments to buyers. We make them because we've spent 30 years executing franchise growth and we know what good looks like.</p>

  <div class="guarantee-cards-buyer">
    <div class="gb-card">
      <div class="gb-top">
        <div class="gb-name">The No Pressure Guarantee</div>
        <div class="gb-condition">If any TFE exhibitor contacts you more than twice after the event without your explicit invitation — report it to promise@thefranchiseedge.com. Simple as that.</div>
      </div>
      <div class="gb-remedy">
        <div class="gb-remedy-label">What we do</div>
        <div class="gb-remedy-text">We remove that brand from the platform and send you a $100 gift card within 48 hours. No questions asked. We enforce this because your trust is the entire product.</div>
      </div>
    </div>
    <div class="gb-card">
      <div class="gb-top">
        <div class="gb-name">The Time Guarantee</div>
        <div class="gb-condition">Attend any TFE education session, speed connect meeting, or brand pitch stage. If within 30 minutes you haven't learned one thing genuinely useful that you didn't know before — email us.</div>
      </div>
      <div class="gb-remedy">
        <div class="gb-remedy-label">What we do</div>
        <div class="gb-remedy-text">Free TFE Franchise Readiness Guide + a 30-minute 1-on-1 session with a TFE advisor at no cost. No catch. We'd rather earn your time than waste it.</div>
      </div>
    </div>
    <div class="gb-card">
      <div class="gb-top">
        <div class="gb-name">The Education Guarantee</div>
        <div class="gb-condition">Complete the pre-event Readiness Assessment and attend at least two education sessions. If you don't leave meaningfully more prepared to evaluate a franchise than when you arrived — tell us.</div>
      </div>
      <div class="gb-remedy">
        <div class="gb-remedy-label">What we do</div>
        <div class="gb-remedy-text">Free seat at the next TFE Virtual Expo + a personal 1-on-1 brand matching session with a TFE advisor at no cost. No forms. Just email promise@thefranchiseedge.com.</div>
      </div>
    </div>
  </div>

  <div class="guarantee-master-buyer">
    <div>
      <p class="gmb-title">"Attend. Learn something real. Talk to a brand that fits. Or we make it right — personally, every time."</p>
      <p class="gmb-body">Most franchise expos are designed for franchisors. TFE is designed for you too. If you leave without learning something that changes how you think about franchise ownership, without having at least one real conversation with a brand that fits your criteria, or if any exhibitor pressures you after the event — tell us. We'll make it right. That's a personal commitment from Paul Samson and Scott Anderson, co-founders of The Franchise Edge.</p>
    </div>
    <div class="gmb-contact">
      <div class="gmb-contact-label">Claim any guarantee</div>
      <div class="gmb-contact-email">promise@<br>thefranchiseedge.com</div>
      <div class="gmb-contact-note">Routes directly to Paul or Scott.<br>24-hour personal response.<br>Always.</div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq" id="faq">
  <div class="section-eyebrow">Questions buyers ask us</div>
  <h2 class="section-title">Everything you want<br>to know before you<br><em>register.</em></h2>
  <div class="faq-grid">
    <div class="faq-item">
      <div class="faq-q">Is it really free to attend?</div>
      <div class="faq-a">Yes. Registration, education sessions, brand discovery, and speed connect meetings are all free for buyers. Franchisors pay a listing fee to exhibit. You are a guest, not a product.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Will I get spammed after I register?</div>
      <div class="faq-a">No. TFE does not sell or share your registration data with exhibiting brands until you explicitly engage with them during the event. We will send you pre-event educational content and your readiness assessment — that's it until event day.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do I need to have capital ready right now?</div>
      <div class="faq-a">No. You need to have a realistic sense of what you could deploy — and be within 12 months of a decision. If you're 3+ years out, TFE's education sessions are still useful but the speed connect format works best when you're in active consideration.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How is this different from attending a franchise expo in person?</div>
      <div class="faq-a">Physical expos are geography-limited, expensive to attend, and typically have 200–400+ brands in a convention hall with no curation. TFE is virtual, curated brands, AI-matched to your profile, with education sessions before you ever step onto the brand floor. And no travel costs.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Will I be connected with a broker?</div>
      <div class="faq-a">No. There are no brokers in TFE Virtual Expo. Every conversation you have is directly with the franchisor's development team. TFE acts as the platform and moderator — we do not take commissions on franchise sales.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What's the investment range of brands at the event?</div>
      <div class="faq-a">TFE exhibitors range from approximately $80K to $650K total investment. The majority of brands fall in the $100K–$350K range. You'll see your matched brands only — if something falls outside your stated range, it won't appear in your pavilion.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What if I attend and don't find a brand I like?</div>
      <div class="faq-a">That's a completely legitimate outcome. The goal of TFE is to help you make the right decision — including the decision that none of the current exhibitors are the right fit. We'd rather you leave clear-headed than feel pressured into something that isn't right.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How do the education sessions work?</div>
      <div class="faq-a">TFE hosts 3–4 live sessions before the event opens: How to read an FDD, What Item 19 actually means, SBA financing for franchise buyers, and Territory rights and evaluation. All are recorded and available on-demand after. Attendance is free and unlocks your AI matchmaking profile.</div>
    </div>
  </div>
</section>

<!-- REGISTER CTA -->
<section class="register" id="register">
  <div class="register-eyebrow">Free registration · Spring 2026</div>
  <h2 class="register-title">You've been thinking<br>about it long enough.<br><em>Let's start.</em></h2>
  <p class="register-sub">Register in 60 seconds. No credit card. No broker callback. No commitment until you decide a brand is worth your time.</p>
  <div class="register-form">
    <input type="email" placeholder="Your email address">
    <button type="button">Register free →</button>
  </div>
  <div class="register-notes">
    <span class="register-note">Free to attend</span>
    <span class="register-note">No broker in the room</span>
    <span class="register-note">No pressure guarantee</span>
    <span class="register-note">Education sessions included</span>
  </div>
  <div class="register-deadline">
    <div class="register-deadline-text">Early registration closes April 15, 2026 · 847+ buyers already registered</div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">The <span>Franchise</span> Edge · Virtual Expo 2026</div>
  <div class="footer-links">
    <a href="#how-it-works">How it works</a>
    <a href="#who-attends">Who attends</a>
    <a href="#guarantees">Guarantees</a>
    <a href="#faq">FAQ</a>
    <a href="/login">Buyer login</a>
    <a href="/franchisor/login">Franchisor login</a>
    <a href="/admin/login">Admin</a>
  </div>
  <div class="footer-legal">© 2026 The Franchise Edge. All rights reserved.</div>
</footer>`;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Load brand count
    async function loadBrandCount() {
      try {
        const res = await fetch("/api/public/expo-info");
        if (res.ok) {
          const data = await res.json();
          const el = document.getElementById("brand-count");
          if (el) el.textContent = String(data.brands?.length || "10+");
        }
      } catch {}
    }
    loadBrandCount();

    // Make hero form click go to register
    const heroForm = document.querySelector(".hero-form");
    if (heroForm) {
      (heroForm as HTMLElement).style.cursor = "pointer";
      heroForm.addEventListener("click", () => router.push("/register"));
    }

    // Make register CTA form go to register
    const registerForm = document.querySelector(".register-form");
    if (registerForm) {
      (registerForm as HTMLElement).style.cursor = "pointer";
      registerForm.addEventListener("click", () => router.push("/register"));
    }

    // Make all register/form buttons go to register
    const buttons = document.querySelectorAll(".hero-form button, .register-form button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push("/register");
      });
    });

    // Make inputs redirect to register on focus
    const inputs = document.querySelectorAll(".hero-form input, .register-form input");
    inputs.forEach((input) => {
      (input as HTMLInputElement).readOnly = true;
      input.addEventListener("focus", () => router.push("/register"));
    });
  }, [router]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_CONTENT }} />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div dangerouslySetInnerHTML={{ __html: BODY_CONTENT }} />
    </>
  );
}
