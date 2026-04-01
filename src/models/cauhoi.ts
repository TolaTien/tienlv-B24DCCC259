import { useState } from 'react';

export interface CauHoi {
	id: number;
	monHoc: string;
	noiDung: string;
	mucDo: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
	khoiKienThuc: string;
}

export default () => {
	const [dsCauHoi, setDsCauHoi] = useState<CauHoi[]>([
		{
			id: 1,
			monHoc: 'Lập trình',
			noiDung: 'Trình bày khái niệm biến trong JavaScript',
			mucDo: 'Dễ',
			khoiKienThuc: 'Tổng quan',
		},
		{
			id: 2,
			monHoc: 'Lập Trình',
			noiDung: 'Giải thích Promise trong JavaScript',
			mucDo: 'Trung bình',
			khoiKienThuc: 'Chuyên sâu',
		},
		{
			id: 3,
			monHoc: 'Lập trình',
			noiDung: 'So sánh var, let, const',
			mucDo: 'Khó',
			khoiKienThuc: 'Chuyên sâu',
		},
		{
			id: 4,
			monHoc: 'Toán',
			noiDung: '1+1 bằng mấy',
			mucDo: 'Dễ',
			khoiKienThuc: 'Tổng quan',
		},
		{
			id: 5,
			monHoc: 'Toán',
			noiDung: '3 điểm thẳng hàng là điểm như thế nào',
			mucDo: 'Trung bình',
			khoiKienThuc: 'Chuyên sâu',
		},
		{
			id: 6,
			monHoc: 'Toán',
			noiDung: 'Tại sao 1+1 bằng 2',
			mucDo: 'Khó',
			khoiKienThuc: 'Chuyên sâu',
		},
		{
			id: 7,
			monHoc: 'English',
			noiDung: 'what is your name?',
			mucDo: 'Dễ',
			khoiKienThuc: 'Tổng quan',
		},
		{
			id: 8,
			monHoc: 'English',
			noiDung: 'IT nghĩa là gì',
			mucDo: 'Trung bình',
			khoiKienThuc: 'Chuyên sâu',
		},
		{
			id: 9,
			monHoc: 'English',
			noiDung: 'how are u today',
			mucDo: 'Khó',
			khoiKienThuc: 'Chuyên sâu',
		},
	]);

	const themCauHoi = (cauHoi: CauHoi) => {
		setDsCauHoi([...dsCauHoi, cauHoi]);
	};

	const xoaCauHoi = (id: number) => {
		setDsCauHoi(dsCauHoi.filter((c) => c.id !== id));
	};

	const suaCauHoi = (cauHoiMoi: CauHoi) => {
		setDsCauHoi(dsCauHoi.map((c) => (c.id === cauHoiMoi.id ? cauHoiMoi : c)));
	};

	return {
		dsCauHoi,
		setDsCauHoi,
		themCauHoi,
		xoaCauHoi,
		suaCauHoi,
	};
};
