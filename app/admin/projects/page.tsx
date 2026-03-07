"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Image as ImageIcon,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  ProjectData,
} from "@/lib/firestore";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Full Stack",
    image: "",
    images: [] as string[],
    tech: "",
    link: "#",
    github: "#",
    type: "fullstack",
    rarity: "Common",
  });

  const [galleryInput, setGalleryInput] = useState("");

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      category: "Full Stack",
      image: "",
      images: [] as string[],
      tech: "",
      link: "#",
      github: "#",
      type: "fullstack",
      rarity: "Common",
    });
    setShowModal(true);
  };

  const openEditModal = (project: ProjectData) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      subtitle: project.subtitle || "",
      description: project.description,
      category: project.category,
      image: project.image,
      images: project.images || [],
      tech: project.tech.join(", "),
      link: project.link,
      github: project.github || "#",
      type: project.type || "fullstack",
      rarity: project.rarity || "Common",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const projectData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        images: formData.images,
        tech: formData.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        link: formData.link,
        github: formData.github,
        type: formData.type,
        rarity: formData.rarity,
      };

      if (editingProject && editingProject.id) {
        await updateProject(editingProject.id, projectData);
        showToast("success", "อัปเดตผลงานสำเร็จ!");
      } else {
        await addProject({ ...projectData, order: projects.length });
        showToast("success", "เพิ่มผลงานสำเร็จ!");
      }
      setShowModal(false);
      await fetchProjects();
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบผลงานนี้หรือไม่?")) return;
    try {
      await deleteProject(id);
      showToast("success", "ลบผลงานสำเร็จ!");
      await fetchProjects();
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-gray-600" size={24} />
            จัดการผลงาน (Projects)
          </h1>
          <p className="text-gray-500 mt-1">
            เพิ่ม ลบ หรือแก้ไขผลงานพอร์ตโฟลิโอของคุณ ({projects.length} ผลงาน)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          เพิ่มผลงานใหม่
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อผลงาน หรือ หมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gray-100 border-b border-gray-200 flex-shrink-0">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-xs">ไม่มีรูปภาพ</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 bg-white text-gray-600 hover:text-blue-600 rounded-md shadow-sm border border-gray-200 hover:border-blue-200 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => project.id && handleDelete(project.id)}
                      className="p-1.5 bg-white text-gray-600 hover:text-red-600 rounded-md shadow-sm border border-gray-200 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded text-xs font-medium text-gray-700 shadow-sm">
                    {project.category}
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-xs text-gray-500 mb-2">{project.subtitle}</p>
                  )}
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 mt-auto border-t border-gray-100">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink size={14} />
                      ดูเว็บไซต์จริง
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
              <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-base font-medium">
                {projects.length === 0
                  ? "ยังไม่มีผลงาน เริ่มเพิ่มผลงานแรกของคุณ!"
                  : "ไม่พบผลงานที่ค้นหา"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
              <h3 className="text-lg font-bold text-gray-800">
                {editingProject ? "แก้ไขข้อมูลผลงาน" : "เพิ่มผลงานชิ้นใหม่"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Row 1: Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ชื่อผลงาน <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="เช่น E-Commerce Platform"
                    required
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ชื่อรอง (Subtitle)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="เช่น Web Application"
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">คำอธิบายรายละเอียด</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="เขียนอธิบายเกี่ยวกับผลงานชิ้นนี้สั้นๆ..."
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all resize-y"
                />
              </div>

              {/* Row 3: Category & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">หมวดหมู่ป้ายกำกับ (Badge)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all cursor-pointer"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ประเภทงาน (Filter)</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all cursor-pointer"
                  >
                    <option value="fullstack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                  </select>
                </div>
              </div>

              {/* Row 4: URL Images */}
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">URL รูปภาพหลัก (หน้าปก) <span className="text-red-500">*</span></label>
                  
                  {formData.image && (
                    <div className="w-full max-w-sm aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative mb-2">
                       <img src={formData.image} alt="Cover Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                       <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg pointer-events-none"></div>
                    </div>
                  )}

                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                    required
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all"
                  />
                </div>
                
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">แกลเลอรี่รูปภาพเพิ่มเติม</label>
                  
                  {/* Current Gallery Images */}
                  {formData.images.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                          <div className="w-12 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative border border-gray-200">
                            <img src={imgUrl} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                          </div>
                          <div className="flex-1 truncate text-xs text-gray-500 font-mono">
                            {imgUrl}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages.splice(idx, 1);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                            title="ลบรูปภาพ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input for new Image */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (galleryInput.trim() !== '') {
                            setFormData({
                              ...formData,
                              images: [...formData.images, galleryInput.trim()]
                            });
                            setGalleryInput("");
                          }
                        }
                      }}
                      placeholder="ใส่ URL รูปภาพ... แล้วกด Enter เพื่อเพิ่ม"
                      className="flex-1 border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (galleryInput.trim() !== '') {
                          setFormData({
                            ...formData,
                            images: [...formData.images, galleryInput.trim()]
                          });
                          setGalleryInput("");
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors"
                    >
                      เพิ่ม
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 5: Technologies */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">เทคโนโลยีที่ใช้ (คั่นด้วยเครื่องหมาย ,จุลภาค)</label>
                <input
                  type="text"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  placeholder="React, Next.js, Node.js, MongoDB"
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all"
                />
              </div>

              {/* Row 6: Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ลิงก์เว็บไซต์จริง (Live Site)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">ลิงก์ GitHub (Source Code)</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-gray-300 transition-all"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Save size={18} />
                  {saving ? "กำลังบันทึกข้อมูล..." : "บันทึกผลงาน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
