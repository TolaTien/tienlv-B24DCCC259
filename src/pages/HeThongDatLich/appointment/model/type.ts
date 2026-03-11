
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  customerName: string;
  serviceId: string;
  serviceName: string; // Lưu để hiển thị nhanh không cần join
  employeeId: string;
  employeeName: string;
  price: number;
  status: AppointmentStatus;
  date: string; // Format: YYYY-MM-DD
}

export interface StatResult {
  label: string;
  value: number;
}