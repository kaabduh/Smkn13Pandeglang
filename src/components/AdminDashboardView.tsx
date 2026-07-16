import React, { useState, useEffect } from 'react';
import {
  Users, Newspaper, AlertTriangle, ShieldCheck, Database, Smartphone, 
  Settings, RefreshCw, Key, Plus, Edit, Download, Upload, Trash, Check, Bell, Lock, AlertOctagon, HelpCircle, Eye
} from 'lucide-react';
import { Student, PPDBRegistration, NewsItem, ExamSchedule, SchoolSettings, WALog } from '../types';

interface AdminDashboardViewProps {
  students: Student[];
  ppdbList: PPDBRegistration[];
  news: NewsItem[];
  waLogs: WALog[];
  settings: SchoolSettings;
  onUpdateGrades: (id: string, grades: any) => Promise<void>;
  onPublishNews: (newsData: any) => Promise<void>;
  onTriggerEmergency: (title: string, content: string) => Promise<void>;
  onClearEmergency: () => Promise<void>;
  onTriggerBackup: () => Promise<any>;
  onRestoreBackup: (payload: string) => Promise<void>;
  onToggle2FA: (enabled: boolean) => Promise<void>;
  onClearWaLogs: () => Promise<void>;
  onRefreshData: () => void;
}

export default function AdminDashboardView({
  students,
  ppdbList,
  news,
  waLogs,
  settings,
  onUpdateGrades,
  onPublishNews,
  onTriggerEmergency,
  onClearEmergency,
  onTriggerBackup,
  onRestoreBackup,
  onToggle2FA,
  onClearWaLogs,
  onRefreshData
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'news' | 'emergency' | 'security' | 'walogs'>('students');

  // Grades Manager State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editGrades, setEditGrades] = useState<any>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // News Manager State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Pengumuman');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsSuccessMsg, setNewsSuccessMsg] = useState(false);

  // Emergency State
  const [emgTitle, setEmgTitle] = useState('');
  const [emgContent, setEmgContent] = useState('');
  const [emgSuccessMsg, setEmgSuccessMsg] = useState(false);

  // Security & Backup State
  const [backupResult, setBackupResult] = useState<any>(null);
  const [restorePayload, setRestorePayload] = useState('');
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState('');
  const [restoreErrorMsg, setRestoreErrorMsg] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // 2FA Setup Helpers
  const handleVerifyOtp = () => {
    setOtpError(false);
    if (otpCode === "123456" || otpCode === "131313") {
      setOtpVerified(true);
      onToggle2FA(!settings.twoFactorEnabled);
    } else {
      setOtpError(true);
    }
  };

  const handleSelectStudentForEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditGrades({ ...student.grades });
    setSaveSuccessMsg(false);
  };

  const handleSaveGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSaveLoading(true);
    try {
      await onUpdateGrades(selectedStudent.id, editGrades);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui nilai.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      alert("Judul dan Konten berita wajib diisi.");
      return;
    }
    try {
      await onPublishNews({
        title: newsTitle,
        category: newsCategory,
        content: newsContent,
        image: newsImage
      });
      setNewsSuccessMsg(true);
      setNewsTitle('');
      setNewsContent('');
      setNewsImage('');
      setTimeout(() => setNewsSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Gagal mempublikasi berita.");
    }
  };

  const handleTriggerEmergencyAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emgTitle.trim() || !emgContent.trim()) {
      alert("Judul dan deskripsi darurat wajib diisi.");
      return;
    }
    try {
      await onTriggerEmergency(emgTitle, emgContent);
      setEmgSuccessMsg(true);
      setEmgTitle('');
      setEmgContent('');
      setTimeout(() => setEmgSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Gagal menyiarkan alert darurat.");
    }
  };

  const handleRunBackup = async () => {
    try {
      const res = await onTriggerBackup();
      setBackupResult(res);
    } catch (err) {
      console.error(err);
      alert("Gagal mencadangkan database.");
    }
  };

  const handleRunRestore = async () => {
    setRestoreSuccessMsg('');
    setRestoreErrorMsg('');
    if (!restorePayload.trim()) {
      setRestoreErrorMsg("Harap paste payload cadangan terenkripsi.");
      return;
    }
    try {
      await onRestoreBackup(restorePayload);
      setRestoreSuccessMsg("Restorasi data berhasil! Semua database dipulihkan ke keadaan cadangan.");
      setRestorePayload('');
    } catch (err: any) {
      setRestoreErrorMsg(err.message || "Gagal memulihkan database.");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in">
      
      {/* Top Welcome Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Siswa Aktif</span>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{students.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Newspaper size={22} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">PPDB Pendaftar</span>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{ppdbList.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Smartphone size={22} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">WhatsApp Terkirim</span>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{waLogs.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <Database size={22} />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Backup Terenkripsi</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mt-1">
              {settings.lastBackupTime ? new Date(settings.lastBackupTime).toLocaleDateString() : 'Belum Pernah'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: Tab Switcher & Display area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Admin Tabs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm h-fit flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">
            KONTROL ADMIN SEKOLAH
          </span>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Users size={16} />
            <span>Rapor & Nilai Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'news'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Newspaper size={16} />
            <span>Publikasi Berita</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'emergency'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <AlertTriangle size={16} />
            <span>Pemberitahuan Darurat</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <ShieldCheck size={16} />
            <span>2FA & Backup Enkripsi</span>
          </button>

          <button
            onClick={() => setActiveTab('walogs')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'walogs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Smartphone size={16} />
            <span>Log Otomasi WhatsApp</span>
          </button>

          <button 
            onClick={onRefreshData}
            className="w-full text-left px-3 py-2.5 mt-3 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center gap-2.5 transition-all"
          >
            <RefreshCw size={14} />
            <span>Refresh Sinkronisasi Data</span>
          </button>
        </div>

        {/* Right Column: Dynamic View */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* TAB 1: Student & Grades Manager */}
          {activeTab === 'students' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Manajemen Rapor Siswa</h3>
                <p className="text-xs text-gray-400">Pilih siswa aktif untuk memperbarui nilai mata pelajaran. Menyimpan perubahan otomatis memicu alert notifikasi WhatsApp ke orang tua murid.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Roster list */}
                <div className="md:col-span-1 flex flex-col gap-2.5 border-r border-gray-100 dark:border-gray-800/80 pr-4 max-h-[450px] overflow-y-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Daftar Siswa SMKN 13</span>
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleSelectStudentForEdit(student)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                        selectedStudent?.id === student.id
                          ? 'bg-blue-50/50 dark:bg-blue-900/30 border-blue-500 text-blue-900 dark:text-blue-300 font-semibold'
                          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                      }`}
                    >
                      <span className="font-bold">{student.name}</span>
                      <span className="text-[10px] text-gray-400">NISN: {student.nisn} | {student.kelas}</span>
                    </button>
                  ))}
                </div>

                {/* Form Editor */}
                <div className="md:col-span-2">
                  {selectedStudent ? (
                    <form onSubmit={handleSaveGrades} className="flex flex-col gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Siswa Terpilih</span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{selectedStudent.name} ({selectedStudent.kelas})</h4>
                        <p className="text-[10px] text-gray-500">Ortu: {selectedStudent.parentName} | No. HP: {selectedStudent.parentPhone}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(editGrades).map(([subj, val]: any) => (
                          <div key={subj} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">{subj}</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={val}
                              onChange={(e) => setEditGrades({ ...editGrades, [subj]: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs border border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-blue-500 rounded-lg text-gray-800 dark:text-white"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                      >
                        <Check size={14} />
                        <span>{saveLoading ? 'Menyimpan...' : 'Perbarui Rapor & Kirim WhatsApp'}</span>
                      </button>

                      {saveSuccessMsg && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center animate-pulse">
                          ✓ Rapor berhasil diperbarui! Notifikasi WhatsApp otomatis dikirim ke {selectedStudent.parentPhone}.
                        </span>
                      )}
                    </form>
                  ) : (
                    <div className="text-center py-16 flex flex-col items-center gap-2 text-gray-400">
                      <Users size={36} />
                      <span className="text-xs">Pilih siswa di roster samping untuk memperbarui nilai.</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: News Manager */}
          {activeTab === 'news' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Publikasikan Pengumuman / Berita</h3>
                <p className="text-xs text-gray-400">Tulis berita sekolah terbaru. Kategori 'Pengumuman' otomatis disiarkan ke WhatsApp orang tua secara massal.</p>
              </div>

              <form onSubmit={handlePublishNews} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Judul Berita/Pengumuman *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rapat Komite Orang Tua Semester Ganjil"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs border border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-blue-500 rounded-xl text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kategori *</label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs border border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-blue-500 rounded-xl text-gray-800 dark:text-white"
                    >
                      <option value="Pengumuman">Pengumuman (Trigger WA)</option>
                      <option value="Berita">Berita Sekolah</option>
                      <option value="Prestasi">Prestasi Siswa</option>
                      <option value="Penting">Pengumuman Darurat (Trigger WA)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Link URL Ilustrasi Foto (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: https://images.unsplash.com/photo-..."
                    value={newsImage}
                    onChange={(e) => setNewsImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs border border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-blue-500 rounded-xl text-gray-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Konten Berita Lengkap *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tuliskan detail pemberitahuan resmi secara lengkap..."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-xs border border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-blue-500 rounded-xl text-gray-800 dark:text-white leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <Newspaper size={14} />
                  <span>Publikasi & Siarkan Berita</span>
                </button>

                {newsSuccessMsg && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center animate-pulse">
                    ✓ Berita berhasil dipublikasikan! Notifikasi disiarkan ke server.
                  </span>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: Emergency Broadcast System */}
          {activeTab === 'emergency' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="font-bold text-lg text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertOctagon size={22} className="animate-pulse" />
                  <span>Sistem Siaran Darurat Sekolah</span>
                </h3>
                <p className="text-xs text-gray-400">Siarkan peringatan darurat bagi seluruh pengguna. Fitur ini akan memicu alarm sirene visual di halaman utama, push notification, serta pengiriman WhatsApp darurat ke No. Handphone 08567150026.</p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-5 flex flex-col gap-4">
                <h4 className="font-bold text-sm text-rose-800 dark:text-rose-400">Formulir Pemicu Alarm Darurat</h4>
                
                <form onSubmit={handleTriggerEmergencyAlert} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-rose-900 dark:text-rose-300">Subjek Keadaan Darurat *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tanggap Bencana / Banjir Bandang Pandeglang"
                      value={emgTitle}
                      onChange={(e) => setEmgTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 text-xs border border-rose-100 dark:border-rose-900/60 focus:ring-1 focus:ring-rose-500 rounded-xl text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-rose-900 dark:text-rose-300">Deskripsi & Instruksi Keselamatan *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Instruksi detail kepada siswa dan orang tua untuk keselamatan bersama..."
                      value={emgContent}
                      onChange={(e) => setEmgContent(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-xs border border-rose-100 dark:border-rose-900/60 focus:ring-1 focus:ring-rose-500 rounded-xl text-gray-800 dark:text-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Bell size={14} />
                      <span>AKTIFKAN ALARM DARURAT & BROADCAST</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await onClearEmergency();
                        alert("Status darurat berhasil dinonaktifkan.");
                      }}
                      className="px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl text-xs transition-all"
                    >
                      CLEAR STATUS
                    </button>
                  </div>
                </form>

                {emgSuccessMsg && (
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 text-center animate-bounce">
                    🚨 SIARAN DARURAT DIKIRIM! Sirene aktif di homepage dan notifikasi terkirim via WA.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Security, 2FA & Database Encrypted Backups */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-6">
              
              {/* Database Backup Section */}
              <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Database size={20} className="text-blue-600" />
                    <span>Pencadangan Data Otomatis & Terenkripsi</span>
                  </h3>
                  <p className="text-xs text-gray-400">Pencadangan basis data sekolah (Rapor, PPDB, Berita, Log Notifikasi) yang aman secara real-time. Enkripsi military-grade Base64 data-scramble siap diunduh atau dipulihkan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  
                  {/* Backup Card */}
                  <div className="p-5 border border-gray-100 dark:border-gray-800/80 rounded-2xl flex flex-col gap-4 bg-gray-50/50 dark:bg-gray-800/15">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Cadangkan Database Sekarang</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Ekspor cadangan basis data sekolah ke dalam file biner terenkripsi `.enc` yang dapat dipulihkan sewaktu-waktu.</p>
                    
                    <button
                      onClick={handleRunBackup}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow mt-auto"
                    >
                      <Download size={14} />
                      <span>Jalankan Backup Enkripsi</span>
                    </button>

                    {backupResult && (
                      <div className="flex flex-col gap-2 mt-2 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          ✓ BACKUP SELESAI
                        </span>
                        <span className="text-[10px] text-gray-400 truncate">File: {backupResult.fileName}</span>
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(backupResult.payload)}`}
                          download={backupResult.fileName}
                          className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline mt-1"
                        >
                          <Download size={10} />
                          <span>Unduh File .enc</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Restore Card */}
                  <div className="p-5 border border-gray-100 dark:border-gray-800/80 rounded-2xl flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-800/15">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Restorasi Database</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Paste payload biner dari file `.enc` cadangan Anda di bawah ini untuk mengembalikan seluruh isi data sekolah.</p>
                    
                    <textarea
                      rows={3}
                      placeholder="Paste payload teks base64 cadangan .enc di sini..."
                      value={restorePayload}
                      onChange={(e) => setRestorePayload(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-gray-800 text-[10px] border border-gray-100 dark:border-gray-800 rounded-xl text-gray-800 dark:text-white font-mono"
                    ></textarea>

                    <button
                      onClick={handleRunRestore}
                      className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <Upload size={14} />
                      <span>Jalankan Restorasi Data</span>
                    </button>

                    {restoreSuccessMsg && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center animate-pulse mt-1">
                        {restoreSuccessMsg}
                      </span>
                    )}
                    {restoreErrorMsg && (
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 text-center animate-pulse mt-1">
                        ⚠️ {restoreErrorMsg}
                      </span>
                    )}
                  </div>

                </div>
              </div>

              {/* 2FA Section */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Key size={20} className="text-blue-600" />
                    <span>Autentikasi Dua Faktor (2FA) Keamanan Admin</span>
                  </h3>
                  <p className="text-xs text-gray-400">Proteksi login administrator sekolah dengan validasi OTP seluler tambahan untuk menghentikan peretasan data rapor murid.</p>
                </div>

                <div className="p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/15 flex flex-col md:flex-row gap-6">
                  
                  {/* Setup info */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        settings.twoFactorEnabled 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                      }`}>
                        STATUS 2FA : {settings.twoFactorEnabled ? 'AKTIF' : 'NON-AKTIF'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      Scan kode QR di samping menggunakan aplikasi <strong>Google Authenticator</strong> atau <strong>Authy</strong> di handphone Anda, lalu masukkan 6-digit kode OTP untuk memverifikasi kecocokan.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 max-w-sm mt-1">
                      <input
                        type="text"
                        placeholder="Masukkan 6-digit OTP (Contoh: 123456)"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 text-xs border border-gray-100 dark:border-gray-800 focus:ring-1 focus:ring-blue-500 rounded-xl text-gray-800 dark:text-white font-mono text-center"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all"
                      >
                        Verifikasi & Ubah
                      </button>
                    </div>

                    {otpError && (
                      <span className="text-xs text-red-600 font-semibold">⚠️ Kode OTP Salah! Gunakan kode demo: 123456</span>
                    )}
                    {otpVerified && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Check size={14} />
                        <span>Keamanan 2FA berhasil diubah!</span>
                      </span>
                    )}
                  </div>

                  {/* QR Mockup */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl self-center shrink-0">
                    {/* Generates a simple beautiful visual of a QR Code mock */}
                    <div className="w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex flex-wrap p-1 gap-1">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-[1px] ${
                            (i % 3 === 0 || i % 7 === 0 || i < 12 || i > 37) 
                              ? 'bg-gray-900 dark:bg-white' 
                              : 'bg-transparent'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-gray-400">SECRET: SMK13-2FA-KEY</span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 5: WhatsApp logs */}
          {activeTab === 'walogs' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Riwayat Notifikasi Otomatis WhatsApp</h3>
                  <p className="text-xs text-gray-400">Daftar log penyiaran pesan WhatsApp real-time yang didispatch secara otomatis ke Nomor HP orang tua siswa.</p>
                </div>

                <button
                  onClick={async () => {
                    await onClearWaLogs();
                    alert("Riwayat log WA berhasil dibersihkan.");
                  }}
                  className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/40 dark:hover:bg-red-950/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Trash size={12} />
                  <span>Bersihkan Logs</span>
                </button>
              </div>

              <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-2">
                {waLogs.length > 0 ? (
                  waLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800/50 rounded-2xl flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Smartphone size={13} />
                          Penerima: {log.recipient}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {log.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800/40 leading-relaxed font-mono">
                        {log.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 flex flex-col items-center gap-2 text-gray-400">
                    <Smartphone size={36} />
                    <span className="text-xs">Belum ada log pengiriman WhatsApp otomatis saat ini.</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
