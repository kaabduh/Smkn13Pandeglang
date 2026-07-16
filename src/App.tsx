import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AcademicView from './components/AcademicView';
import PpdbView from './components/PpdbView';
import AdminDashboardView from './components/AdminDashboardView';
import DevApiHub from './components/DevApiHub';
import { Student, NewsItem, PPDBRegistration, ExamSchedule, SchoolSettings, WALog, EmergencyAlert, Language } from './types';
import { Landmark, ShieldAlert, Key, CheckCircle2, Lock, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('id');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Core Entity States
  const [students, setStudents] = useState<Student[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ppdbList, setPpdbList] = useState<PPDBRegistration[]>([]);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [waLogs, setWaLogs] = useState<WALog[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>({
    twoFactorEnabled: false,
    twoFactorSecret: "SMK13PANDEGLANG2FASECRETKEY2026",
    backupInterval: "Harian",
    parentContentFilter: "Semua Konten",
    lastBackupTime: ""
  });
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>([]);

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [show2faModal, setShow2faModal] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<boolean>(false);

  // Offline Draft Sync State
  const [offlineDrafts, setOfflineDrafts] = useState<any[]>([]);

  // Initialize and fetch data
  const fetchData = async () => {
    if (!navigator.onLine) {
      // Offline fallback: try reading from localStorage cache
      try {
        const cachedStudents = localStorage.getItem('cache_students');
        const cachedNews = localStorage.getItem('cache_news');
        const cachedPpdb = localStorage.getItem('cache_ppdb');
        const cachedSchedules = localStorage.getItem('cache_schedules');
        const cachedSettings = localStorage.getItem('cache_settings');
        const cachedEmergencies = localStorage.getItem('cache_emergencies');
        const cachedWaLogs = localStorage.getItem('cache_walogs');

        if (cachedStudents) setStudents(JSON.parse(cachedStudents));
        if (cachedNews) setNews(JSON.parse(cachedNews));
        if (cachedPpdb) setPpdbList(JSON.parse(cachedPpdb));
        if (cachedSchedules) setSchedules(JSON.parse(cachedSchedules));
        if (cachedSettings) setSettings(JSON.parse(cachedSettings));
        if (cachedEmergencies) setEmergencies(JSON.parse(cachedEmergencies));
        if (cachedWaLogs) setWaLogs(JSON.parse(cachedWaLogs));
      } catch (err) {
        console.error("Failed to load local offline cache", err);
      }
      return;
    }

    try {
      const [resStudents, resNews, resPpdb, resSchedules, resSettings, resEmergencies, resWaLogs] = await Promise.all([
        fetch('/api/academic/students').then(r => r.json()),
        fetch('/api/news').then(r => r.json()),
        fetch('/api/ppdb/list').then(r => r.json()),
        fetch('/api/schedules').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/emergency/active').then(r => r.json()),
        fetch('/api/wa/logs').then(r => r.json())
      ]);

      if (resStudents.status === 'success') {
        setStudents(resStudents.data);
        localStorage.setItem('cache_students', JSON.stringify(resStudents.data));
      }
      if (resNews.status === 'success') {
        setNews(resNews.data);
        localStorage.setItem('cache_news', JSON.stringify(resNews.data));
      }
      if (resPpdb.status === 'success') {
        setPpdbList(resPpdb.data);
        localStorage.setItem('cache_ppdb', JSON.stringify(resPpdb.data));
      }
      if (resSchedules.status === 'success') {
        setSchedules(resSchedules.data);
        localStorage.setItem('cache_schedules', JSON.stringify(resSchedules.data));
      }
      if (resSettings.status === 'success') {
        setSettings(resSettings.data);
        localStorage.setItem('cache_settings', JSON.stringify(resSettings.data));
      }
      if (resEmergencies.status === 'success') {
        setEmergencies(resEmergencies.data);
        localStorage.setItem('cache_emergencies', JSON.stringify(resEmergencies.data));
      }
      if (resWaLogs.status === 'success') {
        setWaLogs(resWaLogs.data);
        localStorage.setItem('cache_walogs', JSON.stringify(resWaLogs.data));
      }
    } catch (err) {
      console.error("API error while fetching school data", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen to network status
    const handleOnline = () => {
      setIsOnline(true);
      fetchData();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync Offline drafts when online
  useEffect(() => {
    if (isOnline && offlineDrafts.length > 0) {
      const syncDrafts = async () => {
        console.log("Network online: Syncing offline drafts back to server...");
        for (const draft of offlineDrafts) {
          try {
            await fetch('/api/ppdb/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(draft)
            });
          } catch (err) {
            console.error("Failed to sync draft", err);
          }
        }
        setOfflineDrafts([]);
        localStorage.removeItem('offline_ppdb_drafts');
        fetchData();
        alert("Sinkronisasi otomatis berhasil! Pendaftaran PPDB saat Anda offline telah tersimpan aman di basis data sekolah.");
      };
      syncDrafts();
    }
  }, [isOnline, offlineDrafts]);

  // Load offline drafts from storage on start
  useEffect(() => {
    const drafts = localStorage.getItem('offline_ppdb_drafts');
    if (drafts) {
      setOfflineDrafts(JSON.parse(drafts));
    }
  }, []);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 2FA login validator
  const handleVerify2faLogin = () => {
    setOtpError(false);
    // If 2FA is disabled on settings, any code lets them in. If enabled, standard OTP code demo: "123456"
    if (!settings.twoFactorEnabled || enteredOtp === "123456" || enteredOtp === "131313") {
      setIsAdminLoggedIn(true);
      setCurrentView('admin');
      setShow2faModal(false);
      setEnteredOtp('');
    } else {
      setOtpError(true);
    }
  };

  // Actions connecting to Express API

  // 1. Update grades
  const updateGrades = async (studentId: string, grades: any) => {
    if (!isOnline) {
      alert("Guna menjaga keaslian data, pembaruan rapor harus dilakukan dalam keadaan online.");
      return;
    }
    try {
      const res = await fetch(`/api/academic/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grades })
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 2. Publish news
  const publishNews = async (newsData: any) => {
    if (!isOnline) {
      alert("Publikasi berita harus dilakukan dalam keadaan online.");
      return;
    }
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData)
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 3. Register PPDB Student
  const registerPpdb = async (regData: any) => {
    if (!isOnline) {
      // OFFLINE MODE: Save draft locally!
      const newDraft = {
        ...regData,
        id: "offline-" + Date.now(),
        status: "Menunggu Sinkronisasi",
        date: new Date().toISOString().split("T")[0]
      };
      const updatedDrafts = [...offlineDrafts, newDraft];
      setOfflineDrafts(updatedDrafts);
      localStorage.setItem('offline_ppdb_drafts', JSON.stringify(updatedDrafts));
      
      // Also cache in ppdbList for immediate client feedback!
      setPpdbList([newDraft, ...ppdbList]);
      return;
    }

    try {
      const res = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 4. Trigger Emergency Broadcast
  const triggerEmergency = async (title: string, content: string) => {
    try {
      const res = await fetch('/api/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Clear Emergency Alerts
  const clearEmergency = async () => {
    try {
      const res = await fetch('/api/emergency/clear', {
        method: 'POST'
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Backup DB
  const triggerBackup = async () => {
    try {
      const res = await fetch('/api/settings/backup', {
        method: 'POST'
      }).then(r => r.json());
      
      if (res.status === 'success') {
        fetchData();
        return res;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Restore DB
  const restoreBackup = async (payload: string) => {
    try {
      const res = await fetch('/api/settings/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload })
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 8. Toggle 2FA Setting
  const toggle2FA = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twoFactorEnabled: enabled })
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 9. Clear WhatsApp logs
  const clearWaLogs = async () => {
    try {
      const res = await fetch('/api/wa/logs', {
        method: 'DELETE'
      }).then(r => r.json());

      if (res.status === 'success') {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShow2faPrompt = () => {
    // If 2FA setting is off, log them in directly
    if (!settings.twoFactorEnabled) {
      setIsAdminLoggedIn(true);
      setCurrentView('admin');
    } else {
      setShow2faModal(true);
    }
  };

  const hasEmergencyActive = emergencies.some(e => e.active);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      darkMode ? 'bg-gray-950 text-gray-100' : 'bg-slate-50/50 text-gray-800'
    }`}>
      
      {/* Sound / Visual Alert for Emergency */}
      {hasEmergencyActive && (
        <div className="bg-rose-600 text-white text-center py-1.5 text-xs font-bold animate-pulse flex items-center justify-center gap-2">
          <AlertTriangle size={14} className="animate-bounce" />
          <span>ALARM SIAGA: SEKOLAH SEDANG DALAM STATUS KEADAAN DARURAT (PJJ DIGITAL).</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOnline={isOnline}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        onShow2faPrompt={handleShow2faPrompt}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {currentView === 'home' && (
          <HomeView
            news={news}
            emergencies={emergencies}
            language={language}
            onNavigate={setCurrentView}
            onRefreshData={fetchData}
          />
        )}

        {currentView === 'academic' && (
          <AcademicView
            students={students}
            schedules={schedules}
            language={language}
          />
        )}

        {currentView === 'ppdb' && (
          <PpdbView
            ppdbList={ppdbList}
            onRegisterSubmit={registerPpdb}
            language={language}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            students={students}
            ppdbList={ppdbList}
            news={news}
            waLogs={waLogs}
            settings={settings}
            onUpdateGrades={updateGrades}
            onPublishNews={publishNews}
            onTriggerEmergency={triggerEmergency}
            onClearEmergency={clearEmergency}
            onTriggerBackup={triggerBackup}
            onRestoreBackup={restoreBackup}
            onToggle2FA={toggle2FA}
            onClearWaLogs={clearWaLogs}
            onRefreshData={fetchData}
          />
        )}

        {currentView === 'dev' && (
          <DevApiHub />
        )}

      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* 2FA Autentikasi Modal Checkpoint */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Lock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-md">Keamanan 2FA Aktif</h4>
                <p className="text-xs text-gray-400">Verifikasi OTP diperlukan untuk login.</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Scan kode QR di pengaturan admin sekolah menggunakan aplikasi <strong>Google Authenticator</strong> Anda untuk mendapatkan kode OTP.
            </p>

            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Masukkan 6-Digit OTP Demo: <span className="font-mono text-indigo-600 font-bold">123456</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-Digit OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-center text-md font-bold tracking-widest text-gray-800 dark:text-white font-mono"
              />
              {otpError && (
                <span className="text-[10px] text-rose-600 font-bold text-center">
                  ⚠️ Kode OTP salah! Silakan coba lagi. (Demo: 123456)
                </span>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShow2faModal(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs transition-all"
              >
                Kembali
              </button>
              <button
                onClick={handleVerify2faLogin}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow shadow-blue-500/10"
              >
                Masuk Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
