"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, RefreshCw, Clock, User as UserIcon, Loader2, Inbox } from "lucide-react";
import { getMessages, ContactMessage } from "@/lib/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SUBJECT_MAP: Record<string, string> = {
  project: 'ต้องการจ้างทำโปรเจกต์',
  job:     'เสนองานประจำ',
  consult: 'ปรึกษาเรื่องเทคนิค',
  other:   'อื่นๆ',
};

const formatDate = (timestamp: unknown) => {
  if (!timestamp) return '-';
  try { return (timestamp as { toDate: () => Date }).toDate().toLocaleString('th-TH'); }
  catch { return '-'; }
};

export default function MessagesAdmin() {
  const [messages, setMessages]           = useState<ContactMessage[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selectedMessage, setSelected]    = useState<ContactMessage | null>(null);
  const [deleting, setDeleting]           = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try { const data = await getMessages(); setMessages(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: string) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'ลบข้อความ?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้ ข้อมูลจะไม่สามารถกู้คืนได้",
      icon: 'warning',
      showCancelButton: true,
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.15)] rounded-3xl',
        title: 'font-orbitron tracking-wider text-white',
        confirmButton: 'mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] rounded-xl font-orbitron tracking-wider transition-all mr-3',
        cancelButton: 'mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl font-orbitron tracking-wider transition-all'
      }
    });

    if (!result.isConfirmed) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'messages', id));
      Swal.fire({
        title: 'ลบสำเร็จ!',
        icon: 'success',
        background: '#0f172a',
        color: '#e2e8f0',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] rounded-3xl',
          title: 'font-orbitron tracking-wider text-emerald-400',
        }
      });
      await fetchMessages();
      if (selectedMessage?.id === id) setSelected(null);
    } catch (e) { 
      console.error(e); 
      Swal.fire({
        title: 'เกิดข้อผิดพลาดในการลบ',
        icon: 'error',
        background: '#0f172a',
        color: '#e2e8f0',
        confirmButtonText: 'ตกลง',
        buttonsStyling: false,
        customClass: {
          popup: 'border border-rose-500/30 rounded-3xl',
          confirmButton: 'mt-4 px-6 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl'
        }
      });
    }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
        style={{ borderBottom: '1px solid rgba(100,116,139,0.15)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="font-orbitron font-black text-xl text-white tracking-wider">ข้อความติดต่อ</h1>
          </div>
          <p className="font-orbitron text-[9px] tracking-widest text-slate-600 ml-11">
            INBOX · {messages.length} MESSAGES
          </p>
        </div>

        <button onClick={fetchMessages} disabled={loading}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-xs tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(16,185,129,0.35)'; el.style.color='#10b981'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(100,116,139,0.2)'; el.style.color='#64748b'; }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          รีเฟรช
        </button>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="font-orbitron text-[10px] tracking-widest text-slate-600">กำลังโหลด...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(100,116,139,0.15)' }}>
            <Inbox className="w-7 h-7 text-slate-700" />
          </div>
          <div className="text-center">
            <p className="font-orbitron text-sm text-slate-500">ยังไม่มีข้อความ</p>
            <p className="text-slate-700 text-xs mt-1">เมื่อมีผู้เยี่ยมชมส่งข้อความ จะแสดงที่นี่</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">

          {/* ── Message list ── */}
          <div className="lg:col-span-2 space-y-2 overflow-y-auto max-h-[70vh] pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(100,116,139,0.2) transparent' }}>
            {messages.map(msg => {
              const active = selectedMessage?.id === msg.id;
              return (
                <div key={msg.id}
                  role="button" tabIndex={0}
                  onClick={() => setSelected(msg)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(msg); } }}
                  className="p-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none"
                  style={{
                    background: active ? 'rgba(16,185,129,0.08)' : 'rgba(15,23,42,0.7)',
                    border: `1px solid ${active ? 'rgba(16,185,129,0.35)' : 'rgba(100,116,139,0.15)'}`,
                    backdropFilter: 'blur(12px)',
                    boxShadow: active ? '0 0 16px rgba(16,185,129,0.08)' : 'none',
                  }}
                  onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(100,116,139,0.3)'; el.style.background='rgba(30,41,59,0.5)'; } }}
                  onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(100,116,139,0.15)'; el.style.background='rgba(15,23,42,0.7)'; } }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg shrink-0"
                      style={{ background: active ? 'rgba(16,185,129,0.15)' : 'rgba(30,41,59,0.7)', border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.15)'}` }}>
                      <UserIcon className="w-3 h-3" style={{ color: active ? '#10b981' : '#475569' }} />
                    </div>
                    <span className="font-orbitron text-xs font-bold truncate" style={{ color: active ? '#f1f5f9' : '#94a3b8' }}>
                      {msg.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate ml-8 mb-2" style={{ color: active ? '#64748b' : '#475569' }}>
                    {msg.subject ? SUBJECT_MAP[msg.subject] ?? msg.subject : msg.email}
                  </p>
                  <div className="flex items-center gap-1.5 ml-8">
                    <Clock className="w-3 h-3 text-slate-700" />
                    <span className="text-[10px] text-slate-700">{formatDate(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Detail panel ── */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <div className="h-full rounded-2xl overflow-hidden"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(16,185,129,0.2)', backdropFilter: 'blur(16px)' }}>
                {/* Panel top accent */}
                <div className="h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,#10b98150,transparent)' }} />

                <div className="p-6">
                  {/* Sender header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                          <UserIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-orbitron font-bold text-base text-white">{selectedMessage.name}</h3>
                      </div>
                      <p className="text-slate-500 text-xs ml-10 font-rajdhani">{selectedMessage.email}</p>
                    </div>
                    <button
                      onClick={() => selectedMessage.id && handleDelete(selectedMessage.id)}
                      disabled={deleting === selectedMessage.id}
                      className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50"
                      style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(100,116,139,0.15)', color: '#64748b' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(244,63,94,0.08)'; el.style.borderColor='rgba(244,63,94,0.3)'; el.style.color='#fb7185'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(30,41,59,0.6)'; el.style.borderColor='rgba(100,116,139,0.15)'; el.style.color='#64748b'; }}>
                      {deleting === selectedMessage.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Subject */}
                  {selectedMessage.subject && (
                    <div className="mb-5 p-4 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <p className="font-orbitron text-[9px] tracking-[0.3em] uppercase text-emerald-600 mb-1">หัวข้อ</p>
                      <p className="text-slate-300 text-sm font-rajdhani font-semibold">
                        {SUBJECT_MAP[selectedMessage.subject] ?? selectedMessage.subject}
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  <div className="mb-5">
                    <p className="font-orbitron text-[9px] tracking-[0.3em] uppercase text-slate-600 mb-3">ข้อความ</p>
                    <div className="p-4 rounded-xl leading-relaxed"
                      style={{ background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(100,116,139,0.12)' }}>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap font-rajdhani">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 pt-4"
                    style={{ borderTop: '1px solid rgba(100,116,139,0.1)' }}>
                    <Clock className="w-3.5 h-3.5 text-slate-700" />
                    <span className="font-orbitron text-[9px] tracking-widest text-slate-700">
                      {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 rounded-2xl"
                style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(100,116,139,0.1)', backdropFilter: 'blur(12px)' }}>
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(100,116,139,0.12)' }}>
                  <Mail className="w-6 h-6 text-slate-700" />
                </div>
                <p className="font-orbitron text-xs text-slate-700">เลือกข้อความเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}