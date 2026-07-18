import React from 'react';
import { Landmark, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: School Identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl select-none shadow-sm">
                13
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-tight leading-none">
                  SMK Negeri 13 Pandeglang
                </h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">
                  Sistem Informasi Akademik Terpadu
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {t.schoolSlogan}. Menyelenggarakan pendidikan kejuruan yang inovatif untuk melahirkan talenta digital berkualitas global.
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-md font-semibold tracking-wide">Hubungi Kami</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-blue-500 shrink-0 mt-1" />
                <span>Jl. Raya Pir V Kp. Koranji, Desa Pasirgadung, Kec. Patia, Kabupaten Pandeglang, Banten 42265</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-blue-500 shrink-0" />
                <span>(0253) 401313 / 08567150026 (WA Admin)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <span>info@smkn13pandeglang.sch.id</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Security & Backup status */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-md font-semibold tracking-wide">Sistem & Keamanan</h3>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck size={14} />
                <span>ENKRIPSI END-TO-END AKTIF</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Portal ini dilengkapi dengan pencadangan cloud otomatis terenkripsi dan sistem autentikasi 2FA guna menjamin privasi dan keamanan data rapor serta biodata siswa.
              </p>
              {/* Anonymous usage analytics badge */}
              <div className="border-t border-gray-700 pt-2 flex items-center justify-between text-[10px] text-gray-500">
                <span>Analitik Penggunaan Anonim</span>
                <span className="bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded font-mono">AKTIF (ANONIM)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 SMK Negeri 13 Pandeglang. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">Panduan Orang Tua</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
