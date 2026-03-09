"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mail, MapPin, Send, Github, Phone, MessageCircle, CheckCircle, AlertCircle, Instagram, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { addContactMessage } from '@/lib/firestore';

/* ── Floating particle canvas ── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      hue: Math.random() > 0.5 ? 190 : 270,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ── Neon input ── */
const NeonInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block font-orbitron text-[9px] tracking-[0.3em] uppercase"
        style={{ color: focused ? '#22d3ee' : '#64748b' }}>
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          className="w-full bg-transparent px-4 py-3 text-slate-200 text-sm font-rajdhani rounded-lg focus:outline-none transition-all duration-300 placeholder:text-slate-700"
          style={{
            border: `1px solid ${focused ? 'rgba(34,211,238,0.5)' : 'rgba(100,116,139,0.2)'}`,
            background: focused ? 'rgba(34,211,238,0.03)' : 'rgba(15,23,42,0.6)',
            boxShadow: focused ? '0 0 16px rgba(34,211,238,0.08), inset 0 0 12px rgba(34,211,238,0.03)' : 'none',
          }}
        />
        {/* bottom accent */}
        <div className="absolute bottom-0 left-4 right-4 h-[1px] transition-all duration-300"
          style={{ background: focused ? 'linear-gradient(90deg,transparent,#22d3ee,transparent)' : 'transparent' }} />
      </div>
    </div>
  );
};

const NeonTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block font-orbitron text-[9px] tracking-[0.3em] uppercase"
        style={{ color: focused ? '#22d3ee' : '#64748b' }}>
        {label}
      </label>
      <div className="relative">
        <textarea
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          className="w-full bg-transparent px-4 py-3 text-slate-200 text-sm font-rajdhani rounded-lg focus:outline-none transition-all duration-300 resize-none placeholder:text-slate-700"
          style={{
            border: `1px solid ${focused ? 'rgba(34,211,238,0.5)' : 'rgba(100,116,139,0.2)'}`,
            background: focused ? 'rgba(34,211,238,0.03)' : 'rgba(15,23,42,0.6)',
            boxShadow: focused ? '0 0 16px rgba(34,211,238,0.08)' : 'none',
          }}
        />
        <div className="absolute bottom-0 left-4 right-4 h-[1px] transition-all duration-300"
          style={{ background: focused ? 'linear-gradient(90deg,transparent,#22d3ee,transparent)' : 'transparent' }} />
      </div>
    </div>
  );
};

/* ── Custom dropdown (replaces native select for full style control) ── */
interface DropdownOption { value: string; label: string }
const NeonDropdown: React.FC<{
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(o => o.value === value)?.label ?? options[0]?.label ?? '';

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative space-y-1.5" ref={ref}>
      <label className="block font-orbitron text-[9px] tracking-[0.3em] uppercase"
        style={{ color: focused || open ? '#22d3ee' : '#64748b' }}>
        {label}
      </label>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(p => !p); setFocused(true); }}
        onBlur={() => { if (!open) setFocused(false); }}
        className="relative w-full flex items-center justify-between px-4 py-3 text-sm font-rajdhani rounded-lg transition-all duration-300 text-left"
        style={{
          border: `1px solid ${open || focused ? 'rgba(34,211,238,0.5)' : 'rgba(100,116,139,0.2)'}`,
          background: open || focused ? 'rgba(34,211,238,0.03)' : 'rgba(15,23,42,0.6)',
          boxShadow: open || focused ? '0 0 16px rgba(34,211,238,0.08)' : 'none',
          color: value ? '#e2e8f0' : '#334155',
        }}
      >
        <span>{selectedLabel}</span>
        <svg
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: '#64748b' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg overflow-hidden shadow-2xl"
          style={{
            background: '#0c1525',
            border: '1px solid rgba(34,211,238,0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(34,211,238,0.06)',
          }}
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); setFocused(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-rajdhani transition-all duration-150"
                style={{
                  background: isSelected ? 'rgba(34,211,238,0.12)' : 'transparent',
                  color: isSelected ? '#22d3ee' : '#cbd5e1',
                  borderLeft: isSelected ? '2px solid #22d3ee' : '2px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.06)';
                    (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
                  }
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSending(true);
    try {
      await addContactMessage(formData);
      showToast('success', 'ส่งข้อความสำเร็จ! ขอบคุณที่ติดต่อมา');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: Mail,   label: t('contact.email'),    value: 'mr.nattawat07@gmail.com', href: 'mailto:mr.nattawat07@gmail.com', color: '#22d3ee' },
    { icon: Phone,  label: t('contact.phone'),    value: '0926243340',               href: 'tel:+66926243340',               color: '#a855f7' },
    { icon: MapPin, label: t('contact.location'), value: t('contact.locationValue'), href: undefined,                       color: '#10b981' },
  ];

  const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/mr.axf/', color: '#bf0b68' },
    { icon: Github,    label: 'GitHub',    href: 'https://github.com/NiaUbin',        color: '#94a3b8' },
  ];

  return (
    <div className="section-container relative overflow-hidden">
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-sm transition-all duration-300"
          style={{
            background: toast.type === 'success' ? 'rgba(6,78,59,0.9)' : 'rgba(127,29,29,0.9)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: toast.type === 'success' ? '#6ee7b7' : '#fca5a5',
            boxShadow: `0 8px 32px ${toast.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-12 md:mb-16">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,#22d3ee)' }} />
            <span className="font-orbitron text-[10px] tracking-[0.4em] text-cyan-400 uppercase">{t('contact.subtitle')}</span>
            <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg,#22d3ee,transparent)' }} />
          </div>
          <h2
            className="font-orbitron font-black text-white"
            style={{ fontSize: 'clamp(1.8rem,5vw,3rem)' }}
          >
            {t('contact.title')}
          </h2>
          <p className="text-slate-400 text-sm mt-4 max-w-md mx-auto leading-relaxed">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6 lg:gap-8 items-start">

          {/* ── Left sidebar ── */}
          <div className="md:col-span-2 space-y-4">

            {/* Contact channels */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(100,116,139,0.15)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="font-orbitron text-xs tracking-widest text-cyan-400 uppercase">{t('contact.channels')}</h3>
              </div>

              {contactItems.map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="group">
                  {href ? (
                    <a href={href}
                      className="flex items-center gap-4 transition-all duration-200"
                    >
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0 transition-all duration-200 group-hover:scale-105"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-orbitron text-[9px] tracking-[0.25em] uppercase" style={{ color: '#64748b' }}>{label}</p>
                        <p className="text-sm font-rajdhani text-slate-300 group-hover:text-white transition-colors truncate">{value}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" style={{ color }} />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-orbitron text-[9px] tracking-[0.25em] uppercase" style={{ color: '#64748b' }}>{label}</p>
                        <p className="text-sm font-rajdhani text-slate-300 truncate">{value}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(100,116,139,0.15)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <h3 className="font-orbitron text-xs tracking-widest text-purple-400 uppercase mb-4">{t('contact.social')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {socials.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2.5 py-3 rounded-xl transition-all duration-300"
                    style={{
                      background: 'rgba(30,41,59,0.6)',
                      border: '1px solid rgba(100,116,139,0.15)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
                      (e.currentTarget as HTMLElement).style.background = `${color}10`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${color}20`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(100,116,139,0.15)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.6)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <Icon className="w-4 h-4 transition-colors duration-200 text-slate-500 group-hover:text-white" style={{ color: undefined }} />
                    <span className="font-orbitron text-[10px] text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: 'rgba(6,78,59,0.2)',
                border: '1px solid rgba(16,185,129,0.2)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
              </span>
              <div>
                <p className="font-orbitron text-xs text-emerald-400">{t('contact.available')}</p>
                <p className="font-orbitron text-[9px] text-emerald-700 mt-0.5">{t('contact.replyTime')}</p>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="md:col-span-3">
            <div
              className="p-6 md:p-8 rounded-2xl h-full"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(100,116,139,0.15)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Form header */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(#22d3ee,#a855f7)' }} />
                <h3 className="font-orbitron text-sm font-bold text-white">{t('contact.sendMessage')}</h3>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NeonInput
                    label={t('contact.name')}
                    type="text"
                    placeholder={t('contact.namePlaceholder')}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <NeonInput
                    label={t('contact.emailLabel')}
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <NeonDropdown
                  label={t('contact.subject')}
                  value={formData.subject}
                  onChange={val => setFormData({ ...formData, subject: val })}
                  options={[
                    { value: '', label: t('contact.selectSubject') },
                    { value: 'project', label: t('contact.projectHire') },
                    { value: 'job', label: t('contact.jobOffer') },
                    { value: 'consult', label: t('contact.consultation') },
                    { value: 'other', label: t('contact.other') },
                  ]}
                />

                <NeonTextarea
                  label={t('contact.message')}
                  rows={5}
                  placeholder={t('contact.messagePlaceholder')}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative w-full py-3.5 rounded-xl font-orbitron text-xs tracking-widest font-bold overflow-hidden transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: sending ? 'rgba(34,211,238,0.1)' : 'linear-gradient(135deg,rgba(34,211,238,0.15),rgba(168,85,247,0.15))',
                    border: '1px solid rgba(34,211,238,0.35)',
                    color: '#22d3ee',
                    boxShadow: sending ? 'none' : '0 0 20px rgba(34,211,238,0.1)',
                  }}
                  onMouseEnter={e => {
                    if (!sending) {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,rgba(34,211,238,0.25),rgba(168,85,247,0.25))';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(34,211,238,0.2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!sending) {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,rgba(34,211,238,0.15),rgba(168,85,247,0.15))';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(34,211,238,0.1)';
                    }
                  }}
                >
                  {/* Scan shimmer */}
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.08),transparent)' }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {sending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>กำลังส่ง...</span></>
                    ) : (
                      <><Send className="w-4 h-4" /><span>{t('contact.send')}</span></>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};