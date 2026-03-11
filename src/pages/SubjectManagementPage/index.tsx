import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, InputNumber, Space, Modal, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Subject } from '../../models/Question';

const SubjectManagementPage: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>(() => {
		const saved = localStorage.getItem('subjects_data');
		return saved ? JSON.parse(saved) : [{ id: 'S01', code: 'INT3306', name: 'Lập trình Web', credits: 3 }];
	});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		localStorage.setItem('subjects_data', JSON.stringify(subjects));
	}, [subjects]);

	const handleSave = (values: any) => {
		const newSubject = { ...values, id: values.id || `S_${Date.now()}` };
		const index = subjects.findIndex((s) => s.id === newSubject.id);
		if (index > -1) {
			const updated = [...subjects];
			updated[index] = newSubject;
			setSubjects(updated);
		} else {
			setSubjects([...subjects, newSubject]);
		}
		setIsModalVisible(false);
		message.success('Đã lưu môn học!');
	};

	const handleDelete = (id: string) => {
		setSubjects(subjects.filter((s) => s.id !== id));
		message.success('Đã xóa môn học!');
	};

	const columns: ColumnsType<Subject> = [
		{ title: 'Mã môn', dataIndex: 'code', key: 'code' },
		{ title: 'Tên môn', dataIndex: 'name', key: 'name' },
		{ title: 'Tín chỉ', dataIndex: 'credits', key: 'credits' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button
						type='link'
						onClick={() => {
							form.setFieldsValue(record);
							setIsModalVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm title='Chắc chắn xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h2>Quản lý Môn học</h2>
				<Button
					type='primary'
					onClick={() => {
						form.resetFields();
						setIsModalVisible(true);
					}}
				>
					+ Thêm môn học
				</Button>
			</div>
			<Table columns={columns} dataSource={subjects} rowKey='id' bordered />
			<Modal
				title='Thông tin môn học'
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item name='id' hidden>
						<Input />
					</Form.Item>
					<Form.Item name='code' label='Mã môn học' rules={[{ required: true }]}>
						<Input placeholder='VD: INT3306' />
					</Form.Item>
					<Form.Item name='name' label='Tên môn học' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='credits' label='Số tín chỉ' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
export default SubjectManagementPage;
