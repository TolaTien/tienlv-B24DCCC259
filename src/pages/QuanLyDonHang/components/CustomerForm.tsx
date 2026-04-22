import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';

interface CustomerFormProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (values: any) => void;
	loading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ visible, onClose, onSubmit, loading }) => {
	const [form] = Form.useForm();
	const { record, edit } = useModel('khachhang');

	useEffect(() => {
		if (visible) {
			if (edit && record) {
				form.setFieldsValue({
					code: record.code,
					name: record.name,
					phone: record.phone,
					email: record.email,
					address: record.address,
				});
			} else {
				form.resetFields();
			}
		}
	}, [visible, edit, record, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			onSubmit(values);
		} catch (err) {
			console.log('Validation failed:', err);
		}
	};

	return (
		<Modal
			title={edit ? 'Chỉnh sửa khách hàng' : 'Thêm mới khách hàng'}
			visible={visible}
			onCancel={onClose}
			footer={null}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='code'
					label='Mã khách hàng'
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder='KH001' disabled={edit} />
				</Form.Item>

				<Form.Item
					name='name'
					label='Tên khách hàng'
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder='Nhập tên khách hàng' />
				</Form.Item>

				<Form.Item
					name='phone'
					label='Số điện thoại'
					rules={[...rules.text]}
				>
					<Input placeholder='Nhập số điện thoại' />
				</Form.Item>

				<Form.Item
					name='email'
					label='Email'
					rules={[...rules.text]}
				>
					<Input placeholder='Nhập email' />
				</Form.Item>

				<Form.Item
					name='address'
					label='Địa chỉ'
					rules={[...rules.text]}
				>
					<Input.TextArea rows={3} placeholder='Nhập địa chỉ' />
				</Form.Item>

				<div style={{ textAlign: 'right', gap: 8, display: 'flex', justifyContent: 'flex-end' }}>
					<Button onClick={onClose}>Hủy</Button>
					<Button type='primary' loading={loading} onClick={handleSubmit}>
						{edit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default CustomerForm;
