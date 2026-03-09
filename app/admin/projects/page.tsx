"use client";

import { useState, useEffect } from "react";
import {
  Briefcase, Plus, Edit2, Trash2, Search, ExternalLink,
  Image as ImageIcon, Save, X, CheckCircle, AlertCircle, Loader2, Github
} from "lucide-react";
import {
  getProjects, addProject, updateProject, deleteProject, ProjectData,
} from "@/lib/firestore";

/* ── Type colours ── */
const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; label: string }> = {
  frontend:  { color: '#22d3ee', border: 'rgba(34,211,238,0.3)',  bg: 'rgba(34,211,238,0.08)',  label: 'Frontend'   },
  backend:   { color: '#a855f7', border: 'rgba(168,85,247,0.3)', bg: 'rgba(168,85,247,0.08)',  label: 'Backend'    },
  fullstack: { color: '#10b981', border: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.08)',  label: 'Full Stack' },
};
const getType = (t?: string) => TYPE_CONFIG[t ?? ''] ?? TYPE_CONFIG.fullstack;

/* ── NeonInput ── */
const NeonInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean; accent?: string }> = ({ label, required, accent = '#22d3ee', className, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-orbitron text-[9px] tracking-[0.25em] uppercase transition-colors duration-200"
          style={{ color: focused ? accent : '#64748b' }}>
          {label}{required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full px-4 py-2.5 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-700 ${className ?? ''}`}
        style={{
          background: focused ? `${accent}06` : 'rgba(30,41,59,0.7)',
          border: `1px solid ${focused ? accent + '55' : 'rgba(100,116,139,0.18)'}`,
          boxShadow: focused ? `0 0 14px ${accent}0d, inset 0 0 14px ${accent}05` : 'none',
        }}
      />
    </div>
  );
};

const NeonTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; accent?: string }> = ({ label, accent = '#22d3ee', ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-orbitron text-[9px] tracking-[0.25em] uppercase transition-colors duration-200"
          style={{ color: focused ? accent : '#64748b' }}>{label}</label>
      )}
      <textarea
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        className="w-full px-4 py-3 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-700 resize-y"
        style={{
          background: focused ? `${accent}06` : 'rgba(30,41,59,0.7)',
          border: `1px solid ${focused ? accent + '55' : 'rgba(100,116,139,0.18)'}`,
          boxShadow: focused ? `0 0 14px ${accent}0d` : 'none',
        }}
      />
    </div>
  );
};

const NeonSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; accent?: string }> = ({ label, accent = '#22d3ee', children, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-orbitron text-[9px] tracking-[0.25em] uppercase transition-colors duration-200"
          style={{ color: focused ? accent : '#64748b' }}>{label}</label>
      )}
      <select
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        className="w-full px-4 py-2.5 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 cursor-pointer"
        style={{
          background: focused ? `${accent}06` : 'rgba(30,41,59,0.7)',
          border: `1px solid ${focused ? accent + '55' : 'rgba(100,116,139,0.18)'}`,
        }}
      >
        {children}
      </select>
    </div>
  );
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [galleryInput, setGalleryInput] = useState("");
  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', category: 'Full Stack',
    image: '', images: [] as string[], tech: '', link: '#', github: '#',
    type: 'fullstack', rarity: 'Common',
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try { const data = await getProjects(); setProjects(data); }
    catch { showToast('error', 'ไม่สามารถโหลดข้อมูลได้'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title:'', subtitle:'', description:'', category:'Full Stack', image:'', images:[], tech:'', link:'#', github:'#', type:'fullstack', rarity:'Common' });
    setShowModal(true);
  };

  const openEditModal = (project: ProjectData) => {
    setEditingProject(project);
    setFormData({
      title: project.title, subtitle: project.subtitle || '', description: project.description,
      category: project.category, image: project.image, images: project.images || [],
      tech: project.tech.join(', '), link: project.link, github: project.github || '#',
      type: project.type || 'fullstack', rarity: project.rarity || 'Common',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setSaving(true);
    try {
      const data = {
        ...formData,
        tech: formData.tech.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingProject?.id) {
        await updateProject(editingProject.id, data);
        showToast('success', 'อัปเดตผลงานสำเร็จ!');
      } else {
        await addProject({ ...data, order: projects.length });
        showToast('success', 'เพิ่มผลงานสำเร็จ!');
      }
      setShowModal(false);
      await fetchProjects();
    } catch { showToast('error', 'เกิดข้อผิดพลาด'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบผลงานนี้หรือไม่?')) return;
    try { await deleteProject(id); showToast('success', 'ลบผลงานสำเร็จ!'); await fetchProjects(); }
    catch { showToast('error', 'เกิดข้อผิดพลาดในการลบ'); }
  };

  const addGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setFormData(f => ({ ...f, images: [...f.images, galleryInput.trim()] }));
    setGalleryInput('');
  };

  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl font-rajdhani font-semibold text-sm transition-all duration-300"
          style={{
            background: toast.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`,
            color: toast.type === 'success' ? '#10b981' : '#fb7185',
            backdropFilter: 'blur(16px)',
            boxShadow: `0 0 24px ${toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`,
          }}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
        style={{ borderBottom: '1px solid rgba(100,116,139,0.15)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <h1 className="font-orbitron font-black text-xl text-white tracking-wider">จัดการผลงาน</h1>
          </div>
          <p className="text-slate-500 text-xs font-orbitron tracking-widest ml-11">
            PORTFOLIO · {projects.length} PROJECTS
          </p>
        </div>

        <button onClick={openAddModal}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider overflow-hidden transition-all duration-300 focus:outline-none"
          style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#020617', boxShadow: '0 0 20px rgba(34,211,238,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 32px rgba(34,211,238,0.5)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 20px rgba(34,211,238,0.3)'; }}>
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">เพิ่มผลงานใหม่</span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input
          type="text" placeholder="ค้นหาชื่อผลงาน หรือ หมวดหมู่..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-700"
          style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(100,116,139,0.18)', backdropFilter: 'blur(16px)' }}
        />
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="font-orbitron text-[10px] tracking-widest text-slate-600">กำลังโหลด...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(project => {
              const tc = getType(project.type);
              return (
                <div key={project.id}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${tc.color}20`, backdropFilter: 'blur(16px)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow=`0 16px 48px ${tc.color}12`; (e.currentTarget as HTMLElement).style.borderColor=`${tc.color}40`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='none'; (e.currentTarget as HTMLElement).style.borderColor=`${tc.color}20`; }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden" style={{ background: 'rgba(15,23,42,0.9)' }}>
                    {project.image ? (
                      <img src={project.image} alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-8 h-8 text-slate-700" />
                        <span className="font-orbitron text-[9px] tracking-widest text-slate-700">NO IMAGE</span>
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(15,23,42,0.9) 0%,rgba(15,23,42,0.1) 60%,transparent 100%)' }} />

                    {/* Type badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 font-orbitron text-[9px] tracking-widest rounded-lg backdrop-blur-sm"
                      style={{ color: tc.color, border: `1px solid ${tc.border}`, background: tc.bg }}>
                      {tc.label}
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => openEditModal(project)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-200"
                        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 12px rgba(34,211,238,0.3)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='none'; }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => project.id && handleDelete(project.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-200"
                        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 0 12px rgba(244,63,94,0.3)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='none'; }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="w-full h-[1px] -mt-1 mb-4" style={{ background: `linear-gradient(90deg,transparent,${tc.color}30,transparent)` }} />
                    <h3 className="font-orbitron font-bold text-base text-white mb-1 leading-tight">{project.title}</h3>
                    {project.subtitle && <p className="font-orbitron text-[9px] tracking-widest mb-3" style={{ color: tc.color + 'aa' }}>{project.subtitle}</p>}
                    {project.description && <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map(t => (
                        <span key={t} className="font-orbitron text-[9px] px-2.5 py-1 rounded-md"
                          style={{ background: 'rgba(30,41,59,0.8)', color: '#64748b', border: '1px solid rgba(100,116,139,0.12)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-auto pt-4" style={{ borderTop: '1px solid rgba(100,116,139,0.1)' }}>
                      {project.link && project.link !== '#' && (
                        <a href={project.link} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 font-orbitron text-[9px] tracking-widest transition-colors duration-200"
                          style={{ color: '#64748b' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = tc.color; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}>
                          <ExternalLink className="w-3.5 h-3.5" />LIVE
                        </a>
                      )}
                      {project.github && project.github !== '#' && (
                        <a href={project.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 font-orbitron text-[9px] tracking-widest transition-colors duration-200"
                          style={{ color: '#64748b' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; }}>
                          <Github className="w-3.5 h-3.5" />CODE
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl"
                style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(100,116,139,0.15)' }}>
                <Briefcase className="w-7 h-7 text-slate-700" />
              </div>
              <p className="font-orbitron text-sm text-slate-600">
                {projects.length === 0 ? 'ยังไม่มีผลงาน เริ่มเพิ่มผลงานแรกได้เลย' : 'ไม่พบผลงานที่ค้นหา'}
              </p>
            </div>
          )}
        </>
      )}

      {/* ═══════ MODAL ═══════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(34,211,238,0.2)', boxShadow: '0 0 60px rgba(34,211,238,0.08)' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ borderBottom: '1px solid rgba(100,116,139,0.15)' }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
                  {editingProject ? <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <h3 className="font-orbitron font-black text-sm text-white tracking-wider">
                  {editingProject ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{ color: '#64748b', border: '1px solid transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#fb7185'; (e.currentTarget as HTMLElement).style.borderColor='rgba(244,63,94,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='#64748b'; (e.currentTarget as HTMLElement).style.borderColor='transparent'; }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NeonInput label="ชื่อผลงาน" required value={formData.title}
                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                    placeholder="เช่น E-Commerce Platform" />
                  <NeonInput label="ชื่อรอง (Subtitle)" value={formData.subtitle}
                    onChange={e => setFormData(f => ({ ...f, subtitle: e.target.value }))}
                    placeholder="เช่น Web Application" />
                </div>

                <NeonTextarea label="คำอธิบาย" rows={3} value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="เขียนอธิบายเกี่ยวกับผลงานชิ้นนี้..." />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NeonSelect label="หมวดหมู่ป้ายกำกับ" value={formData.category}
                    onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>
                    <option value="Full Stack" className="bg-slate-900">Full Stack</option>
                    <option value="Frontend" className="bg-slate-900">Frontend</option>
                    <option value="Backend" className="bg-slate-900">Backend</option>
                  </NeonSelect>
                  <NeonSelect label="ประเภทงาน (Filter)" value={formData.type}
                    onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}>
                    <option value="fullstack" className="bg-slate-900">Full Stack</option>
                    <option value="frontend" className="bg-slate-900">Frontend</option>
                    <option value="backend" className="bg-slate-900">Backend</option>
                  </NeonSelect>
                </div>

                {/* Cover image */}
                <div className="space-y-3">
                  <NeonInput label="URL รูปภาพหลัก (หน้าปก)" required value={formData.image}
                    onChange={e => setFormData(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://example.com/cover.jpg" />
                  {formData.image && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden"
                      style={{ border: '1px solid rgba(100,116,139,0.2)' }}>
                      <img src={formData.image} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="space-y-3">
                  <p className="font-orbitron text-[9px] tracking-[0.25em] uppercase text-slate-600">แกลเลอรี่รูปเพิ่มเติม</p>
                  {formData.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.12)' }}>
                      <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="flex-1 text-xs text-slate-600 font-mono truncate">{url}</p>
                      <button type="button" onClick={() => setFormData(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                        style={{ color: '#64748b' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#fb7185'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='#64748b'; }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" value={galleryInput} onChange={e => setGalleryInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGalleryImage(); } }}
                      placeholder="URL รูปภาพ... แล้วกด Enter"
                      className="flex-1 px-4 py-2.5 text-sm text-slate-200 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-700"
                      style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(100,116,139,0.18)' }} />
                    <button type="button" onClick={addGalleryImage}
                      className="px-4 py-2.5 rounded-xl font-orbitron text-[10px] tracking-wider transition-all duration-200"
                      style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(34,211,238,0.18)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(34,211,238,0.1)'; }}>
                      เพิ่ม
                    </button>
                  </div>
                </div>

                <NeonInput label="เทคโนโลยีที่ใช้ (คั่นด้วย ,)" value={formData.tech}
                  onChange={e => setFormData(f => ({ ...f, tech: e.target.value }))}
                  placeholder="React, Next.js, Node.js, MongoDB" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NeonInput label="ลิงก์ Live Site" value={formData.link}
                    onChange={e => setFormData(f => ({ ...f, link: e.target.value }))}
                    placeholder="https://..." />
                  <NeonInput label="ลิงก์ GitHub" value={formData.github}
                    onChange={e => setFormData(f => ({ ...f, github: e.target.value }))}
                    placeholder="https://github.com/..." />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl font-orbitron text-xs tracking-wider transition-all duration-200"
                    style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(100,116,139,0.2)', color: '#64748b' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#94a3b8'; (e.currentTarget as HTMLElement).style.borderColor='rgba(100,116,139,0.35)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='#64748b'; (e.currentTarget as HTMLElement).style.borderColor='rgba(100,116,139,0.2)'; }}>
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={saving}
                    className="group relative flex-1 py-3 rounded-xl font-orbitron text-xs font-bold tracking-wider overflow-hidden transition-all duration-300 focus:outline-none disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#020617', boxShadow: '0 0 20px rgba(34,211,238,0.3)' }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
                    {saving ? <Loader2 className="w-4 h-4 animate-spin relative z-10" /> : <Save className="w-4 h-4 relative z-10" />}
                    <span className="relative z-10">{saving ? 'กำลังบันทึก...' : 'บันทึกผลงาน'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}