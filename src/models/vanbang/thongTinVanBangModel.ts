import { useState, useEffect } from 'react';

export interface IVanBang {
  _id: string;
  idQuyetDinh: string;
  soVaoSo: number; 
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  duLieuDong: Record<string, any>;
}

export default () => {
  const [danhSachVanBang, setDanhSachVanBang] = useState<IVanBang[]>(() => {
    const savedData = localStorage.getItem('DATA_VAN_BANG');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('DATA_VAN_BANG', JSON.stringify(danhSachVanBang));
  }, [danhSachVanBang]);


  const getNextSoVaoSo = async (idQuyetDinh: string) => {

    if (danhSachVanBang.length === 0) return 1;
    const maxSo = Math.max(...danhSachVanBang.map(vb => vb.soVaoSo || 0));
    return maxSo + 1;
  };


  const addVanBang = (newVanBang: IVanBang) => {
    setDanhSachVanBang(prev => [...prev, newVanBang]);
  };

  return { danhSachVanBang, setDanhSachVanBang, getNextSoVaoSo, addVanBang };
};