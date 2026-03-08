import { useState, useRef, useCallback, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`;

const css = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sand:   #f5f0e8;
    --cream:  #faf7f2;
    --ink:    #1a1208;
    --brown:  #3d2b1f;
    --rust:   #c94f1e;
    --orange: #e8732a;
    --yellow: #f5c842;
    --teal:   #1d7a6e;
    --muted:  #8c7b6b;
    --border: #d9cebc;
    --white:  #ffffff;
    --ff: 'Playfair Display', Georgia, serif;
    --fm: 'Space Mono', monospace;
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
  }

  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body {
    background: var(--cream); color: var(--ink);
    font-family: var(--fm);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  body::after {
    content: ''; position: fixed; inset: 0; z-index: 9999; pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  input, select, button { -webkit-appearance: none; appearance: none; font-family: inherit; border-radius: 0; }
  input[type="number"] { -moz-appearance: textfield; }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }

  /* ─── HEADER ─── */
  .hdr {
    padding: calc(var(--safe-top) + 1rem) 1.5rem 1rem;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1.5px solid var(--border);
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    background: rgba(250,247,242,0.96);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  }
  .hdr-spacer { height: calc(var(--safe-top) + 3.8rem); }
  .logo { font-family: var(--ff); font-size: 1.4rem; font-weight: 900; letter-spacing: -0.03em; color: var(--ink); text-decoration: none; }
  .logo em { font-style: italic; color: var(--rust); }
  .hdr-right { display: flex; align-items: center; gap: 0.6rem; }
  .hdr-pill { font-family: var(--fm); font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; background: var(--yellow); color: var(--ink); padding: 0.22rem 0.6rem; font-weight: 700; border: 1.5px solid var(--ink); box-shadow: 2px 2px 0 var(--ink); }
  .hdr-back { font-family: var(--fm); font-size: 0.7rem; background: transparent; border: 1.5px solid var(--border); color: var(--muted); padding: 0.4rem 0.8rem; cursor: pointer; transition: all .15s; }
  .hdr-back:hover { border-color: var(--rust); color: var(--rust); }

  /* ─── MARQUEE ─── */
  .marquee-wrap {
    background: var(--ink); color: var(--yellow);
    padding: 0.65rem 0; overflow: hidden;
    border-bottom: 2px solid var(--ink);
  }
  .marquee-track { display: flex; white-space: nowrap; animation: marquee 24s linear infinite; }
  .marquee-track span { font-family: var(--ff); font-size: 0.9rem; font-style: italic; padding: 0 1.8rem; flex-shrink: 0; }
  .marquee-track .dot { color: var(--rust); font-style: normal; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ─── HERO AREA ─── */
  .hero-wrap { max-width: 700px; margin: 0 auto; padding: 3rem 1.5rem 0; position: relative; z-index: 1; }
  .hero-eyebrow {
    font-family: var(--fm); font-size: 0.6rem; color: var(--rust);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .hero-eyebrow::before { content: '✦'; font-size: 0.5rem; }
  .hero-h1 {
    font-family: var(--ff);
    font-size: clamp(2.8rem, 9vw, 5rem);
    font-weight: 900; line-height: 1.0; letter-spacing: -0.04em;
    margin-bottom: 1.2rem; color: var(--ink);
  }
  .hero-h1 .hop {
    display: inline-block;
    background: var(--ink); color: var(--yellow);
    padding: 0 0.1em; transform: rotate(-1.5deg);
  }
  .hero-h1 em { font-style: italic; color: var(--rust); }
  .hero-desc { font-size: 0.85rem; line-height: 1.8; color: var(--brown); max-width: 480px; margin-bottom: 2rem; }
  .hero-pills { display: grid; grid-template-columns: repeat(3, auto); gap: 0.4rem; margin-bottom: 2.5rem; justify-content: start; }
  .pill {
    font-family: var(--fm); font-size: 0.6rem; font-weight: 700;
    padding: 0.28rem 0.7rem; border: 1.5px solid var(--border); color: var(--brown); background: var(--white);
  }
  .pill.accent { background: var(--yellow); border-color: var(--ink); color: var(--ink); box-shadow: 2px 2px 0 var(--ink); }

  /* ─── FORM CARD ─── */
  .form-wrap { max-width: 700px; margin: 0 auto; padding: 0 1.5rem 3rem; }
  .fcard {
    background: var(--white); border: 1.5px solid var(--ink);
    box-shadow: 5px 6px 0 var(--ink); padding: 1.8rem;
    position: relative; margin-top: 0.5rem;
  }
  .fcard-label {
    font-family: var(--fm); font-size: 0.55rem; color: var(--muted);
    letter-spacing: 0.12em; text-transform: uppercase;
    position: absolute; top: -0.52rem; left: 1.1rem;
    background: var(--white); padding: 0 0.4rem;
  }
  .fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem; }
  .fg { display: flex; flex-direction: column; gap: 0.3rem; }
  .fg.full { grid-column: 1/-1; }
  .fg label { font-family: var(--fm); font-size: 0.57rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
  .fg input, .fg select {
    background: var(--sand); border: 1.5px solid var(--border);
    padding: 0.75rem 0.9rem; color: var(--ink);
    font-family: var(--ff); font-size: 0.95rem;
    outline: none; width: 100%; min-height: 46px;
    transition: border-color .15s, box-shadow .15s;
  }
  .fg input:focus, .fg select:focus { border-color: var(--rust); box-shadow: 2px 2px 0 var(--rust); }
  .fg input::placeholder { color: var(--muted); font-style: italic; }
  .fg select { cursor: pointer; }
  .fg select option { background: var(--sand); }
  .fg-hint { font-family: var(--fm); font-size: 0.56rem; color: var(--muted); line-height: 1.5; margin-top: 0.15rem; opacity: 0.75; }
  .fdivider { border: none; border-top: 1.5px solid var(--border); margin: 1rem 0; }

  /* stops */
  .stops-label { font-family: var(--fm); font-size: 0.57rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .stops-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .schip {
    font-family: var(--fm); font-size: 0.78rem;
    padding: 0.4rem 0.9rem; border: 1.5px solid var(--border);
    background: var(--sand); color: var(--muted);
    cursor: pointer; transition: all .12s; user-select: none;
    min-height: 38px; display: flex; align-items: center;
    -webkit-tap-highlight-color: transparent;
  }
  .schip:active { transform: translate(1px,1px); }
  .schip.on { background: var(--rust); border-color: var(--ink); color: #fff; font-weight: 700; box-shadow: 2px 2px 0 var(--ink); }
  .custom-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center; }
  .custom-row input { background: var(--sand); border: 1.5px solid var(--border); padding: 0.4rem 0.7rem; color: var(--ink); font-family: var(--fm); font-size: 0.85rem; outline: none; width: 70px; min-height: 38px; }
  .stops-hint { font-family: var(--fm); font-size: 0.56rem; color: var(--muted); margin-top: 0.4rem; font-style: italic; opacity: 0.75; }

  /* generate button */
  .btn-gen {
    width: 100%; background: var(--ink); color: var(--sand);
    border: 1.5px solid var(--ink); padding: 1rem 1.5rem;
    font-family: var(--ff); font-size: 1.05rem; font-weight: 700;
    cursor: pointer; margin-top: 0.8rem;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    min-height: 54px; transition: all .15s; position: relative;
    -webkit-tap-highlight-color: transparent; letter-spacing: -0.01em;
  }
  .btn-gen::after { content: ''; position: absolute; inset: 4px -4px -4px 4px; background: var(--rust); z-index: -1; transition: all .15s; }
  .btn-gen:hover::after { inset: 5px -5px -5px 5px; }
  .btn-gen:active { transform: translate(3px,3px); }
  .btn-gen:active::after { inset: 1px -1px -1px 1px; }
  .btn-gen:disabled { opacity: 0.38; cursor: not-allowed; transform: none; }
  .btn-gen:disabled::after { display: none; }

  /* ─── LOADING ─── */
  .loading-wrap { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 3rem; display:flex; align-items:center; justify-content:center; min-height: 60vh; }
  .loading-card { background: var(--white); border: 1.5px solid var(--ink); box-shadow: 5px 6px 0 var(--ink); padding: 2.8rem 2rem; text-align: center; width: 100%; max-width: 420px; }
  .spinner { width: 36px; height: 36px; border: 2.5px solid var(--border); border-top-color: var(--rust); border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 1.4rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title { font-family: var(--ff); font-size: 1.2rem; font-weight: 700; color: var(--ink); margin-bottom: 0.3rem; }
  .loading-sub { font-family: var(--fm); font-size: 0.65rem; color: var(--muted); font-style: italic; margin-bottom: 1.4rem; }
  .loading-steps { display: flex; gap: 0; border: 1.5px solid var(--border); overflow: hidden; margin-bottom: 0; }
  .lstep { flex: 1; padding: 0.55rem 0.2rem; font-family: var(--fm); font-size: 0.5rem; color: var(--muted); text-align: center; border-right: 1px solid var(--border); transition: all .4s; }
  .lstep:last-child { border-right: none; }
  .lstep-icon { display: block; font-size: 0.9rem; margin-bottom: 0.2rem; }
  .lstep.done { background: var(--teal); color: white; font-weight: 700; border-color: var(--teal); }
  .lstep.active { background: var(--yellow); color: var(--ink); font-weight: 700; animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.65} }
  .loading-note { font-family: var(--fm); font-size: 0.56rem; color: var(--border); margin-top: 1rem; }

  /* ─── RESULT ─── */
  .result-wrap { max-width: 800px; margin: 0 auto; padding: 0 1.5rem 4rem; }

  .trip-header {
    padding: 2rem 0 1.2rem;
    border-bottom: 1.5px solid var(--border);
    margin-bottom: 1.2rem;
  }
  .trip-eyebrow { font-family: var(--fm); font-size: 0.58rem; color: var(--rust); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
  .trip-eyebrow::before { content: '✦'; font-size: 0.45rem; }
  .trip-title { font-family: var(--ff); font-size: clamp(1.8rem, 5vw, 2.6rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 0.8rem; }
  .trip-title em { font-style: italic; color: var(--rust); }
  .trip-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .trip-chip { font-family: var(--fm); font-size: 0.58rem; background: var(--sand); border: 1.5px solid var(--border); color: var(--muted); padding: 0.22rem 0.6rem; }

  /* budget bar */
  .budget-bar {
    background: var(--ink); color: var(--sand);
    border: 1.5px solid var(--ink); box-shadow: 4px 5px 0 var(--rust);
    padding: 1.1rem 1.4rem; margin-bottom: 0.8rem;
    display: grid; grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: center; gap: 0.5rem;
  }
  .bitem { }
  .blabel { font-family: var(--fm); font-size: 0.52rem; color: rgba(245,240,232,.45); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.2rem; }
  .bvalue { font-family: var(--ff); font-size: 1.3rem; font-weight: 900; letter-spacing: -0.03em; color: var(--sand); }
  .bvalue.y { color: var(--yellow); }
  .bvalue.t { color: #7fd8c8; }
  .bdivider { width: 1px; height: 36px; background: rgba(245,240,232,.12); }

  /* regen bar */
  .regen-bar {
    background: #fffbf0; border: 1.5px solid var(--yellow);
    border-left: 3px solid var(--orange);
    padding: 0.85rem 1rem; margin-bottom: 1rem;
    display: flex; align-items: center; justify-content: space-between; gap: 0.8rem; flex-wrap: wrap;
  }
  .regen-info { font-family: var(--fm); font-size: 0.63rem; color: var(--brown); line-height: 1.55; flex: 1; }
  .regen-info strong { color: var(--teal); }
  .btn-regen {
    background: var(--yellow); border: 1.5px solid var(--ink); color: var(--ink);
    padding: 0.5rem 1rem; font-family: var(--fm); font-size: 0.7rem;
    cursor: pointer; box-shadow: 2px 2px 0 var(--ink); font-weight: 700;
    white-space: nowrap; min-height: 36px; transition: all .12s;
    -webkit-tap-highlight-color: transparent;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .btn-regen:active { transform: translate(2px,2px); box-shadow: none; }
  .btn-regen:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: 2px 2px 0 var(--ink); }
  .btn-regen-spinner { width: 12px; height: 12px; border: 2px solid rgba(26,18,8,.25); border-top-color: var(--ink); border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
  .day-card.regenerating { opacity: 0.45; pointer-events: none; transition: opacity .2s; }
  .day-card.regenerating .day-head { background: var(--sand); }

  /* ─── DAY CARDS ─── */
  .day-card {
    background: var(--white); border: 1.5px solid var(--border);
    margin-bottom: 0.5rem; overflow: hidden;
    animation: fadeUp .35s ease both;
    transition: border-color .15s, box-shadow .15s;
  }
  .day-card:hover { border-color: var(--muted); }
  .day-card.locked { border-color: var(--teal); box-shadow: 3px 4px 0 var(--teal); }
  .day-card.drag-over { border-color: var(--rust); border-style: dashed; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .day-head {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.9rem 1rem; cursor: pointer;
    user-select: none; -webkit-user-select: none;
    min-height: 54px; transition: background .1s;
    -webkit-tap-highlight-color: transparent;
  }
  .day-head:active { background: var(--sand); }
  .day-card.open .day-head { border-bottom: 1.5px solid var(--border); background: var(--sand); }

  .drag-h { color: var(--muted); opacity: 0.35; font-size: 0.85rem; cursor: grab; flex-shrink: 0; touch-action: none; min-width: 22px; text-align: center; -webkit-tap-highlight-color: transparent; }
  .drag-h:active { opacity: 1; cursor: grabbing; }

  .day-num {
    font-family: var(--fm); font-size: 0.55rem; letter-spacing: 0.06em;
    color: var(--rust); background: rgba(201,79,30,.08);
    border: 1px solid rgba(201,79,30,.2);
    padding: 0.15rem 0.45rem; flex-shrink: 0; white-space: nowrap;
  }
  .day-card.locked .day-num { color: var(--teal); background: rgba(29,122,110,.08); border-color: rgba(29,122,110,.25); }

  .day-place {
    font-family: var(--fm); font-size: 0.62rem; color: var(--muted);
    flex-shrink: 0; white-space: nowrap; display: none;
  }
  @media (min-width: 480px) { .day-place { display: block; } }

  .day-name { font-family: var(--ff); font-weight: 700; font-size: 0.9rem; letter-spacing: -0.02em; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .day-cost { font-family: var(--fm); font-size: 0.68rem; color: var(--orange); flex-shrink: 0; white-space: nowrap; font-weight: 700; }

  .btn-lock {
    background: none; border: 1px solid var(--border);
    padding: 0.18rem 0.4rem; font-size: 0.58rem; cursor: pointer;
    transition: all .12s; color: var(--muted); font-family: var(--fm);
    white-space: nowrap; flex-shrink: 0; min-height: 28px;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-lock.on { background: rgba(29,122,110,.08); border-color: var(--teal); color: var(--teal); }

  .chev { color: var(--muted); font-size: 0.5rem; transition: transform .2s; flex-shrink: 0; }
  .day-card.open .chev { transform: rotate(180deg); }

  /* day body */
  .day-body { padding: 1.1rem; }
  .dsec { margin-bottom: 1rem; }
  .dsec:last-child { margin-bottom: 0; }
  .dsec-title { font-family: var(--fm); font-size: 0.52rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.35rem; }
  .dsec-body { font-size: 0.88rem; line-height: 1.72; color: var(--brown); }
  .dsec-price { font-family: var(--fm); font-size: 0.65rem; font-weight: 700; color: var(--rust); margin-top: 0.25rem; }

  .transport-block {
    background: #fffbf0; border: 1.5px solid rgba(245,200,66,.5);
    border-left: 3px solid var(--yellow);
    padding: 0.75rem 0.9rem; margin-bottom: 1rem;
  }
  .transport-block .dsec-title { color: var(--orange); }
  .transport-block .dsec-body { color: var(--ink); }

  /* budget on track */
  .on-track {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-family: var(--fm); font-size: 0.58rem; color: var(--teal); font-weight: 700;
    background: rgba(29,122,110,.06); border: 1px solid rgba(29,122,110,.2);
    padding: 0.2rem 0.5rem; margin-top: 0.4rem;
  }

  /* ─── TIPS ─── */
  .tips-card {
    background: var(--sand); border: 1.5px solid var(--border);
    box-shadow: 3px 4px 0 var(--border);
    padding: 1.2rem 1.4rem; margin-top: 1rem;
  }
  .tips-title { font-family: var(--fm); font-size: 0.58rem; color: var(--rust); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.8rem; }
  .tip { display: flex; gap: 0.6rem; margin-bottom: 0.6rem; font-size: 0.82rem; line-height: 1.65; color: var(--brown); }
  .tip-arr { color: var(--rust); flex-shrink: 0; font-family: var(--fm); font-size: 0.78rem; }

  /* ─── HOW IT WORKS STRIP ─── */
  .hiw-strip { padding: 0 1.5rem 0; max-width: 860px; margin: 0 auto 2rem; }
  .hiw-strip-inner { background: var(--sand); border: 1.5px solid var(--border); padding: 1.2rem 1.5rem; }
  .hiw-strip-title { font-family: var(--fm); font-size: 0.5rem; color: var(--rust); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.35rem; }
  .hiw-strip-title::before { content: '◆'; font-size: 0.38rem; }
  .hiw-strip-steps { display: flex; position: relative; max-width: 700px; margin: 0 auto; }
  .hiw-strip-steps::before { content: ''; position: absolute; top: 0.68rem; left: 0.7rem; right: 0.7rem; height: 1px; background: var(--border); z-index: 0; }
  .hiw-strip-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.45rem; position: relative; z-index: 1; }
  .hiw-strip-n { width: 1.4rem; height: 1.4rem; background: var(--rust); color: white; font-family: var(--fm); font-size: 0.55rem; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid var(--sand); }
  .hiw-strip-step strong { font-family: var(--ff); font-size: 0.72rem; color: var(--ink); display: block; line-height: 1.2; }
  .hiw-strip-step span { font-family: var(--fm); font-size: 0.46rem; color: var(--muted); line-height: 1.5; }

  /* ─── TRAVELING AS / PACE / STYLE ─── */
  .new-badge { font-family: var(--fm); font-size: 0.42rem; background: var(--yellow); color: var(--ink); padding: 0.15rem 0.35rem; font-weight: 700; border: 1px solid var(--ink); vertical-align: middle; margin-left: 0.3rem; }
  .who-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.3rem; }
  .who-chip { font-family: var(--fm); font-size: 0.62rem; padding: 0.65rem 0.5rem; border: 1.5px solid var(--border); background: var(--sand); color: var(--muted); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; text-align: center; user-select: none; transition: all .12s; -webkit-tap-highlight-color: transparent; }
  .who-chip .wico { font-size: 1.2rem; }
  .who-chip.on { background: var(--teal); border-color: var(--ink); color: #fff; font-weight: 700; box-shadow: 2px 2px 0 var(--ink); }
  .pace-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.3rem; }
  .pace-chip { font-family: var(--fm); font-size: 0.58rem; padding: 0.55rem 0.4rem; border: 1.5px solid var(--border); background: var(--sand); color: var(--muted); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-align: center; user-select: none; transition: all .12s; -webkit-tap-highlight-color: transparent; }
  .pace-chip .pico { font-size: 1rem; }
  .pace-chip .psub { font-size: 0.46rem; opacity: 0.7; }
  .pace-chip.on { background: var(--yellow); border-color: var(--ink); color: var(--ink); font-weight: 700; box-shadow: 2px 2px 0 var(--ink); }
  .style-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 0.3rem; }
  .style-chip { font-family: var(--fm); font-size: 0.6rem; padding: 0.5rem 0.65rem; border: 1.5px solid var(--border); background: var(--sand); color: var(--muted); cursor: pointer; display: flex; align-items: center; gap: 0.4rem; user-select: none; transition: all .12s; -webkit-tap-highlight-color: transparent; }
  .style-chip.on { background: var(--rust); border-color: var(--ink); color: #fff; font-weight: 700; box-shadow: 2px 2px 0 var(--ink); }

  /* ─── HOW IT WORKS ─── */
  .how-section { max-width: 700px; margin: 0 auto; padding: 0 1.5rem 3rem; }
  .sec-eyebrow { font-family: var(--fm); font-size: 0.58rem; color: var(--rust); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.7rem; display: flex; align-items: center; gap: 0.5rem; }
  .sec-eyebrow::before { content: ''; width: 16px; height: 1.5px; background: var(--rust); }
  .sec-title { font-family: var(--ff); font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.6rem; }
  .sec-sub { font-size: 0.82rem; color: var(--muted); line-height: 1.8; margin-bottom: 2rem; }

  .steps-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1.5px solid var(--ink); overflow: hidden; }
  .step { padding: 1.5rem; border-right: 1.5px solid var(--ink); border-bottom: 1.5px solid var(--ink); background: var(--cream); transition: background .2s; }
  .step:nth-child(2n) { border-right: none; }
  .step:nth-child(3), .step:nth-child(4) { border-bottom: none; }
  .step:hover { background: var(--sand); }
  .step-num { font-family: var(--ff); font-size: 2rem; font-weight: 900; color: var(--border); line-height: 1; margin-bottom: 0.7rem; }
  .step-ico { font-size: 1.3rem; margin-bottom: 0.5rem; }
  .step h3 { font-family: var(--ff); font-size: 0.92rem; font-weight: 700; margin-bottom: 0.3rem; color: var(--ink); }
  .step p { font-size: 0.72rem; color: var(--muted); line-height: 1.65; }

  /* ─── AFFILIATES ─── */
  .aff-section { max-width: 700px; margin: 0 auto; padding: 0 1.5rem 3rem; }
  .aff-title { font-family: var(--fm); font-size: 0.58rem; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem; }
  .aff-title::after { content: ''; flex: 1; height: 1.5px; background: var(--border); }
  .aff-cat-label { font-family: var(--fm); font-size: 0.54rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem; margin-top: 0.2rem; }
  .aff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.9rem; }
  @media (min-width: 560px) { .aff-grid { grid-template-columns: 1fr 1fr 1fr; } }
  .aff-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-left: 3px solid var(--ac, var(--rust));
    padding: 0.9rem 1rem; text-decoration: none;
    display: flex; flex-direction: column; gap: 0.3rem;
    transition: box-shadow .12s, border-color .12s;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .aff-card:hover { border-color: var(--ac, var(--rust)); box-shadow: 3px 3px 0 var(--ac, var(--rust)); }
  .aff-card:active { transform: translate(1px,1px); box-shadow: none; }
  .aff-ico { font-size: 1.1rem; }
  .aff-name { font-family: var(--ff); font-weight: 700; font-size: 0.85rem; color: var(--ink); }
  .aff-desc { font-family: var(--fm); font-size: 0.6rem; color: var(--muted); line-height: 1.4; }
  .aff-cta { font-family: var(--fm); font-size: 0.6rem; font-weight: 700; margin-top: 0.1rem; }
  .aff-note { font-family: var(--fm); font-size: 0.54rem; color: var(--muted); opacity: 0.5; text-align: center; margin-top: 0.4rem; }

  /* ─── DISCLAIMER ─── */
  .disclaimer {
    background: #fffbf0; border: 1.5px solid rgba(245,200,66,.4);
    border-left: 3px solid var(--yellow); padding: 0.9rem 1rem; margin-top: 1rem;
  }
  .disclaimer p { font-family: var(--fm); font-size: 0.62rem; color: var(--brown); line-height: 1.65; }
  .disclaimer strong { color: var(--orange); }

  /* ─── ERROR ─── */
  .err-card {
    background: rgba(201,79,30,.06); border: 1.5px solid rgba(201,79,30,.3);
    border-left: 3px solid var(--rust); padding: 0.9rem 1rem; margin-top: 0.8rem;
    font-family: var(--fm); font-size: 0.75rem; color: var(--rust);
  }

  /* ─── FOOTER ─── */
  .footer {
    background: var(--ink);
    padding: 1.1rem 1.5rem calc(1rem + env(safe-area-inset-bottom,0px));
    border-top: 2px solid var(--rust);
    font-family: var(--fm); font-size: 0.58rem; letter-spacing: 0.05em;
  }
  .footer-row1 {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.6rem; padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(250,247,242,.07);
  }
  .footer-logo { font-family: var(--ff); font-size: 0.95rem; font-weight: 700; color: var(--sand); }
  .footer-logo em { color: var(--rust); font-style: italic; }
  .footer-email { color: rgba(250,247,242,.55); text-decoration: none; transition: color .15s; }
  .footer-email:hover { color: var(--yellow); }
  .footer-row2 {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem;
  }
  .footer-tagline { color: rgba(250,247,242,.35); font-style: italic; font-size: 0.55rem; }
  .footer-links { display: flex; gap: 1rem; align-items: center; }
  .footer-links a { color: rgba(250,247,242,.4); text-decoration: none; transition: color .15s; }
  .footer-links a:hover { color: var(--yellow); }
  .footer-links span { color: rgba(250,247,242,.2); }

  /* ─── RESPONSIVE ─── */
  @media (min-width: 600px) {
    .hdr { padding: calc(var(--safe-top) + 1.3rem) 2.5rem 1.3rem; }
    .hero-wrap { padding: 4rem 2.5rem 0; }
    .form-wrap { padding: 0 2.5rem 3.5rem; }
    .result-wrap { padding: 0 2.5rem 4.5rem; }
    .how-section { padding: 0 2.5rem 3.5rem; }
    .aff-section { padding: 0 2.5rem 3.5rem; }
    .fcard { padding: 2.2rem; }
    .day-head { padding: 1rem 1.2rem; min-height: auto; }
    .day-name { white-space: normal; }
  }
`;

const STOP_PRESETS = [1, 2, 3, 4, 5];

const buildAffiliates = (destination, from) => {
  const dest = encodeURIComponent(destination || "");
  const origin = encodeURIComponent(from || "");
  return [
    { cat: "✈️ Flights", items: [
      { ico:"✈️", name:"Skyscanner", desc:"Cheapest flights, pre-filled with your route", cta:"Search flights →", color:"#00a1e4", url:`https://www.skyscanner.net/transport/flights/${origin}/${dest}/` },
      { ico:"🛫", name:"Kayak", desc:"Compare 100s of travel sites at once", cta:"Compare prices →", color:"#ff690f", url:`https://www.kayak.com/flights/${origin}-${dest}` },
    ]},
    { cat: "🏨 Sleep", items: [
      { ico:"🛏️", name:"Hostelworld", desc:"Best-rated hostels for backpackers worldwide", cta:"Find hostels →", color:"#ff6600", url:`https://www.hostelworld.com/search?search_keywords=${dest}` },
      { ico:"🏠", name:"Booking.com", desc:"Guesthouses, budget hotels & more", cta:"Browse stays →", color:"#003580", url:`https://www.booking.com/search.html?ss=${dest}` },
    ]},
    { cat: "🎒 Do", items: [
      { ico:"🗺️", name:"GetYourGuide", desc:"Local tours, day trips & experiences", cta:"Explore →", color:"#ff5533", url:`https://www.getyourguide.com/s/?q=${dest}` },
      { ico:"🎡", name:"Viator", desc:"Skip-the-line tickets & activities", cta:"Book →", color:"#1a6bff", url:`https://www.viator.com/searchResults/all?text=${dest}` },
    ]},
    { cat: "🛡️ Travel Essentials", items: [
      { ico:"🌍", name:"SafetyWing", desc:"Travel insurance built for nomads & backpackers", cta:"Get covered →", color:"#1d7a6e", url:"https://safetywing.com/nomad-insurance" },
      { ico:"🏥", name:"World Nomads", desc:"Adventure travel insurance worldwide", cta:"Get a quote →", color:"#00b4d8", url:"https://www.worldnomads.com" },
      { ico:"📱", name:"Airalo eSIM", desc:"Local data in 200+ countries — no roaming", cta:"Get eSIM →", color:"#7c3aed", url:"https://www.airalo.com" },
      { ico:"🔒", name:"NordVPN", desc:"Stay secure on hostel & café WiFi", cta:"Get NordVPN →", color:"#4687ff", url:"https://nordvpn.com" },
    ]},
  ];
};

function AffiliateSection({ destination, from }) {
  const groups = buildAffiliates(destination, from);
  return (
    <div>
      <div className="aff-title">🧳 Book everything for your trip</div>
      {groups.map((g, gi) => (
        <div key={gi}>
          <div className="aff-cat-label">{g.cat}</div>
          <div className="aff-grid">
            {g.items.map((item, ii) => (
              <a key={ii} className="aff-card" href={item.url} target="_blank" rel="noopener noreferrer" style={{ "--ac": item.color }}>
                <span className="aff-ico">{item.ico}</span>
                <span className="aff-name">{item.name}</span>
                <span className="aff-desc">{item.desc}</span>
                <span className="aff-cta" style={{ color: item.color }}>{item.cta}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
      <div className="aff-note">HoppAway may earn a commission on bookings — at no extra cost to you.</div>
    </div>
  );
}

function parseItinerary(text) {
  let clean = text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
  const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
  if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);
  try { return JSON.parse(clean); } catch (_) {}
  try { return JSON.parse(clean.replace(/,\s*([}\]])/g, "$1")); } catch (_) {}
  return null;
}

const legalCss = `
  .legal-wrap { max-width: 680px; margin: 0 auto; padding: 2rem 1.5rem 4rem; font-family: var(--fm); color: var(--ink); }
  .legal-back { display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--fm); font-size: 0.65rem; color: var(--muted); text-decoration: none; border: 1.5px solid var(--border); padding: 0.4rem 0.8rem; margin-bottom: 2rem; background: var(--sand); cursor: pointer; }
  .legal-back:hover { background: var(--ink); color: var(--sand); }
  .legal-eyebrow { font-size: 0.55rem; color: var(--rust); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.6rem; }
  .legal-title { font-family: var(--ff); font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.4rem; }
  .legal-date { font-size: 0.6rem; color: var(--muted); margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1.5px solid var(--border); }
  .legal-h2 { font-family: var(--ff); font-size: 1.1rem; font-weight: 700; margin: 2rem 0 0.6rem; color: var(--ink); }
  .legal-p { font-size: 0.78rem; line-height: 1.9; color: var(--brown); margin-bottom: 0.8rem; }
  .legal-ul { padding-left: 1.2rem; margin-bottom: 0.8rem; }
  .legal-ul li { font-size: 0.78rem; line-height: 1.9; color: var(--brown); margin-bottom: 0.3rem; }
  .legal-contact { background: var(--sand); border: 1.5px solid var(--border); border-left: 3px solid var(--rust); padding: 1rem 1.2rem; margin-top: 2rem; }
  .legal-contact p { font-size: 0.75rem; line-height: 1.8; color: var(--brown); }
  .legal-contact a { color: var(--rust); }
`;

function PrivacyPage({ onBack }) {
  useEffect(() => { window.scrollTo(0,0); }, []);
  return (
    <>
      <style>{css}{legalCss}</style>
      <header className="hdr">
        <div className="logo" onClick={onBack} style={{cursor:"pointer"}}>Hopp<em>Away</em></div>
      </header>
      <div className="hdr-spacer" />
      <div className="legal-wrap">
        <button className="legal-back" onClick={onBack}>← Back to app</button>
        <div className="legal-eyebrow">Legal</div>
        <h1 className="legal-title">Privacy Policy</h1>
        <div className="legal-date">Last updated: March 2026</div>

        <h2 className="legal-h2">1. Who we are</h2>
        <p className="legal-p">HoppAway (hoppaway.app) is an AI-powered travel planning tool built and operated by a solo founder. We are not a registered company at this time. For any privacy-related questions, contact us at hello@hoppaway.app.</p>

        <h2 className="legal-h2">2. What data we collect</h2>
        <p className="legal-p">We collect only the minimum data necessary to provide the service:</p>
        <ul className="legal-ul">
          <li>Trip inputs you enter in the form (destination, days, budget, preferences) — processed in real time to generate your itinerary and not stored on our servers.</li>
          <li>Anonymous usage data (pages visited, interactions) via analytics tools, if enabled. This data is aggregated and never linked to an individual.</li>
          <li>Cookies strictly necessary for the functioning of the site.</li>
        </ul>
        <p className="legal-p">We do not collect your name, email address, or any account information unless you voluntarily contact us.</p>

        <h2 className="legal-h2">3. How we use your data</h2>
        <ul className="legal-ul">
          <li>To generate your AI trip itinerary in response to your inputs.</li>
          <li>To understand how the product is used and improve it over time.</li>
          <li>To respond to messages sent to hello@hoppaway.app.</li>
        </ul>
        <p className="legal-p">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

        <h2 className="legal-h2">4. Third-party services</h2>
        <p className="legal-p">HoppAway uses the following third-party services which may process data on our behalf:</p>
        <ul className="legal-ul">
          <li><strong>Anthropic API</strong> — processes your trip inputs to generate itineraries. Anthropic's privacy policy applies to this processing.</li>
          <li><strong>Vercel</strong> — hosts the application and may log standard server access data (IP address, browser type, timestamp).</li>
          <li><strong>Affiliate partners</strong> (Skyscanner, Hostelworld, Booking.com, GetYourGuide, etc.) — when you click a booking link, you are redirected to their sites under their own privacy policies.</li>
        </ul>

        <h2 className="legal-h2">5. Cookies</h2>
        <p className="legal-p">We use only technically necessary cookies required for the site to function. We do not use tracking or advertising cookies. If we introduce analytics in the future, we will update this policy and request consent where required by law.</p>

        <h2 className="legal-h2">6. Data retention</h2>
        <p className="legal-p">Trip inputs are not stored after your session ends. Server logs retained by Vercel follow their standard retention policies. If you contact us by email, we retain that correspondence for as long as necessary to resolve your request.</p>

        <h2 className="legal-h2">7. Your rights</h2>
        <p className="legal-p">Depending on your location, you may have rights including access to, correction of, or deletion of any personal data we hold about you. Since we collect minimal data, in most cases there is nothing to delete. To exercise any rights, contact us at hello@hoppaway.app.</p>

        <h2 className="legal-h2">8. International users</h2>
        <p className="legal-p">HoppAway is accessible internationally. If you are located in the European Economic Area, the UK, or other regions with data protection laws, we process your data in accordance with applicable requirements. Our legal basis for processing is legitimate interest in providing the service you requested.</p>

        <h2 className="legal-h2">9. Children</h2>
        <p className="legal-p">HoppAway is not directed at children under 16. We do not knowingly collect data from minors.</p>

        <h2 className="legal-h2">10. Changes to this policy</h2>
        <p className="legal-p">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the updated policy.</p>

        <h2 className="legal-h2">11. Contact</h2>
        <div className="legal-contact">
          <p>For any privacy-related questions or requests:<br/>
          📧 <a href="mailto:hello@hoppaway.app">hello@hoppaway.app</a><br/>
          We aim to respond within 5 business days.</p>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-row1">
          <div className="footer-logo">Hopp<em>Away</em></div>
          <a href="mailto:hello@hoppaway.app" className="footer-email">hello@hoppaway.app</a>
        </div>
        <div className="footer-row2">
          <span className="footer-tagline">built with ♥ for backpackers</span>
          <div className="footer-links">
            <span onClick={onBack} style={{cursor:"pointer"}}>← App</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function TermsPage({ onBack }) {
  useEffect(() => { window.scrollTo(0,0); }, []);
  return (
    <>
      <style>{css}{legalCss}</style>
      <header className="hdr">
        <div className="logo" onClick={onBack} style={{cursor:"pointer"}}>Hopp<em>Away</em></div>
      </header>
      <div className="hdr-spacer" />
      <div className="legal-wrap">
        <button className="legal-back" onClick={onBack}>← Back to app</button>
        <div className="legal-eyebrow">Legal</div>
        <h1 className="legal-title">Terms of Use</h1>
        <div className="legal-date">Last updated: March 2026</div>

        <h2 className="legal-h2">1. Acceptance of terms</h2>
        <p className="legal-p">By accessing or using HoppAway (hoppaway.app), you agree to be bound by these Terms of Use. If you do not agree, please do not use the service.</p>

        <h2 className="legal-h2">2. Description of service</h2>
        <p className="legal-p">HoppAway is a free AI-powered travel planning tool that generates day-by-day trip itineraries based on user inputs including destination, duration, and budget. The service is provided as-is for informational and inspirational purposes only.</p>

        <h2 className="legal-h2">3. AI-generated content disclaimer</h2>
        <p className="legal-p">All itineraries, recommendations, price estimates, hostel names, transport details, and other content generated by HoppAway are produced by an artificial intelligence model. This content:</p>
        <ul className="legal-ul">
          <li>May not reflect current prices, availability, or operating conditions.</li>
          <li>May contain inaccuracies, outdated information, or hallucinated details.</li>
          <li>Is intended as inspiration and a starting point, not as a definitive travel guide.</li>
          <li>Should always be independently verified before making any booking or travel decision.</li>
        </ul>
        <p className="legal-p">HoppAway is not responsible for any loss, expense, or inconvenience arising from reliance on AI-generated content.</p>

        <h2 className="legal-h2">4. Affiliate links</h2>
        <p className="legal-p">HoppAway includes links to third-party booking platforms (including but not limited to Skyscanner, Hostelworld, Booking.com, GetYourGuide, SafetyWing, and Airalo). These are affiliate links — HoppAway may earn a commission if you make a purchase through them, at no additional cost to you. We are not responsible for the content, pricing, or availability on third-party sites.</p>

        <h2 className="legal-h2">5. Acceptable use</h2>
        <p className="legal-p">You agree not to use HoppAway to:</p>
        <ul className="legal-ul">
          <li>Attempt to reverse-engineer, scrape, or extract data from the service in bulk.</li>
          <li>Circumvent any technical measures or limitations of the service.</li>
          <li>Use the service for any unlawful purpose.</li>
        </ul>

        <h2 className="legal-h2">6. Intellectual property</h2>
        <p className="legal-p">The HoppAway brand, logo, and interface design are the property of the service operator. AI-generated itinerary content is provided to you for personal use. You may not resell or republish itineraries as your own commercial product.</p>

        <h2 className="legal-h2">7. Limitation of liability</h2>
        <p className="legal-p">To the maximum extent permitted by applicable law, HoppAway and its operator shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to travel disruptions, financial losses, or reliance on inaccurate AI-generated content.</p>

        <h2 className="legal-h2">8. Availability</h2>
        <p className="legal-p">We do not guarantee uninterrupted availability of the service. HoppAway may be temporarily unavailable due to maintenance, API outages, or other technical issues. We reserve the right to modify or discontinue the service at any time.</p>

        <h2 className="legal-h2">9. Governing law</h2>
        <p className="legal-p">These terms are governed by applicable law. As HoppAway operates internationally without a fixed legal jurisdiction at this time, we aim to comply with the laws of the user's location to the extent reasonably practicable.</p>

        <h2 className="legal-h2">10. Changes to terms</h2>
        <p className="legal-p">We may update these Terms of Use at any time. Updated terms will be posted on this page with a revised date. Continued use of the service constitutes acceptance of the updated terms.</p>

        <h2 className="legal-h2">11. Contact</h2>
        <div className="legal-contact">
          <p>For any questions about these terms:<br/>
          📧 <a href="mailto:hello@hoppaway.app">hello@hoppaway.app</a><br/>
          We aim to respond within 5 business days.</p>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-row1">
          <div className="footer-logo">Hopp<em>Away</em></div>
          <a href="mailto:hello@hoppaway.app" className="footer-email">hello@hoppaway.app</a>
        </div>
        <div className="footer-row2">
          <span className="footer-tagline">built with ♥ for backpackers</span>
          <div className="footer-links">
            <span onClick={onBack} style={{cursor:"pointer"}}>← App</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function HoppAway() {
  const [page, setPage] = useState(() => {
    const p = window.location.pathname;
    if (p === "/privacy") return "privacy";
    if (p === "/terms") return "terms";
    return "app";
  });

  useEffect(() => {
    const handler = () => {
      const p = window.location.pathname;
      if (p === "/privacy") setPage("privacy");
      else if (p === "/terms") setPage("terms");
      else setPage("app");
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const goTo = (path) => {
    window.history.pushState({}, "", path);
    if (path === "/privacy") setPage("privacy");
    else if (path === "/terms") setPage("terms");
    else setPage("app");
  };

  if (page === "privacy") return <PrivacyPage onBack={() => goTo("/")} />;
  if (page === "terms") return <TermsPage onBack={() => goTo("/")} />;
  return <AppMain goTo={goTo} />;
}

function AppMain({ goTo }) {
  const [form, setForm] = useState({ destination: "", days: "7", budget: "500", currency: "EUR", from: "", stops: "2" });
  const [useCustom, setUseCustom] = useState(false);
  const [customStops, setCustomStops] = useState("");
  const [travelingAs, setTravelingAs] = useState("solo");
  const [pace, setPace] = useState("normal");
  const [travelStyle, setTravelStyle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [locked, setLocked] = useState(new Set());
  const [open, setOpen] = useState({});
  const [error, setError] = useState(null);
  const [view, setView] = useState("form"); // "form" | "result"

  const [loadStep, setLoadStep] = useState(0);
  const dragIdx = useRef(null);
  const [dragOver, setDragOver] = useState(null);
  const touchIdx = useRef(null);

  const toggleOpen = (i) => setOpen(p => ({ ...p, [i]: !p[i] }));
  const toggleLock = (i) => setLocked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const activeStops = useCustom ? (parseInt(customStops) || 2) : parseInt(form.stops);

  const buildPrompt = (lockedDays = []) => {
    const lockedCtx = lockedDays.length > 0
      ? `\n\nFIXED DAYS (keep these exactly):\n${lockedDays.map(d => `- Day ${d.day}: ${d.title} | sleep: ${d.accommodation} | food: ${d.food} | transport: ${d.transport} | do: ${d.activities}`).join("\n")}`
      : "";
    const whoCtx = travelingAs === "solo" ? "solo traveler" : travelingAs === "couple" ? "couple traveling together" : "group of friends";
    const paceCtx = pace === "chill" ? "relaxed pace (2-3 activities/day, plenty of downtime)" : pace === "intense" ? "packed schedule (maximize sights and experiences each day)" : "balanced pace (4-5 activities/day, mix of planned and free time)";
    const styleCtx = travelStyle.length > 0 ? `Travel style preferences: ${travelStyle.join(", ")}.` : "";
    return `You are HoppAway, a budget backpacker trip planner. Generate a ${form.days}-day itinerary for a ${whoCtx} going to ${form.destination}${form.from ? ` from ${form.from}` : ""}, total budget ${form.budget} ${form.currency}. Pace: ${paceCtx}. ${styleCtx}

DESTINATION TYPE — critical:
- If "${form.destination}" is a SINGLE CITY (e.g. "Tokyo", "Rome", "Bangkok", "Chiang Mai"): ignore the stops count. Organize by NEIGHBORHOODS or ZONES within that city. Each day explores a different area/quarter. The "title" field = neighborhood name (e.g. "Asakusa & Ueno"), not a different city.
- If it's a COUNTRY or REGION (e.g. "Vietnam", "Southeast Asia", "Portugal", "Balkans"): distribute ${form.days} days across ${activeStops} distinct cities/towns, allocating days proportionally.
- These are FULL DAYS AT DESTINATION — flights and arrival/departure days are NOT included.${lockedCtx}

TRANSPORT — be specific, not generic:
- Inter-city legs: name exact transport (train/bus/boat/sleeper), operator/line if known, approx duration, estimated cost in ${form.currency}. E.g. "Hanoi → Hue: Reunification Express SE3, overnight sleeper ~10h, ~$18. Book on 12go.asia."
- Within city/zone: name best local options with realistic per-trip costs. E.g. "BTS Skytrain day pass ~$3; Grab motorbike ~$1-2/ride."

ACCOMMODATION — name a real hostel (dorm bed), not just "budget hostel". Include approx nightly price.
FOOD — name actual street food dishes and spots, not generic descriptions. Include price estimates.
ACTIVITIES — name real attractions, free vs. paid. Give entry prices where relevant.

Respond ONLY with valid JSON (no markdown, no explanation):
{"destination":"string","days":number,"totalBudget":number,"currency":"string","estimatedTotal":number,"dailyAverage":number,"itinerary":[{"day":number,"title":"string","location":"string","estimatedCost":number,"accommodation":"string","accommodationPrice":"string","food":"string","foodPrice":"string","transport":"string","activities":"string"}],"backpackerTips":["tip1","tip2","tip3","tip4","tip5"]}

The "location" field = city/area name (e.g. "Hội An, Vietnam" or "Asakusa, Tokyo"). No tourist traps. Real backpacker intel.`;
  };

  const callAPI = async (prompt) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return parseItinerary(data.text || "");
  };

  const handleGenerate = async () => {
    if (!form.destination || !form.days || !form.budget) return;
    setLoading(true); setResult(null); setItinerary([]); setLocked(new Set()); setError(null);
    try {
      const parsed = await callAPI(buildPrompt());
      if (parsed) {
        setResult(parsed); setItinerary(parsed.itinerary || []);
        setOpen({ 0: true }); setView("result");
      } else setError("Couldn't parse the itinerary. Please try again.");
    } catch (e) { setError("Something went wrong. Check your connection."); }
    finally { setLoading(false); }
  };

  const handleRegen = async () => {
    setRegenLoading(true); setError(null);
    try {
      const lockedDays = itinerary.filter((_, i) => locked.has(i));
      const parsed = await callAPI(buildPrompt(lockedDays));
      if (parsed) {
        const merged = (parsed.itinerary || []).map((d, i) => locked.has(i) ? { ...itinerary[i] } : d);
        setItinerary(merged); setResult(r => ({ ...r, ...parsed, itinerary: merged }));
      } else setError("Couldn't regenerate. Please try again.");
    } catch (e) { setError("Something went wrong."); }
    finally { setRegenLoading(false); }
  };

  const reorder = (from, to) => {
    const list = [...itinerary];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    const nl = new Set();
    locked.forEach(li => {
      if (li === from) nl.add(to);
      else if (from < to && li > from && li <= to) nl.add(li - 1);
      else if (from > to && li >= to && li < from) nl.add(li + 1);
      else nl.add(li);
    });
    setLocked(nl);
    setItinerary(list.map((d, i) => ({ ...d, day: i + 1 })));
  };

  const onDragStart = (i) => { dragIdx.current = i; };
  const onDragOver = (e, i) => { e.preventDefault(); setDragOver(i); };
  const onDrop = (i) => {
    if (dragIdx.current !== null && dragIdx.current !== i) reorder(dragIdx.current, i);
    dragIdx.current = null; setDragOver(null);
  };
  const onTouchStart = (e, i) => { touchIdx.current = i; };
  // step animation during loading
  useEffect(() => {
    if (!loading) { setLoadStep(0); return; }
    setLoadStep(0);
    const timers = [
      setTimeout(() => setLoadStep(1), 4000),
      setTimeout(() => setLoadStep(2), 10000),
      setTimeout(() => setLoadStep(3), 18000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const hasOpenCards = Object.values(open).some(Boolean);
  const cardRefs = useRef([]);
  const scrollRAF = useRef(null);

  const onTouchMove = useCallback((e) => {
    if (touchIdx.current === null) return;
    e.preventDefault();
    const y = e.touches[0].clientY;
    const ZONE = 90;
    const SPEED = 7;

    // auto-scroll when near top or bottom of viewport
    if (scrollRAF.current) cancelAnimationFrame(scrollRAF.current);
    const doScroll = () => {
      if (touchIdx.current === null) return;
      if (y < ZONE) { window.scrollBy(0, -SPEED); scrollRAF.current = requestAnimationFrame(doScroll); }
      else if (y > window.innerHeight - ZONE) { window.scrollBy(0, SPEED); scrollRAF.current = requestAnimationFrame(doScroll); }
    };
    doScroll();

    // detect which card the finger is over
    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      if (y >= r.top && y <= r.bottom && idx !== touchIdx.current) setDragOver(idx);
    });
  }, []);

  const onTouchEnd = () => {
    if (scrollRAF.current) { cancelAnimationFrame(scrollRAF.current); scrollRAF.current = null; }
    if (touchIdx.current !== null && dragOver !== null && touchIdx.current !== dragOver) reorder(touchIdx.current, dragOver);
    touchIdx.current = null; setDragOver(null);
  };

  const budgetLeft = result ? result.totalBudget - result.estimatedTotal : 0;

  const handleBack = () => {
    setView("form"); setResult(null); setItinerary([]); setLocked(new Set()); setError(null);
  };

  return (
    <>
      <style>{css}</style>

      {/* HEADER */}
      <header className="hdr">
        <div className="logo" onClick={() => { if(view==="result") handleBack(); }} style={{cursor: view==="result" ? "pointer" : "default"}}>Hopp<em>Away</em></div>
        <div className="hdr-right">
          {view === "result" && (
            <button className="hdr-back" onClick={handleBack}>← New trip</button>
          )}
        </div>
      </header>
      <div className="hdr-spacer" />

      {/* MARQUEE — always visible */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {["Hanoi → Hue night train $18","Hostel dorm €12/night Lisbon","Tuk-tuk Phnom Penh $1/ride","Overnight bus Buenos Aires → Mendoza $22","Dosa breakfast $0.80 Chennai","Ferry Split → Hvar €10","Hostel Kathmandu $5/night","Metro day pass Prague €4","Night bus Nairobi → Mombasa $8","Couchette Paris → Barcelona €35","Street tacos $1.50 Mexico City","Shared taxi Marrakech → Fès $6","Hostel dorm $9/night Cape Town","Minibus Tbilisi → Yerevan $12","Pad thai $1.80 Bangkok","Night ferry Athens → Santorini €40",
            "Hanoi → Hue night train $18","Hostel dorm €12/night Lisbon","Tuk-tuk Phnom Penh $1/ride","Overnight bus Buenos Aires → Mendoza $22","Dosa breakfast $0.80 Chennai","Ferry Split → Hvar €10","Hostel Kathmandu $5/night","Metro day pass Prague €4","Night bus Nairobi → Mombasa $8","Couchette Paris → Barcelona €35","Street tacos $1.50 Mexico City","Shared taxi Marrakech → Fès $6","Hostel dorm $9/night Cape Town","Minibus Tbilisi → Yerevan $12","Pad thai $1.80 Bangkok","Night ferry Athens → Santorini €40"
          ].map((t, i) => (
            <span key={i}>{t}{i % 16 !== 15 ? <span className="dot"> ✦ </span> : null}</span>
          ))}
        </div>
      </div>

      {/* ── FORM VIEW ── */}
      {view === "form" && !loading && (
        <>
          <div className="hero-wrap">
            <h1 className="hero-h1">
              <span className="hop">Hop.</span><br />
              Plan.<br />
              <em>Go.</em>
            </h1>
            <p className="hero-desc">
              Enter destination, days and budget — get a full itinerary with real hostels, exact transport and street food.
            </p>
            <div className="hero-pills">
              <div className="pill">⚡ AI itinerary</div>
              <div className="pill">🏨 Real hostels</div>
              <div className="pill">🚌 Exact trains</div>
              <div className="pill">💸 Hard budget</div>
              <div className="pill">🚫 No tourist traps</div>
              <div className="pill">🔄 Lock & regen</div>
            </div>
          </div>

          {/* HOW IT WORKS STRIP */}
          <div className="hiw-strip">
            <div className="hiw-strip-inner">
              <div className="hiw-strip-title">How it works</div>
              <div className="hiw-strip-steps">
                <div className="hiw-strip-step">
                  <div className="hiw-strip-n">1</div>
                  <strong>Enter trip</strong>
                  <span>Destination, days, budget</span>
                </div>
                <div className="hiw-strip-step">
                  <div className="hiw-strip-n">2</div>
                  <strong>AI plans it</strong>
                  <span>Hostels, transport, food</span>
                </div>
                <div className="hiw-strip-step">
                  <div className="hiw-strip-n">3</div>
                  <strong>Tweak & go</strong>
                  <span>Lock days, regen rest</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-wrap">
            <div className="fcard">
              <span className="fcard-label">Your trip</span>
              <div className="fgrid">
                <div className="fg full">
                  <label>Where are you going?</label>
                  <input type="text" placeholder="Bangkok, Vietnam, Portugal, Southeast Asia..." value={form.destination}
                    onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} autoCapitalize="words" autoCorrect="off" />
                </div>
                <div className="fg">
                  <label>Departing from (optional)</label>
                  <input type="text" placeholder="Milan, London, NYC..." value={form.from}
                    onChange={e => setForm(p => ({ ...p, from: e.target.value }))} autoCapitalize="words" autoCorrect="off" />
                </div>
                <div className="fg">
                  <label>Days at destination ✱</label>
                  <input type="number" inputMode="numeric" min="1" max="30" placeholder="7"
                    value={form.days} onChange={e => setForm(p => ({ ...p, days: e.target.value }))} />
                  <span className="fg-hint">Exclude flights & travel days.</span>
                </div>
                <div className="fg">
                  <label>Total budget</label>
                  <input type="number" inputMode="decimal" min="50" placeholder="500"
                    value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} />
                </div>
                <div className="fg">
                  <label>Currency</label>
                  <select value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                    <option value="EUR">EUR €</option>
                    <option value="USD">USD $</option>
                    <option value="GBP">GBP £</option>
                  </select>
                </div>
              </div>

              <hr className="fdivider" />

              <div className="stops-label">Stops / cities (for multi-city trips)</div>
              <div className="stops-row">
                {STOP_PRESETS.map(n => (
                  <div key={n} className={`schip ${!useCustom && form.stops === String(n) ? "on" : ""}`}
                    onClick={() => { setUseCustom(false); setForm(p => ({ ...p, stops: String(n) })); }}>
                    {n}
                  </div>
                ))}
                <div className={`schip ${useCustom ? "on" : ""}`} onClick={() => setUseCustom(true)}>Custom</div>
              </div>
              {useCustom && (
                <div className="custom-row">
                  <input type="number" inputMode="numeric" min="1" max="20" placeholder="6" value={customStops} onChange={e => setCustomStops(e.target.value)} />
                  <span style={{ fontFamily: "var(--fm)", fontSize: "0.7rem", color: "var(--muted)" }}>stops</span>
                </div>
              )}
              <div className="stops-hint">Single city? AI organizes by neighborhood instead of stops.</div>

              <hr className="fdivider" />

              {/* TRAVELING AS */}
              <div className="stops-label">Traveling as <span className="new-badge">NEW</span></div>
              <div className="who-row">
                {[
                  { id:"solo", icon:"🎒", label:"Solo" },
                  { id:"couple", icon:"👫", label:"Couple" },
                  { id:"group", icon:"👥", label:"Group" },
                ].map(w => (
                  <div key={w.id} className={`who-chip ${travelingAs === w.id ? "on" : ""}`} onClick={() => setTravelingAs(w.id)}>
                    <span className="wico">{w.icon}</span>{w.label}
                  </div>
                ))}
              </div>

              <hr className="fdivider" />

              {/* PACE */}
              <div className="stops-label">Pace <span className="new-badge">NEW</span></div>
              <div className="pace-row">
                {[
                  { id:"chill", icon:"🌿", label:"Chill", sub:"2–3 things/day" },
                  { id:"normal", icon:"⚖️", label:"Normal", sub:"4–5 things/day" },
                  { id:"intense", icon:"⚡", label:"Intense", sub:"see everything" },
                ].map(p => (
                  <div key={p.id} className={`pace-chip ${pace === p.id ? "on" : ""}`} onClick={() => setPace(p.id)}>
                    <span className="pico">{p.icon}</span>{p.label}
                    <span className="psub">{p.sub}</span>
                  </div>
                ))}
              </div>

              <hr className="fdivider" />

              {/* TRAVEL STYLE */}
              <div className="stops-label">Travel style <span className="new-badge">NEW</span></div>
              <div className="stops-hint" style={{marginBottom:"0.6rem"}}>Optional — select one or more</div>
              <div className="style-grid">
                {[
                  { id:"backpacker", icon:"🎒", label:"Backpacker" },
                  { id:"trekking", icon:"🥾", label:"Trekking" },
                  { id:"culture", icon:"🏛️", label:"Culture" },
                  { id:"food", icon:"🍜", label:"Food & local" },
                  { id:"nightlife", icon:"🎉", label:"Nightlife" },
                  { id:"luxury", icon:"✨", label:"Comfort/luxury" },
                ].map(s => (
                  <div key={s.id} className={`style-chip ${travelStyle.includes(s.id) ? "on" : ""}`}
                    onClick={() => setTravelStyle(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id])}>
                    <span>{s.icon}</span>{s.label}
                  </div>
                ))}
              </div>

              <hr className="fdivider" />

              <div style={{
                background: "#fffbf0", border: "1.5px solid rgba(245,200,66,.4)",
                borderLeft: "3px solid var(--yellow)", padding: "0.75rem 0.9rem", marginTop: "0.8rem"
              }}>
                <p style={{ fontFamily: "var(--fm)", fontSize: "0.62rem", color: "var(--brown)", lineHeight: 1.65 }}>
                  <strong style={{ color: "var(--orange)" }}>⚠ AI-generated content.</strong> This itinerary is created by an AI and is meant as inspiration. Prices, availability and transport schedules may differ from reality. Always verify before booking.
                </p>
              </div>

              <button className="btn-gen" onClick={handleGenerate} disabled={!form.destination || !form.days || !form.budget}>
                Generate my itinerary →
              </button>
              {error && <div className="err-card">⚠ {error}</div>}
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="how-section">
            <div className="sec-eyebrow">How it works</div>
            <h2 className="sec-title">Three inputs.<br />One perfect trip.</h2>
            <p className="sec-sub">No 47-step wizard, no account needed. Tell us where, how long and how much — we do the rest.</p>
            <div className="steps-grid">
              <div className="step">
                <div className="step-num">01</div>
                <div className="step-ico">📍</div>
                <h3>Tell us your trip</h3>
                <p>Destination, days at destination (flights excluded), total budget and how many cities to hit.</p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div className="step-ico">⚡</div>
                <h3>AI builds your plan</h3>
                <p>Real hostel names, street food spots, exact transport operators and per-day cost estimates.</p>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div className="step-ico">✏️</div>
                <h3>Tweak until perfect</h3>
                <p>Lock the days you love, regenerate the rest. Drag to reorder. Your trip, your rules.</p>
              </div>
              <div className="step">
                <div className="step-num">04</div>
                <div className="step-ico">🚀</div>
                <h3>Book everything</h3>
                <p>Flights, hostels, tours, eSIM, insurance — direct links from your itinerary.</p>
              </div>
            </div>
          </div>

          {/* BOOK EVERYTHING PREVIEW */}
          <div className="how-section" style={{ paddingTop: 0 }}>
            <div className="sec-eyebrow">Book everything</div>
            <h2 className="sec-title">From itinerary<br />to packed bag.</h2>
            <p className="sec-sub">Every itinerary comes with direct links to book flights, hostels, tours, insurance and eSIM — all in one place.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {[
                { ico:"✈️", name:"Skyscanner", desc:"Cheapest flights", color:"#00a1e4" },
                { ico:"🛏️", name:"Hostelworld", desc:"Best backpacker hostels", color:"#ff6600" },
                { ico:"🏠", name:"Booking.com", desc:"Hotels & guesthouses", color:"#003580" },
                { ico:"🗺️", name:"GetYourGuide", desc:"Tours & experiences", color:"#ff5533" },
                { ico:"🌍", name:"SafetyWing", desc:"Travel insurance", color:"#1d7a6e" },
                { ico:"📱", name:"Airalo eSIM", desc:"Data in 200+ countries", color:"#7c3aed" },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderLeft: `3px solid ${s.color}`, padding: "0.75rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{ fontSize: "1rem" }}>{s.ico}</span>
                  <span style={{ fontFamily: "var(--ff)", fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)" }}>{s.name}</span>
                  <span style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", color: "var(--muted)" }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="loading-wrap">
          <div className="loading-card">
            <div className="spinner" />
            <div className="loading-title">Planning your trip to {form.destination}…</div>
            <div className="loading-sub">{form.days} days · {form.budget} {form.currency} budget</div>
            <div className="loading-steps">
              {[
                { icon:"🏨", label:"Hostels" },
                { icon:"🚌", label:"Transport" },
                { icon:"💸", label:"Budget" },
                { icon:"📋", label:"Itinerary" },
              ].map((s, i) => (
                <div key={i} className={`lstep ${i < loadStep ? "done" : i === loadStep ? "active" : ""}`}>
                  <span className="lstep-icon">{s.icon}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="loading-note">This may take 20–40 seconds — good things take time ✈️</div>
          </div>
        </div>
      )}

      {/* ── RESULT VIEW ── */}
      {view === "result" && result && !loading && (
        <div className="result-wrap">
          <div className="trip-header">
            <div className="trip-eyebrow">Your itinerary</div>
            <div className="trip-title">
              Trip to <em>{result.destination}</em>
            </div>
            <div className="trip-chips">
              <span className="trip-chip">{result.days} days</span>
              <span className="trip-chip">{result.totalBudget} {result.currency} budget</span>
              <span className="trip-chip">~{result.dailyAverage} {result.currency}/day</span>
              {activeStops > 1 && <span className="trip-chip">{activeStops} stops</span>}
            </div>
          </div>

          {/* budget bar */}
          <div className="budget-bar">
            <div className="bitem">
              <div className="blabel">Your budget</div>
              <div className="bvalue">{result.totalBudget} {result.currency}</div>
            </div>
            <div className="bdivider" />
            <div className="bitem">
              <div className="blabel">AI estimate</div>
              <div className="bvalue y">{result.estimatedTotal} {result.currency}</div>
            </div>
            <div className="bdivider" />
            <div className="bitem">
              <div className="blabel">Left over</div>
              <div className="bvalue t">{budgetLeft} {result.currency}</div>
            </div>
          </div>

          {/* drag hint when cards open */}
          {hasOpenCards && (
            <div style={{ fontFamily:"var(--fm)", fontSize:"0.6rem", color:"var(--muted)", textAlign:"center", padding:"0.4rem 0", marginBottom:"0.3rem", background:"rgba(245,240,232,.6)", border:"1px solid var(--border)" }}>
              ↕ Close cards to reorder days
            </div>
          )}

          {/* regen bar */}
          <div className="regen-bar">
            <div className="regen-info">
              🔒 Lock days you love — only <strong>unlocked</strong> days regenerate.
              {locked.size > 0 && <> · <strong>{locked.size} locked</strong>, {itinerary.length - locked.size} will change.</>}
            </div>
            <button className="btn-regen" onClick={handleRegen} disabled={regenLoading}>
              {regenLoading ? (
                <><span className="btn-regen-spinner" />Regenerating…</>
              ) : "↻ Regenerate"}
            </button>
          </div>

          {error && <div className="err-card">⚠ {error}</div>}

          {/* day cards */}
          {itinerary.map((day, i) => (
            <div key={`${i}-${day.title}`}
              ref={el => cardRefs.current[i] = el}
              className={`day-card ${open[i] ? "open" : ""} ${locked.has(i) ? "locked" : ""} ${dragOver === i ? "drag-over" : ""} ${regenLoading && !locked.has(i) ? "regenerating" : ""}`}
              style={{ animationDelay: `${i * 0.04}s` }}
              draggable={!hasOpenCards}
              onDragStart={() => { if(!hasOpenCards) onDragStart(i); }}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={() => onDrop(i)}
              onDragEnd={() => { dragIdx.current = null; setDragOver(null); }}
            >
              <div className="day-head" onClick={() => toggleOpen(i)}>
                <span className="drag-h"
                  onClick={e => e.stopPropagation()}
                  onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e, i); }}
                  onTouchMove={(e) => { e.stopPropagation(); onTouchMove(e); }}
                  onTouchEnd={(e) => { e.stopPropagation(); onTouchEnd(); }}>⠿</span>
                <span className="day-num">DAY {day.day}</span>
                {day.location && <span className="day-place">{day.location}</span>}
                <span className="day-name">{day.title}</span>
                <button className={`btn-lock ${locked.has(i) ? "on" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleLock(i); }}>
                  {locked.has(i) ? "🔒" : "🔓"}
                </button>
                <span className="day-cost">{day.estimatedCost} {result.currency}</span>
                <span className="chev">▼</span>
              </div>

              {open[i] && (
                <div className="day-body">
                  {/* sleep */}
                  <div className="dsec">
                    <div className="dsec-title">🏨 Sleep</div>
                    <div className="dsec-body">{day.accommodation}</div>
                    {day.accommodationPrice && <div className="dsec-price">{day.accommodationPrice}</div>}
                  </div>
                  {/* eat */}
                  <div className="dsec">
                    <div className="dsec-title">🍜 Eat</div>
                    <div className="dsec-body">{day.food}</div>
                    {day.foodPrice && <div className="dsec-price">{day.foodPrice}</div>}
                  </div>
                  {/* transport */}
                  <div className="transport-block">
                    <div className="dsec-title">🚌 Getting around</div>
                    <div className="dsec-body">{day.transport}</div>
                  </div>
                  {/* do */}
                  <div className="dsec">
                    <div className="dsec-title">🎒 Do</div>
                    <div className="dsec-body">{day.activities}</div>
                  </div>
                  {/* budget on track indicator */}
                  {day.estimatedCost <= (result.dailyAverage * 1.1) && (
                    <div className="on-track">✓ Budget on track</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* backpacker tips */}
          {result.backpackerTips?.length > 0 && (
            <div className="tips-card">
              <div className="tips-title">⚡ Backpacker hacks for {result.destination}</div>
              {result.backpackerTips.map((t, i) => (
                <div key={i} className="tip">
                  <span className="tip-arr">→</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}

          {/* affiliates */}
          <div className="aff-section" style={{ padding: 0, marginTop: "1.5rem" }}>
            <AffiliateSection destination={result.destination} from={form.from} />
          </div>

          {/* disclaimer */}
          <div className="disclaimer">
            <p><strong>⚠ Estimates only.</strong> Prices, availability and conditions change frequently. Always verify before booking. HoppAway is not responsible for discrepancies between estimated and actual costs.</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-row1">
          <div className="footer-logo">Hopp<em>Away</em></div>
          <a href="mailto:hello@hoppaway.app" className="footer-email">hello@hoppaway.app</a>
        </div>
        <div className="footer-row2">
          <span className="footer-tagline">built with ♥ for backpackers</span>
          <div className="footer-links">
            <span onClick={() => goTo("/privacy")} style={{cursor:"pointer"}}>Privacy</span>
            <span onClick={() => goTo("/terms")} style={{cursor:"pointer"}}>Terms</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}
