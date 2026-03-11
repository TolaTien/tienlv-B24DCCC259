import { useState, useEffect } from "react";
import { message } from "antd";

const STORAGE_KEY = "appointment_list";

export default function useAppointmentModel() {
  const [appointments, setAppointments] = useState<any[]>([]);

  // Load dữ liệu từ localStorage khi mở web
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      setAppointments(JSON.parse(data));
    }
  }, []);

  // Lưu vào localStorage
  const saveLocal = (data: any[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Thêm lịch
  const addAppointment = (data: any) => {
    const isDuplicate = appointments.find(
      (a) =>
        a.date === data.date &&
        a.time === data.time &&
        a.employeeId === data.employeeId // Cập nhật: check trùng theo employeeId
    );

    if (isDuplicate) {
      message.error("Lịch này đã được đặt!");
      return;
    }

    const newData = [
      ...appointments,
      {
        ...data,
        id: Date.now(),
        status: "Chờ duyệt",
      },
    ];

    setAppointments(newData);
    saveLocal(newData);
  };

  // Cập nhật trạng thái
  const updateStatus = (id: number, status: string) => {
    const newData = appointments.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    setAppointments(newData);
    saveLocal(newData);
  };

  // Xóa lịch
  const deleteAppointment = (id: number) => {
    const newData = appointments.filter((a) => a.id !== id);
    setAppointments(newData);
    saveLocal(newData);
  };

  return {
    appointments,
    addAppointment,
    updateStatus,
    deleteAppointment,
  };
}