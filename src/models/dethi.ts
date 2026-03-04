import { useState } from 'react';
import { message } from 'antd';

export default () => {
	const [dsDeThi, setDsDeThi] = useState<any[]>([]);
	const [dsCauTruc, setDsCauTruc] = useState<any[]>([]);

	// =========================
	// THUẬT TOÁN TẠO ĐỀ
	// =========================
	const taoDeThi = (dsCauHoi: any[], cauTruc: any) => {
		let deThi: any[] = [];

		for (const yc of cauTruc.chiTiet) {
			const dsLoc = dsCauHoi.filter(
				(c) => c.monHoc === cauTruc.monHoc && c.mucDo === yc.mucDo && c.khoiKienThuc === yc.khoiKienThuc,
			);

			if (dsLoc.length < yc.soLuong) {
				message.error(`Không đủ câu hỏi: ${yc.mucDo} - ${yc.khoiKienThuc}`);
				return null;
			}

			const random = dsLoc.sort(() => 0.5 - Math.random()).slice(0, yc.soLuong);

			deThi = [...deThi, ...random];
		}

		const deThiMoi = {
			id: Date.now(),
			monHoc: cauTruc.monHoc,
			danhSach: deThi,
			ngayTao: new Date(),
		};

		setDsDeThi([...dsDeThi, deThiMoi]);
		return deThiMoi;
	};

	return {
		dsDeThi,
		setDsDeThi,
		dsCauTruc,
		setDsCauTruc,
		taoDeThi,
	};
};
