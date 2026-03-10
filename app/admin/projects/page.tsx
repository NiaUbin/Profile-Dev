"use client";

import { useState, useEffect } from "react";
import {
  Briefcase, Plus, Edit2, Trash2, Search, ExternalLink,
  Image as ImageIcon, Save, X, CheckCircle, AlertCircle, Loader2, Github
} from "lucide-react";
import {
  getProjects, addProject, updateProject, deleteProject, ProjectData,
} from "@/lib/firestore";

/* ── Type colours (Light Theme adjustments) ── */
const TYPE_CONFIG: Record<string, { color: string; border: string; bg: string; label: string }> = {
  frontend:  { color: '#0ea5e9', border: 'rgba(14,165,233,0.3)', bg: 'rgba(14,165,233,0.1)',  label: 'Frontend'   },
  backend:   { color: '#8b5cf6', border: 'rgba(139,92,246,0.3)', bg: 'rgba(139,92,246,0.1)',  label: 'Backend'    },
  fullstack: { color: '#10b981', border: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.1)',  label: 'Full Stack' },
};
const getType = (t?: string) => TYPE_CONFIG[t ?? ''] ?? TYPE_CONFIG.fullstack;

/* ── LightInput ── */
const LightInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean; accent?: string }> = ({ label, required, accent = '#0ea5e9', className, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="font-orbitron text-[9px] tracking-[0.25em] uppercase transition-colors duration-200"
          style={{ color: focused ? accent : '#64748b' }}>
          {label}{required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full px-4 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400 ${className ?? ''}`}
        style={{
          background: focused ? '#ffffff' : '#f8fafc',
          border: `1px solid ${focused ? accent : '#e2e8f0'}`,
          boxShadow: focused ? `0 0 0 3px ${accent}20` : 'none',
        }}
      />
    </div>
  );
};

const LightTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; accent?: string }> = ({ label, accent = '#0ea5e9', ...props }) => {
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
        className="w-full px-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400 resize-y"
        style={{
          background: focused ? '#ffffff' : '#f8fafc',
          border: `1px solid ${focused ? accent : '#e2e8f0'}`,
          boxShadow: focused ? `0 0 0 3px ${accent}20` : 'none',
        }}
      />
    </div>
  );
};

const LightSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; accent?: string }> = ({ label, accent = '#0ea5e9', children, ...props }) => {
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
        className="w-full px-4 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 cursor-pointer"
        style={{
          background: focused ? '#ffffff' : '#f8fafc',
          border: `1px solid ${focused ? accent : '#e2e8f0'}`,
          boxShadow: focused ? `0 0 0 3px ${accent}20` : 'none',
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

    const actionText = editingProject?.id ? 'แก้ไข' : 'เพิ่ม';
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: `ยืนยันการ${actionText}ผลงาน?`,
      text: `คุณต้องการ${actionText}ผลงาน "${formData.title}" ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      background: '#ffffff',
      color: '#1e293b',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'border border-blue-100 shadow-[0_10px_40px_rgba(59,130,246,0.1)] rounded-3xl',
        title: 'font-orbitron tracking-wider text-slate-800',
        confirmButton: 'mt-4 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 rounded-xl font-orbitron tracking-wider transition-all mr-3',
        cancelButton: 'mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl font-orbitron tracking-wider transition-all'
      }
    });

    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      const data = {
        ...formData,
        tech: formData.tech.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingProject?.id) {
        await updateProject(editingProject.id, data);
        Swal.fire({
          title: 'อัปเดตสำเร็จ!',
          icon: 'success',
          background: '#ffffff', color: '#1e293b', timer: 1500, showConfirmButton: false,
          customClass: { popup: 'border border-blue-100 rounded-3xl', title: 'font-orbitron tracking-wider text-blue-500' }
        });
      } else {
        await addProject({ ...data, order: projects.length });
        Swal.fire({
          title: 'เพิ่มผลงานสำเร็จ!',
          icon: 'success',
          background: '#ffffff', color: '#1e293b', timer: 1500, showConfirmButton: false,
          customClass: { popup: 'border border-blue-100 rounded-3xl', title: 'font-orbitron tracking-wider text-blue-500' }
        });
      }
      setShowModal(false);
      await fetchProjects();
    } catch { 
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
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
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'ลบผลงาน?',
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบผลงานนี้ ข้อมูลจะไม่สามารถกู้คืนได้",
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
    
    try { 
      await deleteProject(id); 
      Swal.fire({
        title: 'ลบสำเร็จ!',
        icon: 'success',
        background: '#ffffff',
        color: '#1e293b',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'border border-blue-100 rounded-3xl',
          title: 'font-orbitron tracking-wider text-blue-500',
        }
      });
      await fetchProjects(); 
    }
    catch { 
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
        <div className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl font-rajdhani font-semibold text-sm transition-all duration-300 shadow-lg"
          style={{
            background: toast.type === 'success' ? '#ecfdf5' : '#fff1f2',
            border: `1px solid ${toast.type === 'success' ? '#a7f3d0' : '#fecdd3'}`,
            color: toast.type === 'success' ? '#059669' : '#e11d48',
          }}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6"
        style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: '#f3e8ff', border: '1px solid #e9d5ff' }}>
              <Briefcase className="w-4 h-4 text-purple-500" />
            </div>
            <h1 className="font-orbitron font-black text-xl text-slate-800 tracking-wider">จัดการผลงาน</h1>
          </div>
          <p className="text-slate-500 text-xs font-orbitron tracking-widest ml-11">
            PORTFOLIO · {projects.length} PROJECTS
          </p>
        </div>

        <button onClick={openAddModal}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider text-white overflow-hidden transition-all duration-300 focus:outline-none shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
          style={{ background: 'linear-gradient(135deg,#0ea5e9,#3b82f6)' }}>
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }} />
          <Plus className="w-4 h-4 relative z-10" />
          <span className="relative z-10">เพิ่มผลงานใหม่</span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text" placeholder="ค้นหาชื่อผลงาน หรือ หมวดหมู่..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        />
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="font-orbitron text-[10px] tracking-widest text-slate-500">กำลังโหลด...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(project => {
              const tc = getType(project.type);
              return (
                <div key={project.id}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 bg-white shadow-sm border"
                  style={{ borderColor: '#e2e8f0' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow=`0 16px 48px ${tc.color}15`; (e.currentTarget as HTMLElement).style.borderColor=`${tc.color}50`; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow='0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'; (e.currentTarget as HTMLElement).style.borderColor='#e2e8f0'; (e.currentTarget as HTMLElement).style.transform='none' }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {project.image ? (
                      <img src={project.image} alt={project.title} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                        <span className="font-orbitron text-[9px] tracking-widest text-slate-400">NO IMAGE</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Type badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 font-orbitron text-[9px] tracking-widest rounded-lg font-bold shadow-sm backdrop-blur-md"
                      style={{ color: tc.color, border: `1px solid ${tc.border}`, background: '#ffffffee' }}>
                      {tc.label}
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => openEditModal(project)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 bg-white shadow-md text-sky-500 hover:bg-sky-50 hover:text-sky-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => project.id && handleDelete(project.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 bg-white shadow-md text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="w-full h-[2px] -mt-1 mb-4 rounded-full" style={{ background: `linear-gradient(90deg,${tc.color}40,transparent)` }} />
                    <h3 className="font-orbitron font-bold text-base text-slate-800 mb-1 leading-tight">{project.title}</h3>
                    {project.subtitle && <p className="font-orbitron text-[9px] tracking-widest mb-3 font-semibold" style={{ color: tc.color }}>{project.subtitle}</p>}
                    {project.description && <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>}

                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {project.tech.map(t => (
                        <span key={t} className="font-orbitron text-[9px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4 mt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
                      {project.link && project.link !== '#' && (
                        <a href={project.link} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 font-orbitron text-[10px] tracking-widest text-slate-500 hover:text-blue-500 transition-colors font-bold">
                          <ExternalLink className="w-3.5 h-3.5" />LIVE
                        </a>
                      )}
                      {project.github && project.github !== '#' && (
                        <a href={project.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 font-orbitron text-[10px] tracking-widest text-slate-500 hover:text-slate-800 transition-colors font-bold">
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
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                <Briefcase className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-orbitron text-sm text-slate-500">
                {projects.length === 0 ? 'ยังไม่มีผลงาน เริ่มเพิ่มผลงานแรกได้เลย' : 'ไม่พบผลงานที่ค้นหา'}
              </p>
            </div>
          )}
        </>
      )}

      {/* ═══════ MODAL ═══════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                  {editingProject ? <Edit2 className="w-4 h-4 text-blue-500" /> : <Plus className="w-4 h-4 text-blue-500" />}
                </div>
                <h3 className="font-orbitron font-black text-sm text-slate-800 tracking-wider">
                  {editingProject ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LightInput label="ชื่อผลงาน" required value={formData.title} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                    placeholder="เช่น E-Commerce Platform" />
                  <LightInput label="ชื่อรอง (Subtitle)" value={formData.subtitle} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, subtitle: e.target.value }))}
                    placeholder="เช่น Web Application" />
                </div>

                <LightTextarea label="คำอธิบาย" rows={3} value={formData.description} accent="#3b82f6"
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="เขียนอธิบายเกี่ยวกับผลงานชิ้นนี้..." />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LightSelect label="หมวดหมู่ป้ายกำกับ" value={formData.category} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                  </LightSelect>
                  <LightSelect label="ประเภทงาน (Filter)" value={formData.type} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, type: e.target.value }))}>
                    <option value="fullstack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                  </LightSelect>
                </div>

                {/* Cover image */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <LightInput label="URL รูปภาพหลัก (หน้าปก)" required value={formData.image} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://example.com/cover.jpg" />
                  {formData.image && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 mt-2">
                      <img src={formData.image} alt="preview" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-orbitron text-[9px] tracking-[0.25em] uppercase text-slate-500 font-bold">แกลเลอรี่รูปเพิ่มเติม</p>
                  {formData.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <img src={url} alt={`Gallery image ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <p className="flex-1 text-xs text-slate-600 font-mono truncate">{url}</p>
                      <button type="button" onClick={() => setFormData(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" value={galleryInput} onChange={e => setGalleryInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGalleryImage(); } }}
                      placeholder="URL รูปภาพ... แล้วกด Enter"
                      className="flex-1 px-4 py-2.5 text-sm text-slate-800 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-slate-400 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50" />
                    <button type="button" onClick={addGalleryImage}
                      className="px-5 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all duration-200 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100">
                      เพิ่ม
                    </button>
                  </div>
                </div>

                <LightInput label="เทคโนโลยีที่ใช้ (คั่นด้วย ,)" value={formData.tech} accent="#3b82f6"
                  onChange={e => setFormData(f => ({ ...f, tech: e.target.value }))}
                  placeholder="React, Next.js, Node.js, MongoDB" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LightInput label="ลิงก์ Live Site" value={formData.link} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, link: e.target.value }))}
                    placeholder="https://..." />
                  <LightInput label="ลิงก์ GitHub" value={formData.github} accent="#3b82f6"
                    onChange={e => setFormData(f => ({ ...f, github: e.target.value }))}
                    placeholder="https://github.com/..." />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3.5 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all duration-200 bg-slate-100 text-slate-600 hover:bg-slate-200">
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={saving}
                    className="group relative flex-1 py-3.5 rounded-xl font-orbitron text-xs font-bold tracking-wider text-white overflow-hidden transition-all duration-300 focus:outline-none disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                    style={{ background: 'linear-gradient(135deg,#0ea5e9,#3b82f6)' }}>
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