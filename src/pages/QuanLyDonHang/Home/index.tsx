import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Input,
	Select,
	Space,
	Table,
	Popconfirm,
	Modal,
	Row,
	Col,
	Tag,
	Empty,
	Tabs,
	message,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import OrderForm from '../components/OrderForm';
import CustomerForm from '../components/CustomerForm';
import ProductForm from '../components/ProductForm';
import { EOrderStatus, OrderStatusLabels, IOrder } from '../typing';

const QuanLyDonHang = () => {
	const {
		danhSach: orders,
		loading,
		formSubmiting,
		visibleForm,
		edit,
		page,
		limit,
		total,
		record,
		keyword,
		statusFilter,
		sortBy,
		sortOrder,
		setPage,
		setLimit,
		setKeyword,
		setStatusFilter,
		setSortBy,
		setSortOrder,
		setVisibleForm,
		setEdit,
		setRecord,
		getModel,
		getByIdModel,
		postModel,
		putModel,
		deleteModel,
		cancelOrder,
	} = useModel('donhang');

	const customerModel = useModel('khachhang');
	const productModel = useModel('sanpham');

	const [activeTab, setActiveTab] = useState<string>('order');
	const [localKeyword, setLocalKeyword] = useState(keyword);

	useEffect(() => {
		getModel();
	}, [keyword, statusFilter, sortBy, sortOrder]);

	const handleSearch = () => {
		setKeyword(localKeyword);
	};

	const handleStatusFilterChange = (value: any) => {
		setStatusFilter(value === '' ? undefined : value);
	};

	const handleSortChange = (value: any) => {
		setSortBy(value === '' ? undefined : value);
	};

	const handleSortOrderChange = (value: 'asc' | 'desc') => {
		setSortOrder(value);
	};

	const handleAddOrder = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleEditOrder = (record: IOrder) => {
		setRecord(record);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleDeleteOrder = (id: string) => {
		deleteModel(id);
	};

	const handleCancelOrder = (id: string) => {
		cancelOrder(id);
	};

	const handleSubmitOrder = async (values: any) => {
		try {
			if (edit) {
				await putModel({ id: record?.id || '', data: values });
			} else {
				await postModel(values);
			}
			setVisibleForm(false);
		} catch (err) {
			console.log('Submit error:', err);
		}
	};

	const columns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'code',
			width: 120,
			sorter: true,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			width: 180,
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'orderDate',
			width: 150,
			render: (date: number) => new Date(date).toLocaleDateString('vi-VN'),
			sorter: true,
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalAmount',
			width: 150,
			render: (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`,
			sorter: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 150,
			render: (status: EOrderStatus) => {
				const colorMap = {
					[EOrderStatus.PENDING]: 'orange',
					[EOrderStatus.SHIPPING]: 'blue',
					[EOrderStatus.COMPLETED]: 'green',
					[EOrderStatus.CANCELLED]: 'red',
				};
				return <Tag color={colorMap[status]}>{OrderStatusLabels[status]}</Tag>;
			},
		},
		{
			title: 'Hành động',
			width: 150,
			fixed: 'right' as const,
			render: (_: any, record: IOrder) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EditOutlined />}
						onClick={() => handleEditOrder(record)}
					>
						Sửa
					</Button>
					{record.status === EOrderStatus.PENDING && (
						<Popconfirm
							title={
								<div>
									<div>Hủy đơn hàng</div>
									<div style={{ fontSize: '12px', fontWeight: 'normal' }}>Bạn chắc chắn muốn hủy đơn hàng này? Chỉ có thể hủy đơn ở trạng thái "Chờ xác nhận".</div>
								</div>
							}
							onConfirm={() => handleCancelOrder(record.id)}
							okText='Có'
							cancelText='Không'
						>
							<Button type='primary' danger size='small'>
								Hủy
							</Button>
						</Popconfirm>
					)}
					<Popconfirm
						title={
							<div>
								<div>Xóa đơn hàng</div>
								<div style={{ fontSize: '12px', fontWeight: 'normal' }}>Bạn chắc chắn muốn xóa đơn hàng này?</div>
							</div>
						}
						onConfirm={() => handleDeleteOrder(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger size='small' icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const renderOrderManagement = () => (
		<Card
			title={
				<Row justify='space-between' align='middle'>
					<Col>Quản lý đơn hàng</Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAddOrder}>
						Thêm mới
					</Button>
				</Row>
			}
		>
			<Space direction='vertical' style={{ width: '100%' }} size='large'>
				{/* Search and Filter */}
				<Row gutter={[12, 12]}>
					<Col xs={24} sm={12} lg={6}>
						<Input.Search
							placeholder='Tìm mã đơn hàng hoặc khách hàng'
							value={localKeyword}
							onChange={(e) => setLocalKeyword(e.target.value)}
							onSearch={handleSearch}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Select
							placeholder='Lọc theo trạng thái'
							allowClear
							style={{ width: '100%' }}
							value={statusFilter || ''}
							onChange={handleStatusFilterChange}
							options={[
								{ label: 'Tất cả', value: '' },
								...Object.entries(OrderStatusLabels).map(([value, label]) => ({
									label,
									value,
								})),
							]}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Select
							placeholder='Sắp xếp theo'
							allowClear
							style={{ width: '100%' }}
							value={sortBy || ''}
							onChange={handleSortChange}
							options={[
								{ label: 'Tất cả', value: '' },
								{ label: 'Ngày đặt hàng', value: 'date' },
								{ label: 'Tổng tiền', value: 'total' },
							]}
						/>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						{sortBy && (
							<Select
								style={{ width: '100%' }}
								value={sortOrder}
								onChange={handleSortOrderChange}
								options={[
									{ label: 'Giảm dần', value: 'desc' },
									{ label: 'Tăng dần', value: 'asc' },
								]}
							/>
						)}
					</Col>
					<Col xs={24}>
						<Button icon={<ReloadOutlined />} onClick={() => getModel()} loading={loading}>
							Làm mới
						</Button>
					</Col>
				</Row>

				{/* Table */}
				{orders.length > 0 ? (
					<Table
						columns={columns}
						dataSource={orders.map((order, index) => ({ ...order, key: order.id }))}
						loading={loading}
						pagination={{
							current: page,
							pageSize: limit,
							total: total,
							onChange: (newPage) => setPage(newPage),
							onShowSizeChange: (_, newLimit) => setLimit(newLimit),
							showSizeChanger: true,
							pageSizeOptions: ['5', '10', '20', '50'],
						}}
						scroll={{ x: 1200 }}
					/>
				) : (
					<Empty description='Không có đơn hàng' />
				)}
			</Space>

			<OrderForm
				visible={visibleForm}
				onClose={() => setVisibleForm(false)}
				onSubmit={handleSubmitOrder}
				loading={formSubmiting}
			/>
		</Card>
	);

	const renderCustomerManagement = () => (
		<Card
			title={
				<Row justify='space-between' align='middle'>
					<Col>Quản lý khách hàng</Col>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							customerModel.setRecord(undefined);
							customerModel.setEdit(false);
							customerModel.setVisibleForm(true);
						}}
					>
						Thêm mới
					</Button>
				</Row>
			}
		>
			<CustomerManagementComponent model={customerModel} />
		</Card>
	);

	const renderProductManagement = () => (
		<Card
			title={
				<Row justify='space-between' align='middle'>
					<Col>Quản lý sản phẩm</Col>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							productModel.setRecord(undefined);
							productModel.setEdit(false);
							productModel.setVisibleForm(true);
						}}
					>
						Thêm mới
					</Button>
				</Row>
			}
		>
			<ProductManagementComponent model={productModel} />
		</Card>
	);

	return (
		<Tabs activeKey={activeTab} onChange={setActiveTab}>
			<Tabs.TabPane
				key='order'
				tab={
					<span>
						<ShoppingCartOutlined /> Đơn hàng
					</span>
				}
			>
				{renderOrderManagement()}
			</Tabs.TabPane>
			<Tabs.TabPane key='customer' tab='Khách hàng'>
				{renderCustomerManagement()}
			</Tabs.TabPane>
			<Tabs.TabPane key='product' tab='Sản phẩm'>
				{renderProductManagement()}
			</Tabs.TabPane>
		</Tabs>
	);
};

// Customer Management Component
const CustomerManagementComponent: React.FC<{ model: any }> = ({ model }) => {
	const {
		danhSach: customers,
		loading,
		formSubmiting,
		visibleForm,
		edit,
		page,
		limit,
		total,
		record,
		setPage,
		setLimit,
		getModel,
		setVisibleForm,
		setEdit,
		setRecord,
		deleteModel,
		putModel,
		postModel,
	} = model;

	useEffect(() => {
		getModel();
	}, []);

	const handleSubmit = async (values: any) => {
		try {
			if (edit) {
				const customerId = record?.id || '';
				await putModel({ id: customerId, data: values });
			} else {
				await postModel(values);
			}
			setVisibleForm(false);
		} catch (err) {
			console.log('Submit error:', err);
		}
	};

	const columns = [
		{ title: 'Mã khách hàng', dataIndex: 'code', width: 120 },
		{ title: 'Tên khách hàng', dataIndex: 'name', width: 200 },
		{ title: 'Số điện thoại', dataIndex: 'phone', width: 150 },
		{ title: 'Email', dataIndex: 'email', width: 200 },
		{
			title: 'Hành động',
			width: 120,
			render: (_: any, record: any) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setRecord(record);
							setEdit(true);
							setVisibleForm(true);
						}}
					/>
					<Popconfirm
						title={
							<div>
								<div>Xóa khách hàng</div>
								<div style={{ fontSize: '12px', fontWeight: 'normal' }}>Xác nhận xóa?</div>
							</div>
						}
						onConfirm={() => deleteModel(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' style={{ width: '100%' }} size='large'>
			<Table
				columns={columns}
				dataSource={customers.map((c: any) => ({ ...c, key: c.id }))}
				loading={loading}
				pagination={{
					current: page,
					pageSize: limit,
					total: total,
					onChange: setPage,
					onShowSizeChange: (_, newLimit) => setLimit(newLimit),
				}}
			/>
			<CustomerForm
				visible={visibleForm}
				onClose={() => setVisibleForm(false)}
				onSubmit={handleSubmit}
				loading={formSubmiting}
			/>
		</Space>
	);
};

// Product Management Component
const ProductManagementComponent: React.FC<{ model: any }> = ({ model }) => {
	const {
		danhSach: products,
		loading,
		formSubmiting,
		visibleForm,
		edit,
		page,
		limit,
		total,
		record,
		setPage,
		setLimit,
		getModel,
		setVisibleForm,
		setEdit,
		setRecord,
		deleteModel,
		putModel,
		postModel,
	} = model;

	useEffect(() => {
		getModel();
	}, []);

	const handleSubmit = async (values: any) => {
		try {
			if (edit) {
				const productId = record?.id || '';
				await putModel({ id: productId, data: values });
			} else {
				await postModel(values);
			}
			setVisibleForm(false);
		} catch (err) {
			console.log('Submit error:', err);
		}
	};

	const columns = [
		{ title: 'Mã sản phẩm', dataIndex: 'code', width: 120 },
		{ title: 'Tên sản phẩm', dataIndex: 'name', width: 200 },
		{
			title: 'Giá',
			dataIndex: 'price',
			width: 150,
			render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			width: 100,
		},
		{
			title: 'Hành động',
			width: 120,
			render: (_: any, record: any) => (
				<Space size='small'>
					<Button
						type='primary'
						size='small'
						icon={<EditOutlined />}
						onClick={() => {
							setRecord(record);
							setEdit(true);
							setVisibleForm(true);
						}}
					/>
					<Popconfirm
						title={
							<div>
								<div>Xóa sản phẩm</div>
								<div style={{ fontSize: '12px', fontWeight: 'normal' }}>Xác nhận xóa?</div>
							</div>
						}
						onConfirm={() => deleteModel(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' style={{ width: '100%' }} size='large'>
			<Table
				columns={columns}
				dataSource={products.map((p: any) => ({ ...p, key: p.id }))}
				loading={loading}
				pagination={{
					current: page,
					pageSize: limit,
					total: total,
					onChange: setPage,
					onShowSizeChange: (_, newLimit) => setLimit(newLimit),
				}}
			/>
			<ProductForm
				visible={visibleForm}
				onClose={() => setVisibleForm(false)}
				onSubmit={handleSubmit}
				loading={formSubmiting}
			/>
		</Space>
	);
};

export default QuanLyDonHang;
