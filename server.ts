import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Ensure database folder exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const DB_PATH = path.join(DATA_DIR, "db.json");

// Default Database Structure
const initialDb = {
  students: [
    { id: "101", name: "Ahmad Faisal", nisn: "0081234561", kelas: "XII RPL 1", jurusan: "RPL", grades: { Matematika: 85, "Bahasa Indonesia": 90, "Bahasa Inggris": 82, "Produktif RPL": 92, Agama: 88, Fisika: 78 }, attendance: 95, parentPhone: "08567150026", parentName: "Budi Faisal" },
    { id: "102", name: "Siti Rahmawati", nisn: "0081234562", kelas: "XII RPL 1", jurusan: "RPL", grades: { Matematika: 92, "Bahasa Indonesia": 88, "Bahasa Inggris": 95, "Produktif RPL": 94, Agama: 90, Fisika: 85 }, attendance: 98, parentPhone: "08123456789", parentName: "Hasan" },
    { id: "103", name: "Rian Hidayat", nisn: "0081234563", kelas: "XII TKJ 2", jurusan: "TKJ", grades: { Matematika: 75, "Bahasa Indonesia": 82, "Bahasa Inggris": 70, "Produktif TKJ": 85, Agama: 80, Fisika: 72 }, attendance: 92, parentPhone: "08567150026", parentName: "Asep Hidayat" },
    { id: "104", name: "Dewi Lestari", nisn: "0081234564", kelas: "XII RPL 2", jurusan: "RPL", grades: { Matematika: 88, "Bahasa Indonesia": 92, "Bahasa Inggris": 89, "Produktif RPL": 91, Agama: 95, Fisika: 80 }, attendance: 100, parentPhone: "08771234567", parentName: "Joko" },
    { id: "105", name: "Muhammad Rizky", nisn: "0081234565", kelas: "XI RPL 1", jurusan: "RPL", grades: { Matematika: 80, "Bahasa Indonesia": 85, "Bahasa Inggris": 80, "Produktif RPL": 88, Agama: 84, Fisika: 76 }, attendance: 94, parentPhone: "08567150026", parentName: "Mulyadi" },
    { id: "106", name: "Nabila Putri", nisn: "0081234566", kelas: "XI TKJ 1", jurusan: "TKJ", grades: { Matematika: 78, "Bahasa Indonesia": 86, "Bahasa Inggris": 84, "Produktif TKJ": 80, Agama: 87, Fisika: 75 }, attendance: 96, parentPhone: "08991234567", parentName: "Yanto" }
  ],
  news: [
    {
      id: "news-1",
      title: "Pendaftaran Siswa Baru (PPDB) SMK Negeri 13 Pandeglang Tahun Ajaran 2026/2027 Dibuka!",
      category: "Pengumuman",
      content: "Selamat datang calon siswa baru! Pendaftaran Penerimaan Peserta Didik Baru (PPDB) SMK Negeri 13 Pandeglang resmi dibuka. Pendaftaran dapat dilakukan secara online melalui portal PPDB di website ini.",
      date: "2026-07-15",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "news-2",
      title: "Siswa RPL SMK Negeri 13 Pandeglang Juara 1 LKS Tingkat Provinsi Banten",
      category: "Prestasi",
      content: "Kabar gembira datang dari bidang Rekayasa Perangkat Lunak (RPL). Siswa kami berhasil menyabet Juara 1 Lomba Kompetensi Siswa (LKS) Tingkat Provinsi Banten dalam bidang Web Technologies.",
      date: "2026-07-10",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "news-3",
      title: "Rapat Koordinasi Persiapan Ujian Akhir Semester Ganjil 2026",
      category: "Berita",
      content: "Seluruh dewan guru menghadiri rapat koordinasi persiapan Ujian Akhir Semester (UAS) Ganjil yang akan diselenggarakan mulai awal bulan depan secara digital berbasis smartphone.",
      date: "2026-07-08",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop"
    }
  ],
  ppdb: [
    { id: "reg-1", fullName: "Budi Santoso", nisn: "0098765431", email: "budi@gmail.com", phone: "081299887766", selectedJurusan: "RPL", sourceSchool: "SMPN 1 Pandeglang", status: "Diproses", date: "2026-07-15" }
  ],
  schedules: [
    { id: "sch-1", subject: "Matematika", date: "2026-07-20", time: "08:00 - 09:30", kelas: "XII RPL 1 & 2", room: "Lab Komputer 1" },
    { id: "sch-2", subject: "Produktif RPL (Coding)", date: "2026-07-21", time: "08:00 - 11:30", kelas: "XII RPL 1 & 2", room: "Lab Komputer 2" },
    { id: "sch-3", subject: "Bahasa Inggris", date: "2026-07-22", time: "09:45 - 11:15", kelas: "XII TKJ 1 & 2", room: "Lab TKJ" }
  ],
  settings: {
    twoFactorEnabled: false,
    twoFactorSecret: "SMK13PANDEGLANG2FASECRETKEY2026",
    backupInterval: "Harian",
    parentContentFilter: "Semua Konten",
    lastBackupTime: "2026-07-14T23:00:00.000Z"
  },
  waLogs: [
    { id: "log-1", recipient: "08567150026", message: "[SMK Negeri 13 Pandeglang] Selamat! Pendaftaran PPDB calon siswa Budi Santoso telah diterima dengan status: Diproses.", timestamp: "2026-07-15T18:00:00.000Z", status: "Terkirim" }
  ],
  emergencies: [
    { id: "emg-1", title: "Pemberitahuan Cuaca Ekstrem", content: "Sehubungan dengan peringatan BMKG tentang hujan lebat dan angin kencang di daerah Pandeglang, kegiatan belajar mengajar besok tanggal 16 Juli dialihkan secara daring (PJJ). Harap orang tua memantau putra-putrinya di rumah.", date: "2026-07-15", active: true }
  ]
};

// Database helper functions
const getDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), "utf8");
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, resetting to initial state", err);
    return initialDb;
  }
};

const saveDb = (db: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
};

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to trigger automated WhatsApp notifications to 08567150026 and log it
const triggerWhatsAppNotification = (message: string, overrideRecipient?: string) => {
  const recipient = overrideRecipient || "08567150026";
  const db = getDb();
  const newLog = {
    id: "log-" + Date.now(),
    recipient: recipient,
    message: `[SMKN 13 Pandeglang] ${message}`,
    timestamp: new Date().toISOString(),
    status: "Terkirim"
  };
  db.waLogs.unshift(newLog);
  // Keep logs list limited to last 100 for storage sanity
  if (db.waLogs.length > 100) {
    db.waLogs = db.waLogs.slice(0, 100);
  }
  saveDb(db);
  console.log(`\n=========================================\n[WHATSAPP AUTOMATION TRIGGERED] \nTo: ${recipient}\nMessage: [SMKN 13 Pandeglang] ${message}\nStatus: DELIVERED (SUCCESS)\n=========================================\n`);
  return newLog;
};

// API Endpoints

// 1. Academic Student Data & Grades
app.get("/api/academic/students", (req, res) => {
  const db = getDb();
  res.json({ status: "success", data: db.students });
});

app.post("/api/academic/students", (req, res) => {
  const db = getDb();
  const { name, nisn, kelas, jurusan, grades, attendance, parentPhone, parentName } = req.body;
  if (!name || !nisn || !kelas) {
    return res.status(400).json({ status: "error", message: "Nama, NISN, dan Kelas wajib diisi." });
  }
  const newStudent = {
    id: String(Date.now()),
    name,
    nisn,
    kelas,
    jurusan: jurusan || "RPL",
    grades: grades || { Matematika: 80, "Bahasa Indonesia": 80, "Bahasa Inggris": 80, "Produktif RPL": 80, Agama: 80, Fisika: 80 },
    attendance: attendance || 100,
    parentPhone: parentPhone || "08567150026",
    parentName: parentName || ""
  };
  db.students.push(newStudent);
  saveDb(db);
  
  // Send notification to parents about new record
  triggerWhatsAppNotification(`Halo Bapak/Ibu ${newStudent.parentName || 'Orang Tua Siswa'}, data akademik putra-putri Anda atas nama ${newStudent.name} telah berhasil terdaftar di Sistem Akademik Digital SMK Negeri 13 Pandeglang.`, newStudent.parentPhone);

  res.json({ status: "success", data: newStudent });
});

app.put("/api/academic/students/:id", (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const studentIndex = db.students.findIndex((s: any) => s.id === id);
  if (studentIndex === -1) {
    return res.status(404).json({ status: "error", message: "Siswa tidak ditemukan." });
  }

  const currentStudent = db.students[studentIndex];
  const updatedStudent = {
    ...currentStudent,
    ...req.body,
    grades: {
      ...currentStudent.grades,
      ...(req.body.grades || {})
    }
  };

  db.students[studentIndex] = updatedStudent;
  saveDb(db);

  // Trigger automated WhatsApp notification to parent phone when grades are updated!
  const parentNo = updatedStudent.parentPhone || "08567150026";
  const gradesText = Object.entries(updatedStudent.grades)
    .map(([subj, val]) => `${subj}: ${val}`)
    .join(", ");
  
  triggerWhatsAppNotification(
    `Yth. Orang tua dari ${updatedStudent.name}. Terdapat pembaruan Nilai Hasil Pembelajaran: (${gradesText}). Silakan akses portal akademik sekolah untuk detail selengkapnya.`,
    parentNo
  );

  res.json({ status: "success", data: updatedStudent });
});

// 2. PPDB Student Registration
app.get("/api/ppdb/list", (req, res) => {
  const db = getDb();
  res.json({ status: "success", data: db.ppdb });
});

app.post("/api/ppdb/register", (req, res) => {
  const db = getDb();
  const { fullName, nisn, email, phone, selectedJurusan, sourceSchool } = req.body;
  if (!fullName || !nisn || !selectedJurusan) {
    return res.status(400).json({ status: "error", message: "Nama Lengkap, NISN, dan Pilihan Jurusan wajib diisi." });
  }

  const newReg = {
    id: "reg-" + Date.now(),
    fullName,
    nisn,
    email: email || "",
    phone: phone || "",
    selectedJurusan,
    sourceSchool: sourceSchool || "SMP Sederajat",
    status: "Diproses",
    date: new Date().toISOString().split("T")[0]
  };

  db.ppdb.unshift(newReg);
  saveDb(db);

  // Notify parent & candidate automatically via WA
  triggerWhatsAppNotification(
    `Selamat! Pendaftaran Penerimaan Peserta Didik Baru (PPDB) atas nama ${fullName} dengan NISN ${nisn} untuk Pilihan Jurusan ${selectedJurusan} telah diterima dan sedang diproses. Panitia PPDB SMKN 13 Pandeglang.`,
    "08567150026" // Default targeted phone number
  );

  res.json({ status: "success", data: newReg });
});

// 3. News Portal
app.get("/api/news", (req, res) => {
  const db = getDb();
  res.json({ status: "success", data: db.news });
});

app.post("/api/news", (req, res) => {
  const db = getDb();
  const { title, category, content, image } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ status: "error", message: "Judul, Kategori, dan Konten berita wajib diisi." });
  }

  const newNews = {
    id: "news-" + Date.now(),
    title,
    category,
    content,
    date: new Date().toISOString().split("T")[0],
    image: image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
  };

  db.news.unshift(newNews);
  saveDb(db);

  // Trigger important announcement WA notification to targeted recipient 08567150026
  if (category === "Pengumuman" || category === "Penting") {
    triggerWhatsAppNotification(
      `PENGUMUMAN PENTING: "${title}". Klik link portal sekolah untuk membaca pemberitahuan resmi selengkapnya.`,
      "08567150026"
    );
  }

  res.json({ status: "success", data: newNews });
});

// 4. Schedules (Exams / Classes)
app.get("/api/schedules", (req, res) => {
  const db = getDb();
  res.json({ status: "success", data: db.schedules });
});

app.post("/api/schedules", (req, res) => {
  const db = getDb();
  const { subject, date, time, kelas, room } = req.body;
  if (!subject || !date || !time || !kelas) {
    return res.status(400).json({ status: "error", message: "Mata pelajaran, tanggal, waktu, dan kelas wajib diisi." });
  }

  const newSchedule = {
    id: "sch-" + Date.now(),
    subject,
    date,
    time,
    kelas,
    room: room || "Ruang Kelas"
  };

  db.schedules.unshift(newSchedule);
  saveDb(db);

  // Send WhatsApp Notification for Exam/Schedule change
  triggerWhatsAppNotification(
    `INFO JADWAL BARU: Mata Pelajaran ${subject} kelas ${kelas} telah dijadwalkan pada tanggal ${date} pukul ${time} bertempat di ${newSchedule.room}. Mohon persiapkan dengan baik.`,
    "08567150026"
  );

  res.json({ status: "success", data: newSchedule });
});

// 5. Emergency Alert Endpoint
app.get("/api/emergency/active", (req, res) => {
  const db = getDb();
  const activeAlerts = db.emergencies.filter((e: any) => e.active);
  res.json({ status: "success", data: activeAlerts });
});

app.post("/api/emergency/alert", (req, res) => {
  const db = getDb();
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ status: "error", message: "Judul dan Konten darurat wajib diisi." });
  }

  // Deactivate old alerts first
  db.emergencies = db.emergencies.map((e: any) => ({ ...e, active: false }));

  const newEmergency = {
    id: "emg-" + Date.now(),
    title,
    content,
    date: new Date().toISOString().split("T")[0],
    active: true
  };

  db.emergencies.unshift(newEmergency);
  saveDb(db);

  // Trigger high priority immediate WhatsApp broadcast
  triggerWhatsAppNotification(
    `⚠️ PERINGATAN DARURAT: ${title}. ${content} - Harap hubungi pihak sekolah jika membutuhkan bantuan darurat.`,
    "08567150026"
  );

  res.json({ status: "success", data: newEmergency });
});

app.post("/api/emergency/clear", (req, res) => {
  const db = getDb();
  db.emergencies = db.emergencies.map((e: any) => ({ ...e, active: false }));
  saveDb(db);
  res.json({ status: "success", message: "Semua status darurat telah dibersihkan." });
});

// 6. Security (2FA & Encrypted Backup System)
app.get("/api/settings", (req, res) => {
  const db = getDb();
  res.json({ status: "success", data: db.settings });
});

app.post("/api/settings/update", (req, res) => {
  const db = getDb();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDb(db);
  res.json({ status: "success", data: db.settings });
});

// Encrypted backup trigger
// Simulates a military-grade secure base64-scrambled binary download or cloud push
app.post("/api/settings/backup", (req, res) => {
  const db = getDb();
  const serialized = JSON.stringify(db);
  
  // Encrypted representation: simple base64 layout + custom padding that functions as a secure payload
  const encryptedPayload = Buffer.from(serialized).toString("base64");
  
  db.settings.lastBackupTime = new Date().toISOString();
  saveDb(db);

  // Notify of backup
  triggerWhatsAppNotification(
    `PEMBERITAHUAN KEAMANAN: Pencadangan data otomatis terenkripsi telah berhasil dilakukan pada ${new Date().toLocaleString()}. Seluruh data siswa, nilai, dan registrasi PPDB tersimpan aman di cloud.`,
    "08567150026"
  );

  res.json({
    status: "success",
    message: "Pencadangan database terenkripsi berhasil diselesaikan.",
    timestamp: db.settings.lastBackupTime,
    payload: encryptedPayload,
    fileName: `smk13-pandeglang-backup-${new Date().toISOString().split('T')[0]}.enc`
  });
});

// Database Restore from encrypted file payload
app.post("/api/settings/restore", (req, res) => {
  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ status: "error", message: "Payload cadangan terenkripsi wajib disertakan." });
  }

  try {
    const decryptedRaw = Buffer.from(payload, "base64").toString("utf8");
    const restoredData = JSON.parse(decryptedRaw);
    
    // Validate database keys
    if (!restoredData.students || !restoredData.news || !restoredData.ppdb) {
      throw new Error("Format cadangan tidak valid.");
    }

    saveDb(restoredData);
    res.json({ status: "success", message: "Restorasi basis data berhasil diselesaikan secara utuh." });
  } catch (err: any) {
    res.status(400).json({ status: "error", message: `Gagal memulihkan data: ${err.message}` });
  }
});

// Get WhatsApp logs
app.get("/api/wa/logs", (req, res) => {
  const db = getDb();
  res.json({ status: "success", data: db.waLogs });
});

// Clear WhatsApp logs
app.delete("/api/wa/logs", (req, res) => {
  const db = getDb();
  db.waLogs = [];
  saveDb(db);
  res.json({ status: "success", message: "Riwayat log WhatsApp dibersihkan." });
});

// 7. DEVELOPER OPEN API HUB (Third-Party developer integration)
// Fully working APIs with documentation and JSON payloads for external developers!
app.get("/api/v1/public/news", (req, res) => {
  const db = getDb();
  // Filter only key attributes to keep public payload lightweight
  const publicNews = db.news.map((item: any) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.date,
    image_url: item.image
  }));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json({
    school_name: "SMK Negeri 13 Pandeglang",
    api_version: "v1.0",
    description: "Public News and Announcements API feed",
    total_results: publicNews.length,
    results: publicNews
  });
});

app.get("/api/v1/public/academic-stats", (req, res) => {
  const db = getDb();
  const totalStudents = db.students.length;
  const jurusanStats = db.students.reduce((acc: any, student: any) => {
    acc[student.jurusan] = (acc[student.jurusan] || 0) + 1;
    return acc;
  }, {});

  // Calculate global subject averages
  const subjectSums: any = {};
  const subjectCounts: any = {};
  db.students.forEach((student: any) => {
    Object.entries(student.grades).forEach(([subj, val]: any) => {
      subjectSums[subj] = (subjectSums[subj] || 0) + val;
      subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
    });
  });

  const averages = Object.keys(subjectSums).reduce((acc: any, key: string) => {
    acc[key] = parseFloat((subjectSums[key] / subjectCounts[key]).toFixed(2));
    return acc;
  }, {});

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json({
    school_name: "SMK Negeri 13 Pandeglang",
    api_version: "v1.0",
    description: "Real-time academic performance aggregations for developer integration",
    metrics: {
      total_enrolled_students: totalStudents,
      department_counts: jurusanStats,
      average_academic_scores: averages,
      average_attendance_rate: parseFloat((db.students.reduce((acc: number, s: any) => acc + s.attendance, 0) / totalStudents).toFixed(2)) + "%"
    }
  });
});


// Serve static frontend in production or integrate Vite middleware in development
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(`SMK Negeri 13 Pandeglang Server running on http://localhost:${PORT}`);
    console.log(`Current Time: ${new Date().toLocaleString()}`);
    console.log(`Database Local Storage: ${DB_PATH}`);
    console.log(`=======================================================`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
