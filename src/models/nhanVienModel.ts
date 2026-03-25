import { useState, useCallback, useEffect } from 'react';

export interface NhanVien {
  id: string;
  hoTen: string;
  lichLamViec: string;
  gioiHanKhach: number;
  trangThai: 'Hoạt động' | 'Nghỉ phép';
}

const STORAGE_KEY = 'NHAN_VIEN_DATA';

export default function useNhanVienModel() {
  const [nhanVienList, setNhanVienList] = useState<NhanVien[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setNhanVienList(JSON.parse(storedData));
    } else {
      const mockData: NhanVien[] = [
        { id: 'NV01', hoTen: 'Nguyễn Văn A', lichLamViec: '09:00 - 18:00 (T2-T6)', gioiHanKhach: 10, trangThai: 'Hoạt động' },
        { id: 'NV02', hoTen: 'Trần Thị B', lichLamViec: '10:00 - 20:00 (T7-CN)', gioiHanKhach: 15, trangThai: 'Nghỉ phép' },
      ];
      setNhanVienList(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  const saveAndSetState = (newData: NhanVien[]) => {
    setNhanVienList(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const addNhanVien = useCallback((newNhanVien: NhanVien) => {
    saveAndSetState([...nhanVienList, newNhanVien]);
  }, [nhanVienList]);

  const updateNhanVien = useCallback((id: string, updatedData: Partial<NhanVien>) => {
    const newData = nhanVienList.map((item) => 
      item.id === id ? { ...item, ...updatedData } : item
    );
    saveAndSetState(newData);
  }, [nhanVienList]);

  const deleteNhanVien = useCallback((id: string) => {
    const newData = nhanVienList.filter((item) => item.id !== id);
    saveAndSetState(newData);
  }, [nhanVienList]);

  return {
    nhanVienList,
    loading,
    addNhanVien,
    updateNhanVien,
    deleteNhanVien,
  };
}