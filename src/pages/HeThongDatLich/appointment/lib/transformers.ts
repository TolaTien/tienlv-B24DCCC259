// src/entities/appointment/lib/transformers.ts
import { Appointment, StatResult } from "../model/type";

// 1. Tính tổng doanh thu (Chỉ tính những lịch đã hoàn thành)
export const calculateTotalRevenue = (data: Appointment[]): number => {
   return data
    .filter(item => item.status === 'COMPLETED')
    .reduce((sum, item) => sum + item.price, 0);
};

// 2. Nhóm dữ liệu cho Chart: Doanh thu theo Nhân viên
export const groupRevenueByStaff = (data: Appointment[]): StatResult[] => {
  const map = new Map<string, number>();
  
  data.filter(item => item.status === 'COMPLETED').forEach(item => {
    const current = map.get(item.employeeName) || 0;
    map.set(item.employeeName, current + item.price);
  });

  return Array.from(map, ([label, value]) => ({ label, value }));
};

// 3. Nhóm dữ liệu cho Chart: Doanh thu theo Dịch vụ
export const groupRevenueByService = (data: Appointment[]): StatResult[] => {
  const map = new Map<string, number>();
  
  data.filter(item => item.status === 'COMPLETED').forEach(item => {
    const current = map.get(item.serviceName) || 0;
    map.set(item.serviceName, current + item.price);
  });

  return Array.from(map, ([label, value]) => ({ label, value }));
};