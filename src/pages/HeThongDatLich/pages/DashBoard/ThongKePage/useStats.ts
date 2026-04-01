import { useState, useMemo } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const useStats = () => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Kéo dữ liệu từ các model của hệ thống
  const { appointments } = useModel('appointment');
  const { nhanVienList } = useModel('nhanVienModel');
  const { dichVuList } = useModel('dichVuModel');

  const statsData = useMemo(() => {
    // 1. Chỉ lấy những lịch hẹn có trạng thái "Hoàn thành" để tính doanh thu
    let completedAppointments = (appointments || []).filter(
      (app: any) => app.status === 'Hoàn thành'
    );

    // 2. Lọc theo khoảng ngày người dùng chọn
    if (range && range[0] && range[1]) {
      const startDate = range[0].startOf('day');
      const endDate = range[1].endOf('day');
      
      completedAppointments = completedAppointments.filter((app: any) => {
        return dayjs(app.date).isBetween(startDate, endDate, null, '[]');
      });
    }

    // 3. Khớp ID để lấy tên nhân viên và giá tiền dịch vụ
    const mappedData = completedAppointments.map((app: any) => {
      const nhanVien = (nhanVienList || []).find((nv: any) => nv.id === app.employeeId);
      const dichVu = (dichVuList || []).find((dv: any) => dv.id === app.serviceId);

      return {
        id: app.id,
        date: dayjs(app.date).format('DD/MM/YYYY'),
        staff: nhanVien ? nhanVien.hoTen : 'Nhân viên đã xóa',
        service: dichVu ? dichVu.tenDichVu : 'Dịch vụ đã xóa',
        price: dichVu ? dichVu.gia : 0,
      };
    });

    // 4. Tính tổng doanh thu thực tế
    const total = mappedData.reduce((sum, item) => sum + item.price, 0);

    // 5. Nhóm doanh thu theo tên nhân viên để hiển thị lên BarChart
    const staffMap: Record<string, number> = {};
    mappedData.forEach((item) => {
      staffMap[item.staff] = (staffMap[item.staff] || 0) + item.price;
    });

    const staffStats = Object.keys(staffMap).map((name) => ({
      name,
      value: staffMap[name],
    }));

    return {
      filtered: mappedData, // Bảng chi tiết
      total,                // Tổng doanh thu
      staffStats,           // Biểu đồ cột
    };
  }, [appointments, nhanVienList, dichVuList, range]);

  return { range, setRange, statsData };
};