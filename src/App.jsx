import { useState, useEffect, useRef, useCallback } from "react";

/* ═══ STYLES ═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --black:#000;--mag:#CC0066;--mag-dim:rgba(204,0,102,0.12);--mag-border:rgba(204,0,102,0.32);
  --mag-glow:rgba(204,0,102,0.45);--white:#fff;--gray:#888;
  --surface:#0d0d0d;--surface2:#161616;--surface3:#1e1e1e;
  --success:#22c55e;--danger:#ef4444;--warn:#f59e0b;
  --font:'Montserrat',sans-serif;--font-d:'Playfair Display',serif;
  --primary:var(--mag);--primary-dim:var(--mag-dim);--primary-border:var(--mag-border);
}
html,body,#root{height:100%;width:100%;overflow:hidden;}
body{background:var(--black);color:var(--white);font-family:var(--font);}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--primary-border);border-radius:2px;}

/* ── Collapsible Sidebar ── */
.app{display:flex;height:100vh;overflow:hidden;}
.sidebar{
  width:52px;background:var(--surface);border-right:1px solid var(--primary-border);
  display:flex;flex-direction:column;align-items:center;padding:10px 0;gap:1px;
  flex-shrink:0;position:relative;z-index:30;transition:width 0.25s ease;overflow:hidden;
}
.sidebar:hover{width:160px;}
.sidebar::after{content:'';position:absolute;right:0;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,var(--primary),transparent);}
.logo-mark{width:38px;height:38px;background:var(--primary);border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;margin-bottom:12px;font-family:var(--font-d);font-weight:700;font-size:11px;color:var(--white);text-align:center;line-height:1.1;flex-shrink:0;transition:box-shadow 0.3s;}
.logo-mark:hover{box-shadow:0 0 22px var(--mag-glow);}
.nav-btn{
  width:100%;min-height:44px;border-radius:0;border:none;background:transparent;color:var(--gray);
  cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.2s;
  font-size:11px;font-family:var(--font);font-weight:700;text-transform:uppercase;
  padding:0 7px;position:relative;white-space:nowrap;overflow:hidden;
}
.nav-btn .nav-icon{flex-shrink:0;width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all 0.2s;}
.nav-btn:hover{color:var(--primary);}
.nav-btn:hover .nav-icon{background:var(--primary-dim);}
.nav-btn.active{color:var(--primary);}
.nav-btn.active .nav-icon{background:var(--primary-dim);border:1px solid var(--primary-border);}
.nav-btn.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--primary);border-radius:0 2px 2px 0;}
.nav-label{opacity:0;transition:opacity 0.2s 0.05s;font-size:10px;}
.sidebar:hover .nav-label{opacity:1;}

.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{height:54px;background:var(--surface);border-bottom:1px solid var(--primary-border);padding:0 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.topbar-title{font-family:var(--font-d);font-size:18px;font-weight:700;color:var(--primary);}
.topbar-sub{font-size:9px;color:var(--gray);margin-top:1px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;}
.content{flex:1;overflow-y:auto;padding:14px 18px;}

/* ── Cards ── */
.card{background:var(--surface);border:1px solid var(--primary-border);border-radius:13px;padding:14px;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,var(--primary),transparent);}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.stat-val{font-family:var(--font-d);font-size:30px;font-weight:700;color:var(--primary);line-height:1;}
.stat-lbl{font-size:9px;color:var(--gray);margin-top:3px;text-transform:uppercase;letter-spacing:0.7px;font-weight:700;}
.badge{display:inline-flex;align-items:center;gap:3px;font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;text-transform:uppercase;}
.bm{background:var(--primary-dim);color:var(--primary);border:1px solid var(--primary-border);}
.bgg{background:rgba(34,197,94,0.12);color:#22c55e;}
.bgr{background:rgba(239,68,68,0.12);color:#ef4444;}
.bgy{background:rgba(245,158,11,0.12);color:#f59e0b;}
.bgx{background:var(--surface3);color:var(--gray);}

/* ── Avatar hover zoom ── */
.avatar{border-radius:9px;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--primary);font-family:var(--font);border:1px solid var(--primary-border);flex-shrink:0;overflow:hidden;transition:transform 0.22s;cursor:pointer;}
.avatar:hover{transform:scale(2.4);z-index:99;}
.av-sm{width:34px;height:34px;font-size:11px;}
.av-md{width:44px;height:44px;font-size:14px;}
.avatar img{width:100%;height:100%;object-fit:cover;}

.prog-track{background:var(--surface3);border-radius:3px;overflow:hidden;}
.prog-fill{height:100%;background:linear-gradient(to right,#990050,var(--primary));border-radius:3px;transition:width 0.5s ease;}
.prog-sm{height:3px;}
.prog-md{height:6px;}

/* ── Buttons ── */
.btn{border:none;border-radius:9px;cursor:pointer;font-family:var(--font);font-weight:700;display:inline-flex;align-items:center;gap:5px;transition:all 0.18s;letter-spacing:0.2px;}
.btn-primary{background:var(--primary);color:var(--white);font-size:12px;padding:9px 16px;}
.btn-primary:hover{filter:brightness(1.15);box-shadow:0 4px 18px var(--mag-glow);}
.btn-primary:disabled{opacity:0.35;cursor:not-allowed;}
.btn-outline{background:transparent;color:var(--primary);border:1px solid var(--primary-border);font-size:12px;padding:8px 14px;}
.btn-outline:hover{background:var(--primary-dim);}
.btn-ghost{background:var(--surface2);color:var(--white);border:1px solid #2a2a2a;font-size:12px;padding:8px 12px;}
.btn-ghost:hover{border-color:var(--primary-border);color:var(--primary);}
.btn-danger{background:rgba(239,68,68,0.1);color:var(--danger);border:1px solid rgba(239,68,68,0.3);font-size:12px;padding:8px 12px;}
.btn-danger:hover{background:rgba(239,68,68,0.2);}
.btn-sm{padding:4px 8px;font-size:10px;}

/* ── FAB ── */
.fab-wrap{position:fixed;bottom:22px;right:22px;z-index:100;transition:opacity 0.3s,transform 0.3s;}
.fab-wrap.hidden{opacity:0;transform:scale(0.4);pointer-events:none;}
.fab-btn{width:62px;height:62px;border-radius:50%;background:var(--primary);color:var(--white);border:none;cursor:pointer;font-family:var(--font);font-weight:800;font-size:8px;letter-spacing:0.3px;text-transform:uppercase;box-shadow:0 6px 28px var(--mag-glow);transition:all 0.2s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;}
.fab-btn:hover{transform:scale(1.08);}

/* ── Inputs ── */
.inp{width:100%;background:var(--surface2);border:1px solid #2a2a2a;border-radius:8px;padding:9px 12px;color:var(--white);font-size:12px;font-family:var(--font);outline:none;transition:border-color 0.2s;}
.inp:focus{border-color:var(--primary);}
.inp::placeholder{color:var(--gray);}
.sel{width:100%;background:var(--surface2);border:1px solid #2a2a2a;border-radius:8px;padding:9px 12px;color:var(--white);font-size:12px;font-family:var(--font);outline:none;}
.sel:focus{border-color:var(--primary);}
.inp-lbl{font-size:9px;color:var(--gray);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;display:block;}
.sec-title{font-family:var(--font-d);font-size:16px;font-weight:700;color:var(--primary);margin-bottom:10px;}
.divider{height:1px;background:linear-gradient(to right,transparent,var(--primary-border),transparent);margin:12px 0;}

/* ── Modal ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);}
.modal-box{background:var(--surface);border:1px solid var(--primary-border);border-radius:16px;padding:22px;max-width:520px;width:92%;max-height:92vh;overflow-y:auto;}
.modal-box::before{content:'';display:block;height:2px;background:linear-gradient(to right,var(--primary),transparent);margin:-22px -22px 18px;border-radius:16px 16px 0 0;}

/* ── Login ── */
.login-screen{display:flex;height:100vh;align-items:center;justify-content:center;background:var(--black);position:relative;overflow:hidden;}
.login-lines{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(204,0,102,0.04) 0px,rgba(204,0,102,0.04) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,rgba(204,0,102,0.04) 0px,rgba(204,0,102,0.04) 1px,transparent 1px,transparent 60px);}
.login-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(204,0,102,0.1) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);}

/* ── Ticket ── */
.ticket{background:var(--surface);border:1px solid var(--primary-border);border-radius:14px;overflow:hidden;}
.ticket-top{background:var(--primary);padding:14px 18px;}
.ticket-dashes{border-top:2px dashed var(--primary-border);margin:0 12px;}
.ticket-body{padding:10px 18px;}

/* ── Misc ── */
.sem{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.sem-green{background:#22c55e;box-shadow:0 0 5px #22c55e;}
.sem-yellow{background:var(--warn);box-shadow:0 0 5px var(--warn);}
.sem-red{background:var(--danger);box-shadow:0 0 5px var(--danger);}
.check-circle{width:20px;height:20px;border-radius:50%;border:2px solid var(--gray);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.check-circle.done{background:var(--primary);border-color:var(--primary);}
.water-glass{width:28px;height:40px;border:2px solid #2a2a2a;border-top:none;border-radius:0 0 7px 7px;position:relative;overflow:hidden;cursor:pointer;transition:border-color 0.2s;}
.water-glass.filled{border-color:var(--primary);}
.water-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(204,0,102,0.6),rgba(204,0,102,0.2));transition:height 0.3s;}
.timer-display{font-family:var(--font-d);font-size:54px;font-weight:700;color:var(--primary);text-align:center;line-height:1;text-shadow:0 0 28px var(--mag-glow);}
.social-link{display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--surface2);border-radius:9px;border:1px solid var(--primary-border);text-decoration:none;color:var(--white);transition:all 0.2s;}
.social-link:hover{background:var(--primary-dim);}
.session-card{display:flex;align-items:center;gap:10px;padding:9px 11px;background:var(--surface2);border-radius:9px;border-left:3px solid;}
.row-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surface);border:1px solid var(--primary-border);border-radius:11px;cursor:pointer;transition:all 0.2s;}
.row-item:hover{border-color:var(--primary);background:var(--surface2);}
.photo-upload{border-radius:11px;border:2px dashed var(--primary-border);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;transition:all 0.2s;background:var(--surface2);}
.photo-upload:hover{border-color:var(--primary);background:var(--primary-dim);}
.patho-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:20px;font-size:9px;color:var(--warn);margin:2px;}
.comment-bubble{background:var(--surface2);border-left:3px solid var(--primary);border-radius:0 8px 8px 0;padding:8px 11px;margin-bottom:6px;font-size:11px;line-height:1.5;}
.comment-alert{background:rgba(239,68,68,0.08);border-left:3px solid var(--danger);border-radius:0 8px 8px 0;padding:8px 11px;margin-bottom:6px;font-size:11px;}

/* ── Exercise table ── */
.ex-card{background:var(--surface2);border:1px solid var(--primary-border);border-radius:12px;overflow:hidden;margin-bottom:8px;}
.ex-emoji-wrap{height:90px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a0010,#2d0020);font-size:44px;position:relative;}
.ex-set-table{width:100%;border-collapse:collapse;}
.ex-set-table th{font-size:8px;color:var(--gray);text-transform:uppercase;letter-spacing:0.5px;padding:5px 6px;text-align:center;background:var(--surface3);font-weight:700;}
.ex-set-table td{padding:6px;text-align:center;border-top:1px solid #1a1a1a;font-size:12px;}
.ex-set-table tr:hover td{background:var(--primary-dim);}
.set-inp{background:transparent;border:none;color:var(--white);font-size:12px;font-family:var(--font);font-weight:700;text-align:center;width:100%;outline:none;}
.set-inp:focus{color:var(--primary);}

/* ── Food ── */
.food-chip{display:flex;align-items:center;gap:6px;padding:6px 9px;background:var(--surface2);border-radius:8px;border:1px solid var(--primary-border);margin-bottom:4px;cursor:grab;transition:all 0.2s;}
.food-chip:active{cursor:grabbing;opacity:0.6;}
.food-chip.drag-over{border-color:var(--primary);background:var(--primary-dim);}
.food-search-item{padding:8px 11px;cursor:pointer;border-bottom:1px solid #1a1a1a;transition:background 0.15s;font-size:11px;}
.food-search-item:hover{background:var(--primary-dim);}
.day-tab{flex:1;padding:5px 2px;background:var(--surface2);border:1px solid #2a2a2a;border-radius:6px;cursor:pointer;font-size:8px;font-weight:700;text-transform:uppercase;color:var(--gray);text-align:center;transition:all 0.15s;}
.day-tab.active{background:var(--primary);color:var(--white);border-color:var(--primary);}

/* ── Drag handle for client list ── */
.drag-handle{cursor:grab;color:var(--gray);padding:0 4px;}
.drag-handle:active{cursor:grabbing;}
.dragging-row{opacity:0.4;}
.drag-target{border-top:2px solid var(--primary) !important;}

/* ── Volume summary bar ── */
.vol-bar{background:var(--surface3);border-radius:4px;height:6px;overflow:hidden;margin-top:3px;}
.vol-fill{height:100%;background:linear-gradient(to right,var(--primary),var(--mag2,#ff1a8c));border-radius:4px;}

/* ── Color themes ── */
.theme-dot{width:18px;height:18px;border-radius:50%;cursor:pointer;transition:transform 0.15s;}
.theme-dot:hover{transform:scale(1.2);}
.theme-dot.active{outline:3px solid var(--white);}

@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse-p{0%,100%{box-shadow:0 0 10px rgba(204,0,102,0.4)}50%{box-shadow:0 0 26px rgba(204,0,102,0.8)}}
@keyframes flash{0%,100%{opacity:1}50%{opacity:0.2}}
.fade-up{animation:fadeUp 0.24s ease both;}
.pulse-p{animation:pulse-p 2.5s infinite;}
.timer-flash{animation:flash 0.5s ease 3;}
`;

/* ═══ ICONS ════════════════════════════════════════════════════════════════ */
const SVG={
  grid:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  users:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  dumbbell:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 5v14M18 5v14M8 5h4M8 19h4M12 5h4M12 19h4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>`,
  apple:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a5 5 0 0 1 5 5v1H7V7a5 5 0 0 1 5-5z"/><path d="M3 8h18l-1.5 10.5A2 2 0 0 1 17.53 20H6.47a2 2 0 0 1-1.97-1.5L3 8z"/></svg>`,
  ticket:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>`,
  shield:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  check:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  cal:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  arrow:`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>`,
  back:`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  play:`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  pause:`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  reset:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>`,
  camera:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  logout:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  plus:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  drop:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  chart:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  star:`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  ig:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  wa:`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.55 4.1 1.514 5.832L.057 23.428a.5.5 0 0 0 .609.61l5.748-1.506A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.49-5.192-1.348l-.37-.215-3.843 1.006 1.03-3.748-.235-.386A9.942 9.942 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>`,
  tt:`<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.56a8.17 8.17 0 0 0 4.77 1.52V6.64a4.85 4.85 0 0 1-1-.05z"/></svg>`,
  food:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`,
  eye:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeoff:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  search:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  sound:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  person:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`,
  key:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  palette:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  alert:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  video:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  drag:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
};
const I=({n,s=16})=><span dangerouslySetInnerHTML={{__html:SVG[n]||""}} style={{display:"inline-flex",alignItems:"center",width:s,height:s,flexShrink:0}}/>;

/* ═══ CONSTANTS ════════════════════════════════════════════════════════════ */
const LS_KEY="jhcoach_v5";
const DAYS_WEEK=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const MEAL_SLOTS=["Desayuno","Almuerzo","Merienda","Cena"];
const MEAL_ICONS=["🍳","🍚","🥗","🍎"];
const addDays=(d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
const fmtDate=d=>{try{return new Date(d).toLocaleDateString("es-CO",{day:"2-digit",month:"short"});}catch{return"???";}};
const mkDate=d=>{const r=new Date();r.setDate(r.getDate()+d);return r;};

/* ── Color themes ── */
const COLOR_THEMES={
  magenta:{primary:"#CC0066",dim:"rgba(204,0,102,0.12)",border:"rgba(204,0,102,0.32)"},
  azul:{primary:"#0066CC",dim:"rgba(0,102,204,0.12)",border:"rgba(0,102,204,0.32)"},
  verde:{primary:"#00A855",dim:"rgba(0,168,85,0.12)",border:"rgba(0,168,85,0.32)"},
  naranja:{primary:"#CC5500",dim:"rgba(204,85,0,0.12)",border:"rgba(204,85,0,0.32)"},
  violeta:{primary:"#7700CC",dim:"rgba(119,0,204,0.12)",border:"rgba(119,0,204,0.32)"},
  dorado:{primary:"#CC9900",dim:"rgba(204,153,0,0.12)",border:"rgba(204,153,0,0.32)"},
};
const applyTheme=(theme)=>{
  const t=COLOR_THEMES[theme]||COLOR_THEMES.magenta;
  const r=document.documentElement.style;
  r.setProperty("--primary",t.primary);r.setProperty("--primary-dim",t.dim);r.setProperty("--primary-border",t.border);
  r.setProperty("--mag",t.primary);r.setProperty("--mag-dim",t.dim);r.setProperty("--mag-border",t.border);
  r.setProperty("--mag-glow",t.border.replace("0.32","0.5"));
};

/* ── Exercise catalog ── */
const EX_CAT=[
  {name:"Press Banca",emoji:"🏋️",muscle:"Pecho",desc:"Baja la barra al pecho y empuja explosivo en banco plano.",tip:"Pies firmes, espalda ligeramente arqueada.",video:""},
  {name:"Dominadas",emoji:"💪",muscle:"Espalda / Bíceps",desc:"Sube hasta que el mentón pase la barra, controla el descenso.",tip:"Escápulas retraídas, 2-3 seg bajando.",video:""},
  {name:"Sentadilla",emoji:"🦵",muscle:"Cuádriceps / Glúteos",desc:"Baja a 90°, espalda recta, rodillas alineadas.",tip:"Talones en el suelo, pecho arriba.",video:""},
  {name:"Press Militar",emoji:"🙌",muscle:"Hombros",desc:"Empuja la barra desde hombros hasta extensión completa.",tip:"Core apretado, no arquees la espalda baja.",video:""},
  {name:"Peso Muerto",emoji:"🔱",muscle:"Espalda / Piernas",desc:"Levanta la barra del suelo con espalda neutra.",tip:"El peso no se separa del cuerpo, caderas atrás.",video:""},
  {name:"Hip Thrust",emoji:"🍑",muscle:"Glúteos",desc:"Espalda en banco, empuja caderas hacia arriba.",tip:"Contrae glúteos en la cima, pausa 1 seg.",video:""},
  {name:"Press Inclinado",emoji:"📐",muscle:"Pecho alto",desc:"Banco 30-45°, press con mancuernas.",tip:"Codos no bajen del hombro.",video:""},
  {name:"Curl Barra",emoji:"💫",muscle:"Bíceps",desc:"Flexiona codos llevando la barra al pecho.",tip:"Codos fijos, sin balanceo.",video:""},
  {name:"Fondos / Dips",emoji:"⬇️",muscle:"Tríceps / Pecho",desc:"En paralelas, baja y sube el cuerpo.",tip:"Inclinado: pecho. Vertical: tríceps.",video:""},
  {name:"Remo con Barra",emoji:"🚣",muscle:"Espalda media",desc:"Inclinado 45°, jala hacia el abdomen.",tip:"Retrae escápulas, codos pegados.",video:""},
  {name:"Sentadilla Goblet",emoji:"🏆",muscle:"Piernas / Core",desc:"Mancuerna al pecho, sentadilla profunda.",tip:"Talones en suelo, pecho arriba.",video:""},
  {name:"Shadow Boxing",emoji:"🥊",muscle:"Cardio / Coord.",desc:"Combinaciones de golpes al aire.",tip:"Guarda siempre alta, usa piernas.",video:""},
  {name:"Saco de Golpes",emoji:"🎯",muscle:"Fuerza / Cardio",desc:"Golpea con combinaciones de 2-3 golpes.",tip:"Usa rotación de cadera.",video:""},
  {name:"Salto de Cuerda",emoji:"🪢",muscle:"Cardio",desc:"Salta la cuerda con ritmo constante.",tip:"Aterriza suave en antepié.",video:""},
  {name:"Sentadilla Búlgara",emoji:"🎽",muscle:"Piernas / Glúteos",desc:"Pie trasero elevado, baja con la delantera.",tip:"Rodilla no pasa la punta del pie.",video:""},
  {name:"Plancha",emoji:"🧘",muscle:"Core",desc:"Posición horizontal apoyado en codos.",tip:"Caderas neutras, glúteos activos.",video:""},
];

/* ── Food DB (100 productos) ── */
const FOOD_DB=[
  {name:"Arroz blanco cocido",cal:130,protein:2.7,carbs:28,fat:0.3,unit:"100g",cat:"Cereales"},
  {name:"Arroz integral cocido",cal:111,protein:2.6,carbs:23,fat:0.9,unit:"100g",cat:"Cereales"},
  {name:"Arepa de maíz blanca",cal:165,protein:4,carbs:32,fat:2,unit:"1 und(80g)",cat:"Cereales"},
  {name:"Arepa de chócolo",cal:180,protein:4.5,carbs:35,fat:3,unit:"1 und(90g)",cat:"Cereales"},
  {name:"Pan integral",cal:247,protein:9,carbs:41,fat:4,unit:"100g",cat:"Cereales"},
  {name:"Pan tajado blanco",cal:265,protein:8,carbs:49,fat:3.5,unit:"100g",cat:"Cereales"},
  {name:"Avena en hojuelas",cal:389,protein:17,carbs:66,fat:7,unit:"100g",cat:"Cereales"},
  {name:"Granola sin azúcar",cal:380,protein:10,carbs:58,fat:12,unit:"100g",cat:"Cereales"},
  {name:"Papa pastusa cocida",cal:77,protein:2,carbs:17,fat:0.1,unit:"100g",cat:"Tubérculos"},
  {name:"Papa criolla cocida",cal:70,protein:2,carbs:15,fat:0.1,unit:"100g",cat:"Tubérculos"},
  {name:"Papa sabanera",cal:74,protein:2,carbs:16,fat:0.1,unit:"100g",cat:"Tubérculos"},
  {name:"Yuca cocida",cal:160,protein:1.4,carbs:38,fat:0.3,unit:"100g",cat:"Tubérculos"},
  {name:"Plátano maduro frito",cal:181,protein:1,carbs:37,fat:5,unit:"100g",cat:"Tubérculos"},
  {name:"Plátano verde cocido",cal:116,protein:1,carbs:27,fat:0.4,unit:"100g",cat:"Tubérculos"},
  {name:"Ñame cocido",cal:118,protein:1.5,carbs:28,fat:0.2,unit:"100g",cat:"Tubérculos"},
  {name:"Ahuyama cocida",cal:26,protein:1,carbs:6.5,fat:0.1,unit:"100g",cat:"Tubérculos"},
  {name:"Arracacha cocida",cal:99,protein:1.1,carbs:23,fat:0.3,unit:"100g",cat:"Tubérculos"},
  {name:"Fríjol negro cocido",cal:132,protein:8.9,carbs:24,fat:0.5,unit:"100g",cat:"Legumbres"},
  {name:"Fríjol rojo cocido",cal:127,protein:8.7,carbs:23,fat:0.5,unit:"100g",cat:"Legumbres"},
  {name:"Lentejas cocidas",cal:116,protein:9,carbs:20,fat:0.4,unit:"100g",cat:"Legumbres"},
  {name:"Garbanzo cocido",cal:164,protein:9,carbs:27,fat:2.6,unit:"100g",cat:"Legumbres"},
  {name:"Soya cocida",cal:173,protein:17,carbs:10,fat:9,unit:"100g",cat:"Legumbres"},
  {name:"Pechuga de pollo asada",cal:165,protein:31,carbs:0,fat:3.6,unit:"100g",cat:"Proteínas"},
  {name:"Pechuga de pollo cocida",cal:150,protein:29,carbs:0,fat:3,unit:"100g",cat:"Proteínas"},
  {name:"Muslo de pollo sin piel",cal:174,protein:24,carbs:0,fat:8,unit:"100g",cat:"Proteínas"},
  {name:"Carne de res molida (magra)",cal:215,protein:26,carbs:0,fat:12,unit:"100g",cat:"Proteínas"},
  {name:"Lomo de res",cal:189,protein:26,carbs:0,fat:9,unit:"100g",cat:"Proteínas"},
  {name:"Chuleta de cerdo",cal:242,protein:27,carbs:0,fat:14,unit:"100g",cat:"Proteínas"},
  {name:"Atún en agua (lata)",cal:116,protein:26,carbs:0,fat:1,unit:"100g",cat:"Proteínas"},
  {name:"Salmón asado",cal:208,protein:28,carbs:0,fat:10,unit:"100g",cat:"Proteínas"},
  {name:"Tilapia asada",cal:128,protein:26,carbs:0,fat:3,unit:"100g",cat:"Proteínas"},
  {name:"Bagre frito",cal:195,protein:22,carbs:0,fat:11,unit:"100g",cat:"Proteínas"},
  {name:"Huevo entero",cal:155,protein:13,carbs:1.1,fat:11,unit:"100g",cat:"Proteínas"},
  {name:"Clara de huevo",cal:52,protein:11,carbs:0.7,fat:0.2,unit:"100g",cat:"Proteínas"},
  {name:"Proteína de suero (whey)",cal:375,protein:80,carbs:7,fat:5,unit:"100g",cat:"Proteínas"},
  {name:"Chorizo santarrosano",cal:320,protein:14,carbs:3,fat:28,unit:"100g",cat:"Proteínas"},
  {name:"Leche entera",cal:61,protein:3.2,carbs:4.8,fat:3.3,unit:"100ml",cat:"Lácteos"},
  {name:"Leche descremada",cal:34,protein:3.4,carbs:5,fat:0.1,unit:"100ml",cat:"Lácteos"},
  {name:"Yogur griego natural",cal:97,protein:10,carbs:3.6,fat:5,unit:"100g",cat:"Lácteos"},
  {name:"Kumis natural",cal:62,protein:3.5,carbs:6,fat:2.5,unit:"100ml",cat:"Lácteos"},
  {name:"Queso campesino",cal:264,protein:20,carbs:2,fat:19,unit:"100g",cat:"Lácteos"},
  {name:"Queso doble crema",cal:358,protein:22,carbs:2,fat:29,unit:"100g",cat:"Lácteos"},
  {name:"Cuajada fresca",cal:98,protein:7,carbs:3,fat:6,unit:"100g",cat:"Lácteos"},
  {name:"Banano guineo",cal:89,protein:1.1,carbs:23,fat:0.3,unit:"1 und(118g)",cat:"Frutas"},
  {name:"Mango Tommy",cal:60,protein:0.8,carbs:15,fat:0.4,unit:"100g",cat:"Frutas"},
  {name:"Papaya",cal:43,protein:0.5,carbs:11,fat:0.3,unit:"100g",cat:"Frutas"},
  {name:"Mora de Castilla",cal:43,protein:1.4,carbs:9.6,fat:0.5,unit:"100g",cat:"Frutas"},
  {name:"Maracuyá pulpa",cal:97,protein:2.2,carbs:23,fat:0.7,unit:"100g",cat:"Frutas"},
  {name:"Piña",cal:50,protein:0.5,carbs:13,fat:0.1,unit:"100g",cat:"Frutas"},
  {name:"Guanábana",cal:66,protein:1,carbs:17,fat:0.3,unit:"100g",cat:"Frutas"},
  {name:"Manzana",cal:52,protein:0.3,carbs:14,fat:0.2,unit:"100g",cat:"Frutas"},
  {name:"Mandarina",cal:53,protein:0.8,carbs:13,fat:0.3,unit:"100g",cat:"Frutas"},
  {name:"Lulo",cal:25,protein:0.7,carbs:5,fat:0.2,unit:"100g",cat:"Frutas"},
  {name:"Fresa",cal:32,protein:0.7,carbs:8,fat:0.3,unit:"100g",cat:"Frutas"},
  {name:"Aguacate Hass",cal:160,protein:2,carbs:9,fat:15,unit:"100g",cat:"Grasas"},
  {name:"Aceite de oliva",cal:884,protein:0,carbs:0,fat:100,unit:"100ml",cat:"Grasas"},
  {name:"Aceite de coco",cal:862,protein:0,carbs:0,fat:100,unit:"100ml",cat:"Grasas"},
  {name:"Maní sin sal",cal:567,protein:26,carbs:16,fat:49,unit:"100g",cat:"Grasas"},
  {name:"Almendras",cal:579,protein:21,carbs:22,fat:50,unit:"100g",cat:"Grasas"},
  {name:"Nuez de nogal",cal:654,protein:15,carbs:14,fat:65,unit:"100g",cat:"Grasas"},
  {name:"Zanahoria",cal:41,protein:0.9,carbs:10,fat:0.2,unit:"100g",cat:"Verduras"},
  {name:"Espinaca",cal:23,protein:2.9,carbs:3.6,fat:0.4,unit:"100g",cat:"Verduras"},
  {name:"Brócoli",cal:34,protein:2.8,carbs:7,fat:0.4,unit:"100g",cat:"Verduras"},
  {name:"Tomate chonto",cal:18,protein:0.9,carbs:3.9,fat:0.2,unit:"100g",cat:"Verduras"},
  {name:"Cebolla cabezona",cal:40,protein:1.1,carbs:9,fat:0.1,unit:"100g",cat:"Verduras"},
  {name:"Habichuela",cal:31,protein:1.8,carbs:7,fat:0.1,unit:"100g",cat:"Verduras"},
  {name:"Pepino cohombro",cal:15,protein:0.7,carbs:3.6,fat:0.1,unit:"100g",cat:"Verduras"},
  {name:"Lechuga romana",cal:17,protein:1.2,carbs:3.3,fat:0.3,unit:"100g",cat:"Verduras"},
  {name:"Pimentón rojo",cal:31,protein:1,carbs:7,fat:0.3,unit:"100g",cat:"Verduras"},
  {name:"Mazorca desgranada",cal:96,protein:3.4,carbs:21,fat:1.5,unit:"100g",cat:"Verduras"},
  {name:"Caldo de pollo (casero)",cal:15,protein:1.5,carbs:1,fat:0.5,unit:"250ml",cat:"Otros"},
  {name:"Changua (leche+huevo)",cal:145,protein:8,carbs:6,fat:9,unit:"1 taza",cat:"Otros"},
  {name:"Pandequeso",cal:290,protein:8,carbs:42,fat:10,unit:"2 und",cat:"Otros"},
  {name:"Ajiaco santafereño",cal:185,protein:12,carbs:22,fat:5,unit:"1 taza",cat:"Otros"},
  {name:"Sancocho de pollo",cal:165,protein:14,carbs:18,fat:4,unit:"1 taza",cat:"Otros"},
  {name:"Mazamorra con leche",cal:175,protein:4,carbs:35,fat:2,unit:"1 taza",cat:"Otros"},
  {name:"Arroz con leche",cal:165,protein:3.5,carbs:32,fat:2.5,unit:"1 taza",cat:"Otros"},
  {name:"Chocolate santafereño",cal:120,protein:3,carbs:18,fat:4,unit:"1 taza(200ml)",cat:"Bebidas"},
  {name:"Agua de panela",cal:90,protein:0,carbs:23,fat:0,unit:"1 taza(250ml)",cat:"Bebidas"},
  {name:"Jugo de naranja natural",cal:45,protein:0.7,carbs:11,fat:0.2,unit:"100ml",cat:"Bebidas"},
  {name:"Jugo de lulo natural",cal:22,protein:0.5,carbs:4.5,fat:0.1,unit:"100ml",cat:"Bebidas"},
  {name:"Jugo de mora natural",cal:35,protein:0.8,carbs:8,fat:0.2,unit:"100ml",cat:"Bebidas"},
  {name:"Café negro sin azúcar",cal:2,protein:0.3,carbs:0,fat:0,unit:"1 taza(240ml)",cat:"Bebidas"},
  {name:"Leche de almendras",cal:17,protein:0.6,carbs:1.5,fat:1.1,unit:"100ml",cat:"Bebidas"},
  {name:"Batido proteico casero",cal:220,protein:25,carbs:20,fat:4,unit:"1 vaso(350ml)",cat:"Bebidas"},
  {name:"Hogao casero",cal:60,protein:1.2,carbs:7,fat:3,unit:"2 cdas",cat:"Salsas"},
  {name:"Ají de leche",cal:38,protein:0.8,carbs:5,fat:1.5,unit:"2 cdas",cat:"Salsas"},
  {name:"Guiso de tomate y cebolla",cal:45,protein:1,carbs:8,fat:1.5,unit:"2 cdas",cat:"Salsas"},
  {name:"Higo",cal:74,protein:0.8,carbs:19,fat:0.3,unit:"100g",cat:"Frutas"},
  {name:"Carambolo",cal:31,protein:1,carbs:7,fat:0.3,unit:"100g",cat:"Frutas"},
  {name:"Morcilla bogotana",cal:295,protein:12,carbs:10,fat:24,unit:"100g",cat:"Proteínas"},
  {name:"Empanada de pipián",cal:210,protein:4,carbs:30,fat:9,unit:"1 und",cat:"Otros"},
  {name:"Buñuelo",cal:265,protein:6,carbs:32,fat:13,unit:"2 und",cat:"Otros"},
  {name:"Patacón",cal:145,protein:1,carbs:28,fat:4.5,unit:"1 und(80g)",cat:"Tubérculos"},
];

/* ── Default weekly meal plan ── */
const mkDefaultWeekPlan=()=>{
  const plan={};
  DAYS_WEEK.forEach(d=>{
    plan[d]=[
      {meal:"Desayuno",foods:[{...FOOD_DB[6],grams:60},{...FOOD_DB[37],grams:200},{...FOOD_DB[32],grams:100}]},
      {meal:"Almuerzo",foods:[{...FOOD_DB[22],grams:180},{...FOOD_DB[0],grams:150},{...FOOD_DB[17],grams:100},{...FOOD_DB[53],grams:100}]},
      {meal:"Merienda",foods:[{...FOOD_DB[38],grams:150},{...FOOD_DB[34],grams:25}]},
      {meal:"Cena",foods:[{...FOOD_DB[25],grams:150},{...FOOD_DB[8],grams:120},{...FOOD_DB[59],grams:80}]},
    ];
  });
  return plan;
};

/* ── Default routine per goal ── */
const mkDefaultRoutine=(goal)=>{
  const mkSets=(n,reps,kg)=>Array.from({length:n},()=>({reps,kg,rpe:""}));
  if(goal==="Hipertrofia") return[
    {...EX_CAT[0],sets:mkSets(4,8,"80")},{...EX_CAT[1],sets:mkSets(4,6,"+10")},
    {...EX_CAT[6],sets:mkSets(3,10,"28")},{...EX_CAT[7],sets:mkSets(3,10,"35")},
  ];
  if(goal==="Definición") return[
    {...EX_CAT[10],sets:mkSets(4,12,"16")},{...EX_CAT[5],sets:mkSets(4,15,"40")},
    {...EX_CAT[4],sets:mkSets(3,10,"50")},{...EX_CAT[15],sets:mkSets(3,30,"BW")},
  ];
  if(goal==="Resistencia"||goal==="Boxeo") return[
    {...EX_CAT[11],sets:mkSets(3,1,"BW")},{...EX_CAT[12],sets:mkSets(3,1,"BW")},
    {...EX_CAT[13],sets:mkSets(3,1,"BW")},{...EX_CAT[15],sets:mkSets(3,60,"BW")},
  ];
  return[
    {...EX_CAT[0],sets:mkSets(5,5,"90")},{...EX_CAT[4],sets:mkSets(5,5,"100")},
    {...EX_CAT[2],sets:mkSets(5,5,"100")},{...EX_CAT[3],sets:mkSets(4,5,"60")},
  ];
};

/* ── Weekly routine plan (exercises per day) ── */
const mkWeekRoutine=(goal)=>{
  const base=mkDefaultRoutine(goal);
  return {
    Lun:base, Mar:base.slice(0,3), Mié:[...base].reverse().slice(0,3),
    Jue:base, Vie:base.slice(1), Sáb:base.slice(0,2), Dom:[]
  };
};

/* ═══ INITIAL DATA ════════════════════════════════════════════════════════ */
const INIT_CLIENTS=[
  {id:1,name:"Carlos Méndez",init:"CM",plan:"Personal",goal:"Hipertrofia",weight:75.8,targetW:82,energy:4,sleep:7,diet:82,hydration:6,maxHydration:12,paid:true,semaphore:"green",sessions:7,totalSessions:12,startDate:mkDate(-10),photo:null,parqDone:true,password:"cliente123",supplements:["Creatina 5g pre","Proteína 40g post","BCAA 10g intra"],suppComments:[],suppAlerts:[],pathologies:[],weekPlan:mkDefaultWeekPlan(),weekRoutine:mkWeekRoutine("Hipertrofia"),theme:"magenta"},
  {id:2,name:"Laura Sánchez",init:"LS",plan:"Semi-Personal",goal:"Definición",weight:61.6,targetW:58,energy:5,sleep:8,diet:95,hydration:8,maxHydration:12,paid:true,semaphore:"green",sessions:4,totalSessions:12,startDate:mkDate(-5),photo:null,parqDone:true,password:"cliente123",supplements:["L-Carnitina 2g pre","Cafeína 200mg","Proteína 35g post"],suppComments:[],suppAlerts:[],pathologies:[],weekPlan:mkDefaultWeekPlan(),weekRoutine:mkWeekRoutine("Definición"),theme:"violeta"},
  {id:3,name:"Andrés Torres",init:"AT",plan:"Boxeo",goal:"Resistencia",weight:78,targetW:75,energy:3,sleep:6,diet:55,hydration:4,maxHydration:12,paid:false,semaphore:"red",sessions:9,totalSessions:12,startDate:mkDate(-20),photo:null,parqDone:true,password:"cliente123",supplements:["Cafeína 150mg","Beta-Alanina 3g","Isotónica intra"],suppComments:[],suppAlerts:[],pathologies:["Espolón calcáneo derecho"],weekPlan:mkDefaultWeekPlan(),weekRoutine:mkWeekRoutine("Resistencia"),theme:"azul"},
  {id:4,name:"María Jiménez",init:"MJ",plan:"Personal",goal:"Definición",weight:63,targetW:60,energy:4,sleep:7,diet:78,hydration:5,maxHydration:12,paid:true,semaphore:"yellow",sessions:10,totalSessions:12,startDate:mkDate(-25),photo:null,parqDone:true,password:"cliente123",supplements:["CLA 3g","Multivitamínico","Proteína 30g post"],suppComments:[],suppAlerts:[],pathologies:["Lumbalgia crónica"],weekPlan:mkDefaultWeekPlan(),weekRoutine:mkWeekRoutine("Definición"),theme:"naranja"},
];

const INIT_SESSIONS=[
  {id:"s1",clientId:1,date:"2026-04-12",hour:"6:00",status:"completada",plan:"Personal"},
  {id:"s2",clientId:2,date:"2026-04-12",hour:"7:00",status:"completada",plan:"Semi-Personal"},
  {id:"s3",clientId:3,date:"2026-04-13",hour:"17:00",status:"cancelada",plan:"Boxeo"},
  {id:"s4",clientId:4,date:"2026-04-13",hour:"9:00",status:"completada",plan:"Personal"},
  {id:"s5",clientId:1,date:"2026-04-15",hour:"6:00",status:"pendiente",plan:"Personal"},
  {id:"s6",clientId:4,date:"2026-04-15",hour:"9:00",status:"pendiente",plan:"Personal"},
  {id:"s7",clientId:2,date:"2026-04-16",hour:"18:00",status:"pendiente",plan:"Semi-Personal"},
  {id:"s8",clientId:3,date:"2026-04-17",hour:"17:00",status:"pendiente",plan:"Boxeo"},
];

const INIT_TRAINER={id:"t1",name:"Jhojan Rincón",init:"JR",photo:null,role:"Entrenador Personal",specialty:"Biomecánica · Alto Rendimiento",password:"coach2024",
  socials:[{icon:"ig",label:"Instagram",val:"@fitcoachjhojan",color:"#E1306C",url:"https://instagram.com/fitcoachjhojan"},{icon:"wa",label:"WhatsApp",val:"302 667 7151",color:"#25D366",url:"https://wa.me/573026677151"},{icon:"tt",label:"TikTok",val:"@profe..jhojan.rin",color:"#fff",url:"https://tiktok.com"}]};

/* ═══ HOOKS ════════════════════════════════════════════════════════════════ */
function useTimer(init=90){
  const [sec,setSec]=useState(init);const[run,setRun]=useState(false);const[flash,setFlash]=useState(false);const ref=useRef();
  const beep=(f=880,d=0.3,v=0.4)=>{try{const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();const g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.setValueAtTime(v,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);o.start(c.currentTime);o.stop(c.currentTime+d);}catch{}};
  const startBeep=()=>{beep(660,0.12);setTimeout(()=>beep(880,0.22),150);};
  const endBeep=()=>{beep(440,0.18);setTimeout(()=>beep(330,0.18),200);setTimeout(()=>beep(220,0.38),400);};
  useEffect(()=>{if(run&&sec>0){ref.current=setTimeout(()=>setSec(s=>s-1),1000);}else if(run&&sec===0){setRun(false);setFlash(true);endBeep();setTimeout(()=>setFlash(false),1500);}return()=>clearTimeout(ref.current);},[run,sec]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return{fmt:fmt(sec),run,flash,start:()=>{if(!run){startBeep();setRun(true);}},pause:()=>setRun(false),reset:(v=init)=>{setSec(v);setRun(false);}};
}

function useScrollHide(ref){
  const [hidden,setHidden]=useState(false);const last=useRef(0);
  useEffect(()=>{const el=ref.current;if(!el)return;const h=()=>{const d=el.scrollTop-last.current;if(d>30)setHidden(true);else if(d<-10)setHidden(false);last.current=el.scrollTop;};el.addEventListener("scroll",h);return()=>el.removeEventListener("scroll",h);},[]);
  return hidden;
}

/* ═══ SHARED COMPONENTS ════════════════════════════════════════════════════ */
function PhotoUpload({photo,onPhoto,size=80,label=true}){
  const ref=useRef();
  return(
    <div className="photo-upload" style={{width:size,height:size}} onClick={()=>ref.current.click()}>
      {photo?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<><I n="camera" s={16}/>{label&&<span style={{fontSize:8,color:"var(--gray)",marginTop:2}}>Foto</span>}</>}
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onPhoto(ev.target.result);r.readAsDataURL(f);}}/>
    </div>
  );
}

function Av({photo,init,sz="md",extra={}}){
  const s={sm:34,md:44,lg:62}[sz];
  return <div className={`avatar av-${sz}`} style={{width:s,height:s,...extra}}>{photo?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:init}</div>;
}

function PwField({value,onChange,placeholder="Nueva contraseña"}){
  const [show,setShow]=useState(false);
  return <div style={{position:"relative"}}><input className="inp" type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{paddingRight:38}}/><button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--gray)",display:"flex"}}><I n={show?"eyeoff":"eye"} s={13}/></button></div>;
}

function ChangePwModal({onSave,onClose,current=""}){
  const [o,setO]=useState("");const[n,setN]=useState("");const[n2,setN2]=useState("");const[err,setErr]=useState("");
  const go=()=>{if(current&&o!==current){setErr("Contraseña actual incorrecta");return;}if(n.length<6){setErr("Mínimo 6 caracteres");return;}if(n!==n2){setErr("No coinciden");return;}onSave(n);onClose();};
  return <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box" style={{maxWidth:340}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,color:"var(--primary)"}}>Cambiar Contraseña</div><button className="btn btn-ghost btn-sm" onClick={onClose}><I n="x" s={11}/></button></div>
      {current&&<div style={{marginBottom:7}}><label className="inp-lbl">Contraseña actual</label><PwField value={o} onChange={setO} placeholder="Actual"/></div>}
      <div style={{marginBottom:7}}><label className="inp-lbl">Nueva</label><PwField value={n} onChange={setN}/></div>
      <div style={{marginBottom:9}}><label className="inp-lbl">Confirmar</label><PwField value={n2} onChange={setN2} placeholder="Repetir nueva"/></div>
      {err&&<div style={{fontSize:11,color:"var(--danger)",marginBottom:7}}>{err}</div>}
      <div style={{display:"flex",gap:6}}><button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={onClose}>Cancelar</button><button className="btn btn-primary" style={{flex:2,justifyContent:"center"}} onClick={go}><I n="check" s={11}/>Guardar</button></div>
    </div>
  </div>;
}

function TimerCard({timer}){
  return <div className="card" style={{textAlign:"center",padding:12}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:2}}><I n="sound" s={11}/><span style={{fontSize:7,color:"var(--gray)",textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>Cronómetro · Sonido ON</span></div>
    <div className={`timer-display${timer.flash?" timer-flash":""}`}>{timer.fmt}</div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>{[30,60,90,120].map(s=><button key={s} className="btn btn-ghost btn-sm" onClick={()=>timer.reset(s)}>{s}s</button>)}</div>
    <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:7}}>
      <button className="btn btn-primary" style={{padding:"7px 13px"}} onClick={timer.run?timer.pause:timer.start}><I n={timer.run?"pause":"play"} s={11}/>{timer.run?"Pausar":"Iniciar"}</button>
      <button className="btn btn-ghost" style={{padding:"7px 9px"}} onClick={()=>timer.reset()}><I n="reset" s={11}/></button>
    </div>
  </div>;
}

/* ── Exercise card with per-set table ── */
function ExCard({ex,editable=false,onChange,onEditMeta}){
  const [meta,setMeta]=useState(false);const[loc,setLoc]=useState({...ex});
  if(!ex) return null;
  const sets=ex.sets||[{reps:10,kg:"",rpe:""},{reps:10,kg:"",rpe:""},{reps:10,kg:"",rpe:""},{reps:10,kg:"",rpe:""}];
  const updSet=(i,f,v)=>{const s=[...sets];s[i]={...s[i],[f]:v};onChange&&onChange({...ex,sets:s});};
  const totalVol=sets.reduce((a,s)=>{const kg=parseFloat(s.kg)||0;const reps=parseFloat(s.reps)||0;return a+kg*reps;},0);
  return <div className="ex-card">
    <div className="ex-emoji-wrap">
      {ex.photo?<img src={ex.photo} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} alt=""/>:<span>{ex.emoji||"💪"}</span>}
      {(onEditMeta||editable)&&<button onClick={()=>setMeta(true)} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.6)",border:"1px solid var(--primary-border)",borderRadius:6,padding:"3px 7px",color:"var(--primary)",cursor:"pointer",fontSize:9,fontFamily:"var(--font)",fontWeight:700,display:"flex",alignItems:"center",gap:3}}><I n="edit" s={10}/>Editar</button>}
    </div>
    {meta&&<div style={{padding:11,background:"var(--surface3)",borderTop:"1px solid var(--primary-border)"}}>
      <div className="g2" style={{gap:6,marginBottom:6}}><div><label className="inp-lbl">Emoji</label><input className="inp" value={loc.emoji||""} onChange={e=>setLoc(x=>({...x,emoji:e.target.value}))}/></div><div><label className="inp-lbl">Nombre</label><input className="inp" value={loc.name||""} onChange={e=>setLoc(x=>({...x,name:e.target.value}))}/></div></div>
      <div style={{marginBottom:6}}><label className="inp-lbl">Músculo</label><input className="inp" value={loc.muscle||""} onChange={e=>setLoc(x=>({...x,muscle:e.target.value}))}/></div>
      <div style={{marginBottom:6}}><label className="inp-lbl">Descripción</label><textarea className="inp" rows={2} value={loc.desc||""} onChange={e=>setLoc(x=>({...x,desc:e.target.value}))}/></div>
      <div style={{marginBottom:6}}><label className="inp-lbl">Tip</label><input className="inp" value={loc.tip||""} onChange={e=>setLoc(x=>({...x,tip:e.target.value}))}/></div>
      <div style={{marginBottom:6}}><label className="inp-lbl">Video YouTube</label><div style={{display:"flex",gap:5}}><input className="inp" value={loc.video||""} onChange={e=>setLoc(x=>({...x,video:e.target.value}))} placeholder="https://youtube.com/..."/>{loc.video&&<a href={loc.video} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><I n="video" s={11}/></a>}</div></div>
      <div style={{marginBottom:6}}><label className="inp-lbl">Foto referencia</label><PhotoUpload photo={loc.photo} onPhoto={p=>setLoc(x=>({...x,photo:p}))} size={55} label/></div>
      <div style={{display:"flex",gap:5}}><button className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:"center"}} onClick={()=>setMeta(false)}>Cancelar</button><button className="btn btn-primary btn-sm" style={{flex:2,justifyContent:"center"}} onClick={()=>{onChange&&onChange({...ex,...loc});onEditMeta&&onEditMeta({...ex,...loc});setMeta(false);}}><I n="check" s={10}/>Guardar</button></div>
    </div>}
    <div style={{padding:"9px 11px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
        <div><div style={{fontWeight:800,fontSize:12}}>{ex.name}</div><div style={{fontSize:9,color:"var(--primary)",fontWeight:600}}>{ex.muscle}</div></div>
        <div style={{textAlign:"right"}}>
          {ex.video&&<a href={ex.video} target="_blank" rel="noopener noreferrer" style={{color:"var(--danger)",fontSize:9,display:"flex",alignItems:"center",gap:2,textDecoration:"none",marginBottom:2}}><I n="video" s={10}/>YouTube</a>}
          <div style={{fontSize:9,color:"var(--gray)"}}>Vol: <strong style={{color:"var(--primary)"}}>{totalVol>0?`${totalVol}kg`:"—"}</strong></div>
        </div>
      </div>
      <div style={{fontSize:9,color:"var(--gray)",lineHeight:1.4,marginBottom:3}}>{ex.desc}</div>
      <div style={{fontSize:8,color:"var(--primary)",fontWeight:600,marginBottom:7}}>💡 {ex.tip}</div>
      <div style={{overflowX:"auto"}}>
        <table className="ex-set-table">
          <thead><tr><th>Serie</th><th>Reps</th><th>Kg/Carga</th><th>RPE</th><th>Vol</th></tr></thead>
          <tbody>{sets.map((s,i)=>{
            const vol=(parseFloat(s.kg)||0)*(parseFloat(s.reps)||0);
            return <tr key={i}>
              <td style={{fontWeight:700,color:"var(--primary)"}}>{i+1}</td>
              <td>{editable?<input className="set-inp" type="number" min="1" value={s.reps} onChange={e=>updSet(i,"reps",e.target.value)}/>:<strong>{s.reps}</strong>}</td>
              <td>{editable?<input className="set-inp" value={s.kg} onChange={e=>updSet(i,"kg",e.target.value)} placeholder="—"/>:<strong>{s.kg||"—"}</strong>}</td>
              <td>{editable?<input className="set-inp" type="number" min="1" max="10" value={s.rpe||""} onChange={e=>updSet(i,"rpe",e.target.value)} placeholder="—"/>:<strong style={{color:s.rpe>=9?"var(--danger)":s.rpe>=7?"var(--warn)":"var(--success)"}}>{s.rpe||"—"}</strong>}</td>
              <td style={{fontSize:9,color:"var(--gray)"}}>{vol>0?`${vol}kg`:"—"}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </div>
  </div>;
}

/* ── Draggable food slot ── */
function FoodMealSlot({slot,mealIdx,onDrop,onRemove,macroScale,dragItem,setDragItem,editable=false,onAdd}){
  const [over,setOver]=useState(false);const[search,setSearch]=useState("");const[grams,setGrams]=useState(100);
  const filtered=search?FOOD_DB.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())||f.cat.toLowerCase().includes(search.toLowerCase())).slice(0,8):[];
  return <div className="card" style={{marginBottom:7,borderColor:over?"var(--primary)":undefined}}
    onDragOver={e=>{e.preventDefault();setOver(true);}}
    onDragLeave={()=>setOver(false)}
    onDrop={e=>{e.preventDefault();setOver(false);if(dragItem)onDrop(dragItem,mealIdx);}}>
    <div style={{fontWeight:700,fontSize:11,color:"var(--primary)",marginBottom:5}}>{MEAL_ICONS[mealIdx]} {slot.meal}</div>
    {slot.foods.length===0&&<div style={{fontSize:9,color:"var(--gray)",fontStyle:"italic",padding:"3px 0"}}>Arrastra aquí o agrega alimentos</div>}
    {slot.foods.map((f,fi)=>{const m=macroScale(f);return <div key={fi} className="food-chip" draggable onDragStart={()=>setDragItem({food:f,fromMeal:mealIdx,fromIdx:fi})}>
      <I n="drag" s={11}/><div style={{flex:1}}><div style={{fontSize:10,fontWeight:600}}>{f.name} <span style={{color:"var(--gray)",fontSize:8}}>({f.grams}g)</span></div><div style={{fontSize:8,color:"var(--gray)"}}>{m.cal}kcal · P:{m.protein}g · C:{m.carbs}g</div></div>
      {(editable||onRemove)&&<button className="btn btn-danger btn-sm" style={{padding:"1px 5px"}} onClick={()=>onRemove(mealIdx,fi)}><I n="trash" s={10}/></button>}
    </div>;})}
    {editable&&<div style={{marginTop:5}}>
      <div style={{display:"flex",gap:4,marginBottom:3}}><input className="inp" style={{fontSize:10,padding:"5px 8px"}} placeholder="🔍 Buscar alimento..." value={search} onChange={e=>setSearch(e.target.value)}/><input type="number" className="inp" style={{width:60,fontSize:10,padding:"5px 6px"}} value={grams} onChange={e=>setGrams(Number(e.target.value)||100)} placeholder="g"/></div>
      {filtered.length>0&&<div style={{background:"var(--surface3)",borderRadius:7,border:"1px solid var(--primary-border)",maxHeight:140,overflowY:"auto"}}>
        {filtered.map((f,i)=><div key={i} className="food-search-item" style={{fontSize:10}} onClick={()=>{onAdd&&onAdd({...f,grams},mealIdx);setSearch("");}}>
          <span style={{fontWeight:700}}>{f.name}</span> <span className="badge bgx" style={{fontSize:7}}>{f.cat}</span>
          <div style={{fontSize:8,color:"var(--gray)"}}>{f.cal}kcal/{f.unit}</div>
        </div>)}
      </div>}
      <div style={{fontSize:7,color:"var(--gray)",opacity:0.5,marginTop:2}}>↕ Sostén y arrastra para mover entre comidas</div>
    </div>}
  </div>;
}

/* ═══ DRAGGABLE CLIENT LIST ════════════════════════════════════════════════ */
function DraggableClientList({clients,onReorder,onSelect,onRemove,extra}){
  const [dragging,setDragging]=useState(null);const[over,setOver]=useState(null);
  const drop=(toIdx)=>{if(dragging===null||dragging===toIdx)return;const arr=[...clients];const [item]=arr.splice(dragging,1);arr.splice(toIdx,0,item);onReorder(arr);setDragging(null);setOver(null);};
  return <div>{clients.map((c,i)=><div key={c.id}
    draggable onDragStart={()=>setDragging(i)} onDragEnd={()=>{setDragging(null);setOver(null);}}
    onDragOver={e=>{e.preventDefault();setOver(i);}} onDrop={()=>drop(i)}
    className={`row-item${dragging===i?" dragging-row":""}${over===i&&dragging!==i?" drag-target":""}`}
    style={{marginBottom:7,cursor:"grab"}}>
    <div className="drag-handle"><I n="drag" s={12}/></div>
    <Av photo={c.photo} init={c.init} sz="md"/>
    <div style={{flex:1,cursor:"pointer"}} onClick={()=>onSelect&&onSelect(c)}>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}>
        <span style={{fontWeight:800,fontSize:13}}>{c.name}</span><span className="badge bm">{c.plan}</span>
        {!c.paid&&<span className="badge bgr">💳</span>}
        {(c.suppAlerts||[]).length>0&&<span className="badge bgr">⚠️{c.suppAlerts.length}</span>}
      </div>
      <div style={{fontSize:9,color:"var(--gray)"}}>{c.goal} · {c.sessions}/{c.totalSessions} ses.</div>
      {(c.pathologies||[]).length>0&&<div style={{marginTop:2}}>{c.pathologies.map((p,pi)=><span key={pi} className="patho-tag" style={{fontSize:7,padding:"1px 5px"}}>{p}</span>)}</div>}
    </div>
    <div className={`sem sem-${c.semaphore}`}/>
    {extra&&extra(c)}
    <I n="arrow" s={10}/>
  </div>)}</div>;
}

/* ═══ ROOT ════════════════════════════════════════════════════════════════ */
export default function App(){
  const [screen,setScreen]=useState("login");const[activeUser,setActiveUser]=useState(null);
  const [clients,setClients]=useState(INIT_CLIENTS);const[trainer,setTrainer]=useState(INIT_TRAINER);
  const [sessions,setSessions]=useState(INIT_SESSIONS);const[globalTheme,setGlobalTheme]=useState("magenta");
  const [adminPw,setAdminPw]=useState("admin2024");
  const [trainers,setTrainers]=useState([INIT_TRAINER]);

  useEffect(()=>applyTheme(globalTheme),[globalTheme]);

  const updClient=c=>setClients(cs=>cs.map(x=>x.id===c.id?c:x));
  const addClient=c=>setClients(cs=>[...cs,{...c,id:Date.now()}]);
  const rmClient=id=>{setClients(cs=>cs.filter(x=>x.id!==id));setSessions(ss=>ss.filter(s=>s.clientId!==id));};
  const reorderClients=arr=>setClients(arr);
  const addTrainer=t=>setTrainers(ts=>[...ts,{...t,id:Date.now()}]);
  const rmTrainer=id=>setTrainers(ts=>ts.filter(x=>x.id!==id));

  const allUsers=[
    {u:"admin",p:adminPw,role:"admin"},
    {u:"jhojan",p:trainer.password,role:"trainer"},
    {u:trainer.name.toLowerCase().replace(/\s/g,""),p:trainer.password,role:"trainer"},
    ...trainers.filter((_,i)=>i>0).map(t=>({u:t.name.toLowerCase().replace(/\s/g,""),p:t.password||"coach2024",role:"trainer_extra",trainerId:t.id})),
    ...clients.map(c=>({u:c.name.toLowerCase().replace(/\s/g,""),p:c.password||"cliente123",role:"client",clientId:c.id})),
  ];

  const login=(role,data={})=>{setActiveUser({role,...data});setScreen(role);};
  const logout=()=>{setScreen("login");setActiveUser(null);};

  if(screen==="login") return <LoginScreen users={allUsers} onLogin={login}/>;
  if(screen==="admin") return <AdminPanel clients={clients} trainers={trainers} trainer={trainer} setTrainer={setTrainer} sessions={sessions} setSessions={setSessions} onLogout={logout} onUpdClient={updClient} onAddClient={addClient} onRmClient={rmClient} onReorder={reorderClients} onAddTrainer={addTrainer} onRmTrainer={rmTrainer} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} adminPw={adminPw} setAdminPw={setAdminPw}/>;
  if(screen==="trainer") return <TrainerApp clients={clients} sessions={sessions} setSessions={setSessions} trainer={trainer} setTrainer={setTrainer} onLogout={logout} onUpdClient={updClient} onAddClient={addClient} onRmClient={rmClient} onReorder={reorderClients}/>;
  if(screen==="client"){
    const c=clients.find(x=>x.id===activeUser?.clientId);
    if(!c) return null;
    if(!c.parqDone) return <PARQScreen onDone={()=>updClient({...c,parqDone:true})} onBack={logout}/>;
    return <ClientApp c={c} sessions={sessions} setSessions={setSessions} onLogout={logout} onUpdate={updClient}/>;
  }
  return null;
}

/* ═══ LOGIN ════════════════════════════════════════════════════════════════ */
function LoginScreen({users,onLogin}){
  const sv=()=>{try{return JSON.parse(localStorage.getItem(LS_KEY)||"{}");}catch{return{};}};
  const s=sv();const[u,setU]=useState(s.u||"");const[p,setP]=useState(s.p||"");
  const[show,setShow]=useState(false);const[rem,setRem]=useState(!!s.u);const[err,setErr]=useState("");
  const go=()=>{const f=users.find(x=>x.u===u.toLowerCase().replace(/\s/g,"")&&x.p===p);if(!f){setErr("Usuario o contraseña incorrectos");return;}if(rem){try{localStorage.setItem(LS_KEY,JSON.stringify({u,p}));}catch{}}else{try{localStorage.removeItem(LS_KEY);}catch{}}setErr("");onLogin(f.role,f.clientId?{clientId:f.clientId}:{});};
  return <>
    <style>{CSS}</style>
    <div className="login-screen"><div className="login-lines"/><div className="login-glow"/>
      <div style={{position:"relative",zIndex:1,width:330}} className="fade-up">
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:44,fontWeight:900,color:"var(--primary)",lineHeight:1,letterSpacing:-2}}>JHOJAN</div>
          <div style={{fontFamily:"var(--font-d)",fontSize:24,fontWeight:700,color:"var(--white)",letterSpacing:-1}}>COACH</div>
          <div style={{fontSize:8,color:"var(--gray)",letterSpacing:2,fontWeight:700,textTransform:"uppercase",marginTop:4}}>Alto Rendimiento · Athletic Tunal</div>
          <div style={{fontSize:9,color:"var(--primary)",fontWeight:600,marginTop:2}}>@fitcoachjhojan</div>
        </div>
        <div className="card" style={{display:"flex",flexDirection:"column",gap:8}}>
          <div><label className="inp-lbl">Usuario</label><input className="inp" value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="nombre de usuario"/></div>
          <div><label className="inp-lbl">Contraseña</label><PwField value={p} onChange={setP}/></div>
          <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setRem(s=>!s)}>
            <div className={`check-circle ${rem?"done":""}`} style={{width:16,height:16}}>{rem&&<I n="check" s={8}/>}</div>
            <span style={{fontSize:10,color:"var(--gray)"}}>Recordar sesión</span>
          </div>
          {err&&<div style={{fontSize:10,color:"var(--danger)",textAlign:"center"}}>{err}</div>}
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:10,fontSize:12,marginTop:2}} onClick={go}>Ingresar →</button>
        </div>
        <div style={{marginTop:10,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          {[{icon:"ig",val:"@fitcoachjhojan",color:"#E1306C"},{icon:"wa",val:"302 667 7151",color:"#25D366"},{icon:"tt",val:"@profe..jhojan.rin",color:"#fff"}].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:3,fontSize:8,color:s.color,fontWeight:700}}><I n={s.icon} s={11}/>{s.val}</div>
          ))}
        </div>
      </div>
    </div>
  </>;
}

/* ═══ PAR-Q ════════════════════════════════════════════════════════════════ */
function PARQScreen({onDone,onBack}){
  const Qs=["¿Enfermedad cardíaca diagnosticada?","¿Dolor en el pecho durante actividad?","¿Mareos o desmayos recientes?","¿Lesión ósea o articular activa?","¿Medicamentos para presión arterial?","¿Razón física que limite el ejercicio?"];
  const [ans,setAns]=useState({});const[signed,setSigned]=useState(false);
  const done=Object.keys(ans).length===Qs.length&&signed;
  return <>
    <style>{CSS}</style>
    <div className="login-screen"><div className="login-lines"/><div className="login-glow"/>
      <div style={{position:"relative",zIndex:1,width:450,maxHeight:"90vh",overflow:"auto",padding:6}} className="fade-up">
        <div className="card">
          <div style={{display:"flex",gap:8,marginBottom:13}}><span style={{color:"var(--primary)"}}><I n="shield" s={22}/></span><div><div style={{fontFamily:"var(--font-d)",fontSize:17,fontWeight:700,color:"var(--primary)"}}>Filtro Médico PAR-Q</div><div style={{fontSize:8,color:"var(--gray)"}}>Solo se realiza una vez</div></div></div>
          {Qs.map((q,i)=><div key={i} style={{background:"var(--surface2)",borderRadius:8,padding:"7px 9px",border:"1px solid #222",marginBottom:5}}>
            <div style={{fontSize:10,marginBottom:5}}>{i+1}. {q}</div>
            <div style={{display:"flex",gap:5}}>{["Sí","No"].map(v=><button key={v} className="btn btn-sm" style={{flex:1,justifyContent:"center",background:ans[i]===v?"var(--primary)":undefined,color:ans[i]===v?"var(--white)":"var(--gray)",border:ans[i]!==v?"1px solid #2a2a2a":undefined}} onClick={()=>setAns(a=>({...a,[i]:v}))}>{v}</button>)}</div>
          </div>)}
          <div style={{background:"var(--primary-dim)",borderRadius:8,padding:9,border:"1px solid var(--primary-border)",margin:"9px 0",fontSize:9,color:"var(--gray)",lineHeight:1.6}}>Declaro que la información es verídica y eximo a <strong style={{color:"var(--primary)"}}>@fitcoachjhojan</strong> de responsabilidad. Acepto Términos en Athletic Tunal.</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:11,cursor:"pointer"}} onClick={()=>setSigned(s=>!s)}>
            <div className={`check-circle ${signed?"done":""}`}>{signed&&<I n="check" s={8}/>}</div>
            <span style={{fontSize:11}}>Firmo digitalmente y acepto los términos</span>
          </div>
          <div style={{display:"flex",gap:6}}><button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={onBack}>Cancelar</button><button className="btn btn-primary" style={{flex:2,justifyContent:"center",padding:9,opacity:done?1:0.4}} disabled={!done} onClick={onDone}><I n="check" s={10}/>Registrar</button></div>
        </div>
      </div>
    </div>
  </>;
}

/* ═══ SIDEBAR (collapsible) ════════════════════════════════════════════════ */
function Sidebar({nav,tab,setTab,extra,onLogout,logo="JC"}){
  return <div className="sidebar">
    <div className="logo-mark pulse-p" style={{fontSize:10}}>{logo}</div>
    {nav.map(n=><button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
      <div className="nav-icon"><I n={n.icon} s={16}/></div>
      <span className="nav-label">{n.label}</span>
    </button>)}
    <div style={{flex:1}}/>
    {extra}
    <button className="nav-btn" onClick={onLogout}><div className="nav-icon"><I n="logout" s={16}/></div><span className="nav-label">Salir</span></button>
  </div>;
}

/* ═══ ADMIN PANEL ══════════════════════════════════════════════════════════ */
function AdminPanel({clients,trainers,trainer,setTrainer,sessions,setSessions,onLogout,onUpdClient,onAddClient,onRmClient,onReorder,onAddTrainer,onRmTrainer,globalTheme,setGlobalTheme,adminPw,setAdminPw}){
  const [tab,setTab]=useState("overview");const[editC,setEditC]=useState(null);const[showAddC,setShowAddC]=useState(false);const[showAddT,setShowAddT]=useState(false);const[showPw,setShowPw]=useState(false);
  const NAV=[{id:"overview",icon:"grid",label:"Panel"},{id:"clients",icon:"users",label:"Usuarios"},{id:"trainers",icon:"person",label:"Entrenadores"},{id:"sessions",icon:"cal",label:"Sesiones"},{id:"themes",icon:"palette",label:"Temas"}];
  return <>
    <style>{CSS}</style>
    <div className="app">
      <Sidebar nav={NAV} tab={tab} setTab={setTab} onLogout={onLogout} logo="JC ADM"
        extra={<button className="nav-btn" onClick={()=>setShowPw(true)}><div className="nav-icon"><I n="key" s={16}/></div><span className="nav-label">Clave</span></button>}/>
      <div className="main">
        <div className="topbar">
          <div><div className="topbar-title">Panel Administrador</div><div className="topbar-sub">Acceso total · Jhojan Coach</div></div>
          <span className="badge bgr">🔴 ADMIN</span>
        </div>
        <div className="content fade-up">
          {tab==="overview"&&<AdminOverview clients={clients} sessions={sessions}/>}
          {tab==="clients"&&<AdminClients clients={clients} onEdit={setEditC} onAdd={()=>setShowAddC(true)} onRemove={onRmClient} onReorder={onReorder} onReset={c=>onUpdClient({...c,password:"cliente123"})}/>}
          {tab==="trainers"&&<AdminTrainers trainers={trainers} trainer={trainer} setTrainer={setTrainer} onAdd={()=>setShowAddT(true)} onRm={onRmTrainer}/>}
          {tab==="sessions"&&<AdminSessions sessions={sessions} clients={clients} setSessions={setSessions}/>}
          {tab==="themes"&&<AdminThemes clients={clients} globalTheme={globalTheme} setGlobalTheme={setGlobalTheme} onUpdClient={onUpdClient}/>}
        </div>
      </div>
    </div>
    {editC&&<EditClientModal c={editC} onSave={c=>{onUpdClient(c);setEditC(null);}} onClose={()=>setEditC(null)}/>}
    {showAddC&&<AddClientModal onSave={c=>{onAddClient(c);setShowAddC(false);}} onClose={()=>setShowAddC(false)}/>}
    {showAddT&&<AddTrainerModal onSave={t=>{onAddTrainer(t);setShowAddT(false);}} onClose={()=>setShowAddT(false)}/>}
    {showPw&&<ChangePwModal current={adminPw} onSave={setAdminPw} onClose={()=>setShowPw(false)}/>}
  </>;
}

function AdminOverview({clients,sessions}){
  const comp=sessions.filter(s=>s.status==="completada").length;const pend=clients.filter(c=>!c.paid).length;
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div className="g4">{[{l:"Usuarios",v:clients.length,i:"users"},{l:"Sin pagar",v:pend,i:"ticket",w:pend>0},{l:"Completadas",v:comp,i:"check"},{l:"Alertas",v:clients.reduce((a,c)=>(c.suppAlerts||[]).length+a,0),i:"alert"}].map((s,i)=><div key={i} className="card"><div style={{color:s.w&&s.v>0?"var(--danger)":"var(--primary)",marginBottom:3}}><I n={s.i} s={17}/></div><div className="stat-val" style={{color:s.w&&s.v>0?"var(--danger)":undefined}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>)}</div>
    <div className="card"><div className="sec-title">Estado General</div>{clients.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}><div className={`sem sem-${c.semaphore}`}/><Av photo={c.photo} init={c.init} sz="sm"/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:11}}>{c.name}</div><div style={{fontSize:8,color:"var(--gray)"}}>{c.plan} · {c.goal}</div></div><span className={`badge ${c.paid?"bgg":"bgr"}`}>{c.paid?"Pagado":"Pendiente"}</span></div>)}</div>
  </div>;
}

function AdminClients({clients,onEdit,onAdd,onRemove,onReorder,onReset}){
  return <div style={{display:"flex",flexDirection:"column",gap:8}}>
    <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary" onClick={onAdd}><I n="plus" s={13}/>Agregar Usuario</button></div>
    <DraggableClientList clients={clients} onReorder={onReorder}
      extra={c=><div style={{display:"flex",gap:4}}>
        <button className="btn btn-outline btn-sm" onClick={e=>{e.stopPropagation();onEdit(c);}}><I n="edit" s={10}/></button>
        <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();if(window.confirm(`Resetear clave de ${c.name}?`))onReset(c);}} title="Resetear clave"><I n="key" s={10}/></button>
        <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();if(window.confirm(`¿Eliminar a ${c.name}?`))onRemove(c.id);}}><I n="trash" s={10}/></button>
      </div>}/>
  </div>;
}

function AdminTrainers({trainers,trainer,setTrainer,onAdd,onRm}){
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary" onClick={onAdd}><I n="plus" s={13}/>Agregar Entrenador</button></div>
    {trainers.map((t,i)=><div key={i} className="row-item">
      <Av photo={t.photo} init={t.init||"?"} sz="md"/>
      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{t.name} {i===0&&<span className="badge bm" style={{fontSize:8}}>Principal</span>}</div><div style={{fontSize:9,color:"var(--gray)"}}>{t.role} · {t.specialty}</div></div>
      {i>0&&<button className="btn btn-danger btn-sm" onClick={()=>{if(window.confirm(`¿Eliminar a ${t.name}?`))onRm(t.id);}}><I n="trash" s={10}/></button>}
    </div>)}
  </div>;
}

function AdminSessions({sessions,clients,setSessions}){
  const getName=id=>clients.find(c=>c.id===id)?.name||"?";
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    <div className="sec-title">Todas las Sesiones</div>
    {[...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(s=><div key={s.id} className="session-card" style={{borderColor:s.status==="completada"?"var(--success)":s.status==="cancelada"?"var(--danger)":"var(--warn)"}}>
      <div style={{flex:1}}><div style={{fontWeight:700,fontSize:11}}>{getName(s.clientId)}</div><div style={{fontSize:8,color:"var(--gray)"}}>{s.date} · {s.hour} · {s.plan}</div></div>
      <span className={`badge ${s.status==="completada"?"bgg":s.status==="cancelada"?"bgr":"bgy"}`}>{s.status}</span>
      {s.status==="pendiente"&&<button className="btn btn-danger btn-sm" onClick={()=>setSessions(ss=>ss.map(x=>x.id===s.id?{...x,status:"cancelada"}:x))}>Cancelar</button>}
    </div>)}
  </div>;
}

function AdminThemes({clients,globalTheme,setGlobalTheme,onUpdClient}){
  return <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div className="card"><div className="sec-title">Color Global</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {Object.entries(COLOR_THEMES).map(([name,t])=><button key={name} onClick={()=>setGlobalTheme(name)} style={{padding:"7px 13px",border:`2px solid ${globalTheme===name?t.primary:"#2a2a2a"}`,borderRadius:8,background:globalTheme===name?t.primary:"var(--surface2)",color:globalTheme===name?"var(--white)":"var(--gray)",cursor:"pointer",fontFamily:"var(--font)",fontWeight:700,fontSize:10,textTransform:"capitalize",transition:"all 0.2s"}}><span style={{marginRight:4,display:"inline-block",width:9,height:9,borderRadius:"50%",background:t.primary}}/>{name}</button>)}
    </div></div>
    <div className="card"><div className="sec-title">Color por Usuario</div>{clients.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #1a1a1a"}}>
      <Av photo={c.photo} init={c.init} sz="sm"/><div style={{flex:1,fontWeight:600,fontSize:11}}>{c.name}</div>
      <div style={{display:"flex",gap:5}}>{Object.entries(COLOR_THEMES).map(([name,t])=><div key={name} className={`theme-dot ${(c.theme||"magenta")===name?"active":""}`} style={{background:t.primary}} onClick={()=>onUpdClient({...c,theme:name})} title={name}/>)}</div>
    </div>)}</div>
  </div>;
}

function EditClientModal({c,onSave,onClose}){
  const [d,setD]=useState({...c,supplements:[...(c.supplements||[])],pathologies:[...(c.pathologies||[])]});
  const [nS,setNS]=useState("");const[nP,setNP]=useState("");
  return <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:11}}><div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,color:"var(--primary)"}}>Editar Cliente</div><button className="btn btn-ghost btn-sm" onClick={onClose}><I n="x" s={11}/></button></div>
      <div style={{display:"flex",gap:8,marginBottom:9}}><PhotoUpload photo={d.photo} onPhoto={p=>setD(x=>({...x,photo:p}))} size={58}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
          <div><label className="inp-lbl">Nombre</label><input className="inp" value={d.name} onChange={e=>setD(x=>({...x,name:e.target.value}))}/></div>
          <div className="g2"><div><label className="inp-lbl">Plan</label><select className="sel" value={d.plan} onChange={e=>setD(x=>({...x,plan:e.target.value}))}>{["Personal","Semi-Personal","Boxeo","Cortesía"].map(p=><option key={p}>{p}</option>)}</select></div><div><label className="inp-lbl">Objetivo</label><select className="sel" value={d.goal} onChange={e=>setD(x=>({...x,goal:e.target.value}))}>{["Hipertrofia","Definición","Resistencia","Fuerza","Salud"].map(g=><option key={g}>{g}</option>)}</select></div></div>
        </div>
      </div>
      <div className="g2" style={{gap:6,marginBottom:8}}><div><label className="inp-lbl">Peso kg</label><input className="inp" type="number" value={d.weight} onChange={e=>setD(x=>({...x,weight:parseFloat(e.target.value)||0}))}/></div><div><label className="inp-lbl">Objetivo kg</label><input className="inp" type="number" value={d.targetW} onChange={e=>setD(x=>({...x,targetW:parseFloat(e.target.value)||0}))}/></div><div><label className="inp-lbl">Ses. rest.</label><input className="inp" type="number" value={d.sessions} onChange={e=>setD(x=>({...x,sessions:parseInt(e.target.value)||0}))}/></div><div><label className="inp-lbl">Total ses.</label><input className="inp" type="number" value={d.totalSessions} onChange={e=>setD(x=>({...x,totalSessions:parseInt(e.target.value)||0}))}/></div></div>
      <div style={{marginBottom:7}}><label className="inp-lbl">Contraseña</label><PwField value={d.password||""} onChange={v=>setD(x=>({...x,password:v}))} placeholder="Contraseña"/></div>
      <div style={{marginBottom:7}}><label className="inp-lbl">Pago</label><div style={{display:"flex",gap:6}}><button className={`btn ${d.paid?"btn-primary":"btn-ghost"}`} style={{flex:1,justifyContent:"center"}} onClick={()=>setD(x=>({...x,paid:true}))}>Pagado</button><button className={`btn ${!d.paid?"btn-danger":"btn-ghost"}`} style={{flex:1,justifyContent:"center"}} onClick={()=>setD(x=>({...x,paid:false}))}>Pendiente</button></div></div>
      <div style={{marginBottom:7}}><label className="inp-lbl">Patologías</label><div style={{flexWrap:"wrap",display:"flex",gap:3,marginBottom:5}}>{d.pathologies.map((p,i)=><span key={i} className="patho-tag">{p}<button onClick={()=>setD(x=>({...x,pathologies:x.pathologies.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",cursor:"pointer",color:"var(--warn)",marginLeft:3}}>×</button></span>)}</div><div style={{display:"flex",gap:4}}><input className="inp" value={nP} onChange={e=>setNP(e.target.value)} placeholder="+ Patología..." onKeyDown={e=>{if(e.key==="Enter"&&nP.trim()){setD(x=>({...x,pathologies:[...x.pathologies,nP.trim()]}));setNP("");}}}/><button className="btn btn-outline btn-sm" onClick={()=>{if(nP.trim()){setD(x=>({...x,pathologies:[...x.pathologies,nP.trim()]}));setNP("");}}}><I n="plus" s={11}/></button></div></div>
      <div style={{marginBottom:9}}><label className="inp-lbl">Suplementos</label>{d.supplements.map((s,i)=><div key={i} style={{display:"flex",gap:4,marginBottom:4}}><input className="inp" value={s} onChange={e=>{const n=[...d.supplements];n[i]=e.target.value;setD(x=>({...x,supplements:n}));}}/><button className="btn btn-danger btn-sm" onClick={()=>setD(x=>({...x,supplements:x.supplements.filter((_,j)=>j!==i)}))}><I n="trash" s={10}/></button></div>)}<div style={{display:"flex",gap:4,marginTop:4}}><input className="inp" value={nS} onChange={e=>setNS(e.target.value)} placeholder="+ Suplemento..." onKeyDown={e=>{if(e.key==="Enter"&&nS.trim()){setD(x=>({...x,supplements:[...x.supplements,nS.trim()]}));setNS("");}}}/><button className="btn btn-outline btn-sm" onClick={()=>{if(nS.trim()){setD(x=>({...x,supplements:[...x.supplements,nS.trim()]}));setNS("");}}}><I n="plus" s={11}/></button></div></div>
      <div style={{display:"flex",gap:6}}><button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={onClose}>Cancelar</button><button className="btn btn-primary" style={{flex:2,justifyContent:"center"}} onClick={()=>onSave(d)}><I n="check" s={10}/>Guardar</button></div>
    </div>
  </div>;
}

function AddClientModal({onSave,onClose}){
  const [d,setD]=useState({name:"",plan:"Personal",goal:"Hipertrofia",weight:70,targetW:70,energy:4,sleep:7,diet:80,hydration:6,maxHydration:12,paid:false,semaphore:"green",sessions:0,totalSessions:12,startDate:new Date(),photo:null,parqDone:false,password:"cliente123",supplements:[],suppComments:[],suppAlerts:[],pathologies:[],weekPlan:mkDefaultWeekPlan(),weekRoutine:mkWeekRoutine("Hipertrofia"),theme:"magenta"});
  return <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:11}}><div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,color:"var(--primary)"}}>Nuevo Usuario</div><button className="btn btn-ghost btn-sm" onClick={onClose}><I n="x" s={11}/></button></div>
      <div style={{display:"flex",gap:8,marginBottom:9}}><PhotoUpload photo={d.photo} onPhoto={p=>setD(x=>({...x,photo:p}))} size={58}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
          <div><label className="inp-lbl">Nombre completo</label><input className="inp" placeholder="Nombre Apellido" value={d.name} onChange={e=>setD(x=>({...x,name:e.target.value}))}/></div>
          <div className="g2"><div><label className="inp-lbl">Plan</label><select className="sel" value={d.plan} onChange={e=>setD(x=>({...x,plan:e.target.value}))}>{["Personal","Semi-Personal","Boxeo","Cortesía"].map(p=><option key={p}>{p}</option>)}</select></div><div><label className="inp-lbl">Objetivo</label><select className="sel" value={d.goal} onChange={e=>{setD(x=>({...x,goal:e.target.value,weekRoutine:mkWeekRoutine(e.target.value)}))}}>{["Hipertrofia","Definición","Resistencia","Fuerza","Salud"].map(g=><option key={g}>{g}</option>)}</select></div></div>
        </div>
      </div>
      <div className="g2" style={{gap:6,marginBottom:8}}><div><label className="inp-lbl">Peso kg</label><input className="inp" type="number" value={d.weight} onChange={e=>setD(x=>({...x,weight:parseFloat(e.target.value)||0}))}/></div><div><label className="inp-lbl">Peso objetivo</label><input className="inp" type="number" value={d.targetW} onChange={e=>setD(x=>({...x,targetW:parseFloat(e.target.value)||0}))}/></div></div>
      <div style={{marginBottom:9}}><label className="inp-lbl">Contraseña inicial</label><PwField value={d.password} onChange={v=>setD(x=>({...x,password:v}))}/></div>
      <div style={{display:"flex",gap:6}}><button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={onClose}>Cancelar</button><button className="btn btn-primary" style={{flex:2,justifyContent:"center"}} disabled={!d.name.trim()} onClick={()=>onSave({...d,init:d.name.split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2)||"??"})}><I n="check" s={10}/>Crear</button></div>
    </div>
  </div>;
}

function AddTrainerModal({onSave,onClose}){
  const [d,setD]=useState({name:"",role:"Entrenador",specialty:"",photo:null,password:"coach2024"});
  return <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box" style={{maxWidth:380}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:11}}><div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,color:"var(--primary)"}}>Nuevo Entrenador</div><button className="btn btn-ghost btn-sm" onClick={onClose}><I n="x" s={11}/></button></div>
      <div style={{display:"flex",gap:8,marginBottom:9}}><PhotoUpload photo={d.photo} onPhoto={p=>setD(x=>({...x,photo:p}))} size={58}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
          <div><label className="inp-lbl">Nombre</label><input className="inp" value={d.name} onChange={e=>setD(x=>({...x,name:e.target.value}))}/></div>
          <div><label className="inp-lbl">Rol</label><input className="inp" value={d.role} onChange={e=>setD(x=>({...x,role:e.target.value}))}/></div>
          <div><label className="inp-lbl">Especialidad</label><input className="inp" value={d.specialty} onChange={e=>setD(x=>({...x,specialty:e.target.value}))}/></div>
        </div>
      </div>
      <div style={{marginBottom:9}}><label className="inp-lbl">Contraseña inicial</label><PwField value={d.password} onChange={v=>setD(x=>({...x,password:v}))}/></div>
      <div style={{display:"flex",gap:6}}><button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={onClose}>Cancelar</button><button className="btn btn-primary" style={{flex:2,justifyContent:"center"}} disabled={!d.name.trim()} onClick={()=>onSave({...d,init:d.name.split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2)||"??",id:Date.now(),socials:[]})}><I n="check" s={10}/>Crear</button></div>
    </div>
  </div>;
}

/* ═══ TRAINER APP ══════════════════════════════════════════════════════════ */
function TrainerApp({clients,sessions,setSessions,trainer,setTrainer,onLogout,onUpdClient,onAddClient,onRmClient,onReorder}){
  const [tab,setTab]=useState("dashboard");const[selC,setSelC]=useState(null);const[showBook,setShowBook]=useState(false);const[showPw,setShowPw]=useState(false);
  const contentRef=useRef();const fabHidden=useScrollHide(contentRef);
  const NAV=[{id:"dashboard",icon:"grid",label:"Panel"},{id:"clients",icon:"users",label:"Clientes"},{id:"sessions",icon:"cal",label:"Sesiones"},{id:"nutrition",icon:"apple",label:"Nutrición"},{id:"training",icon:"dumbbell",label:"Entreno"},{id:"tiqueteras",icon:"ticket",label:"Tiqueteras"},{id:"perfil",icon:"star",label:"Perfil"}];
  return <>
    <style>{CSS}</style>
    <div className="app">
      <Sidebar nav={NAV} tab={tab} setTab={t=>{setTab(t);if(t!=="clients")setSelC(null);}} onLogout={onLogout}
        extra={<button className="nav-btn" onClick={()=>setShowPw(true)}><div className="nav-icon"><I n="key" s={16}/></div><span className="nav-label">Clave</span></button>}/>
      <div className="main">
        <div className="topbar">
          <div><div className="topbar-title">{tab==="dashboard"?"Panel":tab==="clients"?selC?selC.name:"Clientes":tab==="sessions"?"Sesiones":tab==="nutrition"?"Nutrición":tab==="training"?"Entrenamiento":tab==="tiqueteras"?"Tiqueteras":"Mi Perfil"}</div><div className="topbar-sub">@fitcoachjhojan · Athletic Tunal</div></div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {selC&&tab==="clients"&&<button className="btn btn-ghost btn-sm" onClick={()=>setSelC(null)}><I n="back" s={10}/>Volver</button>}
            <PhotoUpload photo={trainer.photo} onPhoto={p=>setTrainer(t=>({...t,photo:p}))} size={34} label={false}/>
          </div>
        </div>
        <div className="content fade-up" ref={contentRef}>
          {tab==="dashboard"&&<TrainerDashboard clients={clients} sessions={sessions} setTab={setTab} setSelC={setSelC}/>}
          {tab==="clients"&&!selC&&<TrainerClients clients={clients} onSelect={setSelC} onAdd={onAddClient} onRm={onRmClient} onReorder={onReorder}/>}
          {tab==="clients"&&selC&&<TrainerClientDetail c={selC} onUpdate={c=>{onUpdClient(c);setSelC(c);}} sessions={sessions} setSessions={setSessions}/>}
          {tab==="sessions"&&<TrainerSessions sessions={sessions} clients={clients} setSessions={setSessions}/>}
          {tab==="nutrition"&&<TrainerNutrition clients={clients} onUpdate={onUpdClient}/>}
          {tab==="training"&&<TrainerTraining clients={clients} onUpdate={onUpdClient}/>}
          {tab==="tiqueteras"&&<Tiqueteras clients={clients}/>}
          {tab==="perfil"&&<TrainerProfile trainer={trainer} onSave={setTrainer}/>}
        </div>
      </div>
    </div>
    <div className={`fab-wrap${fabHidden?" hidden":""}`}><button className="fab-btn" onClick={()=>setShowBook(true)}><I n="plus" s={20}/><span>AGENDA</span></button></div>
    {showBook&&<BookModal clients={clients} sessions={sessions} setSessions={setSessions} onClose={()=>setShowBook(false)}/>}
    {showPw&&<ChangePwModal current={trainer.password} onSave={p=>setTrainer(t=>({...t,password:p}))} onClose={()=>setShowPw(false)}/>}
  </>;
}

function TrainerDashboard({clients,sessions,setTab,setSelC}){
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div className="g4">{[{l:"Clientes",v:clients.length,i:"users"},{l:"Pendientes",v:sessions.filter(s=>s.status==="pendiente").length,i:"cal"},{l:"Sin pagar",v:clients.filter(c=>!c.paid).length,i:"ticket",w:true},{l:"Alertas supl.",v:clients.reduce((a,c)=>(c.suppAlerts||[]).length+a,0),i:"alert",w:true}].map((s,i)=><div key={i} className="card"><div style={{color:s.w&&s.v>0?"var(--danger)":"var(--primary)",marginBottom:3}}><I n={s.i} s={17}/></div><div className="stat-val" style={{color:s.w&&s.v>0?"var(--danger)":undefined}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>)}</div>
    {clients.some(c=>(c.suppAlerts||[]).length>0)&&<div className="card"><div className="sec-title" style={{color:"var(--danger)"}}>⚠️ Alertas de Suplementos</div>{clients.filter(c=>(c.suppAlerts||[]).length>0).map(c=>c.suppAlerts.map((a,i)=><div key={i} className="comment-alert"><strong style={{color:"var(--primary)"}}>{c.name}:</strong> {a.text} <span style={{fontSize:8,color:"var(--gray)"}}>{a.date}</span></div>))}</div>}
    <div className="g2">
      <div className="card"><div className="sec-title">Semáforo</div>{clients.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderBottom:"1px solid #1a1a1a",cursor:"pointer"}} onClick={()=>{setTab("clients");setSelC(c);}}><div className={`sem sem-${c.semaphore}`}/><Av photo={c.photo} init={c.init} sz="sm"/><div style={{flex:1}}><div style={{fontWeight:700,fontSize:10}}>{c.name}</div><div style={{fontSize:8,color:"var(--gray)"}}>{c.diet}% dieta</div></div><div className="prog-track prog-sm" style={{width:36}}><div className="prog-fill" style={{width:`${c.diet}%`}}/></div></div>)}</div>
      <div className="card"><div className="sec-title">Próximas</div>{sessions.filter(s=>s.status==="pendiente").slice(0,5).map((s,i)=>{const c=clients.find(x=>x.id===s.clientId);return <div key={i} style={{display:"flex",gap:6,padding:"5px 0",borderBottom:"1px solid #1a1a1a"}}><div style={{fontFamily:"var(--font-d)",fontSize:13,fontWeight:700,color:"var(--primary)",width:40,flexShrink:0}}>{s.hour}</div><div><div style={{fontWeight:600,fontSize:10}}>{c?.name.split(" ")[0]}</div><div style={{fontSize:8,color:"var(--gray)"}}>{s.date}</div></div></div>;})}</div>
    </div>
  </div>;
}

function TrainerClients({clients,onSelect,onAdd,onRm,onReorder}){
  const [showAdd,setShowAdd]=useState(false);
  return <div style={{display:"flex",flexDirection:"column",gap:8}}>
    <div style={{display:"flex",justifyContent:"flex-end",gap:6}}><button className="btn btn-primary" onClick={()=>setShowAdd(true)}><I n="plus" s={13}/>Agregar Cliente</button></div>
    <DraggableClientList clients={clients} onReorder={onReorder} onSelect={onSelect} extra={c=><button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();if(window.confirm(`¿Eliminar a ${c.name}?`))onRm(c.id);}}><I n="trash" s={10}/></button>}/>
    {showAdd&&<AddClientModal onSave={c=>{onAdd(c);setShowAdd(false);}} onClose={()=>setShowAdd(false)}/>}
  </div>;
}

function TrainerClientDetail({c,onUpdate,sessions,setSessions}){
  const [d,setD]=useState({...c,supplements:[...(c.supplements||[])],pathologies:[...(c.pathologies||[])]});
  const [nS,setNS]=useState("");const[nP,setNP]=useState("");const[saved,setSaved]=useState(false);
  const save=()=>{onUpdate(d);setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const mySes=sessions.filter(s=>s.clientId===c.id&&s.status==="pendiente").slice(0,4);
  return <div style={{display:"flex",flexDirection:"column",gap:11}}>
    <div className="card"><div style={{display:"flex",gap:11,alignItems:"flex-start",flexWrap:"wrap"}}><PhotoUpload photo={d.photo} onPhoto={p=>setD(x=>({...x,photo:p}))} size={60}/>
      <div style={{flex:1,minWidth:170}}><div style={{fontFamily:"var(--font-d)",fontSize:18,fontWeight:700,marginBottom:4}}>{d.name}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><span className="badge bm">{d.plan}</span><span className="badge bgg">{d.goal}</span><span className={`badge ${d.paid?"bgg":"bgr"}`}>{d.paid?"✓ Pagado":"Pendiente"}</span></div>{(d.pathologies||[]).length>0&&<div style={{marginTop:4}}>{d.pathologies.map((p,i)=><span key={i} className="patho-tag">{p}</span>)}</div>}</div>
    </div>{mySes.length>0&&<div style={{marginTop:8}}><div style={{fontSize:8,color:"var(--gray)",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Próximas sesiones</div>{mySes.map((s,i)=><div key={i} style={{fontSize:10,color:"var(--primary)",fontWeight:600,padding:"2px 0"}}>📅 {s.date} · {s.hour}</div>)}</div>}</div>
    <div className="g2">
      <div className="card"><div className="sec-title">Datos</div><div style={{display:"flex",flexDirection:"column",gap:6}}><div><label className="inp-lbl">Objetivo</label><select className="sel" value={d.goal} onChange={e=>setD(x=>({...x,goal:e.target.value}))}>{["Hipertrofia","Definición","Resistencia","Fuerza","Salud"].map(g=><option key={g}>{g}</option>)}</select></div><div><label className="inp-lbl">Plan</label><select className="sel" value={d.plan} onChange={e=>setD(x=>({...x,plan:e.target.value}))}>{["Personal","Semi-Personal","Boxeo","Cortesía"].map(p=><option key={p}>{p}</option>)}</select></div><div className="g2"><div><label className="inp-lbl">Peso</label><input className="inp" type="number" value={d.weight} onChange={e=>setD(x=>({...x,weight:parseFloat(e.target.value)||0}))}/></div><div><label className="inp-lbl">Objetivo</label><input className="inp" type="number" value={d.targetW} onChange={e=>setD(x=>({...x,targetW:parseFloat(e.target.value)||0}))}/></div></div><div style={{display:"flex",gap:5}}><button className={`btn ${d.paid?"btn-primary":"btn-ghost"}`} style={{flex:1,justifyContent:"center"}} onClick={()=>setD(x=>({...x,paid:true}))}>Pagado</button><button className={`btn ${!d.paid?"btn-danger":"btn-ghost"}`} style={{flex:1,justifyContent:"center"}} onClick={()=>setD(x=>({...x,paid:false}))}>Pendiente</button></div></div></div>
      <div className="card"><div className="sec-title">Suplementos</div>{d.supplements.map((s,i)=><div key={i} style={{display:"flex",gap:4,marginBottom:4}}><input className="inp" value={s} onChange={e=>{const n=[...d.supplements];n[i]=e.target.value;setD(x=>({...x,supplements:n}));}}/><button className="btn btn-danger btn-sm" onClick={()=>setD(x=>({...x,supplements:x.supplements.filter((_,j)=>j!==i)}))}><I n="trash" s={10}/></button></div>)}<div style={{display:"flex",gap:4,marginTop:4}}><input className="inp" value={nS} onChange={e=>setNS(e.target.value)} placeholder="+ Suplemento..." onKeyDown={e=>{if(e.key==="Enter"&&nS.trim()){setD(x=>({...x,supplements:[...x.supplements,nS.trim()]}));setNS("");}}}/><button className="btn btn-outline btn-sm" onClick={()=>{if(nS.trim()){setD(x=>({...x,supplements:[...x.supplements,nS.trim()]}));setNS("");}}}><I n="plus" s={10}/></button></div></div>
    </div>
    <div className="card"><div className="sec-title">Patologías</div><div style={{flexWrap:"wrap",display:"flex",gap:3,marginBottom:5}}>{(d.pathologies||[]).map((p,i)=><span key={i} className="patho-tag">{p}<button onClick={()=>setD(x=>({...x,pathologies:x.pathologies.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",cursor:"pointer",color:"var(--warn)",marginLeft:3}}>×</button></span>)}</div><div style={{display:"flex",gap:4}}><input className="inp" value={nP} onChange={e=>setNP(e.target.value)} placeholder="+ Patología..." onKeyDown={e=>{if(e.key==="Enter"&&nP.trim()){setD(x=>({...x,pathologies:[...x.pathologies,nP.trim()]}));setNP("");}}}/><button className="btn btn-outline btn-sm" onClick={()=>{if(nP.trim()){setD(x=>({...x,pathologies:[...x.pathologies,nP.trim()]}));setNP("");}}}><I n="plus" s={10}/></button></div></div>
    {(c.suppComments||[]).length>0&&<div className="card"><div className="sec-title">Comentarios Suplementos</div>{c.suppComments.map((cm,i)=><div key={i} className={cm.isAlert?"comment-alert":"comment-bubble"}>{cm.isAlert&&"⚠️ "}{cm.text}<span style={{fontSize:8,color:"var(--gray)",display:"block",marginTop:1}}>{cm.date}</span></div>)}</div>}
    <button className="btn btn-primary" style={{padding:"9px 20px"}} onClick={save}><I n="check" s={10}/>{saved?"¡Guardado!":"Guardar cambios"}</button>
  </div>;
}

function TrainerSessions({sessions,clients,setSessions}){
  const getName=id=>clients.find(c=>c.id===id)?.name||"?";
  const recent=[...sessions].sort((a,b)=>new Date(b.date)-new Date(a.date));
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div className="card"><div className="sec-title">Últimas 3 (Historial)</div>{recent.filter(s=>s.status!=="pendiente").slice(0,3).map((s,i)=><div key={i} className="session-card" style={{borderColor:s.status==="completada"?"var(--success)":"var(--danger)",marginBottom:4}}><div style={{flex:1}}><div style={{fontWeight:700,fontSize:11}}>{getName(s.clientId)}</div><div style={{fontSize:8,color:"var(--gray)"}}>{s.date} · {s.hour} · {s.plan}</div></div><span className={`badge ${s.status==="completada"?"bgg":"bgr"}`}>{s.status}</span></div>)}</div>
    <div className="card"><div className="sec-title">Pendientes</div>{recent.filter(s=>s.status==="pendiente").map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:11}}>{getName(s.clientId)}</div><div style={{fontSize:8,color:"var(--gray)"}}>{s.date} · {s.hour}</div></div><button className="btn btn-danger btn-sm" onClick={()=>setSessions(ss=>ss.map(x=>x.id===s.id?{...x,status:"cancelada"}:x))}>Cancelar</button></div>)}</div>
  </div>;
}

function TrainerNutrition({clients,onUpdate}){
  const [selId,setSelId]=useState(clients[0]?.id);const[selDay,setSelDay]=useState("Lun");const[dragItem,setDragItem]=useState(null);
  const c=clients.find(x=>x.id===selId);if(!c)return null;
  const dayPlan=(c.weekPlan?.[selDay])||MEAL_SLOTS.map(m=>({meal:m,foods:[]}));
  const ms=(food)=>{const r=(food.grams||100)/100;return{cal:Math.round(food.cal*r),protein:+(food.protein*r).toFixed(1),carbs:+(food.carbs*r).toFixed(1),fat:+(food.fat*r).toFixed(1)};};
  const tot=dayPlan.reduce((t,s)=>{s.foods.forEach(f=>{const m=ms(f);t.cal+=m.cal;t.protein+=m.protein;t.carbs+=m.carbs;t.fat+=m.fat;});return t;},{cal:0,protein:0,carbs:0,fat:0});
  const updPlan=(nd)=>onUpdate({...c,weekPlan:{...c.weekPlan,[selDay]:nd}});
  const addFood=(food,mi)=>{const d=[...dayPlan];d[mi]={...d[mi],foods:[...d[mi].foods,food]};updPlan(d);};
  const removeFood=(mi,fi)=>{const d=[...dayPlan];d[mi]={...d[mi],foods:d[mi].foods.filter((_,i)=>i!==fi)};updPlan(d);};
  const handleDrop=(item,toMeal)=>{if(!item)return;const d=[...dayPlan];const food=item.food;d[item.fromMeal]={...d[item.fromMeal],foods:d[item.fromMeal].foods.filter((_,i)=>i!==item.fromIdx)};d[toMeal]={...d[toMeal],foods:[...d[toMeal].foods,food]};updPlan(d);setDragItem(null);};
  return <div style={{display:"flex",flexDirection:"column",gap:9}}>
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{clients.map(x=><button key={x.id} className={`btn ${selId===x.id?"btn-primary":"btn-ghost"}`} style={{fontSize:11,padding:"6px 11px"}} onClick={()=>setSelId(x.id)}>{x.name.split(" ")[0]}</button>)}</div>
    <div style={{display:"flex",gap:3}}>{DAYS_WEEK.map(d=><button key={d} className={`day-tab ${selDay===d?"active":""}`} onClick={()=>setSelDay(d)}>{d}</button>)}</div>
    <div className="g4">{[["Kcal",Math.round(tot.cal),"var(--primary)"],["Prot.",`${Math.round(tot.protein)}g`,"#ef4444"],["Carbs",`${Math.round(tot.carbs)}g`,"var(--primary)"],["Grasa",`${Math.round(tot.fat)}g`,"#60a5fa"]].map(([l,v,col])=><div key={l} className="card" style={{textAlign:"center",padding:"7px 3px"}}><div style={{fontFamily:"var(--font-d)",fontSize:17,fontWeight:700,color:col}}>{v}</div><div style={{fontSize:7,color:"var(--gray)",textTransform:"uppercase"}}>{l}</div></div>)}</div>
    {dayPlan.map((slot,si)=><FoodMealSlot key={si} slot={slot} mealIdx={si} onDrop={handleDrop} onRemove={removeFood} macroScale={ms} dragItem={dragItem} setDragItem={setDragItem} editable={true} onAdd={addFood}/>)}
  </div>;
}

function TrainerTraining({clients,onUpdate}){
  const [selId,setSelId]=useState(clients[0]?.id);const[selDay,setSelDay]=useState("Lun");const timer=useTimer(90);
  const c=clients.find(x=>x.id===selId);if(!c)return null;
  const dayExs=(c.weekRoutine?.[selDay])||[];
  const totalVol=dayExs.reduce((a,ex)=>{const s=ex.sets||[];return a+s.reduce((b,s)=>(parseFloat(s.kg)||0)*(parseFloat(s.reps)||0)+b,0);},0);
  const updEx=(i,upd)=>{const wr={...c.weekRoutine};const d=[...dayExs];d[i]=upd;wr[selDay]=d;onUpdate({...c,weekRoutine:wr});};
  return <div style={{display:"flex",flexDirection:"column",gap:9}}>
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{clients.map(x=><button key={x.id} className={`btn ${selId===x.id?"btn-primary":"btn-ghost"}`} style={{fontSize:11,padding:"6px 11px"}} onClick={()=>setSelId(x.id)}>{x.name.split(" ")[0]}</button>)}</div>
    <div style={{display:"flex",gap:3}}>{DAYS_WEEK.map(d=><button key={d} className={`day-tab ${selDay===d?"active":""}`} onClick={()=>setSelDay(d)}>{d}</button>)}</div>
    <TimerCard timer={timer}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div className="sec-title" style={{marginBottom:0}}>{c.name.split(" ")[0]} · {selDay} {dayExs.length===0&&"(Descanso)"}</div>
      {totalVol>0&&<div style={{fontSize:10,color:"var(--primary)",fontWeight:700}}>Vol. total: {totalVol}kg</div>}
    </div>
    {dayExs.length===0&&<div className="card" style={{fontSize:11,color:"var(--gray)",textAlign:"center"}}>Día de descanso 🛌</div>}
    {dayExs.map((ex,i)=><ExCard key={i} ex={ex} editable={false} onEditMeta={(upd)=>updEx(i,upd)} onChange={(upd)=>updEx(i,upd)}/>)}
  </div>;
}

function Tiqueteras({clients}){
  return <div style={{display:"flex",flexDirection:"column",gap:9}}>
    <div style={{padding:"7px 10px",background:"var(--primary-dim)",border:"1px solid var(--primary-border)",borderRadius:8,fontSize:10}}>💳 Pagos en recepción de <strong style={{color:"var(--primary)"}}>Athletic Tunal</strong> · Todo medio de pago</div>
    {clients.map(c=><div key={c.id} className="ticket">
      <div className="ticket-top"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:7,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>TIQUETERA · 30 DÍAS</div><div style={{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700,color:"var(--white)",marginTop:1}}>{c.name}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.7)"}}>{c.plan} · {c.goal}</div></div><div style={{textAlign:"center"}}><div style={{fontFamily:"var(--font-d)",fontSize:36,fontWeight:700,color:"var(--white)",lineHeight:1}}>{c.sessions}</div><div style={{fontSize:7,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>restantes</div></div></div></div>
      <div className="ticket-dashes"/>
      <div className="ticket-body"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1,marginRight:9}}><div className="prog-track prog-md"><div className="prog-fill" style={{width:`${Math.round((1-c.sessions/c.totalSessions)*100)}%`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"var(--gray)",marginTop:2}}><span>{c.sessions} rest.</span><span>Vence: {fmtDate(addDays(c.startDate,30))}</span></div></div><span className={`badge ${c.paid?"bgg":"bgr"}`}>{c.paid?"✓ Pagado":"Pendiente"}</span></div></div>
    </div>)}
  </div>;
}

function TrainerProfile({trainer,onSave}){
  const [t,setT]=useState({...trainer,socials:[...(trainer.socials||[])]});const[saved,setSaved]=useState(false);
  return <div className="card"><div className="sec-title">Mi Perfil</div>
    <div style={{display:"flex",gap:11,marginBottom:11,flexWrap:"wrap"}}><PhotoUpload photo={t.photo} onPhoto={p=>setT(x=>({...x,photo:p}))} size={68}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:6,minWidth:160}}>
        <div><label className="inp-lbl">Nombre</label><input className="inp" value={t.name} onChange={e=>setT(x=>({...x,name:e.target.value}))}/></div>
        <div><label className="inp-lbl">Rol</label><input className="inp" value={t.role} onChange={e=>setT(x=>({...x,role:e.target.value}))}/></div>
        <div><label className="inp-lbl">Especialidad</label><input className="inp" value={t.specialty} onChange={e=>setT(x=>({...x,specialty:e.target.value}))}/></div>
      </div>
    </div>
    <div className="divider"/>
    <div style={{fontSize:9,color:"var(--gray)",marginBottom:7,fontWeight:700,textTransform:"uppercase"}}>Redes Sociales</div>
    {(t.socials||[]).map((s,i)=><div key={i} style={{display:"flex",gap:5,marginBottom:5,alignItems:"center"}}><span style={{color:s.color,flexShrink:0}}><I n={s.icon} s={14}/></span><input className="inp" value={s.val} onChange={e=>{const n=[...t.socials];n[i]={...n[i],val:e.target.value};setT(x=>({...x,socials:n}));}} placeholder="Handle"/><input className="inp" value={s.url} onChange={e=>{const n=[...t.socials];n[i]={...n[i],url:e.target.value};setT(x=>({...x,socials:n}));}} placeholder="URL"/></div>)}
    <button className="btn btn-primary" style={{marginTop:9}} onClick={()=>{onSave(t);setSaved(true);setTimeout(()=>setSaved(false),2000);}}><I n="check" s={10}/>{saved?"¡Guardado!":"Guardar"}</button>
  </div>;
}

function BookModal({clients,sessions,setSessions,onClose}){
  const [step,setStep]=useState(1);const[sel,setSel]=useState({clientId:"",date:"2026-04-15",hour:""});
  const HOURS=["6:00","7:00","8:00","9:00","10:00","11:00","16:00","17:00","18:00","19:00","20:00"];
  const c=clients.find(x=>x.id===parseInt(sel.clientId));
  return <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box" style={{maxWidth:380}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:11}}><div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,color:"var(--primary)"}}>Agendar Sesión</div><button className="btn btn-ghost btn-sm" onClick={onClose}><I n="x" s={11}/></button></div>
      {step===1&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div><label className="inp-lbl">Cliente</label><select className="sel" value={sel.clientId} onChange={e=>setSel(s=>({...s,clientId:e.target.value}))}><option value="">Seleccionar...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name} · {c.plan}</option>)}</select></div>
        <div><label className="inp-lbl">Fecha</label><input className="inp" type="date" value={sel.date} onChange={e=>setSel(s=>({...s,date:e.target.value}))}/></div>
        <div><label className="inp-lbl">Hora</label><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>{HOURS.map(h=><button key={h} className={`btn ${sel.hour===h?"btn-primary":"btn-ghost"}`} style={{justifyContent:"center",padding:"5px",fontSize:10}} onClick={()=>setSel(s=>({...s,hour:h}))}>{h}</button>)}</div></div>
        <button className="btn btn-primary" style={{justifyContent:"center",padding:9}} disabled={!sel.clientId||!sel.hour} onClick={()=>setStep(2)}>Confirmar →</button>
      </div>}
      {step===2&&<div style={{display:"flex",flexDirection:"column",gap:9}}>
        <div style={{background:"var(--primary-dim)",border:"1px solid var(--primary-border)",borderRadius:9,padding:12}}>{[["Cliente",c?.name],["Plan",c?.plan],["Fecha",sel.date],["Hora",sel.hour]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:"1px solid var(--primary-border)"}}><span style={{color:"var(--gray)"}}>{k}</span><span style={{fontWeight:700}}>{v}</span></div>)}</div>
        <div style={{display:"flex",gap:6}}><button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(1)}>← Volver</button><button className="btn btn-primary" style={{flex:2,justifyContent:"center"}} onClick={()=>{setSessions(ss=>[...ss,{id:`s${Date.now()}`,clientId:parseInt(sel.clientId),date:sel.date,hour:sel.hour,status:"pendiente",plan:c?.plan||""}]);onClose();}}><I n="check" s={10}/>Agendar</button></div>
      </div>}
    </div>
  </div>;
}

/* ═══ CLIENT APP ══════════════════════════════════════════════════════════ */
function ClientApp({c,sessions,setSessions,onLogout,onUpdate}){
  const [tab,setTab]=useState("home");const[checklist,setChecklist]=useState([false,false,false,false]);const[hydration,setHydration]=useState(c.hydration||6);const[selDay,setSelDay]=useState("Lun");const[dragItem,setDragItem]=useState(null);const[weekRoutine,setWeekRoutine]=useState({...(c.weekRoutine||{})});const[showBook,setShowBook]=useState(false);const[showPw,setShowPw]=useState(false);const[suppText,setSuppText]=useState("");const[suppAlert,setSuppAlert]=useState(false);
  const timer=useTimer(90);const contentRef=useRef();const fabHidden=useScrollHide(contentRef);
  useEffect(()=>{if(c.theme)applyTheme(c.theme);},[c.theme]);
  useEffect(()=>setWeekRoutine({...(c.weekRoutine||{})}),[c.id]);

  const mySessions=sessions.filter(s=>s.clientId===c.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const nextSessions=mySessions.filter(s=>s.status==="pendiente").slice(0,4);
  const lastThree=mySessions.filter(s=>s.status!=="pendiente").slice(0,3);

  const ms=(food)=>{const r=(food.grams||100)/100;return{cal:Math.round(food.cal*r),protein:+(food.protein*r).toFixed(1),carbs:+(food.carbs*r).toFixed(1),fat:+(food.fat*r).toFixed(1)};};
  const dayPlan=(c.weekPlan?.[selDay])||MEAL_SLOTS.map(m=>({meal:m,foods:[]}));
  const tot=dayPlan.reduce((t,s)=>{s.foods.forEach(f=>{const m=ms(f);t.cal+=m.cal;t.protein+=m.protein;t.carbs+=m.carbs;t.fat+=m.fat;});return t;},{cal:0,protein:0,carbs:0,fat:0});

  const updPlan=(nd)=>onUpdate({...c,weekPlan:{...c.weekPlan,[selDay]:nd}});
  const addFood=(food,mi)=>{const d=[...dayPlan];d[mi]={...d[mi],foods:[...d[mi].foods,food]};updPlan(d);};
  const removeFood=(mi,fi)=>{const d=[...dayPlan];d[mi]={...d[mi],foods:d[mi].foods.filter((_,i)=>i!==fi)};updPlan(d);};
  const handleDrop=(item,toMeal)=>{if(!item)return;const d=[...dayPlan];const food=item.food;d[item.fromMeal]={...d[item.fromMeal],foods:d[item.fromMeal].foods.filter((_,i)=>i!==item.fromIdx)};d[toMeal]={...d[toMeal],foods:[...d[toMeal].foods,food]};updPlan(d);setDragItem(null);};

  const dayExs=(weekRoutine[selDay])||[];
  const totalVol=dayExs.reduce((a,ex)=>a+(ex.sets||[]).reduce((b,s)=>(parseFloat(s.kg)||0)*(parseFloat(s.reps)||0)+b,0),0);
  const updEx=(i,upd)=>{const wr={...weekRoutine,[selDay]:[...dayExs]};wr[selDay][i]=upd;setWeekRoutine(wr);};
  const saveRoutine=()=>onUpdate({...c,weekRoutine});

  const addSuppComment=(text,isAlert)=>{
    const cm={text,isAlert,date:new Date().toLocaleDateString("es-CO")};
    const sc=[...(c.suppComments||[]),cm];const sa=isAlert?[...(c.suppAlerts||[]),cm]:(c.suppAlerts||[]);
    onUpdate({...c,suppComments:sc,suppAlerts:sa});
  };

  const MAX_H=12; // 3 litros (12 vasos de 250ml)

  return <>
    <style>{CSS}</style>
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:"var(--black)"}}>
      {/* HEADER */}
      <div style={{background:"var(--surface)",borderBottom:"1px solid var(--primary-border)",padding:"8px 12px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>document.getElementById("cliph"+c.id).click()}>
            <div className="avatar av-md">{c.photo?<img src={c.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:c.init}</div>
            <div style={{position:"absolute",bottom:-2,right:-2,background:"var(--primary)",borderRadius:"50%",width:13,height:13,display:"flex",alignItems:"center",justifyContent:"center"}}><I n="camera" s={7}/></div>
            <input id={"cliph"+c.id} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onUpdate({...c,photo:ev.target.result});r.readAsDataURL(f);}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"var(--font-d)",fontWeight:900,fontSize:16,color:"var(--white)",lineHeight:1.1}}>{c.name}</div>
            <div style={{fontSize:7,color:"var(--primary)",fontWeight:700,marginTop:1}}>Coach Jhojan Rincón · @fitcoachjhojan</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:17,fontWeight:700,color:"var(--primary)",lineHeight:1}}>{c.sessions}<span style={{fontSize:7,color:"var(--gray)",fontWeight:400}}>/{c.totalSessions}</span></div>
            <div style={{display:"flex",gap:4}}>
              <button className="btn btn-ghost" style={{padding:"2px 5px",fontSize:8}} onClick={()=>setShowPw(true)}><I n="key" s={10}/></button>
              <button className="btn btn-ghost" style={{padding:"2px 5px",fontSize:8}} onClick={onLogout}>Salir</button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:9}} ref={contentRef}>

        {tab==="home"&&<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:8}}>
          <div className="ticket">
            <div className="ticket-top"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
              <div><div style={{fontSize:7,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>TIQUETERA · 30 DÍAS</div><div style={{fontFamily:"var(--font-d)",fontSize:13,fontWeight:700,color:"var(--white)"}}>{c.plan}</div><div style={{fontSize:7,color:"rgba(255,255,255,0.7)"}}>{c.goal} · Vence: {fmtDate(addDays(c.startDate,30))}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontFamily:"var(--font-d)",fontSize:36,fontWeight:700,color:"var(--white)",lineHeight:1}}>{c.sessions}</div><div style={{fontSize:7,fontWeight:700,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>restantes</div></div>
            </div></div>
            <div className="ticket-dashes"/>
            <div className="ticket-body"><div className="prog-track prog-md"><div className="prog-fill" style={{width:`${Math.round((1-c.sessions/c.totalSessions)*100)}%`}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"var(--gray)",marginTop:2}}><span>{c.totalSessions-c.sessions} usadas</span><span>{c.sessions} restantes</span></div></div>
          </div>
          {(c.pathologies||[]).length>0&&<div className="card"><div style={{fontSize:7,color:"var(--warn)",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>⚠️ Recomendaciones</div>{c.pathologies.map((p,i)=><span key={i} className="patho-tag" style={{display:"block",marginBottom:2}}>{p}</span>)}</div>}
          <div className="card">
            <div style={{fontSize:7,color:"var(--gray)",textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Próximas Sesiones</div>
            {nextSessions.length===0&&<div style={{fontSize:10,color:"var(--gray)",marginBottom:6}}>Sin sesiones agendadas</div>}
            {nextSessions.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 0",borderBottom:"1px solid #1a1a1a"}}>
              <div style={{fontSize:10,color:"var(--primary)",fontWeight:700,minWidth:85}}>📅 {s.date}</div>
              <div style={{flex:1,fontSize:10,fontWeight:600}}>{s.hour}</div>
              <span className="badge bm" style={{fontSize:7}}>{s.plan}</span>
              <button className="btn btn-danger btn-sm" style={{padding:"2px 5px"}} onClick={()=>setSessions(ss=>ss.map(x=>x.id===s.id?{...x,status:"cancelada"}:x))}>×</button>
            </div>)}
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:7,marginTop:6,fontSize:10}} onClick={()=>setShowBook(true)}><I n="plus" s={10}/>Agendar Sesión</button>
          </div>
          {lastThree.length>0&&<div className="card"><div style={{fontSize:7,color:"var(--gray)",textTransform:"uppercase",fontWeight:700,marginBottom:5}}>Últimas 3 Sesiones</div>{lastThree.map((s,i)=><div key={i} className="session-card" style={{borderColor:s.status==="completada"?"var(--success)":"var(--danger)",marginBottom:4}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:10}}>{s.date} · {s.hour}</div><div style={{fontSize:8,color:"var(--gray)"}}>{s.plan}</div></div><span className={`badge ${s.status==="completada"?"bgg":"bgr"}`}>{s.status}</span></div>)}</div>}
          <div className="card"><div style={{fontSize:7,color:"var(--gray)",textTransform:"uppercase",fontWeight:700,marginBottom:5}}>Contacto</div>{[{icon:"ig",val:"@fitcoachjhojan",color:"#E1306C",url:"https://instagram.com/fitcoachjhojan"},{icon:"wa",val:"302 667 7151",color:"#25D366",url:"https://wa.me/573026677151"},{icon:"tt",val:"@profe..jhojan.rin",color:"#fff",url:"https://tiktok.com"}].map((s,i)=><a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link" style={{textDecoration:"none",marginBottom:4}}><span style={{color:s.color}}><I n={s.icon} s={14}/></span><div style={{fontWeight:700,fontSize:10,color:s.color}}>{s.val}</div></a>)}</div>
        </div>}

        {tab==="rutina"&&<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:8}}>
          <TimerCard timer={timer}/>
          <div style={{display:"flex",gap:3}}>{DAYS_WEEK.map(d=><button key={d} className={`day-tab ${selDay===d?"active":""}`} onClick={()=>setSelDay(d)}>{d}</button>)}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div className="sec-title" style={{marginBottom:0}}>{selDay} {dayExs.length===0?"· Descanso 🛌":""}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {totalVol>0&&<div style={{fontSize:10,color:"var(--primary)",fontWeight:700}}>Vol: {totalVol}kg</div>}
              <button className="btn btn-primary btn-sm" onClick={saveRoutine}><I n="check" s={9}/>Guardar</button>
            </div>
          </div>
          {/* Volume bar */}
          {totalVol>0&&<div style={{marginBottom:2}}>
            <div style={{fontSize:8,color:"var(--gray)",marginBottom:2}}>Volumen del día vs semana</div>
            <div className="vol-bar"><div className="vol-fill" style={{width:`${Math.min(100,(totalVol/3000)*100)}%`}}/></div>
            <div style={{fontSize:8,color:"var(--gray)",marginTop:1}}>{totalVol}kg / est. 3000kg semana</div>
          </div>}
          {dayExs.length===0&&<div className="card" style={{fontSize:11,color:"var(--gray)",textAlign:"center"}}>Hoy es día de descanso activo. Estira, camina, descansa 🧘</div>}
          {dayExs.map((ex,i)=><ExCard key={i} ex={ex} editable={true} onChange={upd=>updEx(i,upd)}/>)}
        </div>}

        {tab==="nutricion"&&<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",gap:3}}>{DAYS_WEEK.map(d=><button key={d} className={`day-tab ${selDay===d?"active":""}`} onClick={()=>setSelDay(d)}>{d}</button>)}</div>
          <div className="g4">{[["Kcal",Math.round(tot.cal),"var(--primary)"],["Prot.",`${Math.round(tot.protein)}g`,"#ef4444"],["Carbs",`${Math.round(tot.carbs)}g`,"var(--primary)"],["Grasa",`${Math.round(tot.fat)}g`,"#60a5fa"]].map(([l,v,col])=><div key={l} className="card" style={{textAlign:"center",padding:"5px 2px"}}><div style={{fontFamily:"var(--font-d)",fontSize:15,fontWeight:700,color:col}}>{v}</div><div style={{fontSize:7,color:"var(--gray)",textTransform:"uppercase"}}>{l}</div></div>)}</div>
          {dayPlan.map((slot,si)=><FoodMealSlot key={si} slot={slot} mealIdx={si} onDrop={handleDrop} onRemove={removeFood} macroScale={ms} dragItem={dragItem} setDragItem={setDragItem} editable={true} onAdd={addFood}/>)}
          <div className="card"><div style={{fontSize:7,color:"var(--gray)",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>¿Cumpliste hoy?</div>{MEAL_SLOTS.map((meal,i)=><div key={i} className={`checklist-item ${checklist[i]?"done":""}`} onClick={()=>setChecklist(ch=>{const n=[...ch];n[i]=!n[i];return n;})} style={{marginBottom:4}}>
            <div className={`check-circle ${checklist[i]?"done":""}`}>{checklist[i]&&<I n="check" s={8}/>}</div>
            <div style={{flex:1}}><div style={{fontSize:10,fontWeight:600}}>{meal}</div></div>
            <div style={{fontSize:12}}>{MEAL_ICONS[i]}</div>
          </div>)}<div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginTop:3}}><span style={{color:"var(--gray)"}}>Adherencia</span><span style={{color:"var(--primary)",fontWeight:700}}>{Math.round(checklist.filter(Boolean).length/4*100)}%</span></div></div>
          {/* Hidratación hasta 3 litros (12 vasos) */}
          <div className="card"><div style={{fontSize:7,color:"var(--gray)",fontWeight:700,textTransform:"uppercase",marginBottom:5}}>Hidratación (máx. 3L)</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>
              {Array.from({length:MAX_H}).map((_,i)=><div key={i} className={`water-glass ${i<hydration?"filled":""}`} style={{width:24,height:36}} onClick={()=>setHydration(i<hydration?i:i+1)}><div className="water-fill" style={{height:i<hydration?"100%":"0%"}}/></div>)}
            </div>
            <div style={{fontSize:10,color:"var(--primary)",fontWeight:700}}>{hydration}/{MAX_H} vasos · {hydration*250}ml / {MAX_H*250}ml (3L)</div>
          </div>
        </div>}

        {tab==="suplementos"&&<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:7}}>
          <div style={{padding:"7px 10px",background:"var(--primary-dim)",border:"1px solid var(--primary-border)",borderRadius:8,fontSize:9,color:"var(--gray)"}}>💊 Asignados por <strong style={{color:"var(--primary)"}}>Coach Jhojan Rincón</strong> · Objetivo: <strong style={{color:"var(--white)"}}>{c.goal}</strong></div>
          {(c.supplements||[]).length===0&&<div className="card" style={{fontSize:11,color:"var(--gray)",textAlign:"center"}}>Sin suplementos asignados</div>}
          {(c.supplements||[]).map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 11px",background:"var(--surface)",border:"1px solid var(--primary-border)",borderRadius:9}}><div style={{width:5,height:5,borderRadius:"50%",background:"var(--primary)",flexShrink:0}}/><div style={{fontSize:11,fontWeight:600,flex:1}}>{s}</div></div>)}
          <div className="card"><div className="sec-title" style={{fontSize:13,marginBottom:7}}>Mis Comentarios</div>
            {(c.suppComments||[]).map((cm,i)=><div key={i} className={cm.isAlert?"comment-alert":"comment-bubble"}>{cm.isAlert&&"⚠️ "}{cm.text}<span style={{fontSize:8,color:"var(--gray)",display:"block",marginTop:1}}>{cm.date}</span></div>)}
            <div style={{marginTop:7}}><textarea className="inp" rows={2} value={suppText} onChange={e=>setSuppText(e.target.value)} placeholder="Cómo te sientes con los suplementos..."/><div style={{display:"flex",alignItems:"center",gap:6,marginTop:5}}>
              <div style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}} onClick={()=>setSuppAlert(s=>!s)}>
                <div className={`check-circle ${suppAlert?"done":""}`} style={{width:16,height:16,borderColor:suppAlert?"var(--danger)":"var(--gray)",background:suppAlert?"var(--danger)":undefined}}>{suppAlert&&<I n="check" s={8}/>}</div>
                <span style={{fontSize:9,color:suppAlert?"var(--danger)":"var(--gray)"}}>⚠️ Alerta al entrenador</span>
              </div>
              <button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}} disabled={!suppText.trim()} onClick={()=>{addSuppComment(suppText.trim(),suppAlert);setSuppText("");setSuppAlert(false);}}><I n="check" s={9}/>Enviar</button>
            </div></div>
          </div>
        </div>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{display:"flex",background:"var(--surface)",borderTop:"1px solid var(--primary-border)",padding:"3px 0",flexShrink:0}}>
        {[{id:"home",icon:"ticket",label:"Inicio"},{id:"rutina",icon:"dumbbell",label:"Rutina"},{id:"nutricion",icon:"food",label:"Nutrición"},{id:"suplementos",icon:"drop",label:"Suplem."}].map(n=><button key={n.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,fontSize:7,fontWeight:700,textTransform:"uppercase",border:"none",background:"transparent",cursor:"pointer",padding:"5px 0",color:tab===n.id?"var(--primary)":"var(--gray)",fontFamily:"var(--font)",transition:"color 0.15s"}} onClick={()=>setTab(n.id)}><I n={n.icon} s={18}/>{n.label}</button>)}
      </div>
    </div>
    <div className={`fab-wrap${fabHidden?" hidden":""}`}><button className="fab-btn" onClick={()=>setShowBook(true)}><I n="plus" s={18}/><span>AGENDA</span></button></div>
    {showBook&&<ClientBookModal c={c} sessions={sessions} setSessions={setSessions} onClose={()=>setShowBook(false)}/>}
    {showPw&&<ChangePwModal current={c.password||"cliente123"} onSave={p=>onUpdate({...c,password:p})} onClose={()=>setShowPw(false)}/>}
  </>;
}

function ClientBookModal({c,sessions,setSessions,onClose}){
  const [date,setDate]=useState("2026-04-16");const[hour,setHour]=useState("");
  const HOURS=["6:00","7:00","8:00","9:00","10:00","11:00","16:00","17:00","18:00","19:00","20:00"];
  return <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal-box" style={{maxWidth:340}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:11}}><div style={{fontFamily:"var(--font-d)",fontSize:15,fontWeight:700,color:"var(--primary)"}}>Agendar Sesión</div><button className="btn btn-ghost btn-sm" onClick={onClose}><I n="x" s={11}/></button></div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div><label className="inp-lbl">Fecha</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
        <div><label className="inp-lbl">Hora</label><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>{HOURS.map(h=><button key={h} className={`btn ${hour===h?"btn-primary":"btn-ghost"}`} style={{justifyContent:"center",padding:"5px",fontSize:9}} onClick={()=>setHour(h)}>{h}</button>)}</div></div>
        <div style={{padding:"5px 8px",background:"var(--surface2)",borderRadius:6,fontSize:8,color:"var(--gray)"}}>⚠️ Cancela con mínimo 2 horas de anticipación</div>
        <button className="btn btn-primary" style={{justifyContent:"center",padding:9}} disabled={!hour} onClick={()=>{setSessions(ss=>[...ss,{id:`s${Date.now()}`,clientId:c.id,date,hour,status:"pendiente",plan:c.plan}]);onClose();}}><I n="check" s={10}/>Confirmar</button>
      </div>
    </div>
  </div>;
}