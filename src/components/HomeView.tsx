import React, { useState } from 'react';
import { Newspaper, Image, Calendar, AlertTriangle, ArrowRight, ShieldCheck, Filter, Bell, ExternalLink, RefreshCw } from 'lucide-react';
import { NewsItem, EmergencyAlert, Language } from '../types';
// @ts-ignore
import schoolLogo from '../assets/images/school_logo_1784346350047.jpg';
import { translations } from '../translations';

interface HomeViewProps {
  news: NewsItem[];
  emergencies: EmergencyAlert[];
  language: Language;
  onNavigate: (view: string) => void;
  onRefreshData: () => void;
}

export default function HomeView({
  news,
  emergencies,
  language,
  onNavigate,
  onRefreshData
}: HomeViewProps) {
  const t = translations[language];
  const [parentFilter, setParentFilter] = useState<'Semua' | 'Akademik' | 'Darurat'>('Semua');
  const [filterSavedMsg, setFilterSavedMsg] = useState(false);

  // Default mock gallery items
  const galleryItems = [
    {
      title: "Praktik Budidaya Hidroponik ATPH",
      desc: "Siswa program keahlian Agribisnis Tanaman Pangan dan Hortikultura (ATPH) melakukan praktik pertanian modern.",
      image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=500&auto=format&fit=crop"
    },
    {
      title: "Praktik Jaringan Telekomunikasi TJKT",
      desc: "Siswa program keahlian Teknik Jaringan Komputer dan Telekomunikasi (TJKT) merakit jaringan dan serat optik.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=500&auto=format&fit=crop"
    },
    {
      title: "Praktik Bengkel Sepeda Motor TSM",
      desc: "Siswa program keahlian Teknik Sepeda Motor (TSM) mempelajari pemeliharaan mesin & kelistrikan sepeda motor.",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500&auto=format&fit=crop"
    },
    {
      title: "Kegiatan Pramuka & Pembinaan Karakter",
      desc: "Pembentukan karakter siswa SMKN 13 Pandeglang yang tangguh, mandiri, dan berakhlak mulia di alam bebas.",
      image: "https://images.unsplash.com/photo-1501535033-a598d2bfbd1f?q=80&w=500&auto=format&fit=crop"
    }
  ];

  const handleSaveFilter = () => {
    setFilterSavedMsg(true);
    setTimeout(() => setFilterSavedMsg(false), 3000);
  };

  const activeEmergency = emergencies.find(e => e.active);

  // Google Calendar Reminder Generator Helper
  const getGoogleCalendarUrl = (title: string, date: string, desc: string) => {
    const formattedDate = date.replace(/-/g, '');
    const start = `${formattedDate}T080000`;
    const end = `${formattedDate}T120000`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(desc)}&location=SMK+Negeri+13+Pandeglang&sf=true&output=xml`;
  };

  // Filter news according to parents preference
  const filteredNews = news.filter(item => {
    if (parentFilter === 'Semua') return true;
    if (parentFilter === 'Akademik') return item.category === 'Pengumuman' || item.category === 'Prestasi';
    if (parentFilter === 'Darurat') return item.category === 'Penting' || item.category === 'Pengumuman';
    return true;
  });

  return (
    <div className="flex flex-col gap-10 pb-16">
      
      {/* Emergency Alert Banner */}
      {activeEmergency && (
        <div className="bg-red-50 dark:bg-red-950/40 border-y border-red-200 dark:border-red-900/60 p-4 transition-colors">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 animate-bounce">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900 dark:text-red-400 flex items-center gap-2">
                <span>{t.emergencyAlert} : {activeEmergency.title}</span>
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-[10px] px-2 py-0.5 rounded-full font-bold">PENTING</span>
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                {activeEmergency.content} (Tanggal rilis: {activeEmergency.date})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-indigo-600 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200 shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl flex flex-col gap-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm w-fit border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              PPDB TA 2026/2027 Dibuka
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t.welcomeTitle}
            </h2>
            <p className="text-sm sm:text-base text-gray-100 leading-relaxed max-w-xl">
              {t.welcomeDesc}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => onNavigate('ppdb')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-indigo-700 font-bold rounded-xl text-sm shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Daftar Siswa Baru (PPDB)</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('academic')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/30 backdrop-blur-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Cek Nilai Siswa
              </button>
            </div>
          </div>

          {/* School Logo */}
          <div className="shrink-0 flex items-center justify-center p-3 bg-white rounded-full border-4 border-slate-200 shadow-2xl w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 transform hover:scale-105 transition-all duration-300">
            <img
              src={schoolLogo}
              alt="Logo SMK Negeri 13 Pandeglang"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        {/* Abstract decorative background vector */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </section>

      {/* Main Grid: News Content & Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: News Portal Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="text-blue-600" size={22} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.latestNews}
              </h3>
            </div>
            <button 
              onClick={onRefreshData}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-all"
              title="Refresh Berita"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {item.image && (
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
                      {item.category}
                    </span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                  <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed flex-1">
                    {item.content}
                  </p>
                  <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline mt-2 self-start">
                    <span>Selengkapnya</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar (Parents preference & Google Calendar Reminders) */}
        <div className="flex flex-col gap-6">
          
          {/* 1. Parent Preference Filter Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Filter className="text-blue-600" size={18} />
              <h3 className="font-bold text-gray-900 dark:text-white text-md">
                {t.parentFilter}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t.parentFilterDesc}
            </p>
            
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <input
                  type="radio"
                  name="parentFilter"
                  checked={parentFilter === 'Semua'}
                  onChange={() => setParentFilter('Semua')}
                  className="accent-blue-600"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.allContent}</span>
              </label>
              
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <input
                  type="radio"
                  name="parentFilter"
                  checked={parentFilter === 'Akademik'}
                  onChange={() => setParentFilter('Akademik')}
                  className="accent-blue-600"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.academicOnly}</span>
              </label>
              
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <input
                  type="radio"
                  name="parentFilter"
                  checked={parentFilter === 'Darurat'}
                  onChange={() => setParentFilter('Darurat')}
                  className="accent-blue-600"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.announcementsOnly}</span>
              </label>
            </div>

            <button
              onClick={handleSaveFilter}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <Bell size={14} />
              <span>{t.saveSettings}</span>
            </button>

            {filterSavedMsg && (
              <span className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                Preferensi orang tua berhasil diterapkan!
              </span>
            )}
          </div>

          {/* 2. Google Calendar Sync Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Calendar className="text-blue-600" size={18} />
              <h3 className="font-bold text-gray-900 dark:text-white text-md">
                {t.googleCalendar}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Sinkronisasikan agenda ujian dan kegiatan penting sekolah langsung ke Google Calendar Anda agar tidak terlewat.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col gap-1.5">
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-md w-fit">
                  EXAM PREP
                </span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Ujian Semester Ganjil 2026</span>
                <span className="text-[10px] text-gray-400">Tanggal: 20 Juli 2026</span>
                <a
                  href={getGoogleCalendarUrl(
                    "Ujian Semester Ganjil 2026 - SMKN 13 Pandeglang",
                    "2026-07-20",
                    "Ujian Semester Ganjil digital berbasis Android untuk kelas XII, XI, X."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline mt-1 self-start"
                >
                  <span>Sync Google Calendar</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col gap-1.5">
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md w-fit">
                  ADMISSION
                </span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Batas Akhir PPDB Online</span>
                <span className="text-[10px] text-gray-400">Tanggal: 31 Agustus 2026</span>
                <a
                  href={getGoogleCalendarUrl(
                    "Batas Akhir Pendaftaran PPDB Online SMKN 13 Pandeglang",
                    "2026-08-31",
                    "Penutupan pendaftaran online PPDB SMKN 13 Pandeglang."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline mt-1 self-start"
                >
                  <span>Sync Google Calendar</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Photo Gallery Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
          <Image className="text-blue-600" size={22} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.photoGallery}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((photo, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-snug">
                  {photo.title}
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  {photo.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
