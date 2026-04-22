import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';

interface ProductFormProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (values: any) => void;
	loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ visible, onClose, onSubmit, loading }) => {
	const [form] = Form.useForm();
	const { record, edit } = useModel('sanpham');

	useEffect(() => {
		if (visible) {
			if (edit && record) {
				form.setFieldsValue({
					code: record.code,
					name: record.name,
					price: record.price,
					quantity: record.quantity,
					description: record.description,
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
			title={edit ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm'}
			visible={visible}
			onCancel={onClose}
			footer={null}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='code'
					label='Mã sản phẩm'
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder='SP001' disabled={edit} />
				</Form.Item>

				<Form.Item
					name='name'
					label='Tên sản phẩm'
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder='Nhập tên sản phẩm' />
				</Form.Item>

				<Form.Item
					name='price'
					label='Giá (₫)'
					rules={[...rules.required, ...rules.number(1000000000, 0, false)]}
				>
					<InputNumber placeholder='Nhập giá' min={0} step={100000} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='quantity'
					label='Số lượng'
					rules={[...rules.required, ...rules.number(1000000000, 0, false)]}
				>
					<InputNumber placeholder='Nhập số lượng' min={0} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='description'
					label='Mô tả'
					rules={[...rules.text]}
				>
					<Input.TextArea rows={3} placeholder='Nhập mô tả sản phẩm' />
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

export default ProductForm;
