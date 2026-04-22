import { useState, useCallback, useEffect } from 'react';

export type EmployeeStatus = 'Thử việc' | 'Đã ký hợp đồng' | 'Nghỉ phép' | 'Đã thôi việc';

export interface IEmployee {
  code: string;
  fullName: string;
  position: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
}

const STORAGE_KEY = 'QUAN_LY_NHAN_VIEN_DATA_V2';

export default function useQuanLyNhanVienModel() {
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setEmployees(JSON.parse(storedData));
    } else {
      const mockData: IEmployee[] = [
        {
          code: 'NV001',
          fullName: 'Nguyễn Văn A',
          position: 'Nhân viên',
          department: 'Phòng Kỹ thuật',
          salary: 15000000,
          status: 'Đã ký hợp đồng',
        },
        {
          code: 'NV002',
          fullName: 'Trần Thị B',
          position: 'Trưởng phòng',
          department: 'Phòng Nhân sự',
          salary: 25000000,
          status: 'Thử việc',
        },
        {
          code: 'NV003',
          fullName: 'Lê Văn C',
          position: 'Giám đốc',
          department: 'Phòng Giám đốc',
          salary: 50000000,
          status: 'Đã ký hợp đồng',
        },
        {
          code: 'NV004',
          fullName: 'Phạm Thị D',
          position: 'Thực tập sinh',
          department: 'Phòng Kinh doanh',
          salary: 5000000,
          status: 'Đã thôi việc',
        },
        {
          code: 'NV005',
          fullName: 'Hoàng Văn E',
          position: 'Nhân viên',
          department: 'Phòng Kế toán',
          salary: 12000000,
          status: 'Nghỉ phép',
        },
      ];
      setEmployees(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  const saveToStorage = (data: IEmployee[]) => {
    setEmployees(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addEmployee = useCallback(
    (newEmployee: Omit<IEmployee, 'code'>) => {
      const nextId = employees.length > 0 
        ? Math.max(...employees.map(e => parseInt(e.code.replace('NV', ''), 10) || 0)) + 1 
        : 1;
      const code = `NV${nextId.toString().padStart(3, '0')}`;
      
      const emp: IEmployee = { ...newEmployee, code };
      saveToStorage([...employees, emp]);
    },
    [employees],
  );

  const updateEmployee = useCallback(
    (code: string, updatedData: Partial<IEmployee>) => {
      const newData = employees.map((item) =>
        item.code === code ? { ...item, ...updatedData } : item,
      );
      saveToStorage(newData);
    },
    [employees],
  );

  const deleteEmployee = useCallback(
    (code: string) => {
      const newData = employees.filter((item) => item.code !== code);
      saveToStorage(newData);
    },
    [employees],
  );

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
