import { Button, Card, Select, InputNumber, Form, message } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';

const { Option } = Select;

const People24 = () => {
	const { dsCauHoi } = useModel('cauhoi');
	const { taoDeThi, dsDeThi } = useModel('dethi');

	const [form] = Form.useForm();

	const handleTaoDe = () => {
		const values = form.getFieldsValue();

		const cauTruc = {
			monHoc: values.monHoc,
			chiTiet: [
				{
					mucDo: 'Dễ',
					khoiKienThuc: 'Tổng quan',
					soLuong: values.de || 0,
				},
				{
					mucDo: 'Trung bình',
					khoiKienThuc: 'Chuyên sâu',
					soLuong: values.trungBinh || 0,
				},
				{
					mucDo: 'Khó',
					khoiKienThuc: 'Chuyên sâu',
					soLuong: values.kho || 0,
				},
			],
		};

		const de = taoDeThi(dsCauHoi, cauTruc);

		if (de) {
			message.success('Tạo đề thành công');
		}
	};

	return (
		<div style={{ padding: 24 }}>
			<Card title='Tạo đề thi'>
				<Form layout='vertical' form={form}>
					<Form.Item name='monHoc' label='Môn học'>
						<Select>
							<Option value='Lập trình'>Lập trình</Option>
							<Option value='Toán'>Toán</Option>
							<Option value='English'>English</Option>
						</Select>
					</Form.Item>

					<Form.Item name='de' label='Số câu Dễ'>
						<InputNumber min={0} />
					</Form.Item>

					<Form.Item name='trungBinh' label='Số câu Trung bình'>
						<InputNumber min={0} />
					</Form.Item>

					<Form.Item name='kho' label='Số câu Khó'>
						<InputNumber min={0} />
					</Form.Item>

					<Button type='primary' onClick={handleTaoDe}>
						Tạo đề
					</Button>
				</Form>
			</Card>

			<Card title='Danh sách đề đã tạo' style={{ marginTop: 20 }}>
				{dsDeThi.map((de: any) => (
					<Card key={de.id} type='inner' title={`Đề môn ${de.monHoc}`} style={{ marginBottom: 16 }}>
						{de.danhSach.map((c: any) => (
							<p key={c.id}>{c.noiDung}</p>
						))}
					</Card>
				))}
			</Card>
		</div>
	);
};

export default People24;
