
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
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

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

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
  const [members, setMembers] = useState(() =>
    loadLS("cdb_members", DEFAULT_MEMBERS)
  );
  const [memories, setMemories] = useState(() =>
    loadLS("cdb_memories", DEFAULT_MEMORIES)
  );
  const [categories, setCategories] = useState(() =>
    loadLS("cdb_categories_baru", DEFAULT_CATEGORIES)
  );
  const [filter, setFilter] = useState("semua");
  const [isAdmin, setIsAdmin] = useState(false);

  const [pinModal, setPinModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [memoryModal, setMemoryModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [galleryItem, setGalleryItem] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [editMemory, setEditMemory] = useState(null);

  const heroRef = useRef(null);
  const crewRef = useRef(null);
  const galeriRef = useRef(null);

  useEffect(
    () => localStorage.setItem("cdb_members", JSON.stringify(members)),
    [members]
  );
  useEffect(
    () => localStorage.setItem("cdb_memories", JSON.stringify(memories)),
    [memories]
  );
  useEffect(
    () => localStorage.setItem("cdb_categories_baru", JSON.stringify(categories)),
    [categories]
  );

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" });

  const categoryById = (id) => categories.find((c) => c.id === id);
  const shortLabel = (id) => {
    const cat = categoryById(id);
    if (!cat) return id;
    return cat.label.split(" ")[0].toUpperCase();
  };

  const visibleMemories =
    filter === "semua"
      ? memories
      : memories.filter((m) => m.category === filter);

  const handleDeleteMember = (id) => {
    if (window.confirm("Hapus member ini dari Cemara Divisi Brutal?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm("Hapus dokumentasi ini?")) {
      setMemories((prev) => prev.filter((m) => m.id !== id));
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
              Galeri Memori
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

      {/* GALLERY MODAL */}
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
                  className="aspect-square overflow-hidden"
                  style={{ border: `1px solid ${C.border}` }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

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

function MemberForm({ initial, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(await fileToDataUrl(file));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      photo:
        photo ||
        `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`,
    });
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
      <div>
        <FieldLabel>Simpan Foto dari Perangkat</FieldLabel>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full text-xs font-mono"
          style={{ color: C.textMuted }}
        />
      </div>
      {photo && (
        <img
          src={photo}
          alt="preview"
          className="w-20 h-20 object-cover"
          style={{ border: `1px solid ${C.border}` }}
        />
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

function MemoryForm({ categories, initial, onSave }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(
    initial?.category ?? categories[0]?.id ?? ""
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [photos, setPhotos] = useState(initial?.photos ?? []);
  
  // Tambahkan fungsi ini di dalam MemoryForm
const uploadToDrive = async (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result.split(',')[1];
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwUXlCwVe4R9KIKBxSd69xZ3Db4W3zg2BavEVhygKe_BX_azPBd3rRziCXhgnAIiLnQ/exec", { // <--- GANTI URL DI SINI
          method: "POST",
          body: JSON.stringify({
            data: base64data,
            filename: file.name,
            mimetype: file.type
          })
        });
        const result = await response.text();
        resolve(result.replace("File berhasil diupload! URL: ", ""));
      } catch (error) {
        reject(error);
      }
    };
  });
};

const handleCoverFile = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  // Ini akan mengubah proses dari lokal (base64) ke upload ke Drive
  const driveUrl = await uploadToDrive(file);
  setCover(driveUrl); 
};

const handleGalleryFiles = async (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  
  // Upload semua file ke drive satu per satu
  const driveUrls = await Promise.all(files.map(uploadToDrive));
  setPhotos((prev) => [...prev, ...driveUrls]);
};

  const removePhoto = (idx) =>
    setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      category,
      location: location.trim() || "Lokasi belum diisi",
      date: date.trim() || "Tanggal belum diisi",
      cover:
        cover ||
        `https://picsum.photos/seed/${encodeURIComponent(title)}/700/900`,
      photos,
    });
  };

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
