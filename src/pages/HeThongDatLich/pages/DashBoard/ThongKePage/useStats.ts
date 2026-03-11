import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

const MOCK_DATA = [
  { id: '1', staff: 'Nguyễn Văn A', service: 'Cắt tóc', price: 150000, date: '2026-03-01', status: 'COMPLETED' },
  { id: '2', staff: 'Trần Thị B', service: 'Spa', price: 500000, date: '2026-03-05', status: 'COMPLETED' },
  { id: '3', staff: 'Lê Văn C', service: 'Khám bệnh', price: 300000, date: '2026-03-08', status: 'COMPLETED' },
  { id: '4', staff: 'Nguyễn Văn A', service: 'Gội đầu', price: 100000, date: '2026-03-10', status: 'COMPLETED' },
];

export const useStats = () => {
  const [range, setRange] = useState<any>([dayjs().startOf('month'), dayjs().endOf('month')]);

  const statsData = useMemo(() => {
    if (!range || !range[0] || !range[1]) return { filtered: [], total: 0, staffStats: [] };

    const filtered = MOCK_DATA.filter(item => 
      dayjs(item.date).isAfter(range[0].startOf('day')) &&
      dayjs(item.date).isBefore(range[1].endOf('day'))
    );

    const total = filtered.reduce((sum, item) => sum + item.price, 0);

    // Ép kiểu Record<string, number> để TypeScript biết giá trị trả về là con số
    const staffMap = filtered.reduce((acc: Record<string, number>, curr) => {
      acc[curr.staff] = (acc[curr.staff] || 0) + curr.price;
      return acc;
    }, {});

    // Chuyển sang mảng chuẩn DataItem[]
    const staffStats = Object.entries(staffMap).map(([name, value]) => ({
      name,
      value: Number(value) // Đảm bảo chắc chắn là kiểu number
    }));

    return { filtered, total, staffStats };
  }, [range]);

  return { range, setRange, statsData };
};