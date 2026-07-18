import React, { useState } from 'react';
import { Search, FileSpreadsheet, FileText, Calendar, TrendingUp, Award, User, BookOpen, Clock, MapPin, CheckCircle, HelpCircle } from 'lucide-react';
import { Student, ExamSchedule, Language } from '../types';
import { translations } from '../translations';

interface AcademicViewProps {
  students: Student[];
  schedules: ExamSchedule[];
  language: Language;
}

export default function AcademicView({ students, schedules, language }: AcademicViewProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'rapor' | 'jadwal' | 'analitik'>('rapor');
  const [searchNisn, setSearchNisn] = useState('');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchGrades = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSearchedStudent(null);

    if (!searchNisn.trim()) {
      setErrorMsg(t.nisnRequired);
      return;
    }

    const student = students.find(s => s.nisn === searchNisn.trim());
    if (student) {
      setSearchedStudent(student);
    } else {
      setErrorMsg(t.nisnNotFound);
    }
  };

  // EXPORT EXCEL (CSV Generation format)
  const handleExportExcel = () => {
    if (!searchedStudent) return;
    
    const headers = ["NISN", "Nama", "Kelas", "Jurusan", "Mata Pelajaran", "Nilai", "Kehadiran", "Nama Orang Tua"];
    const rows = Object.entries(searchedStudent.grades).map(([subj, val]) => [
      searchedStudent.nisn,
      searchedStudent.name,
      searchedStudent.kelas,
      searchedStudent.jurusan,
      subj,
      val,
      `${searchedStudent.attendance}%`,
      searchedStudent.parentName
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rapor_SMK13_${searchedStudent.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EXPORT PDF (HTML Print format triggers browser-print with tailored clean layout)
  const handleExportPdf = () => {
    if (!searchedStudent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to export PDF.");
      return;
    }

    const gradesHtml = Object.entries(searchedStudent.grades)
      .map(([subj, val]) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${subj}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${val}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${(val as number) >= 75 ? '<span style="color: green;">LULUS</span>' : '<span style="color: red;">REMIDIAL</span>'}</td>
        </tr>
      `).join('');

    const total = (Object.values(searchedStudent.grades) as number[]).reduce((a: number, b: number) => a + b, 0);
    const avg = (total / Object.keys(searchedStudent.grades).length).toFixed(1);

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Rapor Hasil Belajar - SMK Negeri 13 Pandeglang</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; color: #1e3a8a; }
            .header p { margin: 5px 0 0 0; font-size: 12px; color: #555; }
            .student-info { margin-bottom: 30px; width: 100%; border-collapse: collapse; }
            .student-info td { padding: 5px 10px; }
            .student-info td.label { font-weight: bold; width: 150px; }
            .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .grades-table th { background-color: #f3f4f6; padding: 12px; border: 1px solid #ddd; text-align: left; }
            .grades-table td { border: 1px solid #ddd; }
            .summary-box { background-color: #f9fafb; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .footer-sig { margin-top: 50px; float: right; text-align: center; width: 250px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SMK NEGERI 13 PANDEGLANG</h1>
            <p>Jl. Raya Pir V Kp. Koranji, Desa Pasirgadung, Kec. Patia, Kabupaten Pandeglang, Banten 42265</p>
            <p>Email: info@smkn13pandeglang.sch.id | Telp: (0253) 401313</p>
          </div>
          
          <h2 style="text-align: center; margin-bottom: 20px;">KARTU HASIL STUDI (RAPOR)</h2>
          
          <table class="student-info">
            <tr>
              <td class="label">Nama Siswa</td><td>: ${searchedStudent.name}</td>
              <td class="label">Kelas</td><td>: ${searchedStudent.kelas}</td>
            </tr>
            <tr>
              <td class="label">NISN</td><td>: ${searchedStudent.nisn}</td>
              <td class="label">Jurusan</td><td>: ${searchedStudent.jurusan}</td>
            </tr>
            <tr>
              <td class="label">Nama Orang Tua</td><td>: ${searchedStudent.parentName}</td>
              <td class="label">Kehadiran</td><td>: ${searchedStudent.attendance}%</td>
            </tr>
          </table>

          <table class="grades-table">
            <thead>
              <tr>
                <th>Mata Pelajaran</th>
                <th style="text-align: center; width: 100px;">Nilai Akhir</th>
                <th style="text-align: center; width: 150px;">Kriteria Kelulusan</th>
              </tr>
            </thead>
            <tbody>
              ${gradesHtml}
            </tbody>
          </table>

          <div class="summary-box">
            <p><strong>Total Nilai:</strong> ${total}</p>
            <p><strong>Rata-Rata Nilai (GPA):</strong> ${avg}</p>
            <p><strong>Predikat Kelulusan:</strong> ${parseFloat(avg) >= 80 ? 'SANGAT MEMUASKAN' : 'MEMUASKAN'}</p>
          </div>

          <div class="footer-sig">
            <p>Pandeglang, ${new Date().toLocaleDateString('id-ID')}</p>
            <p>Kepala Sekolah SMKN 13</p>
            <br><br><br>
            <p><strong>H.M. Wahyu Surya Sukma Sejati, ST., M.MT</strong></p>
            <p>NIP. -</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Perform Calculations for SVG Charts
  const totalStudents = students.length;
  const avgAttendance = parseFloat((students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents).toFixed(1));
  
  // Average grades per subject
  const subjectAverages: { [key: string]: number } = {};
  const subjectCounts: { [key: string]: number } = {};
  students.forEach(s => {
    Object.entries(s.grades).forEach(([subj, val]) => {
      subjectAverages[subj] = (subjectAverages[subj] || 0) + val;
      subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
    });
  });

  const chartData = Object.keys(subjectAverages).map(subj => ({
    subject: subj,
    average: parseFloat((subjectAverages[subj] / subjectCounts[subj]).toFixed(1))
  }));

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 w-full max-w-md self-center">
        <button
          onClick={() => setActiveTab('rapor')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'rapor'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {t.gradesTab}
        </button>
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'jadwal'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {t.schedulesTab}
        </button>
        <button
          onClick={() => setActiveTab('analitik')}
          className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'analitik'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {t.analyticsTab}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        
        {/* TAB 1: Rapor Siswa Checking */}
        {activeTab === 'rapor' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award size={20} className="text-blue-600" />
                <span>Kartu Rapor Hasil Studi Digital</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Silakan masukkan NISN (Nomor Induk Siswa Nasional) yang terdaftar untuk melihat kartu hasil studi secara real-time. Hubungi admin sekolah jika data tidak sesuai.
              </p>
            </div>

            <form onSubmit={handleSearchGrades} className="flex flex-col sm:flex-row gap-3 max-w-lg mt-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Contoh: 0081234561"
                  value={searchNisn}
                  onChange={(e) => setSearchNisn(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl text-gray-800 dark:text-white transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                {t.findGrades}
              </button>
            </form>

            {errorMsg && (
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 animate-pulse">
                ⚠️ {errorMsg}
              </span>
            )}

            {searchedStudent && (
              <div className="mt-4 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-800/10 flex flex-col gap-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-md">
                        {searchedStudent.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        NISN: {searchedStudent.nisn} | Kelas {searchedStudent.kelas} ({searchedStudent.jurusan})
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportExcel}
                      className="px-3.5 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <FileSpreadsheet size={14} className="text-emerald-500" />
                      <span>{t.exportExcel}</span>
                    </button>
                    <button
                      onClick={handleExportPdf}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <FileText size={14} />
                      <span>{t.exportPdf}</span>
                    </button>
                  </div>
                </div>

                {/* Grade breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(searchedStudent.grades).map(([subj, val]) => {
                    const isPassing = (val as number) >= 75;
                    return (
                      <div
                        key={subj}
                        className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{subj}</span>
                          <span className="text-[10px] text-gray-400">KKM Nilai : 75</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-md font-extrabold ${isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {val}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isPassing ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/40 text-rose-600'}`}>
                            {isPassing ? 'LULUS' : 'REMIDIAL'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick stats and comments */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200">Rasio Kehadiran</h5>
                      <p className="text-xs text-gray-400">
                        {searchedStudent.attendance}% Kehadiran Terhitung semester ini.
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-100/50 dark:border-blue-900/40 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                      Catatan Wali Kelas
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {((Object.values(searchedStudent.grades) as number[]).reduce((a: number, b: number) => a + b, 0) / Object.keys(searchedStudent.grades).length) >= 85
                        ? "Sangat baik dalam memahami materi produktif kejuruan. Pertahankan prestasi dan bantu teman sekelasmu."
                        : "Siswa menunjukkan minat belajar yang baik, namun disarankan meningkatkan keaktifan dalam praktikum pemrograman."}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: Jadwal Ujian */}
        {activeTab === 'jadwal' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                <span>Jadwal Penilaian & Ujian Sekolah</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Jadwal Ujian Akhir Semester (UAS) ganjil terintegrasi digital. Ujian diselenggarakan menggunakan aplikasi internal sekolah yang dapat diakses secara offline di lab komputer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="p-5 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <BookOpen size={14} />
                      {sch.subject}
                    </span>
                    <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                      {sch.kelas}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-gray-400 shrink-0" />
                      <span>Hari/Tanggal : {sch.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-gray-400 shrink-0" />
                      <span>Waktu Ujian : {sch.time} WIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-gray-400 shrink-0" />
                      <span>Lokasi Ruang : {sch.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Analytics Dashboard */}
        {activeTab === 'analitik' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                <span>Analitik Performa Akademik Siswa</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Pemantauan rata-rata nilai mata pelajaran kejuruan (ATPH, TJKT, & TSM) serta persentase kehadiran siswa se-kabupaten secara real-time.
              </p>
            </div>

            {/* Stats Overview banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 flex flex-col gap-1.5 shadow">
                <span className="text-xs font-semibold text-blue-100">Total Siswa Terpantau</span>
                <span className="text-3xl font-extrabold">{totalStudents} Siswa</span>
                <span className="text-[10px] text-blue-100 mt-1">Aktif semester ini</span>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 flex flex-col gap-1.5 shadow">
                <span className="text-xs font-semibold text-emerald-100">Kehadiran Rata-Rata</span>
                <span className="text-3xl font-extrabold">{avgAttendance}%</span>
                <span className="text-[10px] text-emerald-100 mt-1">Sangat Disiplin (Target &gt;95%)</span>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-5 flex flex-col gap-1.5 shadow">
                <span className="text-xs font-semibold text-indigo-100">Rata-Rata Kelulusan</span>
                <span className="text-3xl font-extrabold">85.4 / 100</span>
                <span className="text-[10px] text-indigo-100 mt-1">92% Diatas Standar KKM</span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="mt-4 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                Rata-rata Nilai per Mata Pelajaran
              </h4>

              <div className="flex flex-col gap-5 mt-2">
                {chartData.map((item) => (
                  <div key={item.subject} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                      <span>{item.subject}</span>
                      <span className="font-bold">{item.average} / 100</span>
                    </div>
                    {/* Progress indicator */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3.5 overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.average}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
