import { IOrder, EOrderStatus } from '../typing';

const ORDERS_KEY = 'order_orders';

const INITIAL_ORDERS: IOrder[] = [
	{
		id: '1',
		code: 'ĐH001',
		customerId: '1',
		customerCode: 'KH001',
		customerName: 'Công ty ABC Ltd',
		orderDate: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
		items: [
			{
				productId: '1',
				productCode: 'SP001',
				productName: 'Laptop Dell XPS 13',
				quantity: 2,
				price: 25000000,
				total: 50000000,
			},
			{
				productId: '2',
				productCode: 'SP002',
				productName: 'Chuột Logitech MX Master',
				quantity: 5,
				price: 1500000,
				total: 7500000,
			},
		],
		totalAmount: 57500000,
		status: EOrderStatus.COMPLETED,
		notes: 'Giao thành công',
		createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
	},
	{
		id: '2',
		code: 'ĐH002',
		customerId: '2',
		customerCode: 'KH002',
		customerName: 'Cửa hàng XYZ',
		orderDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
		items: [
			{
				productId: '4',
				productCode: 'SP004',
				productName: 'Monitor LG 27 inch',
				quantity: 3,
				price: 5000000,
				total: 15000000,
			},
		],
		totalAmount: 15000000,
		status: EOrderStatus.SHIPPING,
		notes: 'Đang vận chuyển',
		createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 12 * 60 * 60 * 1000,
	},
	{
		id: '3',
		code: 'ĐH003',
		customerId: '3',
		customerCode: 'KH003',
		customerName: 'Tập đoàn Tech Vietnam',
		orderDate: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
		items: [
			{
				productId: '3',
				productCode: 'SP003',
				productName: 'Bàn phím Mechanical RGB',
				quantity: 10,
				price: 2500000,
				total: 25000000,
			},
			{
				productId: '5',
				productCode: 'SP005',
				productName: 'Webcam Logitech 4K',
				quantity: 2,
				price: 800000,
				total: 1600000,
			},
		],
		totalAmount: 26600000,
		status: EOrderStatus.PENDING,
		notes: 'Chờ xác nhận',
		createdAt: Date.now() - 1 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 60 * 60 * 1000,
	},
];

export const orderService = {
	getOrders: (): IOrder[] => {
		const data = localStorage.getItem(ORDERS_KEY);
		if (!data) {
			localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
			return INITIAL_ORDERS;
		}
		return JSON.parse(data);
	},

	saveOrders: (orders: IOrder[]) => {
		localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
	},

	getOrderById: (id: string): IOrder | undefined => {
		return orderService.getOrders().find((o) => o.id === id);
	},

	getOrderByCode: (code: string): IOrder | undefined => {
		return orderService.getOrders().find((o) => o.code === code);
	},

	addOrder: (order: IOrder): IOrder => {
		if (orderService.getOrderByCode(order.code)) {
			throw new Error(`Mã đơn hàng "${order.code}" đã tồn tại`);
		}
		const orders = orderService.getOrders();
		orders.push(order);
		orderService.saveOrders(orders);
		return order;
	},

	updateOrder: (id: string, updates: Partial<IOrder>): IOrder => {
		const orders = orderService.getOrders();
		const index = orders.findIndex((o) => o.id === id);
		if (index === -1) throw new Error('Đơn hàng không tồn tại');

		// Check if changing code to duplicate
		if (updates.code && updates.code !== orders[index].code) {
			if (orderService.getOrderByCode(updates.code)) {
				throw new Error(`Mã đơn hàng "${updates.code}" đã tồn tại`);
			}
		}

		orders[index] = { ...orders[index], ...updates, updatedAt: Date.now() } as any;
		orderService.saveOrders(orders);
		return orders[index];
	},

	deleteOrder: (id: string): void => {
		const orders = orderService.getOrders();
		const filtered = orders.filter((o) => o.id !== id);
		orderService.saveOrders(filtered);
	},

	cancelOrder: (id: string): IOrder => {
		const order = orderService.getOrderById(id);
		if (!order) throw new Error('Đơn hàng không tồn tại');
		if (order.status !== EOrderStatus.PENDING) {
			throw new Error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"');
		}
		return orderService.updateOrder(id, { status: EOrderStatus.CANCELLED });
	},

	searchOrders: (
		keyword: string,
		page: number = 1,
		limit: number = 10,
	): { data: IOrder[]; total: number } => {
		const orders = orderService.getOrders();
		const filtered = orders.filter(
			(o) =>
				o.code.toLowerCase().includes(keyword.toLowerCase()) ||
				o.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
				o.customerCode.toLowerCase().includes(keyword.toLowerCase()),
		);
		const start = (page - 1) * limit;
		const end = start + limit;
		return {
			data: filtered.slice(start, end),
			total: filtered.length,
		};
	},

	filterOrdersByStatus: (
		status: EOrderStatus,
		page: number = 1,
		limit: number = 10,
	): { data: IOrder[]; total: number } => {
		const orders = orderService.getOrders();
		const filtered = orders.filter((o) => o.status === status);
		const start = (page - 1) * limit;
		const end = start + limit;
		return {
			data: filtered.slice(start, end),
			total: filtered.length,
		};
	},

	sortOrders: (
		orders: IOrder[],
		sortBy: 'date' | 'total',
		order: 'asc' | 'desc' = 'desc',
	): IOrder[] => {
		const sorted = [...orders];
		if (sortBy === 'date') {
			sorted.sort((a, b) => {
				return order === 'desc' ? b.orderDate - a.orderDate : a.orderDate - b.orderDate;
			});
		} else if (sortBy === 'total') {
			sorted.sort((a, b) => {
				return order === 'desc' ? b.totalAmount - a.totalAmount : a.totalAmount - b.totalAmount;
			});
		}
		return sorted;
	},

	getOrdersWithFilters: (
		page: number = 1,
		limit: number = 10,
		filters?: {
			keyword?: string;
			status?: EOrderStatus;
			sortBy?: 'date' | 'total';
			sortOrder?: 'asc' | 'desc';
		},
	): { data: IOrder[]; total: number } => {
		let orders = orderService.getOrders();

		// Apply search
		if (filters?.keyword) {
			orders = orders.filter(
				(o) =>
					o.code.toLowerCase().includes(filters.keyword!.toLowerCase()) ||
					o.customerName.toLowerCase().includes(filters.keyword!.toLowerCase()) ||
					o.customerCode.toLowerCase().includes(filters.keyword!.toLowerCase()),
			);
		}

		// Apply status filter
		if (filters?.status) {
			orders = orders.filter((o) => o.status === filters.status);
		}

		// Apply sorting
		if (filters?.sortBy) {
			orders = orderService.sortOrders(orders, filters.sortBy, filters.sortOrder || 'desc');
		}

		const total = orders.length;
		const start = (page - 1) * limit;
		const end = start + limit;
		return {
			data: orders.slice(start, end),
			total,
		};
	},
};
