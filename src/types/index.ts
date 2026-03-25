// interfaces cho CLB
export interface IClub {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  leader: string;
  foundedDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  memberCount?: number;
}

// interfaces cho Registration/Đơn đăng ký
export interface IRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  skills: string;
  clubId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  history: IHistoryLog[];
  createdAt: string;
  updatedAt?: string;
}

// interfaces cho Members (thành viên)
export interface IMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  skills: string;
  clubId: string;
  joinedDate: string;
  role?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt?: string;
}

// Lịch sử thao tác
export interface IHistoryLog {
  action: 'Approved' | 'Rejected' | 'Edited';
  admin?: string;
  timestamp: string;
  reason?: string;
  details?: string;
}

// Stats/Báo cáo
export interface IStats {
  totalClubs: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedMembers: number;
  rejectedRegistrations: number;
  registrationsByClub: IClubStats[];
}

export interface IClubStats {
  clubId: string;
  clubName: string;
  pending: number;
  approved: number;
  rejected: number;
}

// Pagination
export interface IPaginationParams {
  current: number;
  pageSize: number;
}
