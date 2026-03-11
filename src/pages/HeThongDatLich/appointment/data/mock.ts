// src/entities/appointment/data/mock.ts
import { Appointment } from "../model/type";

export const MOCK_APPOINTMENTS: Appointment[] = [
{ id: '1', customerName: 'Kad', serviceId: 's1', serviceName: 'Cắt tóc', employeeId: 'e1', employeeName: 'Hoàng', price: 150000, status: 'COMPLETED', date: '2026-03-01' },
{ id: '2', customerName: 'Linh', serviceId: 's2', serviceName: 'Gội đầu', employeeId: 'e2', employeeName: 'An', price: 80000, status: 'COMPLETED', date: '2026-03-01' },
{ id: '3', customerName: 'Minh', serviceId: 's1', serviceName: 'Cắt tóc', employeeId: 'e1', employeeName: 'Hoàng', price: 150000, status: 'CANCELLED', date: '2026-03-02' },
];

