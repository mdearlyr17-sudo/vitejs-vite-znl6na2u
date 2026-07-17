// @ts-nocheck
import React, { useState, useEffect } from "react";
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
  Hash,
  Send
} from "lucide-react";

/* ==========================================================
   CEMARA DIVISI BRUTAL - FULL EDITION + ADMIN CATEGORY CONTROL
   (VERSI TANPA KATEGORI DEFAULT / KOSONG DARI AWAL)
   ========================================================== */

export default function App() {
  // State Admin PIN (PIN: brutal)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModalPin, setShowModalPin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorPin, setErrorPin] = useState(false);

  // State Kategori (TANPA DEFAULT / KOSONG [])
  // Key diganti jadi cdb_kategori_v2 biar cache lama otomatis bersih!
  const [kategoriList, setKategoriList] = useState(() => {
    const saved = localStorage.getItem("cdb_kategori_v2");
    return saved ? JSON.parse(saved) : []; 
  });
  const [kategoriBaru, setKategoriBaru] = useState("");
  const [activeKategori, setActiveKategori] = useState("Semua");

  // State Navigation Tab
  const [activeTab, setActiveTab] = useState("beranda");

  // Data Anggota & Galeri (Dummy)
  const [anggotaList, setAnggotaList] = useState([
    { nama: "Alex Sudo", peran: "Ketua Divisi", status: "Active", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60" },
    { nama: "Reno Gaspol", peran: "Kadiv Touring", status: "Active", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60" },
    { nama: "Siti Kopi", peran: "Bendahara Rahasia", status: "Active", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60" },
  ]);

  const [galeriList, setGaleriList] = useState([
    { judul: "Touring Lintas Malam", deskripsi: "Menembus kabut lembah cemara", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80" },
    { judul: "Mabar Akhir Pekan", deskripsi: "Push rank sampai pagi", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80" },
  ]);

  // Handler Login Admin
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (pinInput.toLowerCase() === "brutal") {
      setIsAdmin(true);
      setShowModalPin(false);
      setPinInput("");
      setErrorPin(false);
    } else {
      setErrorPin(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  // Handler Kategori (Simpan ke cdb_kategori_v2)
  const handleTambahKategori = (e: any) => {
    e.preventDefault();
    if (!kategoriBaru.trim()) return;
    const updateList = [...kategoriList, kategoriBaru.trim()];
    setKategoriList(updateList);
    localStorage.setItem("cdb_kategori_v2", JSON.stringify(updateList));
    setKategoriBaru("");
  };

  const handleHapusKategori = (indexHapus: number) => {
    const updateList = kategoriList.filter((_, index) => index !== indexHapus);
    setKategoriList(updateList);
    localStorage.setItem("cdb_kategori_v2", JSON.stringify(updateList));
    if (activeKategori === kategoriList[indexHapus]) {
      setActiveKategori("Semua");
    }
  };

  return (
    /* ANTI-BOCOR HP: overflow-x-hidden & w-full wajib ada di sini */
    <div className="min-h-screen overflow-x-hidden w-full bg-[#0E1410] text-white font-sans selection:bg-red-600 selection:text-white">
      
      {/* NAVBAR / HEADER */}
      <header className="border-b border-zinc-800 bg-[#0E1410]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black tracking-tighter text-xl">
            <span className="bg-red-600 text-white px-2 py-0.5 text-xs rounded uppercase tracking-widest font-mono">
              CDB
            </span>
            <span className="tracking-widest">CEMARA DIVISI BRUTAL</span>
          </div>

          {/* TOMBOL GEMBOK ADMIN */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-3 py-1 rounded-full text-xs font-mono text-red-400 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MODE ADMIN</span>
                <button
                  onClick={handleLogout}
                  className="ml-1 bg-red-600/30 hover:bg-red-600 p-1 rounded text-white transition cursor-pointer"
                  title="Keluar Admin"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModalPin(true)}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                title="Buka Gembok Admin"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative py-16 md:py-24 border-b border-zinc-800 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-sm">
            CEMARA <span className="text-red-600 underline decoration-red-600/50 decoration-wavy">DIVISI</span> BRUTAL
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-mono">
            "Satu jalur, satu tongkrongan, solid sampai akhir. Tidak ada kata mundur dalam kamus divisi kami."
          </p>
        </div>

        {/* PITA RUNNING TEXT (ANTI-BOCOR) */}
        <div className="mt-12 bg-red-600 text-black font-black font-mono text-sm py-1.5 uppercase tracking-widest overflow-hidden whitespace-nowrap shadow-lg rotate-1 scale-105">
          <div className="inline-block animate-marquee">
            • CEMARA DIVISI BRUTAL • SOLIDARITAS TANPA BATAS • KOPDAR RUTIN • TOURING GASPOL • HANCURKAN RINTANGAN • 
          </div>
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-center gap-2 border-b border-zinc-800 pb-4">
          <button
            onClick={() => setActiveTab("beranda")}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition cursor-pointer ${
              activeTab === "beranda"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 font-black"
                : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Beranda & Kategori
          </button>
          <button
            onClick={() => setActiveTab("anggota")}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition cursor-pointer ${
              activeTab === "anggota"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 font-black"
                : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Anggota Divisi
          </button>
          <button
            onClick={() => setActiveTab("galeri")}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition cursor-pointer ${
              activeTab === "galeri"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 font-black"
                : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            Galeri Memori
          </button>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        
        {/* TAB 1: BERANDA & KATEGORI */}
        {activeTab === "beranda" && (
          <div>
            {/* SECTION KATEGORI DIVISI (DENGAN KONTROL ADMIN) */}
            <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/60 shadow-xl mb-12">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
                <h3 className="text-lg font-black tracking-wider uppercase flex items-center gap-2 text-red-500">
                  <Hash className="w-5 h-5" /> Kategori Divisi
                </h3>
                {isAdmin ? (
                  <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2.5 py-1 rounded font-mono">
                    Admin Mode: Bisa Tambah & Hapus
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500 font-mono">
                    {kategoriList.length === 0 ? "Belum ada kategori kustom" : `${kategoriList.length} Kategori Tersedia`}
                  </span>
                )}
              </div>

              {/* FORM TAMBAH KATEGORI (KHUSUS ADMIN) */}
              {isAdmin && (
                <form onSubmit={handleTambahKategori} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={kategoriBaru}
                    onChange={(e) => setKategoriBaru(e.target.value)}
                    placeholder="Ketik nama kategori baru (misal: Kopdar, Touring)..."
                    className="flex-1 px-4 py-2.5 bg-black border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-600/20 cursor-pointer uppercase tracking-wider transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </form>
              )}

              {/* DAFTAR PILIHAN KATEGORI */}
              <div className="flex flex-wrap gap-2.5 items-center">
                <button
                  onClick={() => setActiveKategori("Semua")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                    activeKategori === "Semua"
                      ? "bg-white text-black font-black"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                  }`}
                >
                  # Semua
                </button>

                {/* PESAN KALO KATEGORI MASIH KOSONG & BUKAN ADMIN */}
                {kategoriList.length === 0 && !isAdmin && (
                  <span className="text-xs text-zinc-600 italic font-mono px-2">
                    (Belum ada kategori tambahan dari admin)
                  </span>
                )}

                {kategoriList.map((kat, index) => (
                  <div
                    key={index}
                    className={`group flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition border ${
                      activeKategori === kat
                        ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20"
                        : "bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <button
                      onClick={() => setActiveKategori(kat)}
                      className="cursor-pointer font-mono"
                    >
                      # {kat}
                    </button>

                    {/* TOMBOL HAPUS KATEGORI (KHUSUS ADMIN) */}
                    {isAdmin && (
                      <button
                        onClick={() => handleHapusKategori(index)}
                        className="ml-1 text-zinc-500 hover:text-white hover:bg-red-700 p-1 rounded transition cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* INFO KATEGORI DIPILIH */}
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
              <Compass className="w-12 h-12 text-red-600 mx-auto mb-3 animate-spin-slow" />
              <h4 className="text-xl font-bold mb-1 uppercase tracking-wide">
                Menampilkan Kategori: <span className="text-red-500">#{activeKategori}</span>
              </h4>
              <p className="text-zinc-500 text-sm font-mono">
                Pilih tab Anggota atau Galeri untuk melihat dokumentasi divisi.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ANGGOTA DIVISI */}
        {activeTab === "anggota" && (
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
              <Users2 className="w-6 h-6 text-red-500" /> Anggota Resmi Divisi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {anggotaList.map((anggota, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition">
                  <div className="h-48 overflow-hidden relative">
                    <img src={anggota.img} alt={anggota.nama} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 right-3 bg-red-600 text-black font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-widest">
                      {anggota.status}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-black text-lg text-white mb-0.5 uppercase tracking-wide">{anggota.nama}</h4>
                    <p className="text-red-500 text-xs font-mono font-bold uppercase tracking-widest">{anggota.peran}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALERI MEMORI */}
        {activeTab === "galeri" && (
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
              <ImagePlus className="w-6 h-6 text-red-500" /> Galeri & Arsip Memori
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galeriList.map((item, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden group">
                  <div className="h-64 overflow-hidden relative">
                    <img src={item.img} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="font-black text-xl text-white uppercase tracking-wider mb-1">{item.judul}</h4>
                      <p className="text-zinc-400 text-xs font-mono">{item.deskripsi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-black/60 py-8 text-center text-zinc-500 font-mono text-xs mt-20">
        <p>CDB © 2026 • CEMARA DIVISI BRUTAL • STAY SOLID & RESPECT</p>
      </footer>

      {/* MODAL PIN RAHASIA */}
      {showModalPin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0E1410] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => { setShowModalPin(false); setErrorPin(false); setPinInput(""); }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider">Akses Gembok Admin</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">Masukkan sandi rahasia divisi (PIN: brutal)</p>
            </div>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ketik sandi..."
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-center text-white font-mono tracking-widest text-lg mb-4 focus:outline-none focus:border-red-600"
                autoFocus
              />
              
              {errorPin && (
                <p className="text-red-500 text-xs font-mono text-center mb-4 animate-bounce">
                  ⚠️ SANDI SALAH! AKSES DITOLAK.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl uppercase tracking-wider shadow-lg shadow-red-600/20 cursor-pointer transition"
              >
                Buka Gembok
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}