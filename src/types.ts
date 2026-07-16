export interface Student {
  id: string;
  name: string;
  nisn: string;
  kelas: string;
  jurusan: 'RPL' | 'TKJ' | string;
  grades: {
    [subject: string]: number;
  };
  attendance: number;
  parentPhone: string;
  parentName: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Pengumuman' | 'Berita' | 'Prestasi' | 'E-Learning' | string;
  content: string;
  date: string;
  image?: string;
}

export interface PPDBRegistration {
  id: string;
  fullName: string;
  nisn: string;
  email: string;
  phone: string;
  selectedJurusan: string;
  sourceSchool: string;
  status: 'Diproses' | 'Diterima' | 'Ditolak' | string;
  date: string;
}

export interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  kelas: string;
  room: string;
}

export interface SchoolSettings {
  twoFactorEnabled: boolean;
  twoFactorSecret: string;
  backupInterval: string;
  parentContentFilter: string;
  lastBackupTime: string;
}

export interface WALog {
  id: string;
  recipient: string;
  message: string;
  timestamp: string;
  status: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  content: string;
  date: string;
  active: boolean;
}

export type Language = 'id' | 'en';
