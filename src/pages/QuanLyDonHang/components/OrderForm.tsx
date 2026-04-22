import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Card, Row, Col, Table, Space, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { IOrder, EOrderStatus, OrderStatusLabels, IOrderItem } from '../typing';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import rules from '@/utils/rules';

interface OrderFormProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (values: any) => void;
	loading?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ visible, onClose, onSubmit, loading }) => {
	const [form] = Form.useForm();
	const { record, edit } = useModel('donhang');
	const [customers, setCustomers] = useState<any[]>([]);
	const [products, setProducts] = useState<any[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<IOrderItem[]>([]);
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		setCustomers(customerService.getCustomers());
		setProducts(productService.getProducts());
	}, []);

	useEffect(() => {
		if (visible) {
			if (edit && record) {
				form.setFieldsValue({
					code: record.code,
					customerId: record.customerId,
					status: record.status,
					notes: record.notes,
				});
				setSelectedProducts(record.items);
				setTotalAmount(record.totalAmount);
			} else {
				form.resetFields();
				setSelectedProducts([]);
				setTotalAmount(0);
			}
		}
	}, [visible, edit, record, form]);

	const handleAddProduct = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		if (!product) return;

		const existingItem = selectedProducts.find((item) => item.productId === productId);
		if (existingItem) {
			message.warning('Sản phẩm này đã được thêm vào đơn hàng');
			return;
		}

		const newItem: IOrderItem = {
			productId: product.id,
			productCode: product.code,
			productName: product.name,
			quantity: 1,
			price: product.price,
			total: product.price,
		};

		const updated = [...selectedProducts, newItem];
		setSelectedProducts(updated);
		calculateTotal(updated);
	};

	const handleRemoveProduct = (productId: string) => {
		const updated = selectedProducts.filter((item) => item.productId !== productId);
		setSelectedProducts(updated);
		calculateTotal(updated);
	};

	const handleQuantityChange = (productId: string, quantity: number) => {
		if (quantity <= 0) {
			handleRemoveProduct(productId);
			return;
		}

		const updated = selectedProducts.map((item) =>
			item.productId === productId
				? { ...item, quantity, total: quantity * item.price }
				: item,
		);
		setSelectedProducts(updated);
		calculateTotal(updated);
	};

	const calculateTotal = (items: IOrderItem[]) => {
		const total = items.reduce((sum, item) => sum + item.total, 0);
		setTotalAmount(total);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (selectedProducts.length === 0) {
				message.error('Vui lòng thêm ít nhất một sản phẩm');
				return;
			}

			const customer = customers.find((c) => c.id === values.customerId);
			if (!customer) {
				message.error('Khách hàng không hợp lệ');
				return;
			}

			const orderData = {
				...values,
				customerCode: customer.code,
				customerName: customer.name,
				items: selectedProducts,
				totalAmount,
				orderDate: Date.now(),
			};

			onSubmit(orderData);
		} catch (err) {
			console.log('Validation failed:', err);
		}
	};

	const columns = [
		{
			title: 'Mã sản phẩm',
			dataIndex: 'productCode',
			width: 120,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'productName',
			width: 200,
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			width: 120,
			render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			width: 100,
			render: (quantity: number, record: IOrderItem) => (
				<InputNumber
					min={1}
					value={quantity}
					onChange={(value) => handleQuantityChange(record.productId, value || 1)}
					style={{ width: '100%' }}
				/>
			),
		},
		{
			title: 'Thành tiền',
			dataIndex: 'total',
			width: 120,
			render: (total: number) => `${total.toLocaleString('vi-VN')} ₫`,
		},
		{
			title: 'Hành động',
			width: 80,
			render: (_: any, record: IOrderItem) => (
				<Button
					type='link'
					danger
					size='small'
					icon={<DeleteOutlined />}
					onClick={() => handleRemoveProduct(record.productId)}
				/>
			),
		},
	];

	return (
		<Modal
			title={edit ? 'Chỉnh sửa đơn hàng' : 'Thêm mới đơn hàng'}
			visible={visible}
			onCancel={onClose}
			footer={null}
			width={1000}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='code'
							label='Mã đơn hàng'
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder='ĐH001' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='customerId'
							label='Khách hàng'
							rules={[...rules.required]}
						>
							<Select
								placeholder='Chọn khách hàng'
								options={customers.map((c) => ({
									label: `${c.code} - ${c.name}`,
									value: c.id,
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='status'
							label='Trạng thái'
							rules={[...rules.required]}
							initialValue={EOrderStatus.PENDING}
						>
							<Select
								placeholder='Chọn trạng thái'
								options={Object.entries(OrderStatusLabels).map(([value, label]) => ({
									label,
									value,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Tổng tiền'>
							<Input
								value={`${totalAmount.toLocaleString('vi-VN')} ₫`}
								disabled
								readOnly
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label='Sản phẩm'>
					<Card style={{ marginBottom: 16 }}>
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col flex='auto'>
								<Select
									placeholder='Chọn sản phẩm để thêm'
									options={products
										.filter((p) => !selectedProducts.find((item) => item.productId === p.id))
										.map((p) => ({
											label: `${p.code} - ${p.name} (${p.price.toLocaleString('vi-VN')} ₫)`,
											value: p.id,
										}))}
									onChange={handleAddProduct}
								/>
							</Col>
							<Col>
								<Button type='primary' icon={<PlusOutlined />}>
									Thêm
								</Button>
							</Col>
						</Row>

						<Table
							columns={columns}
							dataSource={selectedProducts}
							rowKey='productId'
							pagination={false}
							scroll={{ x: true }}
							size='small'
						/>
					</Card>
				</Form.Item>

				<Form.Item name='notes' label='Ghi chú'>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú (tùy chọn)' />
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

export default OrderForm;
