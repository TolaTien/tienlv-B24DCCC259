import { useState, useCallback, useEffect } from 'react';

export interface DichVu {
  id: string;
  tenDichVu: string;
  gia: number;
  thoiGian: number;
}

const STORAGE_KEY = 'DICH_VU_DATA';

export default function useDichVuModel() {
  const [dichVuList, setDichVuList] = useState<DichVu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy dữ liệu từ LocalStorage khi khởi tạo
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setDichVuList(JSON.parse(storedData));
    } else {
      
      const mockData: DichVu[] = [
        { id: 'DV01', tenDichVu: 'Cắt tóc nam', gia: 100000, thoiGian: 30 },
        { id: 'DV02', tenDichVu: 'Gội đầu dưỡng sinh', gia: 250000, thoiGian: 60 },
      ];
      setDichVuList(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  
  const saveAndSetState = (newData: DichVu[]) => {
    setDichVuList(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // Thêm mới dịch vụ
  const addDichVu = useCallback((newDichVu: DichVu) => {
    saveAndSetState([...dichVuList, newDichVu]);
  }, [dichVuList]);

  // Cập nhật dịch vụ
  const updateDichVu = useCallback((id: string, updatedData: Partial<DichVu>) => {
    const newData = dichVuList.map((item) => 
      item.id === id ? { ...item, ...updatedData } : item
    );
    saveAndSetState(newData);
  }, [dichVuList]);

  // Xóa dịch vụ
  const deleteDichVu = useCallback((id: string) => {
    const newData = dichVuList.filter((item) => item.id !== id);
    saveAndSetState(newData);
  }, [dichVuList]);

  return {
    dichVuList,
    loading,
    addDichVu,
    updateDichVu,
    deleteDichVu,
  };
}