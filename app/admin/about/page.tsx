"use client";

import { useEffect, useState } from "react";
import {
  User, Code2, Server, Zap, Save, RefreshCw, Plus, Trash2,
  Briefcase, GraduationCap, Globe, FileText, Type,
} from "lucide-react";
import { getAboutData, updateAboutData, AboutData, AboutSkill } from "@/lib/firestore";

/* ═══════════════════════════════════════
   GLASS CARD (Light)
═══════════════════════════════════════ */
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; accent?: string }> = ({ children, className = "", accent }) => (
  <div
    className={`rounded-2xl p-5 md:p-6 shadow-sm ${className}`}
    style={{
      background: "#ffffff",
      border: `1px solid ${accent ? `${accent}40` : "#e2e8f0"}`,
      boxShadow: accent ? `0 4px 20px ${accent}10` : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    }}
  >
    {children}
  </div>
);

/* ═══════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════ */
const SectionHeader: React.FC<{
  icon: React.ReactNode; title: string; titleColor?: string; iconBg: string; iconBorder: string;
}> = ({ icon, title, titleColor, iconBg, iconBorder }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div
      className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
      style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
    >
      {icon}
    </div>
    <h3 className="font-orbitron text-sm font-bold" style={{ color: titleColor ?? "#1e293b" }}>
      {title}
    </h3>
  </div>
);

/* ═══════════════════════════════════════
   STYLED INPUT
═══════════════════════════════════════ */
const StyledInput: React.FC<{
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}> = ({ label, value, onChange, placeholder, type = "text" }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="font-orbitron text-[9px] tracking-[0.3em] uppercase"
        style={{ color: focused ? "#0ea5e9" : "#64748b" }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400"
        style={{
          background: focused ? "#ffffff" : "#f8fafc",
          border: `1px solid ${focused ? "#3b82f6" : "#e2e8f0"}`,
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════
   STYLED TEXTAREA
═══════════════════════════════════════ */
const StyledTextarea: React.FC<{
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="font-orbitron text-[9px] tracking-[0.3em] uppercase"
        style={{ color: focused ? "#0ea5e9" : "#64748b" }}>
        {label}
      </label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400 resize-none"
        style={{
          background: focused ? "#ffffff" : "#f8fafc",
          border: `1px solid ${focused ? "#3b82f6" : "#e2e8f0"}`,
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════
   SKILL EDITOR ROW
═══════════════════════════════════════ */
const SkillEditorRow: React.FC<{
  skill: AboutSkill;
  onChange: (s: AboutSkill) => void;
  onDelete: () => void;
}> = ({ skill, onChange, onDelete }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
    style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
    <div className="relative shrink-0">
      <div className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer"
        style={{ background: skill.color, border: "1px solid rgba(0,0,0,0.1)" }}>
        <input
          type="color" value={skill.color}
          onChange={e => onChange({ ...skill, color: e.target.value })}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
    <input
      value={skill.name}
      onChange={e => onChange({ ...skill, name: e.target.value })}
      className="flex-1 px-3 py-2 text-sm text-slate-800 rounded-lg focus:outline-none transition-all duration-300 placeholder:text-slate-400"
      style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
      placeholder="ชื่อ Skill"
    />
    <button onClick={onDelete}
      className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all duration-200"
      style={{ background: "#fff1f2", border: "1px solid #ffe4e6", color: "#e11d48" }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.background = "#ffe4e6"; el.style.borderColor = "#fecdd3"; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.background = "#fff1f2"; el.style.borderColor = "#ffe4e6"; }}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

/* ═══════════════════════════════════════
   TOOL TAG EDITOR
═══════════════════════════════════════ */
const ToolTagEditor: React.FC<{
  tool: string; onDelete: () => void;
}> = ({ tool, onDelete }) => (
  <span
    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-rajdhani font-semibold text-sm cursor-default transition-all duration-200 group"
    style={{
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      color: "#475569",
    }}
  >
    {tool}
    <button onClick={onDelete}
      className="w-4 h-4 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity hover:bg-rose-100"
      style={{ color: "#e11d48" }}>
      <Trash2 className="w-3 h-3" />
    </button>
  </span>
);

/* ═══════════════════════════════════════
   MAIN ADMIN ABOUT PAGE
═══════════════════════════════════════ */
type TabType = 'profile' | 'bio' | 'skills' | 'tools';

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTool, setNewTool] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs: { id: TabType; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'profile', label: 'ข้อมูลและสถิติ', icon: User, color: '#0ea5e9' },
    { id: 'bio', label: 'ข้อความแนะนำตัว', icon: Type, color: '#3b82f6' },
    { id: 'skills', label: 'ทักษะ (Skills)', icon: Code2, color: '#8b5cf6' },
    { id: 'tools', label: 'เครื่องมือ (Tools)', icon: Zap, color: '#eab308' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const aboutData = await getAboutData();
      setData(aboutData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateAboutData(data);
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        title: "บันทึกสำเร็จ!",
        text: "ข้อมูลเกี่ยวกับฉันถูกอัปเดตแล้ว",
        icon: "success",
        background: "#ffffff",
        color: "#1e293b",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "border border-blue-100 shadow-[0_10px_40px_rgba(59,130,246,0.1)] rounded-3xl",
          title: "font-orbitron tracking-wider text-blue-600",
        },
      });
    } catch (e) {
      console.error(e);
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        background: "#ffffff",
        color: "#1e293b",
        confirmButtonText: "ตกลง",
        buttonsStyling: false,
        customClass: {
          popup: "border border-rose-100 shadow-[0_10px_40px_rgba(244,63,94,0.1)] rounded-3xl",
          title: "font-orbitron tracking-wider text-rose-500",
          confirmButton: "mt-4 px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-orbitron tracking-wider transition-all",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const update = (patch: Partial<AboutData>) => setData(prev => prev ? { ...prev, ...patch } : prev);

  const updateFrontendSkill = (index: number, skill: AboutSkill) => {
    if (!data) return;
    const arr = [...data.frontendSkills];
    arr[index] = skill;
    update({ frontendSkills: arr });
  };

  const updateBackendSkill = (index: number, skill: AboutSkill) => {
    if (!data) return;
    const arr = [...data.backendSkills];
    arr[index] = skill;
    update({ backendSkills: arr });
  };

  const deleteFrontendSkill = (index: number) => {
    if (!data) return;
    update({ frontendSkills: data.frontendSkills.filter((_, i) => i !== index) });
  };

  const deleteBackendSkill = (index: number) => {
    if (!data) return;
    update({ backendSkills: data.backendSkills.filter((_, i) => i !== index) });
  };

  const addFrontendSkill = () => {
    if (!data) return;
    update({ frontendSkills: [...data.frontendSkills, { name: "", color: "#0ea5e9" }] });
  };

  const addBackendSkill = () => {
    if (!data) return;
    update({ backendSkills: [...data.backendSkills, { name: "", color: "#8b5cf6" }] });
  };

  const addTool = () => {
    if (!data || !newTool.trim()) return;
    update({ tools: [...data.tools, newTool.trim()] });
    setNewTool("");
  };

  const deleteTool = (index: number) => {
    if (!data) return;
    update({ tools: data.tools.filter((_, i) => i !== index) });
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl p-6 animate-pulse bg-white border border-slate-200">
            <div className="h-5 w-40 rounded-lg mb-4 bg-slate-100" />
            <div className="space-y-3">
              <div className="h-10 rounded-xl bg-slate-50" />
              <div className="h-10 rounded-xl bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
        style={{ borderBottom: "1px solid #e2e8f0" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
              <User className="w-4 h-4 text-sky-500" />
            </div>
            <h1 className="font-orbitron font-black text-xl text-slate-800 tracking-wider">จัดการเกี่ยวกับฉัน</h1>
          </div>
          <p className="text-slate-500 text-sm ml-11">แก้ไขข้อมูลในส่วน About และ Skills ต่างๆ</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchData} disabled={loading}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-xs tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50 shadow-sm"
            style={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#64748b" }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#bae6fd"; el.style.color = "#0ea5e9"; el.style.boxShadow = "0 4px 12px rgba(14,165,233,0.1)"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "#e2e8f0"; el.style.color = "#64748b"; el.style.boxShadow = "none"; }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            รีเฟรช
          </button>

          <button onClick={handleSave} disabled={saving}
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-widest text-white overflow-hidden transition-all duration-300 disabled:opacity-60 focus:outline-none shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#3b82f6)" }}
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)" }} />
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />กำลังบันทึก...</>
            ) : (
              <><Save className="w-3.5 h-3.5 relative z-10" /><span className="relative z-10">บันทึก</span></>
            )}
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="group flex items-center gap-2.5 px-5 py-3 rounded-xl font-orbitron text-xs tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 focus:outline-none"
              style={{
                background: isActive ? `${tab.color}15` : "#ffffff",
                border: `1px solid ${isActive ? `${tab.color}40` : "#e2e8f0"}`,
                color: isActive ? tab.color : "#64748b",
                boxShadow: isActive ? `0 4px 12px ${tab.color}10` : "0 1px 2px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.background = "#f8fafc";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.background = "#ffffff";
                }
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[400px]">

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <GlassCard accent="#0ea5e9">
              <SectionHeader
                icon={<User className="w-3.5 h-3.5 text-sky-500" />}
                title="ข้อมูลโปรไฟล์"
                titleColor="#0ea5e9"
                iconBg="#e0f2fe"
                iconBorder="#bae6fd"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StyledInput label="ชื่อ" value={data.name} onChange={v => update({ name: v })} placeholder="ชื่อที่แสดง" />
                <StyledInput label="ตำแหน่ง/บทบาท" value={data.role} onChange={v => update({ role: v })} placeholder="Full Stack Developer" />
                <StyledInput label="URL รูปโปรไฟล์" value={data.avatarUrl} onChange={v => update({ avatarUrl: v })} placeholder="/profile.webp" />
                <StyledInput label="URL ไฟล์ CV" value={data.cvUrl} onChange={v => update({ cvUrl: v })} placeholder="/resume.pdf" />
              </div>

              <div className="mt-6 pt-5" style={{ borderTop: "1px solid #e2e8f0" }}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-6 h-6 flex items-center justify-center rounded-md"
                    style={{ background: "#f3e8ff", border: "1px solid #e9d5ff" }}>
                    <Briefcase className="w-3 h-3 text-purple-500" />
                  </div>
                  <span className="font-orbitron text-[10px] tracking-widest text-slate-500 uppercase">สถิติโปรไฟล์</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StyledInput label="ประสบการณ์" value={data.experience} onChange={v => update({ experience: v })} placeholder="3+ ปี พัฒนาเว็บ" />
                  <StyledInput label="การศึกษา" value={data.education} onChange={v => update({ education: v })} placeholder="วิศวกรรมคอมพิวเตอร์" />
                  <StyledInput label="สถานที่" value={data.location} onChange={v => update({ location: v })} placeholder="กรุงเทพฯ, ประเทศไทย" />
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* BIO TAB */}
        {activeTab === 'bio' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <GlassCard accent="#3b82f6">
              <SectionHeader
                icon={<Type className="w-3.5 h-3.5 text-blue-500" />}
                title="ข้อความแนะนำตัว"
                titleColor="#3b82f6"
                iconBg="#dbeafe"
                iconBorder="#bfdbfe"
              />
              <div className="space-y-4">
                <StyledInput label="ชื่อเน้น (Highlight)" value={data.highlightName} onChange={v => update({ highlightName: v })} placeholder="Nattawat" />
                <StyledTextarea label="แนะนำตัว ส่วนที่ 1 (ก่อนชื่อ)" value={data.introPart1} onChange={v => update({ introPart1: v })} placeholder="สวัสดีครับ! ผมคือ" rows={2} />
                <StyledTextarea label="แนะนำตัว ส่วนที่ 2 (หลังชื่อ ก่อน Frontend/Backend)" value={data.introPart2} onChange={v => update({ introPart2: v })} placeholder="โปรแกรมเมอร์ที่หลงใหลในการพัฒนา..." rows={2} />
                <StyledTextarea label="แนะนำตัว ส่วนที่ 3 (ย่อหน้า 2 เริ่มต้น)" value={data.introPart3} onChange={v => update({ introPart3: v })} placeholder="ผมสร้างเว็บไซต์ที่" rows={2} />
                <StyledTextarea label="แนะนำตัว ส่วนที่ 4 (ปิดท้าย ย่อหน้า 2)" value={data.introPart4} onChange={v => update({ introPart4: v })} placeholder="บนทุกอุปกรณ์ ไม่ว่าจะเป็น..." rows={2} />
              </div>

              {/* Preview */}
              <div className="mt-6 p-5 rounded-xl shadow-inner bg-slate-50" style={{ border: "1px dashed #cbd5e1" }}>
                <p className="font-orbitron text-[9px] tracking-[0.3em] text-blue-500 uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  ตัวอย่างการแสดงผลจริง (Live Preview)
                </p>
                <div className="space-y-3 text-slate-700 text-sm leading-relaxed p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p>
                    {data.introPart1}{" "}
                    <span className="text-sky-500 font-medium">{data.highlightName}</span>{" "}
                    {data.introPart2}{" "}
                    <span className="px-1.5 py-0.5 rounded text-xs font-orbitron bg-cyan-50 text-cyan-600 border border-cyan-200">Frontend</span>{" "}
                    และ{" "}
                    <span className="px-1.5 py-0.5 rounded text-xs font-orbitron bg-purple-50 text-purple-600 border border-purple-200">Backend</span>
                  </p>
                  <p>
                    {data.introPart3}{" "}
                    <span className="text-slate-900 font-medium">สวยงาม</span>,{" "}
                    <span className="text-slate-900 font-medium">ใช้งานง่าย</span> และ{" "}
                    <span className="text-slate-900 font-medium">ทำงานได้รวดเร็ว</span>{" "}
                    {data.introPart4}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <GlassCard accent="#0ea5e9">
              <SectionHeader
                icon={<Code2 className="w-3.5 h-3.5 text-sky-500" />}
                title="Frontend Skills"
                titleColor="#0ea5e9"
                iconBg="#e0f2fe"
                iconBorder="#bae6fd"
              />
              <div className="space-y-2.5">
                {data.frontendSkills.map((skill, i) => (
                  <SkillEditorRow key={i} skill={skill}
                    onChange={s => updateFrontendSkill(i, s)}
                    onDelete={() => deleteFrontendSkill(i)}
                  />
                ))}
              </div>
              <button onClick={addFrontendSkill}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[10px] tracking-widest transition-all duration-200 bg-sky-50 text-sky-600 border border-dashed border-sky-200 hover:bg-sky-100 hover:border-sky-300"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่ม Frontend Skill
              </button>
            </GlassCard>

            <GlassCard accent="#8b5cf6">
              <SectionHeader
                icon={<Server className="w-3.5 h-3.5 text-purple-500" />}
                title="Backend Skills"
                titleColor="#8b5cf6"
                iconBg="#f3e8ff"
                iconBorder="#e9d5ff"
              />
              <div className="space-y-2.5">
                {data.backendSkills.map((skill, i) => (
                  <SkillEditorRow key={i} skill={skill}
                    onChange={s => updateBackendSkill(i, s)}
                    onDelete={() => deleteBackendSkill(i)}
                  />
                ))}
              </div>
              <button onClick={addBackendSkill}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[10px] tracking-widest transition-all duration-200 bg-purple-50 text-purple-600 border border-dashed border-purple-200 hover:bg-purple-100 hover:border-purple-300"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่ม Backend Skill
              </button>
            </GlassCard>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <GlassCard accent="#eab308">
              <SectionHeader
                icon={<Zap className="w-3.5 h-3.5 text-yellow-500" />}
                title="เครื่องมือที่ใช้"
                titleColor="#ca8a04"
                iconBg="#fef9c3"
                iconBorder="#fef08a"
              />

              <div className="flex flex-wrap gap-2 mb-6">
                {data.tools.map((tool, i) => (
                  <ToolTagEditor key={i} tool={tool} onDelete={() => deleteTool(i)} />
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
                <input
                  value={newTool}
                  onChange={e => setNewTool(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTool(); } }}
                  placeholder="พิมพ์ชื่อเครื่องมือแล้วกด Enter เพื่อเพิ่ม"
                  className="flex-1 px-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400 bg-white border border-yellow-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 shadow-sm"
                />
                <button onClick={addTool}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-orbitron text-xs font-bold tracking-widest transition-all duration-200 shrink-0 bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> เพิ่มเครื่องมือ
                </button>
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </div>
  );
}
