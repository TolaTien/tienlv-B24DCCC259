export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface HistoryLog {
  id: string;
  admin: string;
  action: RegistrationStatus;
  time: string;
  reason?: string;
}

export interface Club {
  id: string;
  name: string;
  avatar: string;
  foundedDate: string;
  description: string; // HTML string từ TinyEditor
  chairperson: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  address: string;
  strength: string;
  clubId: string;
  reason: string;
  status: RegistrationStatus;
  note?: string;
  history: HistoryLog[];
}