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
      background: '#ffffff',
      color: '#1e293b',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'border border-rose-100 shadow-[0_10px_40px_rgba(244,63,94,0.1)] rounded-3xl',
        title: 'font-orbitron tracking-wider text-slate-800',
        confirmButton: 'mt-4 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 rounded-xl font-orbitron tracking-wider transition-all mr-3',
        cancelButton: 'mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl font-orbitron tracking-wider transition-all'
      }
    });

    if (!result.isConfirmed) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'messages', id));
      Swal.fire({
        title: 'ลบสำเร็จ!',
        icon: 'success',
        background: '#ffffff',
        color: '#1e293b',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'border border-emerald-100 shadow-[0_10px_40px_rgba(16,185,129,0.1)] rounded-3xl',
          title: 'font-orbitron tracking-wider text-emerald-500',
        }
      });
      await fetchMessages();
      if (selectedMessage?.id === id) setSelected(null);
    } catch (e) { 
      console.error(e); 
      Swal.fire({
        title: 'เกิดข้อผิดพลาดในการลบ',
        icon: 'error',
        background: '#ffffff',
        color: '#1e293b',
        confirmButtonText: 'ตกลง',
        buttonsStyling: false,
        customClass: {
          popup: 'border border-rose-100 rounded-3xl',
          confirmButton: 'mt-4 px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-orbitron tracking-wider transition-all'
        }
      });
    }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
        style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
              <Mail className="w-4 h-4 text-emerald-500" />
            </div>
            <h1 className="font-orbitron font-black text-xl text-slate-800 tracking-wider">ข้อความติดต่อ</h1>
          </div>
          <p className="font-orbitron text-[9px] tracking-widest text-slate-500 ml-11">
            INBOX · {messages.length} MESSAGES
          </p>
        </div>

        <button onClick={fetchMessages} disabled={loading}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-xs tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50 shadow-sm bg-white border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-500 hover:shadow-md">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          รีเฟรช
        </button>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="font-orbitron text-[10px] tracking-widest text-slate-500">กำลังโหลด...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Inbox className="w-7 h-7 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="font-orbitron text-sm font-bold text-slate-500">ยังไม่มีข้อความ</p>
            <p className="text-slate-400 text-xs mt-1">เมื่อมีผู้เยี่ยมชมส่งข้อความ จะแสดงที่นี่</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">

          {/* ── Message list ── */}
          <div className="lg:col-span-2 space-y-2 overflow-y-auto max-h-[70vh] pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
            {messages.map(msg => {
              const active = selectedMessage?.id === msg.id;
              return (
                <div key={msg.id}
                  role="button" tabIndex={0}
                  onClick={() => setSelected(msg)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(msg); } }}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none border ${
                    active ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-lg shrink-0 border ${
                      active ? 'bg-emerald-100 border-emerald-300' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <UserIcon className={`w-3 h-3 ${active ? 'text-emerald-600' : 'text-slate-500'}`} />
                    </div>
                    <span className={`font-orbitron text-xs font-bold truncate ${active ? 'text-emerald-800' : 'text-slate-700'}`}>
                      {msg.name}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate ml-8 mb-2 ${active ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {msg.subject ? SUBJECT_MAP[msg.subject] ?? msg.subject : msg.email}
                  </p>
                  <div className="flex items-center gap-1.5 ml-8">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-500">{formatDate(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Detail panel ── */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <div className="h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm flex flex-col">
                {/* Panel top accent */}
                <div className="h-1 bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-100" />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Sender header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
                          <UserIcon className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h3 className="font-orbitron font-bold text-base text-slate-800">{selectedMessage.name}</h3>
                      </div>
                      <p className="text-slate-500 text-sm ml-10 font-rajdhani">{selectedMessage.email}</p>
                    </div>
                    <button
                      onClick={() => selectedMessage.id && handleDelete(selectedMessage.id)}
                      disabled={deleting === selectedMessage.id}
                      className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 text-slate-400 border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 bg-slate-50">
                      {deleting === selectedMessage.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Subject */}
                  {selectedMessage.subject && (
                    <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <p className="font-orbitron text-[9px] tracking-[0.3em] uppercase text-emerald-600 mb-1 font-bold">หัวข้อ</p>
                      <p className="text-slate-800 text-sm font-rajdhani font-semibold">
                        {SUBJECT_MAP[selectedMessage.subject] ?? selectedMessage.subject}
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  <div className="space-y-3 flex-1">
                    <p className="font-orbitron text-[9px] tracking-[0.3em] uppercase text-slate-500 font-bold px-1">ข้อความ</p>
                    <div className="p-5 rounded-xl leading-relaxed bg-slate-50 border border-slate-200 shadow-inner min-h-[150px]">
                      <p className="text-slate-700 text-sm whitespace-pre-wrap font-rajdhani">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-end gap-2 pt-6 mt-6 border-t border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-orbitron text-[10px] tracking-widest text-slate-500">
                      ส่งเมื่อ : {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 rounded-2xl bg-white border border-slate-200 border-dashed">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-orbitron text-xs text-slate-400">เลือกข้อความเพื่อดูรายละเอียดด้านนี้</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}