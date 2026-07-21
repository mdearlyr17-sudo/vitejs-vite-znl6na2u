
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan KEY lo dari dashboard Supabase
const supabaseUrl = 'https://cowhnlntimqkpguwrlxh.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvd2hubG50aW1xa3BndXdybHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNzE2NTgsImV4cCI6MjA5OTg0NzY1OH0.llNQaxrEBIaSfQMwDkicC-dWqvJUsIc3LXbPqxSk1IQ'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import {
  Plus,
  X,
  MapPin,
  Calendar,
  ImagePlus,
  Users2,
  Compass,
  Lock,
  Unlock,
  LogOut,
  Pencil,
  Trash2,
  ShieldCheck,
} from "lucide-react";

/* ---------------------------------------------------------
   CEMARA DIVISI BRUTAL — design tokens
   Pine-forest dark base (from "cemara" = pine) + one hot
   accent, everything stamped like a passport/ticket stub —
   that stamp motif is the signature element carried through
   crew cards, memory cards, and now the admin badge too.
--------------------------------------------------------- */
const C = {
  bg: "#0E1410",
  bgAlt: "#141C16",
  surface: "#182019",
  surfaceHover: "#1E2A20",
  border: "#2A342B",
  borderStrong: "#3A473C",
  text: "#F2F0E6",
  textMuted: "#8E988A",
  accent: "#FF4B2B",
  accentDim: "#C93D22",
  pine: "#4A6B4E",
};

const ADMIN_PINS = ["budi", "fadli"];

const DEFAULT_CATEGORIES = [
  { id: "trip", label: "Trip ", isDefault: true },
  
];

const DEFAULT_MEMBERS = [
  {
    id: "m1",
    name: "Tuan Fredikson",
    photo: "https://picsum.photos/seed/fredikson/400/400",
  },
  {
    id: "m2",
    name: "Koceng",
    photo: "https://picsum.photos/seed/koceng/400/400",
  },
  {
    id: "m3",
    name: "Masmus",
    photo: "https://picsum.photos/seed/masmus/400/400",
  },
  {
    id: "m4",
    name: "Ramdan",
    photo: "https://picsum.photos/seed/ramdan/400/400",
  },
];

const DEFAULT_MEMORIES = [
  {
    id: "d1",
    title: "Trip Bromo",
    category: "trip",
    location: "Gunung Bromo, Jawa Timur",
    date: "Sep 2025",
    cover: "https://picsum.photos/seed/bromo-cover/700/900",
    photos: [
      "https://picsum.photos/seed/bromo1/700/700",
      "https://picsum.photos/seed/bromo2/700/700",
    ],
  },
  {
    id: "d2",
    title: "Warkop Kemang",
    category: "nongkrong",
    location: "Kemang, Jakarta Selatan",
    date: "Nov 2025",
    cover: "https://picsum.photos/seed/warkop-cover/700/900",
    photos: ["https://picsum.photos/seed/warkop1/700/700"],
  },
  {
    id: "d3",
    title: "Main PS di Rumah Masmus",
    category: "main",
    location: "Rumah Masmus",
    date: "Des 2025",
    cover: "https://picsum.photos/seed/ps-cover/700/900",
    photos: [
      "https://picsum.photos/seed/ps1/700/700",
      "https://picsum.photos/seed/ps2/700/700",
    ],
  },
  {
    id: "d4",
    title: "Camping Ranu Kumbolo",
    category: "trip",
    location: "Ranu Kumbolo, Jawa Timur",
    date: "Jul 2025",
    cover: "https://picsum.photos/seed/ranu-cover/700/900",
    photos: ["https://picsum.photos/seed/ranu1/700/700"],
  },
  {
    id: "d5",
    title: "Nasi Goreng Tengah Malam",
    category: "nongkrong",
    location: "Tebet, Jakarta Selatan",
    date: "Jan 2026",
    cover: "https://picsum.photos/seed/nasgor-cover/700/900",
    photos: ["https://picsum.photos/seed/nasgor1/700/700"],
  },
];



function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function slugify(label) {
  return (
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `kategori-${Date.now()}`
  );
}

// ---> TAMBAHIN FUNGSI INI BANG <---
function parseGDriveLink(url) {
  if (!url) return "";
  // Cari ID unik dari link Google Drive (misal: drive.google.com/file/d/1a2b3c4d.../view)
  const gDriveRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(gDriveRegex);
  
  if (match && match[1]) {
    // Otomatis ubah jadi direct link gambar Google Drive yang siap tampil
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url; // Kalau bukan dari GDrive, tetap balikin link aslinya (misal link dari Pinterest / web lain)
}

// ---> TAMBAHKAN FUNGSI INI DI SINI <---
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function StampBadge({ children, rotate = -6, tone = "accent" }) {
  const bg = tone === "accent" ? C.accent : C.pine;
  return (
    <div
      className="absolute top-3 right-3 px-2.5 py-1 text-[10px] tracking-widest font-bold uppercase select-none pointer-events-none"
      style={{
        background: bg,
        color: C.bg,
        transform: `rotate(${rotate}deg)`,
        fontFamily: "'Space Mono', monospace",
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
}

function AdminControls({ onEdit, onDelete }) {
  return (
    <div className="absolute top-3 left-3 z-10 flex gap-1.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label="Edit"
        className="p-1.5"
        style={{
          background: C.bgAlt,
          border: `1px solid ${C.borderStrong}`,
          color: C.text,
        }}
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Hapus"
        className="p-1.5"
        style={{
          background: C.bgAlt,
          border: `1px solid ${C.accent}`,
          color: C.accent,
        }}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,8,6,0.85)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[85vh] overflow-y-auto"
        style={{ background: C.surface, border: `1px solid ${C.borderStrong}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4 sticky top-0"
          style={{
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <h3
            className="text-sm tracking-[0.2em] uppercase font-bold"
            style={{ color: C.text, fontFamily: "'Space Mono', monospace" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{ color: C.textMuted }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label
      className="block text-[11px] tracking-widest uppercase font-bold mb-2"
      style={{ color: C.textMuted, fontFamily: "'Space Mono', monospace" }}
    >
      {children}
    </label>
  );
}

const inputStyle = {
  background: C.bgAlt,
  border: `1px solid ${C.border}`,
  color: C.text,
};
const btnPrimary = { background: C.accent, color: C.bg };

export default function App() {
  const [members, setMembers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  
  const [filter, setFilter] = useState("semua");
  const [isAdmin, setIsAdmin] = useState(false);

  const [pinModal, setPinModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [memoryModal, setMemoryModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [galleryItem, setGalleryItem] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [editMemory, setEditMemory] = useState(null);
  const [plans, setPlans] = useState([]);
  const [planModal, setPlanModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const heroRef = useRef(null);
  const crewRef = useRef(null);
  const galeriRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: mData } = await supabase.from('members').select('*');
      if (mData) setMembers(mData);
      const { data: memData } = await supabase.from('memories').select('*');
      if (memData) setMemories(memData);
      
      // ---> TAMBAHIN YANG INI <---
      const { data: pData } = await supabase.from('plans').select('*');
      if (pData) setPlans(pData);
    };
    loadData();

    const channel1 = supabase.channel('members').on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, loadData).subscribe();
    const channel2 = supabase.channel('memories').on('postgres_changes', { event: '*', schema: 'public', table: 'memories' }, loadData).subscribe();
    // ---> TAMBAHIN YANG INI <---
    const channel3 = supabase.channel('plans').on('postgres_changes', { event: '*', schema: 'public', table: 'plans' }, loadData).subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
      supabase.removeChannel(channel3); // <--- Jangan lupa di-remove
    };
  }, []);


  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  const categoryById = (id) => categories.find((c) => c.id === id);
  const shortLabel = (id) => {
    const cat = categoryById(id);
    if (!cat) return id;
    return cat.label.split(" ")[0].toUpperCase();
  };

  // Ganti bagian ini:
const visibleMemories = memories && memories.length > 0
? (filter === "semua" ? memories : memories.filter((m) => m.category === filter))
: [];

  // Tambahkan 'async' dan perintah supabase.delete()
  const handleDeleteMember = async (id) => {
    if (window.confirm("Hapus member ini dari Cemara Divisi Brutal?")) {
      // 1. Hapus dulu dari database server Supabase
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id); // <--- Cari yang id-nya sama dengan yang diklik

      if (error) {
        alert("Gagal menghapus dari Supabase: " + error.message);
      } else {
        // 2. Kalau di server berhasil terhapus, baru hapus dari layar
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    }
  };

  const handleDeleteMemory = async (id) => {
    if (window.confirm("Hapus dokumentasi ini?")) {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Gagal menghapus dokumentasi: " + error.message);
      } else {
        setMemories((prev) => prev.filter((m) => m.id !== id));
      }
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm("Hapus Plan ini?")) {
      await supabase.from('plans').delete().eq('id', id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDeleteCategory = (id) => {
    const inUse = memories.some((m) => m.category === id);
    const msg = inUse
      ? "Kategori ini masih dipakai beberapa dokumentasi. Tetap hapus kategorinya?"
      : "Hapus kategori ini?";
    if (window.confirm(msg)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (filter === id) setFilter("semua");
    }
  };

  return (
    <div
      style={{ background: C.bg, color: C.text, minHeight: "100vh" }}
      className="w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Archivo Black', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }

        .marquee-wrap { overflow: hidden; }
        .marquee-track { display: flex; width: max-content; animation: marquee-scroll 16s linear infinite; }
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }

        .grain-overlay { background-image: radial-gradient(rgba(242,240,230,0.035) 1px, transparent 1px); background-size: 3px 3px; }

        .cdb-nav-link { position: relative; }
        .cdb-nav-link::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 2px;
          background: ${C.accent}; transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease;
        }
        .cdb-nav-link:hover::after { transform: scaleX(1); }

        .cdb-card { transition: border-color 0.2s ease, transform 0.2s ease; }
        .cdb-card:hover { border-color: ${C.accent}; transform: translateY(-2px); }

        .cdb-photo { filter: grayscale(70%) contrast(1.05); transition: filter 0.3s ease; }
        .cdb-card:hover .cdb-photo { filter: grayscale(0%) contrast(1.05); }

        .cdb-dashed { border: 1.5px dashed ${C.borderStrong}; transition: border-color 0.2s ease, background 0.2s ease; }
        .cdb-dashed:hover { border-color: ${C.accent}; background: ${C.surfaceHover}; }
      `}</style>

      {/* NAV */}
      <header
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          background: "rgba(14,20,16,0.9)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4 gap-4 flex-wrap">
          <button
            onClick={() => scrollTo(heroRef)}
            className="font-mono text-xs tracking-[0.25em] uppercase font-bold px-2 py-1"
            style={{ background: C.accent, color: C.bg }}
          >
            CDB
          </button>

          <nav className="flex items-center gap-6 font-mono text-xs tracking-[0.15em] uppercase">
            <button
              onClick={() => scrollTo(heroRef)}
              className="cdb-nav-link"
              style={{ color: C.text }}
            >
              Beranda
            </button>
            <button
              onClick={() => scrollTo(crewRef)}
              className="cdb-nav-link"
              style={{ color: C.text }}
            >
              Anggota
            </button>
            <button
              onClick={() => scrollTo(galeriRef)}
              className="cdb-nav-link"
              style={{ color: C.text }}
            >
              Galeri Memori
            </button>
          </nav>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] tracking-widest uppercase font-bold px-2.5 py-1.5 flex items-center gap-1.5"
                style={{ background: C.pine, color: C.text }}
              >
                <ShieldCheck size={12} /> Mode Admin Aktif
              </span>
              <button
                onClick={() => setIsAdmin(false)}
                className="font-mono text-[10px] tracking-widest uppercase font-bold px-2.5 py-1.5 flex items-center gap-1.5"
                style={{
                  background: "transparent",
                  border: `1px solid ${C.borderStrong}`,
                  color: C.textMuted,
                }}
              >
                <LogOut size={12} /> Keluar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPinModal(true)}
              aria-label="Masuk sebagai admin"
              className="p-2"
              style={{ border: `1px solid ${C.border}`, color: C.textMuted }}
            >
              <Lock size={15} />
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center text-center px-5 grain-overlay"
        style={{
          minHeight: "72vh",
          background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgAlt} 100%)`,
        }}
      >
        <h1
          className="font-display uppercase leading-[0.88] select-none"
          style={{
            fontSize: "clamp(2.75rem, 9vw, 7.5rem)",
            color: C.text,
            letterSpacing: "-0.02em",
          }}
        >
          Cemara
          <br />
          <span style={{ color: C.accent }}>Divisi</span>
          <br />
          Brutal
        </h1>
      </section>

      {/* MARQUEE */}
      <div
        className="marquee-wrap py-3"
        style={{
          background: C.accent,
          transform: "rotate(-1deg)",
          margin: "-1.25rem 0 2.5rem 0",
        }}
      >
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="font-mono font-bold uppercase text-sm tracking-[0.3em] px-4"
              style={{ color: C.bg }}
            >
              CEMARA DIVISI BRUTAL • CEMARA DIVISI BRUTAL • CEMARA DIVISI BRUTAL
              • CEMARA DIVISI BRUTAL •
            </span>
          ))}
        </div>
      </div>
      
      {/* ================= SECTION NEXT PLAN ================= */}
      <section className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase font-bold" style={{ color: C.textMuted }}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ background: C.accent }}></span>
            Next Plan
          </div>
          {isAdmin && (
            <button
              onClick={() => { setEditPlan(null); setPlanModal(true); }}
              className="font-mono text-[11px] uppercase tracking-widest font-bold px-3 py-1.5 flex items-center gap-1"
              style={btnPrimary}
            >
              <Plus size={12} /> Tambah Plan
            </button>
          )}
        </div>

        {plans.length === 0 ? (
          <div className="p-8 text-center font-mono text-sm cdb-dashed" style={{ color: C.textMuted }}>
            Belum ada Plan / Agenda terdekat!!! 
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="cdb-card relative p-6 text-left" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                {isAdmin && (
                  <AdminControls
                    onEdit={() => setEditPlan(p)}
                    onDelete={() => handleDeletePlan(p.id)}
                  />
                )}
                <StampBadge rotate={-3} tone="accent">ACTIVE PLAN</StampBadge>
                
                <h3 className="font-display text-2xl md:text-3xl uppercase mb-2 mt-2" style={{ color: C.text }}>
                  {p.title}
                </h3>

                <div className="flex flex-wrap gap-4 font-mono text-xs my-3" style={{ color: C.textMuted }}>
                  <span className="flex items-center gap-1.5"><MapPin size={14} style={{ color: C.accent }} /> {p.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} style={{ color: C.accent }} /> {p.date_text}</span>
                </div>

                {/* TIMER COUNTDOWN */}
                <CountdownTimer targetDate={p.target_date} />
              </div>
            ))}
          </div>
        )}
      </section>
      {/* ================= END SECTION NEXT PLAN ================= */}

      {/* THE CREW */}
      <section ref={crewRef} className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Users2 size={18} style={{ color: C.accent }} />
          <h2
            className="font-mono text-xs tracking-[0.3em] uppercase font-bold"
            style={{ color: C.textMuted }}
          >
            Anggota
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {members.map((m, idx) => (
            <div
              key={m.id}
              className="cdb-card relative"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              {isAdmin && (
                <AdminControls
                  onEdit={() => setEditMember(m)}
                  onDelete={() => handleDeleteMember(m.id)}
                />
              )}
              <StampBadge rotate={idx % 2 === 0 ? -6 : 6}>
                {String(idx + 1).padStart(2, "0")}
              </StampBadge>
              <div className="aspect-square overflow-hidden">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="cdb-photo w-full h-full object-cover"
                />
              </div>
              <div className="px-3 py-3">
                <p className="font-mono text-sm uppercase tracking-wide font-bold truncate">
                  {m.name}
                </p>
              </div>
            </div>
          ))}

          {isAdmin && (
            <button
              onClick={() => setMemberModal(true)}
              className="cdb-dashed flex flex-col items-center justify-center gap-2 aspect-square"
            >
              <Plus size={26} style={{ color: C.textMuted }} />
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: C.textMuted }}
              >
                Tambah Member
              </span>
            </button>
          )}
        </div>
      </section>

      {/* MEMORY LIBRARY */}
      <section ref={galeriRef} className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Compass size={18} style={{ color: C.accent }} />
            <h2
              className="font-mono text-xs tracking-[0.3em] uppercase font-bold"
              style={{ color: C.textMuted }}
            >
              Album
            </h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setMemoryModal(true)}
              className="font-mono text-xs uppercase tracking-widest font-bold px-4 py-2 flex items-center gap-2"
              style={btnPrimary}
            >
              <ImagePlus size={14} />
              Tambah Dokumentasi
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setFilter("semua")}
            className="font-mono text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-full"
            style={{
              background: filter === "semua" ? C.accent : "transparent",
              color: filter === "semua" ? C.bg : C.textMuted,
              border: `1px solid ${filter === "semua" ? C.accent : C.border}`,
            }}
          >
            Semua
          </button>

          {categories.map((cat) => {
            const active = filter === cat.id;
            return (
              <div key={cat.id} className="relative group">
                <button
                  onClick={() => setFilter(cat.id)}
                  className="font-mono text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-full"
                  style={{
                    background: active ? C.accent : "transparent",
                    color: active ? C.bg : C.textMuted,
                    border: `1px solid ${active ? C.accent : C.border}`,
                    paddingRight:
                      isAdmin && !cat.isDefault ? "1.9rem" : undefined,
                  }}
                >
                  {cat.label}
                </button>
                {isAdmin && !cat.isDefault && (
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    aria-label={`Hapus kategori ${cat.label}`}
                    className="absolute top-1/2 -translate-y-1/2 right-1.5"
                    style={{ color: active ? C.bg : C.accent }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => setCategoryModal(true)}
              className="font-mono text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-full flex items-center gap-1.5"
              style={{
                border: `1.5px dashed ${C.borderStrong}`,
                color: C.textMuted,
              }}
            >
              <Plus size={12} /> Tambah Kategori
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleMemories.map((item) => (
            <div
              key={item.id}
              className="cdb-card relative text-left"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              {isAdmin && (
                <AdminControls
                  onEdit={() => setEditMemory(item)}
                  onDelete={() => handleDeleteMemory(item.id)}
                />
              )}
              <button
                onClick={() => setGalleryItem(item)}
                className="block w-full text-left"
              >
                <StampBadge>{shortLabel(item.category)}</StampBadge>
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="cdb-photo w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-4">
                  <p className="font-display uppercase text-lg leading-tight mb-2">
                    {item.title}
                  </p>
                  <div
                    className="flex flex-col gap-1 font-mono text-[11px]"
                    style={{ color: C.textMuted }}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} /> {item.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {item.date}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}

          {isAdmin && (
            <button
              onClick={() => setMemoryModal(true)}
              className="cdb-dashed flex flex-col items-center justify-center gap-2 min-h-[220px]"
            >
              <Plus size={26} style={{ color: C.textMuted }} />
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: C.textMuted }}
              >
                Tambah Dokumentasi
              </span>
            </button>
          )}
        </div>

        {visibleMemories.length === 0 && (
          <p className="font-mono text-sm mt-6" style={{ color: C.textMuted }}>
            Belum ada dokumentasi di kategori ini.
          </p>
        )}
      </section>

      <footer
        className="text-center py-10 font-mono text-[11px] tracking-widest uppercase"
        style={{ color: C.textMuted }}
      >
        Cemara Divisi Brutal
      </footer>

      {/* PIN MODAL */}
      <Modal
        open={pinModal}
        onClose={() => setPinModal(false)}
        title="Masukan PIN Admin"
      >
        <PinForm
          onSuccess={() => {
            setIsAdmin(true);
            setPinModal(false);
          }}
        />
      </Modal>

      {/* ADD MEMBER MODAL */}
      <Modal
        open={memberModal}
        onClose={() => setMemberModal(false)}
        title="Tambah Member"
      >
        <MemberForm
          onSave={(member) => {
            setMembers((prev) => [
              ...prev,
              { ...member, id: `m${Date.now()}` },
            ]);
            setMemberModal(false);
          }}
        />
      </Modal>

      {/* EDIT MEMBER MODAL */}
      <Modal
        open={!!editMember}
        onClose={() => setEditMember(null)}
        title="Edit Member"
      >
        {editMember && (
          <MemberForm
            initial={editMember}
            onSave={(data) => {
              setMembers((prev) =>
                prev.map((m) =>
                  m.id === editMember.id ? { ...m, ...data } : m
                )
              );
              setEditMember(null);
            }}
          />
        )}
      </Modal>

      {/* ADD MEMORY MODAL */}
      <Modal
        open={memoryModal}
        onClose={() => setMemoryModal(false)}
        title="Tambah Dokumentasi"
      >
        <MemoryForm
          categories={categories}
          onSave={(memory) => {
            setMemories((prev) => [
              { ...memory, id: `d${Date.now()}` },
              ...prev,
            ]);
            setMemoryModal(false);
          }}
        />
      </Modal>

      {/* EDIT MEMORY MODAL */}
      <Modal
        open={!!editMemory}
        onClose={() => setEditMemory(null)}
        title="Edit Dokumentasi"
      >
        {editMemory && (
          <MemoryForm
            categories={categories}
            initial={editMemory}
            onSave={(data) => {
              setMemories((prev) =>
                prev.map((m) =>
                  m.id === editMemory.id ? { ...m, ...data } : m
                )
              );
              setEditMemory(null);
            }}
          />
        )}
      </Modal>

      {/* ADD CATEGORY MODAL */}
      <Modal
        open={categoryModal}
        onClose={() => setCategoryModal(false)}
        title="Tambah Kategori Baru"
      >
        <CategoryForm
          onSave={(label) => {
            const id = `${slugify(label)}-${Date.now().toString(36)}`;
            setCategories((prev) => [...prev, { id, label, isDefault: false }]);
            setCategoryModal(false);
          }}
        />
      </Modal>

     {/* ================= GALLERY MODAL ================= */}
     <Modal
        open={!!galleryItem}
        onClose={() => setGalleryItem(null)}
        title={galleryItem?.title ?? ""}
      >
        {galleryItem && (
          <div>
            <div
              className="flex flex-col gap-1 font-mono text-[11px] mb-4"
              style={{ color: C.textMuted }}
            >
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> {galleryItem.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> {galleryItem.date}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[galleryItem.cover, ...galleryItem.photos].map((src, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden cursor-pointer group"
                  style={{ border: `1px solid ${C.border}` }}
                  onClick={() => setZoomedImage(src)}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
            {galleryItem?.youtube_url && (
              <div
                className="mb-4 aspect-video w-full overflow-hidden mt-3"
                style={{ border: `1px solid ${C.border}` }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(galleryItem.youtube_url)}`}
                  title="YouTube video player"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ================= LIGHTBOX ZOOM FOTO ================= */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300"
          style={{ background: "rgba(6,8,6,0.95)" }}
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full transition-transform hover:scale-110"
            style={{
              background: C.surface,
              color: C.text,
              border: `1px solid ${C.borderStrong}`,
            }}
          >
            <X size={24} />
          </button>

          <img
            src={zoomedImage}
            alt="Zoomed memory"
            className="max-w-full max-h-[88vh] object-contain shadow-2xl rounded-sm select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ================= MODAL ADD / EDIT PLAN ================= */}
      <Modal
        open={planModal || !!editPlan}
        onClose={() => {
          setPlanModal(false);
          setEditPlan(null);
        }}
        title={editPlan ? "Edit Plan" : "Tambah Next Plan"}
      >
        <PlanForm
          initial={editPlan}
          onSave={(data) => {
            if (editPlan) {
              setPlans((prev) =>
                prev.map((p) => (p.id === editPlan.id ? data : p))
              );
            } else {
              setPlans((prev) => [data, ...prev]);
            }
            setPlanModal(false);
            setEditPlan(null);
          }}
        />
      </Modal>

    </div> /* <--- INI PENUTUP RESMI FUNGSI App() */
  );
}

/* ================= DI BAWAH SINI BARU FUNGSI-FUNGSI LAIN ================= */
/* (PinForm, CategoryForm, CountdownTimer, PlanForm, MemberForm, MemoryForm) */
/* Jangan diubah yang bagian bawah ini ya bang */
   
function PinForm({ onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (ADMIN_PINS.includes(pin.trim())) {
      setError("");
      onSuccess();
    } else {
      setError("PIN salah. Coba lagi.");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="font-mono text-xs" style={{ color: C.textMuted }}>
        Khusus panitia Cemara Divisi Brutal. Masukkan PIN untuk mengaktifkan
        mode admin.
      </p>
      <div>
        <FieldLabel>PIN</FieldLabel>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none tracking-[0.3em]"
          style={inputStyle}
          placeholder="••••"
          autoFocus
        />
      </div>
      {error && (
        <p className="font-mono text-[11px]" style={{ color: C.accent }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-widest font-bold py-3 flex items-center justify-center gap-2"
        style={btnPrimary}
      >
        <Unlock size={14} /> Masuk
      </button>
    </form>
  );
}

function CategoryForm({ onSave }) {
  const [label, setLabel] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSave(label.trim());
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <FieldLabel>Nama Kategori</FieldLabel>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none"
          style={inputStyle}
          placeholder="cth. Konser, Mabar Game, Kuliner"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-widest font-bold py-3"
        style={btnPrimary}
      >
        Simpan
      </button>
    </form>
  );
}

// 1. KOMPONEN HITUNG MUNDUR (COUNTDOWN TIMER)
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const selisih = target - now;

      if (selisih < 0) {
        clearInterval(interval);
        setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
      } else {
        setTimeLeft({
          hari: Math.floor(selisih / (1000 * 60 * 60 * 24)),
          jam: Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          menit: Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60)),
          detik: Math.floor((selisih % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 my-4 text-center font-mono">
      {Object.entries(timeLeft).map(([label, angka]) => (
        <div key={label} className="p-2" style={{ background: C.bgAlt, border: `1px solid ${C.borderStrong}` }}>
          <span className="block text-xl md:text-2xl font-bold" style={{ color: C.accent }}>
            {String(angka).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: C.textMuted }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// 2. KOMPONEN FORM BUAT ADMIN INPUT PLAN BARU
function PlanForm({ initial, onSave }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [dateText, setDateText] = useState(initial?.date_text ?? "");
  const [targetDate, setTargetDate] = useState(initial?.target_date ?? "");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) {
      alert("Judul dan Tanggal Target (buat timer) wajib diisi ya bang!");
      return;
    }

    const planData = {
      id: initial?.id ?? `p${Date.now()}`,
      title: title.trim(),
      location: location.trim() || "Lokasi belum ditentukan",
      date_text: dateText.trim() || "Tanggal belum ditentukan",
      target_date: targetDate,
    };

    // Upsert (kalau udah ada di-edit, kalau belum di-insert)
    const { error } = await supabase.from('plans').upsert([planData]);

    if (error) {
      alert("Gagal simpan plan: " + error.message);
    } else {
      onSave(planData);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <FieldLabel>Nama Plan / Agenda</FieldLabel>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none"
          style={inputStyle}
          placeholder="cth. Ekspedisi Gunung Gede"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Lokasi</FieldLabel>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2.5 text-sm outline-none"
            style={inputStyle}
            placeholder="cth. Cibodas"
          />
        </div>
        <div>
          <FieldLabel>Teks Tanggal (Buat Ditampilkan)</FieldLabel>
          <input
            value={dateText}
            onChange={(e) => setDateText(e.target.value)}
            className="w-full px-3 py-2.5 text-sm outline-none"
            style={inputStyle}
            placeholder="cth. 17 Agustus 2026"
          />
        </div>
      </div>
      <div>
        <FieldLabel>Waktu Target (Buat Hitung Mundur / Timer)</FieldLabel>
        <input
          type="datetime-local"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none font-mono"
          style={inputStyle}
        />
        <span className="text-[10px] block mt-1" style={{ color: C.textMuted }}>
          *Timer countdown bakal otomatis ngitung ke jam & tanggal yang dipilih ini.
        </span>
      </div>
      <button type="submit" className="font-mono text-xs uppercase tracking-widest font-bold py-3" style={btnPrimary}>
        Simpan Plan
      </button>
    </form>
  );
}

function MemberForm({ initial, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [linkInput, setLinkInput] = useState(""); // Buat nampung link GDrive

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(await fileToDataUrl(file));
    setLinkInput(""); // Kosongin teks link kalau pilih dari perangkat
  };

  const handleLinkChange = (e) => {
    const val = e.target.value;
    setLinkInput(val);
    if (val.trim()) {
      // Otomatis convert link GDrive jadi foto
      setPhoto(parseGDriveLink(val.trim()));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const submit = async (e) => {
      e.preventDefault();
      if (!name.trim()) return;
  
      const memberData = {
        id: initial?.id ?? `m${Date.now()}`, // <--- Tambahin ID
        name: name.trim(),
        photo: photo || `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`,
      };
  
      // Ganti jadi .upsert()
      const { error } = await supabase.from('members').upsert([memberData]);
      
      if (error) {
        alert("Gagal simpan ke Supabase: " + error.message);
      } else {
        onSave(memberData); 
      }
    };
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <FieldLabel>Nama</FieldLabel>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none"
          style={inputStyle}
          placeholder="cth. Anak Baru"
        />
      </div>

      {/* OPSI 1: UPLOAD PERANGKAT */}
      <div>
        <FieldLabel>Opsi 1: Pilih Foto dari Perangkat</FieldLabel>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full text-xs font-mono"
          style={{ color: C.textMuted }}
        />
      </div>

      {/* OPSI 2: LINK GOOGLE DRIVE */}
      <div>
        <FieldLabel>Opsi 2: Atau Tempel Link Google Drive / Web</FieldLabel>
        <input
          value={linkInput}
          onChange={handleLinkChange}
          className="w-full px-3 py-2 text-xs outline-none font-mono"
          style={inputStyle}
          placeholder="https://drive.google.com/file/d/..../view?usp=sharing"
        />
        <span className="text-[10px] block mt-1" style={{ color: C.textMuted }}>
          *Pastikan akses foto di GDrive diganti jadi <b>"Siapa saja yang memiliki link (Anyone with link)"</b>.
        </span>
      </div>

      {photo && (
        <div>
          <FieldLabel>Preview Foto:</FieldLabel>
          <img
            src={photo}
            alt="preview"
            className="w-20 h-20 object-cover mt-1"
            style={{ border: `1px solid ${C.border}` }}
          />
        </div>
      )}

      <button type="submit" className="font-mono text-xs uppercase tracking-widest font-bold py-3" style={btnPrimary}>
        Simpan
      </button>
    </form>
  );
}

function MemoryForm({ categories, initial, onSave }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.id ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [photos, setPhotos] = useState(initial?.photos ?? []);
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_url ?? "");
  
  // State baru buat nampung link GDrive
  const [coverLinkInput, setCoverLinkInput] = useState("");
  const [galleryLinkInput, setGalleryLinkInput] = useState("");

  const handleCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(await fileToDataUrl(file));
    setCoverLinkInput("");
  };

  const handleCoverLinkChange = (e) => {
    const val = e.target.value;
    setCoverLinkInput(val);
    if (val.trim()) setCover(parseGDriveLink(val.trim()));
  };

  const handleGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setPhotos((prev) => [...prev, ...dataUrls]);
  };

  // Fungsi buat nambah foto galeri dari link GDrive
  const handleAddGalleryLink = (e) => {
    e.preventDefault();
    if (!galleryLinkInput.trim()) return;
    const directUrl = parseGDriveLink(galleryLinkInput.trim());
    setPhotos((prev) => [...prev, directUrl]);
    setGalleryLinkInput(""); // Kosongin input setelah ditambah
  };

  const removePhoto = (idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const submit = async (e) => {
      e.preventDefault();
      if (!title.trim()) return;
  
      const memoryData = {
        // 1. TAMBAHIN BARIS INI: Biar sistem tau ini edit album lama atau bikin album baru
        id: initial?.id ?? `d${Date.now()}`, 
        title: title.trim(),
        category,
        location: location.trim() || "Lokasi belum diisi",
        date: date.trim() || "Tanggal belum diisi",
        cover: cover || `https://picsum.photos/seed/${encodeURIComponent(title)}/700/900`,
        photos,
        youtube_url: youtubeUrl.trim(),
      };
  
      // 2. GANTI .insert() JADI .upsert()
      const { error } = await supabase.from('memories').upsert([memoryData]);
  
      if (error) {
        alert("Gagal simpan memori: " + error.message);
      } else {
        onSave(memoryData);
      }
    };
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <FieldLabel>Judul</FieldLabel>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="cth. Trip Dieng" />
      </div>
      <div>
        <FieldLabel>Kategori</FieldLabel>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Lokasi</FieldLabel>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="cth. Dieng" />
        </div>
        <div>
          <FieldLabel>Tanggal</FieldLabel>
          <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="cth. Jun 2026" />
        </div>
      </div>
      <div>
        <FieldLabel>Link YouTube (Opsional)</FieldLabel>
        <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} placeholder="cth. https://youtube.com/watch?v=..." />
      </div>

      {/* --- BAGIAN COVER FOTO --- */}
      <div className="p-3" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
        <FieldLabel>Foto Sampul (Pilih Salah Satu):</FieldLabel>
        <input type="file" accept="image/*" onChange={handleCoverFile} className="w-full text-xs font-mono mb-2" style={{ color: C.textMuted }} />
        <input
          value={coverLinkInput}
          onChange={handleCoverLinkChange}
          className="w-full px-2.5 py-1.5 text-xs outline-none font-mono"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
          placeholder="Atau tempel Link Google Drive di sini..."
        />
        {cover && <img src={cover} alt="preview" className="w-16 h-20 object-cover mt-2" style={{ border: `1px solid ${C.border}` }} />}
      </div>

      {/* --- BAGIAN GALERI FOTO --- */}
      <div className="p-3" style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}>
        <FieldLabel>Foto Galeri (Bisa dari Perangkat / GDrive):</FieldLabel>
        <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="w-full text-xs font-mono mb-3" style={{ color: C.textMuted }} />
        
        <div className="flex gap-2">
          <input
            value={galleryLinkInput}
            onChange={(e) => setGalleryLinkInput(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs outline-none font-mono"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
            placeholder="Tempel Link GDrive foto galeri..."
          />
          <button
            type="button"
            onClick={handleAddGalleryLink}
            className="px-3 py-1 text-xs font-mono font-bold uppercase shrink-0"
            style={{ background: C.pine, color: C.text }}
          >
            + Tambah
          </button>
        </div>

        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {photos.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} alt="" className="w-14 h-14 object-cover" style={{ border: `1px solid ${C.border}` }} />
                <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1.5 -right-1.5 rounded-full p-0.5" style={{ background: C.accent, color: C.bg }}>
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="font-mono text-xs uppercase tracking-widest font-bold py-3" style={btnPrimary}>Simpan</button>
    </form>
  );


  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <FieldLabel>Judul</FieldLabel>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none"
          style={inputStyle}
          placeholder="cth. Trip Dieng"
        />
      </div>
      <div>
        <FieldLabel>Kategori</FieldLabel>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none"
          style={inputStyle}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Lokasi</FieldLabel>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2.5 text-sm outline-none"
            style={inputStyle}
            placeholder="cth. Dieng"
          />
        </div>
        <div>
          <FieldLabel>Tanggal</FieldLabel>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm outline-none"
            style={inputStyle}
            placeholder="cth. Jun 2026"
          />
        </div>
            
      <div>
        <FieldLabel>Link YouTube (Opsional)</FieldLabel>
        <input
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full px-3 py-2.5 text-sm outline-none"
          style={inputStyle}
          placeholder="cth. https://youtube.com/watch?v=..."
        />
      </div>
      </div>
      <div>
        <FieldLabel>Simpan Foto Sampul dari Perangkat</FieldLabel>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverFile}
          className="w-full text-xs font-mono"
          style={{ color: C.textMuted }}
        />
      </div>
      {cover && (
        <img
          src={cover}
          alt="preview"
          className="w-20 h-24 object-cover"
          style={{ border: `1px solid ${C.border}` }}
        />
      )}
      <div>
        <FieldLabel>
          Tambah Foto Galeri dari Perangkat (bisa pilih banyak)
        </FieldLabel>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryFiles}
          className="w-full text-xs font-mono"
          style={{ color: C.textMuted }}
        />
      </div>
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img
                src={p}
                alt=""
                className="w-14 h-14 object-cover"
                style={{ border: `1px solid ${C.border}` }}
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-1.5 -right-1.5 rounded-full p-0.5"
                style={{ background: C.accent, color: C.bg }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-widest font-bold py-3"
        style={btnPrimary}
      >
        Simpan
      </button>
    </form>
  );
}
