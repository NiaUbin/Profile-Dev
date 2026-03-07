"use client";

import React, { useState } from 'react';
import { CardFrame, GameButton } from './GamerUI';
import { Mail, MapPin, Send, Linkedin, Github, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { addContactMessage } from '@/lib/firestore';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
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
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="section-container relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-900/90 text-green-300 border border-green-700'
              : 'bg-red-900/90 text-red-300 border border-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-orbitron text-2xl md:text-4xl font-black mb-2 text-white">{t('contact.title')}</h2>
          <p className="text-slate-500 font-orbitron text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em]">{t('contact.subtitle')}</p>
          <p className="text-slate-400 text-sm md:text-base mt-3 md:mt-4 max-w-md mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-4">
            {/* Contact Cards */}
            <CardFrame className="p-4 md:p-6">
              <h3 className="font-orbitron text-sm md:text-base font-bold mb-4 text-cyan-400 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> {t('contact.channels')}
              </h3>
              <div className="space-y-3 md:space-y-4">
                <a href="mailto:mr.nattawat07@gmail.com" className="flex items-center gap-3 md:gap-4 text-slate-400 hover:text-white transition-colors group">
                  <div className="p-2 md:p-2.5 bg-slate-800 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-orbitron">{t('contact.email')}</p>
                    <p className="text-xs md:text-sm font-orbitron truncate">mr.nattawat07@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+66926243340" className="flex items-center gap-3 md:gap-4 text-slate-400 hover:text-white transition-colors group">
                  <div className="p-2 md:p-2.5 bg-slate-800 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-orbitron">{t('contact.phone')}</p>
                    <p className="text-xs md:text-sm font-orbitron">0926243340</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 md:gap-4 text-slate-400">
                  <div className="p-2 md:p-2.5 bg-slate-800 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-orbitron">{t('contact.location')}</p>
                    <p className="text-xs md:text-sm font-orbitron truncate">{t('contact.locationValue')}</p>
                  </div>
                </div>
              </div>
            </CardFrame>

            {/* Social Links */}
            <CardFrame className="p-4 md:p-6">
              <h3 className="font-orbitron text-sm md:text-base font-bold mb-4 text-purple-400">{t('contact.social')}</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <a href="#" className="flex items-center justify-center gap-2 p-2.5 md:p-3 bg-slate-800 hover:bg-[#0077b5]/20 text-slate-400 hover:text-[#0077b5] transition-all rounded-lg group">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs font-orbitron">LinkedIn</span>
                </a>
                <a href="#" className="flex items-center justify-center gap-2 p-2.5 md:p-3 bg-slate-800 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-lg group">
                  <Github className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs font-orbitron">GitHub</span>
                </a>
              </div>
            </CardFrame>

            {/* Availability */}
            <CardFrame className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <p className="text-sm md:text-base font-orbitron text-white">{t('contact.available')}</p>
                  <p className="text-[10px] md:text-xs text-slate-500">{t('contact.replyTime')}</p>
                </div>
              </div>
            </CardFrame>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <CardFrame className="h-full p-4 md:p-6">
              <h3 className="font-orbitron text-sm md:text-base font-bold mb-4 md:mb-6 text-white">{t('contact.sendMessage')}</h3>
              <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-[10px] md:text-xs font-orbitron text-slate-500 uppercase">{t('contact.name')}</label>
                    <input 
                      type="text" 
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 md:p-3 text-slate-200 text-xs md:text-sm font-rajdhani rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-[10px] md:text-xs font-orbitron text-slate-500 uppercase">{t('contact.emailLabel')}</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 md:p-3 text-slate-200 text-xs md:text-sm font-rajdhani rounded-lg focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="block text-[10px] md:text-xs font-orbitron text-slate-500 uppercase">{t('contact.subject')}</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 md:p-3 text-slate-200 text-xs md:text-sm font-rajdhani rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">{t('contact.selectSubject')}</option>
                    <option value="project">{t('contact.projectHire')}</option>
                    <option value="job">{t('contact.jobOffer')}</option>
                    <option value="consult">{t('contact.consultation')}</option>
                    <option value="other">{t('contact.other')}</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="block text-[10px] md:text-xs font-orbitron text-slate-500 uppercase">{t('contact.message')}</label>
                  <textarea 
                    rows={4}
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 md:p-3 text-slate-200 text-xs md:text-sm font-rajdhani rounded-lg focus:outline-none focus:border-cyan-500 transition-colors resize-none placeholder:text-slate-600"
                  />
                </div>

                <GameButton className="w-full flex items-center justify-center gap-2" disabled={sending}>
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                      <span>กำลังส่ง...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('contact.send')}</span>
                    </>
                  )}
                </GameButton>
              </form>
            </CardFrame>
          </div>
        </div>
      </div>
    </div>
  );
};
