import React, { useState } from 'react';
import { UserCheck, CheckCircle2, Search, Smartphone, Send, Landmark, HelpCircle, FileText } from 'lucide-react';
import { PPDBRegistration, Language } from '../types';
import { translations } from '../translations';

interface PpdbViewProps {
  ppdbList: PPDBRegistration[];
  onRegisterSubmit: (data: {
    fullName: string;
    nisn: string;
    email: string;
    phone: string;
    selectedJurusan: string;
    sourceSchool: string;
  }) => Promise<void>;
  language: Language;
}

export default function PpdbView({ ppdbList, onRegisterSubmit, language }: PpdbViewProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'daftar' | 'status'>('daftar');
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [nisn, setNisn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('08567150026'); // Pre-populated with requested targeted mobile number
  const [selectedJurusan, setSelectedJurusan] = useState('ATPH');
  const [sourceSchool, setSourceSchool] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Status Tracker State
  const [trackNisn, setTrackNisn] = useState('');
  const [trackResult, setTrackResult] = useState<PPDBRegistration | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nisn.trim() || !sourceSchool.trim()) {
      alert("Harap lengkapi semua isian bertanda bintang (*).");
      return;
    }

    setSubmitting(true);
    try {
      await onRegisterSubmit({
        fullName,
        nisn,
        email,
        phone,
        selectedJurusan,
        sourceSchool
      });
      setIsSuccess(true);
      // Clear form
      setFullName('');
      setNisn('');
      setEmail('');
      setSourceSchool('');
    } catch (err) {
      console.error(err);
      alert("Gagal mengirimkan registrasi. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackSearched(true);
    setTrackResult(null);

    if (!trackNisn.trim()) return;

    const result = ppdbList.find(item => item.nisn === trackNisn.trim());
    if (result) {
      setTrackResult(result);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      
      {/* Header section */}
      <div className="text-center flex flex-col gap-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {t.registrationPortal}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Penerimaan Peserta Didik Baru (PPDB) SMK Negeri 13 Pandeglang. Proses pendaftaran mudah, transparan, dan terintegrasi notifikasi WhatsApp instan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 w-full max-w-sm self-center">
        <button
          onClick={() => setActiveTab('daftar')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'daftar'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
        >
          Formulir PPDB
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'status'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
        >
          Pantau Kelulusan
        </button>
      </div>

      {/* Forms Area */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        
        {/* TAB 1: Registration Form */}
        {activeTab === 'daftar' && (
          <div className="flex flex-col gap-6">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    <span>{t.registerFormTitle}</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.registerFormDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Nomor NISN Calon Siswa (10 Digit) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 0098765431"
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t.sourceSchool} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: SMPN 1 Pandeglang"
                      value={sourceSchool}
                      onChange={(e) => setSourceSchool(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t.email} (Opsional)
                    </label>
                    <input
                      type="email"
                      placeholder="Contoh: budi@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <span>{t.parentPhone} *</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                        WhatsApp Active
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 08567150026"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {t.chooseMajor} *
                    </label>
                    <select
                      value={selectedJurusan}
                      onChange={(e) => setSelectedJurusan(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                    >
                      <option value="ATPH">Agribisnis Tanaman Pangan dan Hortikultura (ATPH)</option>
                      <option value="TJKT">Teknik Jaringan Komputer dan Telekomunikasi (TJKT)</option>
                      <option value="TSM">Teknik Sepeda Motor (TSM)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/40 p-4 rounded-2xl flex items-start gap-3 mt-2">
                  <Smartphone className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    Sistem akan mengirimkan pesan WhatsApp otomatis secara real-time ke nomor handphone orang tua <strong>{phone}</strong> untuk memberikan bukti tanda pendaftaran digital Anda.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2 shadow shadow-blue-500/10"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Mengirim data...' : t.submitRegistration}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-10 flex flex-col items-center gap-5 max-w-md mx-auto animate-fade-in">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
                  <CheckCircle2 size={54} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pendaftaran Berhasil Terkirim!</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Terima kasih telah mendaftar di SMK Negeri 13 Pandeglang. Kami telah mengirimkan struk bukti pendaftaran otomatis via WhatsApp ke nomor HP orang tua Anda.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl transition-all"
                  >
                    Daftar Kembali
                  </button>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setActiveTab('status');
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow shadow-blue-500/10"
                  >
                    Pantau Status Pendaftaran
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Status Admission Checking */}
        {activeTab === 'status' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck size={20} className="text-blue-600" />
                <span>{t.trackStatus}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Silakan masukkan NISN calon siswa yang didaftarkan pada formulir PPDB online untuk melacak tahap seleksi kelulusan Anda secara transparan.
              </p>
            </div>

            <form onSubmit={handleTrackStatus} className="flex flex-col sm:flex-row gap-3 max-w-lg mt-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder={t.searchRegNisn}
                  value={trackNisn}
                  onChange={(e) => setTrackNisn(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                {t.checkStatus}
              </button>
            </form>

            {trackSearched && (
              <div className="mt-4">
                {trackResult ? (
                  <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-800/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-md">
                          {trackResult.fullName}
                        </h4>
                        <span className="text-xs text-gray-400">NISN: {trackResult.nisn} | Asal Sekolah: {trackResult.sourceSchool}</span>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        trackResult.status === 'Diproses' 
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' 
                          : trackResult.status === 'Diterima'
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                      }`}>
                        {trackResult.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Pilihan Jurusan :</span>
                        <span className="font-bold">{trackResult.selectedJurusan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal Registrasi :</span>
                        <span>{trackResult.date}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl mt-2 flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Keterangan Panitia PPDB:</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {trackResult.status === 'Diproses' 
                          ? "Data berkas pendaftaran Anda telah lengkap. Panitia sedang melakukan verifikasi keaslian NISN dan nilai rapor sekolah asal. Informasi kelulusan final akan diumumkan segera." 
                          : trackResult.status === 'Diterima'
                          ? "Selamat! Anda dinyatakan LULUS seleksi berkas PPDB SMK Negeri 13 Pandeglang. Silakan datangi bagian Tata Usaha sekolah pada jam kerja untuk melakukan daftar ulang."
                          : "Mohon maaf, Anda belum lulus kualifikasi PPDB SMKN 13 Pandeglang tahun ajaran ini."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/40 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-3">
                    <span className="font-bold text-sm">⚠️ Data pendaftaran dengan NISN tersebut tidak ditemukan. Mohon pastikan angka NISN yang Anda masukkan sudah benar atau isi formulir pendaftaran kembali.</span>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
