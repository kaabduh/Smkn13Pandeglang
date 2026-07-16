import React from 'react';
import { BookOpen, Globe, Sun, Moon, Wifi, WifiOff, Shield, Menu, X, Code, Landmark } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isOnline: boolean;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  onShow2faPrompt: () => void;
}

export default function Header({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  isOnline,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  onShow2faPrompt
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'academic', label: t.navAcademic },
    { id: 'ppdb', label: t.navPpdb },
    { id: 'dev', label: t.navDev },
  ];

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminLoggedIn(false);
      setCurrentView('home');
    } else {
      onShow2faPrompt();
    }
    setMobileMenuOpen(false);
  };

  const selectView = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-200">
      {/* Network Status Bar */}
      <div className={`w-full py-1 text-center text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-all duration-300 ${
        isOnline 
          ? 'bg-emerald-600 dark:bg-emerald-700 h-6' 
          : 'bg-amber-600 dark:bg-amber-700 h-6 animate-pulse'
      }`}>
        {isOnline ? (
          <>
            <Wifi size={13} />
            <span>{t.onlineMode}</span>
          </>
        ) : (
          <>
            <WifiOff size={13} />
            <span>{t.offlineMode} - Menggunakan Cache Lokal (Sinkronisasi Otomatis Terjadwal)</span>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => selectView('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl select-none shadow-sm">
              13
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                SMK NEGERI 13 PANDEGLANG
              </h1>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">
                Sistem Informasi Akademik Terpadu
              </p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                SMKN 13
              </h1>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                Pandeglang
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => selectView(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleAdminClick}
              className={`ml-1 px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
                currentView === 'admin'
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <Shield size={14} className={isAdminLoggedIn ? 'text-emerald-500' : ''} />
              <span>{isAdminLoggedIn ? 'Dashboard Admin' : 'Portal Admin'}</span>
            </button>
          </nav>

          {/* Controls (Theme, Lang, Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === 'id'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 flex flex-col gap-1 transition-all duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => selectView(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleAdminClick}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              currentView === 'admin'
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
            }`}
          >
            <Shield size={16} className={isAdminLoggedIn ? 'text-emerald-500' : ''} />
            <span>{isAdminLoggedIn ? 'Dashboard Admin' : 'Portal Admin'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
