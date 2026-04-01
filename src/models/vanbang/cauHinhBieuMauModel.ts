import { useState, useEffect } from 'react';

export type FieldDataType = 'String' | 'Number' | 'Date';

export interface IFormField {
  _id: string;
  maTruong: string;
  tenTruong: string;
  kieuDuLieu: FieldDataType;
  batBuoc: boolean;
}

export default () => {
  const [danhSachTruong, setDanhSachTruong] = useState<IFormField[]>(() => {
    const savedData = localStorage.getItem('DATA_CAU_HINH_BIEU_MAU');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return [];
      }
    }
    // Dữ liệu mẫu
    return [
      { _id: '1', maTruong: 'dan_toc', tenTruong: 'Dân tộc', kieuDuLieu: 'String', batBuoc: true },
      { _id: '2', maTruong: 'diem_tb', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number', batBuoc: true },
    ];
  });


  useEffect(() => {
    localStorage.setItem('DATA_CAU_HINH_BIEU_MAU', JSON.stringify(danhSachTruong));
  }, [danhSachTruong]);

  return { danhSachTruong, setDanhSachTruong };
};