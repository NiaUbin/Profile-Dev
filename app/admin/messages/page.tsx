"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, RefreshCw, Clock, User as UserIcon } from "lucide-react";
import { getMessages, ContactMessage } from "@/lib/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบข้อความนี้หรือไม่?")) return;
    try {
      await deleteDoc(doc(db, "messages", id));
      await fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "-";
    try {
      const ts = timestamp as { toDate: () => Date };
      return ts.toDate().toLocaleString("th-TH");
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="text-gray-600" size={24} />
            ข้อความติดต่อ
          </h1>
          <p className="text-gray-500 mt-1">
            ข้อความจากผู้เยี่ยมชมเว็บไซต์ ({messages.length} ข้อความ)
          </p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          รีเฟรช
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
          <Mail size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">ยังไม่มีข้อความ</p>
          <p className="text-sm">เมื่อมีผู้เยี่ยมชมส่งข้อความผ่านฟอร์ม จะแสดงที่นี่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedMessage?.id === msg.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserIcon size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 truncate">{msg.name}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.subject || msg.email}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock size={12} />
                  {formatDate(msg.createdAt)}
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.name}</h3>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                  </div>
                  <button
                    onClick={() => selectedMessage.id && handleDelete(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {selectedMessage.subject && (
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500 uppercase">หัวข้อ</span>
                    <p className="text-sm text-gray-800 mt-1">{selectedMessage.subject}</p>
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase">ข้อความ</span>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <Mail size={32} className="mx-auto mb-3 opacity-30" />
                <p>เลือกข้อความเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
